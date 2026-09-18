// nav/main-landing-nav.js
// js/nav/main-landing-nav.js
// js/nav/main-landing-nav.js
export function refreshSteps() {

    // updateSteps();

    // iStep = -1;

}

// js/nav/main-landing-nav.js

import {
    letterNav,
    resetLetterNav,
    jumpOutOfInput
} from "./letter-nav.js";

import {
    setNavMode,
    NAV_MODES,
    focusMainLandingPage
} from "./keyboard-nav.js";


/*
=========================================================
MAIN LANDING NAVIGATION
=========================================================
*/

export function mainLandingNav(e) {

    const key =
        e.key.toLowerCase();


    /*
    =====================================================
    CMD + SHIFT + X
    =====================================================
    */

    if (
        key === "x" &&
        e.shiftKey &&
        e.metaKey
    ) {

        const didJump =
            jumpOutOfInput();


        if (didJump) {

            e.preventDefault();
            e.stopPropagation();

            resetLetterNav();

            showNavigationPopup();

            return true;

        }

    }


    /*
    =====================================================
    LETTER NAVIGATION
    =====================================================

    This is now the OLD 1040 navigation system.

    It automatically backs off while the user is typing
    inside an input/select/textarea.
    */

    if (
        /^[a-z]$/.test(key)
    ) {

        const handled =
            letterNav({
                e
            });


        if (handled) {

            return true;

        }

    }


    /*
    =====================================================
    ESCAPE
    =====================================================
    */

    if (
        key === "escape"
    ) {

        e.preventDefault();
        e.stopPropagation();


        resetLetterNav();


        setNavMode(
            NAV_MODES.PAGE
        );


        focusMainLandingPage();


        return true;

    }


    return false;

}


/*
=========================================================
NAVIGATION POPUP
=========================================================
*/

function showNavigationPopup() {

    const popup =
        document.querySelector(
            "#popupLetterNav"
        ) ||
        document.querySelector(
            ".popup-letter-nav"
        );


    if (!popup) {

        return;
    }


    popup.innerText =
        "letter navigation";


    popup.classList.add(
        "animate"
    );


    setTimeout(() => {

        popup.classList.remove(
            "animate"
        );

    }, 1000);

}
