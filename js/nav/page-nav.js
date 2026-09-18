// js/nav/page-nav.js
// js/nav/page-nav.js

import {
    setNavMode,
    NAV_MODES
} from "./keyboard-nav.js";


/*
=========================================================
PAGE NAVIGATION
=========================================================
*/


export function pageNav(e) {

    const key =
        e.key.toLowerCase();


    /*
    -----------------------------------------------------
    DO NOT INTERCEPT TYPING
    -----------------------------------------------------
    */

    if (isTextInput(e.target)) {

        return false;

    }


    /*
    =====================================================
    A
    =====================================================

    Enter sidebar navigation.
    */

    if (key === "a") {

        e.preventDefault();
        e.stopPropagation();

        enterSidebarMode();

        return true;

    }


    /*
    =====================================================
    F
    =====================================================

    Enter NAV mode.

    The first F is handled by the existing
    letter-focus system through mainLandingNav().
    */

    if (key === "f") {

        e.preventDefault();
        e.stopPropagation();

        setNavMode(
            NAV_MODES.NAV
        );


        /*
        Let NAV mode process the same F
        immediately.
        */

        return true;

    }


    /*
    =====================================================
    ESCAPE
    =====================================================
    */

    if (key === "escape") {

        setNavMode(
            NAV_MODES.PAGE
        );

        return true;

    }


    return false;

}


/*
=========================================================
ENTER SIDEBAR MODE
=========================================================
*/

function enterSidebarMode() {

    const sidebar =
        document.querySelector(
            ".side-bar"
        );


    if (!sidebar) {

        return;

    }


    setNavMode(
        NAV_MODES.SIDEBAR
    );


    const button =
        sidebar.querySelector(
            "#sideBarBtn"
        );


    if (button) {

        button.focus();

        return;

    }


    const firstFocusable =
        sidebar.querySelector(
            "a, button, [tabindex='0']"
        );


    firstFocusable?.focus();

}


/*
=========================================================
TEXT INPUT CHECK
=========================================================
*/

function isTextInput(element) {

    if (!element) {

        return false;

    }


    return element.matches?.(
        "input:not([type='checkbox']):not([type='radio']), textarea, select"
    );

}