// letter-nav.js
// js/nav/letter-nav.js
/*
============================================================
LETTER NAVIGATION
============================================================
*/
let lastLetterPressed = null;
/*
============================================================
LETTER NAVIGATION
============================================================
*/
export function letterNav({ e }) {
    const key =
        e.key.toLowerCase();
    /*
    ========================================================
    INPUTS
    ========================================================
    */
    if (
        isEditingControl(
            document.activeElement
        )
    ) {
        resetLetterNav();
        return false;
    }
    /*
    ========================================================
    ONLY LETTERS
    ========================================================
    */
    if (
        !/^[a-z]$/.test(key)
    ) {
        return false;
    }
    /*
    ========================================================
    DON'T INTERFERE WITH MODIFIERS
    ========================================================
    */
    if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
    ) {
        return false;
    }
    /*
    ========================================================
    BUILD TARGETS
    ========================================================
    */
    const targets =
        buildTextTargets();
    if (
        !targets.length
    ) {
        return false;
    }
    /*
    ========================================================
    FIND MATCHES
    ========================================================
    */
    const matching =
        targets.filter(
            target =>
                target.letter === key
        );
    if (
        !matching.length
    ) {
        return false;
    }
    /*
    ========================================================
    CURRENT FOCUS
    ========================================================
    */
    const activeEl =
        document.activeElement;
    const allIndex =
        targets.findIndex(
            target =>
                target.element === activeEl
        );
    const matchingIndex =
        matching.findIndex(
            target =>
                target.element === activeEl
        );
    let newIndex;
    /*
    ========================================================
    NEW LETTER
    ========================================================
    */
    if (
        key !== lastLetterPressed
    ) {
        /*
        ----------------------------------------------------
        NOTHING CURRENTLY FOCUSED
        ----------------------------------------------------
        */
        if (
            allIndex === -1
        ) {
            newIndex =
                e.shiftKey
                    ? matching.length - 1
                    : 0;
        }
        /*
        ----------------------------------------------------
        SOMETHING IS CURRENTLY FOCUSED
        ----------------------------------------------------
        */
        else {
            /*
            -----------------------------------------------
            SHIFT = BACKWARD
            -----------------------------------------------
            */
            if (
                e.shiftKey
            ) {
                let found =
                    false;
                for (
                    let i = allIndex - 1;
                    i >= 0;
                    i--
                ) {
                    if (
                        targets[i].letter === key
                    ) {
                        newIndex =
                            matching.indexOf(
                                targets[i]
                            );
                        found =
                            true;
                        break;
                    }
                }
                if (!found) {
                    newIndex =
                        matching.length - 1;
                }
            }
            /*
            -----------------------------------------------
            NORMAL = FORWARD
            -----------------------------------------------
            */
            else {
                let found =
                    false;
                for (
                    let i = allIndex + 1;
                    i < targets.length;
                    i++
                ) {
                    if (
                        targets[i].letter === key
                    ) {
                        newIndex =
                            matching.indexOf(
                                targets[i]
                            );
                        found =
                            true;
                        break;
                    }
                }
                if (!found) {
                    newIndex = 0;
                }
            }
        }
    }
    /*
    ========================================================
    SAME LETTER
    ========================================================
        A
        A
        A
        A
    Repeated A cycles through all A targets.
    ========================================================
    */
    else {
        if (
            matchingIndex === -1
        ) {
            newIndex =
                e.shiftKey
                    ? matching.length - 1
                    : 0;
        }
        else {
            /*
            -----------------------------------------------
            SHIFT = BACKWARD
            -----------------------------------------------
            */
            if (
                e.shiftKey
            ) {
                newIndex =
                    (
                        matchingIndex -
                        1 +
                        matching.length
                    ) %
                    matching.length;
            }
            /*
            -----------------------------------------------
            NORMAL = FORWARD
            -----------------------------------------------
            */
            else {
                newIndex =
                    (
                        matchingIndex +
                        1
                    ) %
                    matching.length;
            }
        }
    }
    /*
    ========================================================
    GET TARGET
    ========================================================
    */
    const target =
        matching[newIndex];
    if (!target) {
        return false;
    }
    /*
    ========================================================
    FOCUS
    ========================================================
    */
    target.element.focus();
    /*
    ========================================================
    PREVENT TYPING
    ========================================================
    */
    e.preventDefault();
    lastLetterPressed =
        key;
    return true;
}
/*
============================================================
JUMP OUT OF INPUT
============================================================
*/
export function jumpOutOfInput() {
    const activeEl =
        document.activeElement;
    if (
        !isEditingControl(activeEl)
    ) {
        return false;
    }
    const targets =
        buildTextTargets();
    if (
        !targets.length
    ) {
        return false;
    }
    let previousTarget =
        null;
    let nextTarget =
        null;
    /*
    ========================================================
    FIND NEARBY TEXT TARGET
    ========================================================
    */
    for (
        const target of targets
    ) {
        const position =
            activeEl.compareDocumentPosition(
                target.element
            );
        /*
        ----------------------------------------------------
        TARGET BEFORE INPUT
        ----------------------------------------------------
        */
        if (
            position &
            Node.DOCUMENT_POSITION_PRECEDING
        ) {
            previousTarget =
                target;
            continue;
        }
        /*
        ----------------------------------------------------
        TARGET AFTER INPUT
        ----------------------------------------------------
        */
        if (
            position &
            Node.DOCUMENT_POSITION_FOLLOWING
        ) {
            nextTarget =
                target;
            break;
        }
    }
    /*
    ========================================================
    PREFER PREVIOUS
    ========================================================
    */
    const target =
        previousTarget ||
        nextTarget;
    if (!target) {
        return false;
    }
    target.element.focus();
    resetLetterNav();
    return true;
}
/*
============================================================
BUILD TEXT TARGETS
============================================================
*/
function buildTextTargets() {
    /*
    ========================================================
    GLOBAL PAGE SEARCH
    ========================================================
    LETTER MODE is global.
    Therefore we search the entire page rather than
    restricting navigation to .main-landing-page.
    This allows:
        sidebar links
        sidebar headings
        main page text
        page headings
        other visible text
    to participate in letter navigation.
    */
    const container =
        document.querySelector(
            ".page-wrapper"
        );
    if (!container) {
        return [];
    }
    const elements = [
        ...container.querySelectorAll("*")
    ];
    const targets = [];
    for (
        const el of elements
    ) {
        if (
            !isTextElement(el)
        ) {
            continue;
        }
        if (
            !isActuallyVisible(el)
        ) {
            continue;
        }
        const text =
            getDirectText(el);
        if (!text) {
            continue;
        }
        const letter =
            getFirstLetter(text);
        if (!letter) {
            continue;
        }
        /*
        ----------------------------------------------------
        MAKE TEXT TAB-FOCUSABLE
        ----------------------------------------------------
        */
        if (
            !el.hasAttribute("tabindex")
        ) {
            el.setAttribute(
                "tabindex",
                "0"
            );
        }
        targets.push({
            element:
                el,
            text:
                text,
            letter:
                letter
        });
    }
    return targets;
}
/*
============================================================
IS TEXT ELEMENT
============================================================
*/
function isTextElement(el) {
    if (
        el.matches(
            "input, select, textarea, button, option"
        )
    ) {
        return false;
    }
    if (
        el.matches(
            "script, style, noscript, svg"
        )
    ) {
        return false;
    }
    if (
        !el.innerText?.trim()
    ) {
        return false;
    }
    return true;
}
/*
============================================================
GET DIRECT TEXT
============================================================
*/
function getDirectText(el) {
    const children = [
        ...el.children
    ];
    /*
    --------------------------------------------------------
    NO CHILDREN
    --------------------------------------------------------
    */
    if (
        !children.length
    ) {
        return cleanText(
            el.innerText
        );
    }
    /*
    --------------------------------------------------------
    DIRECT TEXT NODES ONLY
    --------------------------------------------------------
    */
    let text = "";
    for (
        const node of el.childNodes
    ) {
        if (
            node.nodeType ===
            Node.TEXT_NODE
        ) {
            text +=
                ` ${node.textContent}`;
        }
    }
    return cleanText(
        text
    );
}
/*
============================================================
CLEAN TEXT
============================================================
*/
function cleanText(text) {
    if (!text) {
        return "";
    }
    return text
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}
/*
============================================================
FIRST LETTER
============================================================
*/
function getFirstLetter(text) {
    for (
        const char of
        text.toLowerCase()
    ) {
        if (
            /[a-z]/.test(char)
        ) {
            return char;
        }
    }
    return "";
}
/*
============================================================
FORM CONTROL
============================================================
*/
function isEditingControl(el) {
    if (!el) {
        return false;
    }
    return el.matches(
        "input, textarea, select"
    );
}
/*
============================================================
VISIBILITY
============================================================
*/
function isActuallyVisible(el) {
    if (!el) {
        return false;
    }
    const style =
        getComputedStyle(el);
    if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
    ) {
        return false;
    }
    const rect =
        el.getBoundingClientRect();
    if (
        rect.width === 0 ||
        rect.height === 0
    ) {
        return false;
    }
    let parent =
        el.parentElement;
    while (parent) {
        const parentStyle =
            getComputedStyle(parent);
        if (
            parentStyle.display === "none" ||
            parentStyle.visibility === "hidden"
        ) {
            return false;
        }
        parent =
            parent.parentElement;
    }
    return true;
}
/*
============================================================
RESET
============================================================
*/
export function resetLetterNav() {
    lastLetterPressed =
        null;
}
