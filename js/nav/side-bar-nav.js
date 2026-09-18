// nav/side-bar-nav.js
// js/nav/side-bar-nav.js
// js/nav/side-bar-nav.js

import {
    setNavMode,
    NAV_MODES
} from "./keyboard-nav.js";


/*
=========================================================
SIDEBAR NAVIGATION
=========================================================
*/

export function sideBarNav(e) {

    const sidebar =
        document.querySelector(".side-bar");

    if (!sidebar) {
        return false;
    }


    const key =
        e.key.toLowerCase();


    /*
    -----------------------------------------------------
    ESCAPE
    -----------------------------------------------------

    Leave sidebar mode.
    */

    if (key === "escape") {

        e.preventDefault();

        leaveSidebarMode();

        return true;
    }


    /*
    -----------------------------------------------------
    A
    -----------------------------------------------------

    Toggle back to page mode.
    */
    /*
    -----------------------------------------------------
    A
    -----------------------------------------------------
    
    Move backward through sidebar items.
    */

    if (key === "a") {

        e.preventDefault();

        moveSidebarFocus(
            sidebar,
            -1
        );

        return true;
    }
    /*
    -----------------------------------------------------
    F
    -----------------------------------------------------

    Move forward through sidebar items.
    */

    if (key === "f") {

        e.preventDefault();

        moveSidebarFocus(sidebar, 1);

        return true;
    }


    /*
    -----------------------------------------------------
    ARROW DOWN
    -----------------------------------------------------

    Also move forward.
    */

    if (key === "arrowdown") {

        e.preventDefault();

        moveSidebarFocus(sidebar, 1);

        return true;
    }


    /*
    -----------------------------------------------------
    ARROW UP
    -----------------------------------------------------
    */

    if (key === "arrowup") {

        e.preventDefault();

        moveSidebarFocus(sidebar, -1);

        return true;
    }


    /*
    -----------------------------------------------------
    ENTER
    -----------------------------------------------------

    Activate the currently focused sidebar item.
    */

    if (key === "enter") {

        const active =
            document.activeElement;


        if (
            active?.matches(
                "#sideBarList a, #createSidePage, #editSideBarBtn"
            )
        ) {

            e.preventDefault();

            active.click();

            return true;
        }
    }


    return false;
}


/*
=========================================================
LEAVE SIDEBAR MODE
=========================================================
*/

function leaveSidebarMode() {

    setNavMode(NAV_MODES.PAGE);


    const mainLandingPage =
        document.querySelector(".main-landing-page");


    if (mainLandingPage) {

        mainLandingPage.focus();

        return;
    }


    document.body.focus();
}


/*
=========================================================
GET SIDEBAR ITEMS
=========================================================
*/

function getSidebarItems(sidebar) {

    return Array.from(
        sidebar.querySelectorAll(
            "#sideBarBtn, #sideBarList a, #createSidePage, #editSideBarBtn"
        )
    ).filter(element => {

        return (
            !element.disabled &&
            element.offsetParent !== null
        );

    });
}


/*
=========================================================
MOVE SIDEBAR FOCUS
=========================================================
*/

function moveSidebarFocus(sidebar, direction) {

    const items =
        getSidebarItems(sidebar);


    if (!items.length) {
        return;
    }


    const currentIndex =
        items.indexOf(
            document.activeElement
        );


    /*
    -----------------------------------------------------
    NO CURRENT FOCUS
    -----------------------------------------------------

    Start at beginning/end.
    */

    if (currentIndex === -1) {

        const startIndex =
            direction > 0
                ? 0
                : items.length - 1;

        items[startIndex]?.focus();

        return;
    }


    /*
    -----------------------------------------------------
    CALCULATE NEXT ITEM
    -----------------------------------------------------
    */

    let nextIndex =
        currentIndex + direction;


    /*
    Wrap around.
    */

    if (nextIndex >= items.length) {
        nextIndex = 0;
    }


    if (nextIndex < 0) {
        nextIndex = items.length - 1;
    }


    items[nextIndex]?.focus();
}