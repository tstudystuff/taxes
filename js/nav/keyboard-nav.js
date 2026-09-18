// keyboard-nav.js
// js/nav/keyboard-nav.js
/*
=========================================================
IMPORTS
=========================================================
*/
import { pageNav } from "./page-nav.js";
import { sideBarNav } from "./side-bar-nav.js";
import { mainLandingNav } from "./main-landing-nav.js";
import { formNav } from "./form-nav.js";
import { showLetterNavStatus } from "../visuals/popup-letter-nav.js";
import {
    letterNav,
    jumpOutOfInput
} from "./letter-nav.js";
/*
=========================================================
NAVIGATION MODES
=========================================================
*/
export const NAV_MODES = Object.freeze({
    PAGE: "page",
    SIDEBAR: "sidebar",
    MAIN: "main",
    FORM: "form",
    LETTER: "letter"
});
/*
=========================================================
STATE
=========================================================
*/
const navState = {
    mode:
        NAV_MODES.PAGE,
    previousMode:
        null,
    resetSequence:
        false,
    resetTimer:
        null
};
/*
=========================================================
FOCUS MEMORY
=========================================================
We keep TWO completely separate memories:
    lastMainFocus
        Last NON-FORM element focused inside
        .main-landing-page
    lastFormFocus
        Last input/select/textarea focused inside
        .main-landing-page
This allows:
    FORM
       ↓ M
    MAIN
       ↓ M
    FORM
       ↓ M
    MAIN
=========================================================
*/
let lastMainFocus = null;
let lastFormFocus = null;
/*
=========================================================
TRACK FOCUS
=========================================================
IMPORTANT:
The tax form is loaded INSIDE .main-landing-page.
Therefore we MUST check for a form control FIRST.
Otherwise an input would incorrectly become
lastMainFocus.
=========================================================
*/
document.addEventListener(
    "focusin",
    e => {
        const target =
            e.target;
        if (!target) {
            return;
        }
        /*
        =====================================================
        FORM CONTROL
        =====================================================
        Inputs inside .main-landing-page belong to
        FORM focus memory, not MAIN focus memory.
        */
        if (
            isFormControl(target)
        ) {
            lastFormFocus =
                target;
            return;
        }
        /*
        =====================================================
        MAIN LANDING PAGE
        =====================================================
        */
        const mainLanding =
            target.closest?.(
                ".main-landing-page"
            );
        if (
            mainLanding
        ) {
            lastMainFocus =
                target;
        }
    }
);
/*
=========================================================
GET MODE
=========================================================
*/
export function getNavMode() {
    return navState.mode;
}
/*
=========================================================
SET MODE
=========================================================
*/
export function setNavMode(mode) {

    if (
        !Object.values(NAV_MODES)
            .includes(mode)
    ) {
        return;
    }

    navState.previousMode =
        navState.mode;

    navState.mode =
        mode;

    const pageWrapper =
        document.querySelector(
            ".page-wrapper"
        );

    if (pageWrapper) {

        pageWrapper.dataset.navMode =
            mode;

    }
}
/*
=========================================================
FOCUS MAIN
=========================================================
*/
export function focusMainLandingPage() {
    const mainLandingPage =
        document.querySelector(
            ".main-landing-page"
        );
    if (!mainLandingPage) {
        return false;
    }
    /*
    =====================================================
    RETURN TO LAST MAIN ELEMENT
    =====================================================
    */
    if (
        lastMainFocus &&
        lastMainFocus.isConnected &&
        mainLandingPage.contains(
            lastMainFocus
        )
    ) {
        /*
        Make sure we didn't accidentally remember
        a form control.
        */
        if (
            !isFormControl(
                lastMainFocus
            )
        ) {
            lastMainFocus.focus();
            return true;
        }
    }
    /*
    =====================================================
    FALLBACK
    =====================================================
    */
    mainLandingPage.focus();
    return true;
}
/*
=========================================================
FOCUS LAST FORM ELEMENT
=========================================================
*/
export function focusLastFormElement() {
    if (
        lastFormFocus &&
        lastFormFocus.isConnected
    ) {
        lastFormFocus.focus();
        return true;
    }
    return false;
}
/*
=========================================================
M TOGGLE
=========================================================
M is NOT a navigation mode.
M simply switches between the last:
    MAIN location
and
    FORM location
=========================================================
*/
function toggleMainFormFocus() {
    const active =
        document.activeElement;
    /*
    =====================================================
    CURRENTLY IN MAIN
    =====================================================
    */
    if (
        isInsideMainLandingPage(active) &&
        !isFormControl(active)
    ) {
        /*
        -------------------------------------------------
        MAIN → FORM
        -------------------------------------------------
        */
        if (
            focusLastFormElement()
        ) {
            setNavMode(
                NAV_MODES.FORM
            );
            return true;
        }
        return false;
    }
    /*
    =====================================================
    CURRENTLY IN FORM
    =====================================================
    */
    if (
        isFormControl(active)
    ) {
        /*
        -------------------------------------------------
        FORM → MAIN
        -------------------------------------------------
        */
        if (
            focusMainLandingPage()
        ) {
            setNavMode(
                NAV_MODES.MAIN
            );
            return true;
        }
        return false;
    }
    /*
    =====================================================
    ANYWHERE ELSE
    =====================================================
    If M is pressed from the sidebar/header/etc.,
    go to the remembered MAIN location.
    */
    if (
        focusMainLandingPage()
    ) {
        setNavMode(
            NAV_MODES.MAIN
        );
        return true;
    }
    return false;
}
/*
=========================================================
TOGGLE LETTER NAVIGATION MODE
=========================================================
*/
function toggleLetterMode() {
    if (
        navState.mode ===
        NAV_MODES.LETTER
    ) {
        setNavMode(
            NAV_MODES.PAGE
        );
        return;
    }
    setNavMode(
        NAV_MODES.LETTER
    );
}
/*
=========================================================
SIDEBAR BUTTON
=========================================================
*/
function focusSidebarButton() {
    const button =
        document.querySelector(
            "#sideBarBtn"
        );
    if (!button) {
        return false;
    }
    button.focus();
    return true;
}
/*
=========================================================
HOMEPAGE
=========================================================
*/
function focusHomepage() {
    const homepage =
        document.querySelector(
            "[data-nav-target='homepageLink']"
        );
    if (!homepage) {
        return false;
    }
    homepage.focus();
    return true;
}
/*
=========================================================
RESET BUTTON
=========================================================
*/
function focusResetButton() {
    const button =
        document.querySelector(
            "#resetPageBtn"
        );
    if (!button) {
        return false;
    }
    button.focus();
    return true;
}
/*
=========================================================
GLOBAL SHORTCUTS
=========================================================
*/
function handleGlobalShortcuts(e) {
    const key =
        e.key.toLowerCase();
    /*
    =====================================================
    LETTER MODE OWNS THE KEYBOARD
    =====================================================
    */
    if (
        navState.mode ===
        NAV_MODES.LETTER
    ) {
        return false;
    }
    /*
    =====================================================
    M = MAIN / FORM
    =====================================================
    IMPORTANT:
    M MUST work inside inputs.
    Therefore this shortcut is intentionally checked
    BEFORE the typing-control restriction.
    */
    if (
        key === "m"
    ) {
        e.preventDefault();
        e.stopPropagation();
        toggleMainFormFocus();
        return true;
    }
    /*
    =====================================================
    DO NOT RUN OTHER SHORTCUTS INSIDE INPUTS
    =====================================================
    */
    if (
        isTypingControl(e.target)
    ) {
        return false;
    }
    /*
    =====================================================
    S = SIDEBAR
    =====================================================
    */
    if (
        key === "s"
    ) {
        if (
            focusSidebarButton()
        ) {
            e.preventDefault();
            e.stopPropagation();
            setNavMode(
                NAV_MODES.SIDEBAR
            );
            return true;
        }
    }
    /*
    =====================================================
    H = HOMEPAGE
    =====================================================
    */
    if (
        key === "h"
    ) {
        if (
            focusHomepage()
        ) {
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
    }
    /*
    =====================================================
    R R = RESET
    =====================================================
    */
    if (
        key === "r"
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (
            !navState.resetSequence
        ) {
            navState.resetSequence =
                true;
            clearTimeout(
                navState.resetTimer
            );
            navState.resetTimer =
                setTimeout(() => {
                    navState.resetSequence =
                        false;
                }, 1000);
            return true;
        }
        navState.resetSequence =
            false;
        clearTimeout(
            navState.resetTimer
        );
        focusResetButton();
        return true;
    }
    return false;
}
/*
=========================================================
MAIN KEYBOARD ROUTER
=========================================================
*/
export function initKeyboardNav({ e }) {
    /*
    =====================================================
    COMMAND + SHIFT + X
    =====================================================
    */
    if (
        e.metaKey &&
        e.shiftKey &&
        e.key.toLowerCase() === "x"
    ) {
        e.preventDefault();
        e.stopPropagation();
        /*
        -------------------------------------------------
        IF INSIDE INPUT
        -------------------------------------------------
        */
        if (
            isTypingControl(e.target)
        ) {
            jumpOutOfInput();
            return;
        }
        /*
        -------------------------------------------------
        TOGGLE LETTER MODE
        -------------------------------------------------
        */
        toggleLetterMode();
        showLetterNavStatus({ navState, NAV_MODES });
        return;
    }
    /*
    =====================================================
    LETTER MODE
    =====================================================
    */
    if (
        navState.mode ===
        NAV_MODES.LETTER
    ) {
        /*
        -------------------------------------------------
        ESCAPE
        -------------------------------------------------
        */
        if (
            e.key.toLowerCase() ===
            "escape"
        ) {
            e.preventDefault();
            e.stopPropagation();
            setNavMode(
                NAV_MODES.PAGE
            );
            focusMainLandingPage();
            return;
        }
        /*
        -------------------------------------------------
        LETTER NAVIGATION
        -------------------------------------------------
        */
        letterNav({
            e,
            global: true
        });
        return;
    }
    /*
    =====================================================
    NORMAL GLOBAL SHORTCUTS
    =====================================================
    */
    const handled =
        handleGlobalShortcuts(e);
    if (handled) {
        return;
    }
    /*
    =====================================================
    ESCAPE
    =====================================================
    */
    if (
        e.key.toLowerCase() ===
        "escape"
    ) {
        if (
            navState.mode !==
            NAV_MODES.PAGE
        ) {
            e.preventDefault();
            e.stopPropagation();
            setNavMode(
                NAV_MODES.PAGE
            );
            focusMainLandingPage();
            return;
        }
    }
    /*
    =====================================================
    P = PAGE MODE
    =====================================================
    */
    if (
        e.key.toLowerCase() === "p" &&
        !isTypingControl(e.target)
    ) {
        e.preventDefault();
        e.stopPropagation();
        setNavMode(
            NAV_MODES.PAGE
        );
        focusMainLandingPage();
        return;
    }
    /*
    =====================================================
    NORMAL ROUTING
    =====================================================
    */
    switch (
        navState.mode
    ) {
        case NAV_MODES.SIDEBAR:
            sideBarNav(e);
            break;
        case NAV_MODES.MAIN:
            mainLandingNav(e);
            break;
        case NAV_MODES.FORM:
            formNav(
                e,
                navState
            );
            break;
        case NAV_MODES.PAGE:
        default:
            pageNav(e);
            break;
    }
}
/*
=========================================================
IS FORM CONTROL
=========================================================
The important part:
The tax form is apparently INSIDE
.main-landing-page.
Therefore we identify form focus by the actual
interactive controls rather than by a form container.
=========================================================
*/
function isFormControl(element) {
    if (!element) {
        return false;
    }
    return element.matches?.(
        "input, textarea, select"
    );
}
/*
=========================================================
IS INSIDE MAIN LANDING PAGE
=========================================================
*/
function isInsideMainLandingPage(element) {
    if (!element) {
        return false;
    }
    return !!element.closest?.(
        ".main-landing-page"
    );
}
/*
=========================================================
TYPING CONTROL
=========================================================
*/
function isTypingControl(element) {
    if (!element) {
        return false;
    }
    return element.matches?.(
        "input, textarea, select"
    );
}
