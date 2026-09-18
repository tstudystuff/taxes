// js/ui/sidebar.js

// LOAD DEFAULT PAGE WITH THIS INDEX
// *********************************************
import {
    initFormPageNav
} from "./form-page-nav.js";

import { refreshSteps }
    from "../nav/main-landing-nav.js";

import {
    loadPages,
    savePages
} from "../data/page-storage.js";

import {
    promptsSaverTemplate
} from "../templates/prompts-template.js";

import {
    toggleEditMode,
    isEditMode,
    exitEditMode
} from "./sidebar-edit-mode.js";

import {
    initEditButton,
    initOutsideClickExit,
    initKeyExit
} from "./sidebar-edit-mode.js";

import {
    changeTutorialLink
} from "./change-tutorial-link.js";


let default_sidebar_index = 0;

const mainLandingPage =
    document.querySelector(".main-landing-page");


let pages = loadPages();


export function initSidebar() {

    renderSidebar();

    initSidebarClickHandler();

    initCreatePageButton();

    initEditButton(renderSidebar);

    initOutsideClickExit(renderSidebar);

    initKeyExit(renderSidebar);
}


// =========================================================
// RENDER SIDEBAR
// =========================================================

function renderSidebar() {

    const sideBarList =
        document.querySelector("#sideBarList");

    if (!sideBarList) {
        return;
    }

    sideBarList.innerHTML = "";

    pages.forEach(page => {

        const li =
            createPageListItem(page);

        sideBarList.append(li);

    });
}


// =========================================================
// CREATE PAGE LIST ITEM
// =========================================================

function createPageListItem(page) {

    const li =
        document.createElement("li");

    /*
    =========================================================
    PAGE LINK
    =========================================================
    */

    const link =
        document.createElement("a");

    link.href = "#";

    link.textContent = page.title;

    link.dataset.pageId = page.id;

    link.setAttribute(
        "tabindex",
        "0"
    );

    link.setAttribute(
        "data-nav-target",
        `"${page.title}"`
    );

    li.append(link);


    /*
    =========================================================
    DELETE BUTTON
    =========================================================
    */

    if (isEditMode()) {

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "-";

        deleteBtn.classList.add(
            "delete-page-btn"
        );

        deleteBtn.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                const confirmed =
                    confirm(
                        "Are you sure you want to delete this page?"
                    );

                if (!confirmed) {
                    return;
                }

                const currentIndex =
                    findPageIndex(page.id);

                pages =
                    removePageById(
                        pages,
                        page.id
                    );

                savePages(pages);

                renderSidebar();

                const links =
                    document.querySelectorAll(
                        "#sideBarList a"
                    );

                if (links.length === 0) {

                    loadPage(null);

                    return;
                }

                let nextIndex =
                    currentIndex - 1;

                if (nextIndex < 0) {
                    nextIndex = 0;
                }

                const targetLink =
                    links[nextIndex] ||
                    links[0];

                if (targetLink) {

                    targetLink.focus();

                    targetLink.click();

                }

            }
        );

        li.append(deleteBtn);
    }


    /*
    =========================================================
    CHILDREN
    =========================================================
    */

    if (
        Array.isArray(page.children) &&
        page.children.length > 0
    ) {

        const childList =
            document.createElement("ul");

        childList.classList.add(
            "sidebar-sublist"
        );

        page.children.forEach(child => {

            const childLi =
                createPageListItem(child);

            childList.append(childLi);

        });

        li.append(childList);
    }


    return li;
}


// =========================================================
// FIND PAGE RECURSIVELY
// =========================================================

function findPageById(
    pageList,
    pageId
) {

    for (const page of pageList) {

        if (page.id === pageId) {
            return page;
        }

        if (
            Array.isArray(page.children)
        ) {

            const found =
                findPageById(
                    page.children,
                    pageId
                );

            if (found) {
                return found;
            }
        }
    }

    return null;
}


// =========================================================
// FIND PAGE INDEX
// =========================================================

function findPageIndex(
    pageId,
    pageList = pages
) {

    let index = 0;

    for (const page of pageList) {

        if (page.id === pageId) {
            return index;
        }

        if (
            Array.isArray(page.children)
        ) {

            const childIndex =
                findPageIndex(
                    pageId,
                    page.children
                );

            if (childIndex !== -1) {
                return index + childIndex;
            }
        }

        index++;
    }

    return -1;
}


// =========================================================
// REMOVE PAGE RECURSIVELY
// =========================================================

function removePageById(
    pageList,
    pageId
) {

    return pageList
        .filter(page => page.id !== pageId)
        .map(page => {

            if (
                Array.isArray(page.children)
            ) {

                return {
                    ...page,
                    children:
                        removePageById(
                            page.children,
                            pageId
                        )
                };
            }

            return page;
        });
}


// =========================================================
// CLICK SIDEBAR LINKS
// =========================================================

// function initSidebarClickHandler() {

//     const sideBarList =
//         document.querySelector("#sideBarList");

//     if (!sideBarList) {
//         return;
//     }


//     /*
//     =========================================================
//     INITIAL PAGE LOAD
//     =========================================================
//     */

//     if (!document.eventsAdded) {

//         console.log(
//             pages[default_sidebar_index].file
//         );

//         loadPage(
//             pages[default_sidebar_index]
//         );
//     }

//     document.eventsAdded = true;


//     /*
//     =========================================================
//     CLICK HANDLER
//     =========================================================
//     */
//     sideBarList.addEventListener(
//         "click",
//         (e) => {

//             console.log(
//                 "SIDEBAR CLICK:",
//                 e.target
//             );

//             const link =
//                 e.target.closest("a");

//             console.log(
//                 "FOUND LINK:",
//                 link
//             );

//             if (!link) {
//                 return;
//             }

//             e.preventDefault();

//             const pageId =
//                 link.dataset.pageId;

//             console.log(
//                 "PAGE ID:",
//                 pageId
//             );

//             const page =
//                 findPageById(
//                     pages,
//                     pageId
//                 );

//             console.log(
//                 "FOUND PAGE:",
//                 page
//             );

//             if (!page) {

//                 console.warn(
//                     "Could not find sidebar page:",
//                     pageId
//                 );

//                 return;
//             }

//             loadPage(page);

//             refreshSteps();
//         }
//     );
//     // sideBarList.addEventListener(
//     //     "click",
//     //     (e) => {

//     //         const link =
//     //             e.target.closest("a");

//     //         if (!link) {
//     //             return;
//     //         }

//     //         e.preventDefault();

//     //         const pageId =
//     //             link.dataset.pageId;

//     //         /*
//     //         IMPORTANT:
//     //         Search both top-level pages
//     //         and nested children.
//     //         */

//     //         const page =
//     //             findPageById(
//     //                 pages,
//     //                 pageId
//     //             );

//     //         if (!page) {

//     //             console.warn(
//     //                 "Could not find sidebar page:",
//     //                 pageId
//     //             );

//     //             return;
//     //         }

//     //         loadPage(page);

//     //         refreshSteps();

//     //     }
//     // );
// }
function initSidebarClickHandler() {

    const sideBarList =
        document.querySelector("#sideBarList");

    if (!sideBarList) {
        return;
    }


    /*
    =========================================================
    INITIAL PAGE LOAD
    =========================================================
    */

    if (!document.eventsAdded) {

        console.log(
            pages[default_sidebar_index].file
        );

        loadPage(
            pages[default_sidebar_index]
        );
    }

    document.eventsAdded = true;


    /*
    =========================================================
    ACTIVATE SIDEBAR PAGE
    =========================================================
    */

    function activateSidebarPage(e) {

        const link =
            e.target.closest?.(
                "#sideBarList a"
            );

        if (!link) {
            return;
        }

        e.preventDefault();

        const pageId =
            link.dataset.pageId;

        const page =
            findPageById(
                pages,
                pageId
            );

        if (!page) {

            console.warn(
                "Could not find sidebar page:",
                pageId
            );

            return;
        }

        loadPage(page);

        refreshSteps();
    }


    /*
    =========================================================
    POINTER / TOUCH ACTIVATION
    =========================================================

    pointerup handles:
        - touchscreen
        - mouse
        - stylus

    This gives mobile an explicit activation path instead
    of relying only on the browser-generated click event.
    =========================================================
    */

    sideBarList.addEventListener(
        "pointerup",
        e => {

            /*
            Ignore mouse here.

            Desktop mouse activation continues to use the
            normal click handler below. This prevents a
            desktop mouse from loading the page twice.
            */

            if (
                e.pointerType === "mouse"
            ) {
                return;
            }

            activateSidebarPage(e);
        }
    );


    /*
    =========================================================
    NORMAL CLICK ACTIVATION
    =========================================================

    Keep this for:
        - desktop mouse
        - keyboard-generated clicks
        - browsers that use normal click for touch
    =========================================================
    */

    sideBarList.addEventListener(
        "click",
        e => {

            /*
            A touch pointerup may be followed by a synthetic
            click. Ignore that click so the page isn't loaded
            twice.
            */

            if (
                e.sourceCapabilities?.firesTouchEvents
            ) {
                return;
            }

            activateSidebarPage(e);
        }
    );
}


// =========================================================
// LOAD PAGE
// =========================================================

async function loadPage(page) {

    if (!page) {

        mainLandingPage.innerHTML = "";

        return;
    }


    /*
    =========================================================
    INLINE CONTENT
    =========================================================
    */

    if (page.content) {

        mainLandingPage.innerHTML =
            page.content;

        return;
    }


    /*
    =========================================================
    FILE
    =========================================================
    */

    if (page.file) {

        console.log(
            "Loading:",
            page.file
        );

        const response =
            await fetch(page.file);

        if (!response.ok) {

            console.error(
                "Failed to load page:",
                page.file
            );

            console.error(
                "Status:",
                response.status
            );

            return;
        }

        const html =
            await response.text();

        mainLandingPage.innerHTML =
            html;


        /*
        =====================================================
        RECREATE EXTERNAL SCRIPTS
        =====================================================
        */

        mainLandingPage
            .querySelectorAll(
                'script[src]'
            )
            .forEach(script => {

                const loadedScript =
                    document.createElement(
                        "script"
                    );

                loadedScript.src =
                    new URL(
                        script.getAttribute("src"),
                        response.url
                    ).href;

                document.body.appendChild(
                    loadedScript
                );

                script.remove();

            });
        initFormPageNav()
        return;
    }


    console.error(
        "Page has neither content nor file:",
        page
    );
}


// =========================================================
// CREATE PAGE
// =========================================================

function initCreatePageButton() {

    const createBtn =
        document.querySelector(
            "#createSidePage"
        );

    if (!createBtn) {
        return;
    }

    createBtn.addEventListener(
        "click",
        () => {

            const title =
                prompt(
                    "Enter page title"
                );

            if (!title) {
                return;
            }

            const newPage = {

                id:
                    crypto.randomUUID(),

                title,

                content:
                    promptsSaverTemplate
                        .replace(
                            "new-side-link-page",
                            title
                        )
            };


            pages.push(
                newPage
            );

            savePages(
                pages
            );

            renderSidebar();

            loadPage(
                newPage
            );

        }
    );
}