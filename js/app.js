// js/app.js
import { initDarkMode } from "./ui/dark-mode.js";
import { initSidebar } from "./ui/sidebar.js";
import {
    initKeyboardNav,
    setNavMode,
    NAV_MODES,
    focusMainLandingPage
} from "./nav/keyboard-nav.js";
import { initToggleSidebar } from "./ui/toggle-sidebar.js";
import { changeTutorialLink } from "./ui/change-tutorial-link.js";
const resetPageBtn =
    document.querySelector("#resetPageBtn");
const pageWrapper =
    document.querySelector(".page-wrapper");
/*
=========================================================
INITIALIZE APPLICATION
=========================================================
*/
function initApp() {
    initSidebar();
    initDarkMode();
    initGlobalListeners();
    focusAutoloadElement();
    initToggleSidebar();
}
/*
=========================================================
GLOBAL LISTENERS
=========================================================
*/
function initGlobalListeners() {
    /*
    =====================================================
    RESET PAGE
    =====================================================
    */
    if (resetPageBtn) {
        resetPageBtn.addEventListener(
            "click",
            () => {
                localStorage.removeItem(
                    "sidebar-pages"
                );
                location.reload();
            }
        );
    }
    /*
    =====================================================
    KEYBOARD NAVIGATION
    =====================================================
    */
    document.addEventListener(
        "keydown",
        e => {
            /*
            =================================================
            M = MAIN LANDING PAGE
            =================================================
            Handle this at the document level.
            This means M works regardless of whether focus
            is currently on:
                - page
                - sidebar
                - header
                - main landing page
                - dynamically loaded content
            */
            if (
                e.key.toLowerCase() === "m" &&
                !isTypingControl(e.target)
            ) {
                const mainLandingPage =
                    document.querySelector(
                        ".main-landing-page"
                    );
                if (mainLandingPage) {
                    e.preventDefault();
                    e.stopPropagation();
                    setNavMode(
                        NAV_MODES.MAIN
                    );
                    mainLandingPage.focus();
                    return;
                }
            }
            /*
            =================================================
            NORMAL NAVIGATION
            =================================================
            */
            initKeyboardNav({
                e,
                container: pageWrapper
            });
            /*
            =================================================
            TUTORIAL LINK
            =================================================
            */
            changeTutorialLink({
                e
            });
        },
        true
    );
}
/*
=========================================================
AUTOLOAD FOCUS
=========================================================
*/
function focusAutoloadElement() {
    const autoloadElement =
        pageWrapper?.querySelector(
            "[data-autoload]"
        );
    if (autoloadElement) {
        autoloadElement.focus();
    }
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
        "input:not([type='checkbox']):not([type='radio']), textarea, select"
    );
}
/*
=========================================================
START
=========================================================
*/

initApp();
