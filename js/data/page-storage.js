// js/data/page-storage.js

import { defaultPages } from "./pages.js";

const STORAGE_KEY = "sidebar-pages";


export function loadPages() {

    const stored =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (stored) {

        try {

            const pages =
                JSON.parse(
                    stored
                );


            /*
            =====================================================
            MIGRATE EXISTING 1040 PAGE
            =====================================================
            */

            const form1040 =
                pages.find(
                    page =>
                        page.id === "page-0"
                );


            if (form1040) {

                if (
                    !Array.isArray(
                        form1040.children
                    )
                ) {

                    form1040.children = [];

                }


                let changed =
                    false;


                /*
                =================================================
                FORM 8949
                =================================================
                */

                const form8949Exists =
                    form1040.children.some(
                        child =>
                            child.id ===
                            "form-8949-2025"
                    );


                if (!form8949Exists) {

                    form1040.children.push({
                        id: "form-8949-2025",

                        title:
                            "Form 8949",

                        file:
                            "../forms-taxes-html/form-8949/form_8949_2025.html"
                    });


                    changed = true;

                }


                /*
                =================================================
                SCHEDULE B
                =================================================
                */

                /*
=================================================
SCHEDULE B
=================================================
*/

                let scheduleB =
                    form1040.children.find(
                        child =>
                            child.id ===
                            "schedule-b-2025"
                    );


                if (!scheduleB) {

                    scheduleB = {
                        id:
                            "schedule-b-2025",

                        title:
                            "Schedule B",

                        file:
                            "../forms-taxes-html/schedule-b/form_schedule_b_25.html"
                    };


                    form1040.children.push(
                        scheduleB
                    );


                    changed = true;

                } else {

                    /*
                    -------------------------------------------------
                    KEEP EXISTING STORED PAGE CURRENT
                    -------------------------------------------------
                    */

                    if (
                        scheduleB.title !==
                        "Schedule B"
                    ) {

                        scheduleB.title =
                            "Schedule B";

                        changed = true;

                    }


                    if (
                        scheduleB.file !==
                        "../forms-taxes-html/schedule-b/form_schedule_b_25.html"
                    ) {

                        scheduleB.file =
                            "../forms-taxes-html/schedule-b/form_schedule_b_25.html";

                        changed = true;

                    }

                }
                /*
                =================================================
                SAVE MIGRATED SIDEBAR
                =================================================
                */

                if (changed) {

                    savePages(
                        pages
                    );

                }

            }


            return pages;


        } catch (e) {

            console.warn(
                "Failed to parse pages, resetting."
            );


            savePages(
                defaultPages
            );


            return defaultPages;

        }

    }


    /*
    =========================================================
    FIRST RUN
    =========================================================
    */

    savePages(
        defaultPages
    );


    return defaultPages;
}



export function savePages(pages) {

    console.log(
        pages.length
    );


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            pages
        )
    );

}