// js/nav/toggle-side-bar-nav.js
// js/ui/toggle-sidebar.js
// js/ui/toggle-sidebar.js

/*
=========================================================
TOGGLE SIDEBAR
=========================================================
*/

export function initToggleSidebar() {

    const mainContent =
        document.querySelector(".main-content");


    const sideBarButton =
        document.querySelector("#sideBarBtn");


    if (!mainContent) {

        console.error(
            "Could not find .main-content"
        );

        return;

    }


    if (!sideBarButton) {

        console.error(
            "Could not find #sideBarBtn"
        );

        return;

    }


    /*
    =====================================================
    INITIAL STATE
    =====================================================
    */

    updateAria(
        mainContent,
        sideBarButton
    );


    /*
    =====================================================
    CLICK
    =====================================================
    */

    sideBarButton.addEventListener(
        "click",
        () => {

            toggleSidebar(
                mainContent,
                sideBarButton
            );

        }
    );


    /*
    =====================================================
    ENTER / SPACE
    =====================================================
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
                    mainContent,
                    sideBarButton
                );

            }

        }
    );

}


/*
=========================================================
TOGGLE
=========================================================
*/

function toggleSidebar(
    mainContent,
    sideBarButton
) {

    mainContent.classList.toggle(
        "sidebar-collapsed"
    );


    updateAria(
        mainContent,
        sideBarButton
    );

}


/*
=========================================================
ARIA
=========================================================
*/

function updateAria(
    mainContent,
    sideBarButton
) {

    const collapsed =
        mainContent.classList.contains(
            "sidebar-collapsed"
        );


    sideBarButton.setAttribute(
        "aria-expanded",
        String(!collapsed)
    );

}