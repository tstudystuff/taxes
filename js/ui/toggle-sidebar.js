// js/ui/toggle-sidebar.js
// js/ui/toggle-sidebar.js


export function initToggleSidebar() {

    const mainContent =
        document.querySelector(".main-content");

    const sideBarButton =
        document.querySelector("#sideBarBtn");


    if (!mainContent || !sideBarButton) {

        console.error(
            "Could not initialize sidebar toggle."
        );

        return;

    }


    /*
    =========================================================
    CLICK
    =========================================================
    */

    sideBarButton.addEventListener(
        "click",
        () => {

            toggleSidebar(
                mainContent
            );

        }
    );


    /*
    =========================================================
    KEYBOARD
    =========================================================
    */

    sideBarButton.addEventListener(
        "keydown",
        e => {

            if (
                e.key === "Enter" ||
                e.key === " "
            ) {

                e.preventDefault();

                toggleSidebar(
                    mainContent
                );

            }

        }
    );

}


/*
=============================================================
TOGGLE SIDEBAR
=============================================================

POSITION STATE CYCLE:

    SIDE
      ↓
    TOP
      ↓
    HIDDEN
      ↓
    SIDE
      ↓
    TOP
      ↓
    HIDDEN
      ...

The initial state is SIDE because neither class exists.
=============================================================
*/

function toggleSidebar(mainContent) {


    /*
    =========================================================
    STATE 1
    =========================================================
    SIDE → TOP
    =========================================================
    */

    if (
        !mainContent.classList.contains(
            "sidebar-top"
        ) &&
        !mainContent.classList.contains(
            "sidebar-collapsed"
        )
    ) {

        mainContent.classList.add(
            "sidebar-top"
        );

        return;

    }


    /*
    =========================================================
    STATE 2
    =========================================================
    TOP → HIDDEN
    =========================================================
    */

    if (
        mainContent.classList.contains(
            "sidebar-top"
        )
    ) {

        mainContent.classList.remove(
            "sidebar-top"
        );

        mainContent.classList.add(
            "sidebar-collapsed"
        );

        return;

    }


    /*
    =========================================================
    STATE 3
    =========================================================
    HIDDEN → SIDE
    =========================================================
    */

    if (
        mainContent.classList.contains(
            "sidebar-collapsed"
        )
    ) {

        mainContent.classList.remove(
            "sidebar-collapsed"
        );

        return;

    }

}