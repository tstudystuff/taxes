// js/nav/form-nav.js


/*
=========================================================
TAX FORM NAVIGATION
=========================================================

This file is intentionally separate from page and
sidebar navigation.

Eventually this can control:

    - 1040 input order
    - tax-line navigation
    - checkbox navigation
    - radio navigation
    - section navigation
    - next/previous field
    - numeric field movement
    - form-specific letter navigation
    - etc.

It should NOT need to know how the sidebar works.
It should NOT need to know how the application page
works.
*/


export function formNav(e, navState) {

    /*
    -----------------------------------------------------
    TEMPORARY
    -----------------------------------------------------

    The form currently retains normal browser keyboard
    behavior.

    We will build the actual 1040 navigation separately.
    */

    if (e.key === "Escape") {

        e.preventDefault();

        /*
        We intentionally do not change mode here yet.

        When we build form navigation, this is where we
        can decide exactly how the user exits FORM mode.
        */
    }
}