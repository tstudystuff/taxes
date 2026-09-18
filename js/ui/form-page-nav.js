// js/ui/form-page-nav.js


let cleanupCurrentFormPageNav = null;


/* =========================================================
   INITIALIZE FORM PAGE NAVIGATION
   ========================================================= */

export function initFormPageNav() {

    /*
    Clean up navigation from the previously loaded form.
    */

    if (cleanupCurrentFormPageNav) {

        cleanupCurrentFormPageNav();

        cleanupCurrentFormPageNav = null;
    }


    const mainLandingPage =
        document.querySelector(
            ".main-landing-page"
        );


    if (!mainLandingPage) {
        return;
    }


    /*
    =========================================================
    GET PHYSICAL TAX PAGES
    =========================================================
    */

    const pages = [
        ...mainLandingPage.querySelectorAll(
            ".tax-form-page"
        )
    ];


    /*
    No arrows needed for a one-page form.
    */

    if (pages.length <= 1) {
        return;
    }


    /*
    =========================================================
    CREATE NAVIGATION
    =========================================================
    */

    const nav =
        document.createElement(
            "div"
        );


    nav.classList.add(
        "form-page-nav"
    );


    nav.setAttribute(
        "aria-label",
        "Tax form page navigation"
    );


    /*
    =========================================================
    LEFT / PREVIOUS BUTTON
    =========================================================
    */

    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.type =
        "button";


    previousButton.classList.add(
        "form-page-nav-btn",
        "form-page-nav-prev"
    );


    previousButton.textContent =
        "←";


    previousButton.setAttribute(
        "aria-label",
        "Previous form page"
    );


    /*
    =========================================================
    RIGHT / NEXT BUTTON
    =========================================================
    */

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.type =
        "button";


    nextButton.classList.add(
        "form-page-nav-btn",
        "form-page-nav-next"
    );


    nextButton.textContent =
        "→";


    nextButton.setAttribute(
        "aria-label",
        "Next form page"
    );


    nav.append(
        previousButton,
        nextButton
    );


    /*
    Put navigation inside .main-landing-page.

    position: fixed keeps it in the exact same place
    on the screen while pages move underneath.
    */

    mainLandingPage.prepend(
        nav
    );


    /*
    =========================================================
    CURRENT PAGE
    =========================================================
    */

    let currentPageIndex = 0;


    /*
    =========================================================
    FIXED VERTICAL POSITION
    =========================================================

    Capture the original top of .main-landing-page ONCE.

    We do NOT recalculate this when scrolling.

    That is what keeps the arrows in the exact same place
    on the screen when moving from page 1 to page 2.
    =========================================================
    */

    const initialLandingRect =
        mainLandingPage
            .getBoundingClientRect();


    const initialLandingStyles =
        window.getComputedStyle(
            mainLandingPage
        );


    const initialPaddingTop =
        parseFloat(
            initialLandingStyles.paddingTop
        ) || 0;


    let fixedTop =
        initialLandingRect.top +
        initialPaddingTop;


    /*
    Don't allow navigation to disappear above viewport.
    */

    fixedTop =
        Math.max(
            8,
            fixedTop
        );


    /*
    =========================================================
    POSITION NAVIGATION
    =========================================================

    Horizontal position CAN change because sidebar width
    changes.

    Vertical position stays fixed.
    =========================================================
    */

    function positionNavigation() {

        const landingRect =
            mainLandingPage
                .getBoundingClientRect();


        const styles =
            window.getComputedStyle(
                mainLandingPage
            );


        const paddingLeft =
            parseFloat(
                styles.paddingLeft
            ) || 0;


        const paddingRight =
            parseFloat(
                styles.paddingRight
            ) || 0;


        const left =
            landingRect.left +
            paddingLeft;


        const width =
            landingRect.width -
            paddingLeft -
            paddingRight;


        nav.style.left =
            `${left}px`;


        nav.style.width =
            `${width}px`;


        nav.style.top =
            `${fixedTop}px`;
    }


    /*
    =========================================================
    BUTTON VISIBILITY
    =========================================================
    */

    function updateButtons() {

        /*
        FIRST PAGE

        ← hidden
        → visible
        */

        previousButton.hidden =
            currentPageIndex === 0;


        /*
        LAST PAGE

        → hidden
        ← visible
        */

        nextButton.hidden =
            currentPageIndex ===
            pages.length - 1;
    }


    /*
    =========================================================
    GO TO PAGE
    =========================================================
    */

    function goToPage(index) {

        if (
            index < 0 ||
            index >= pages.length
        ) {
            return;
        }


        /*
        Change state FIRST.

        This means the opposite arrow appears immediately
        when the user clicks.
        */

        currentPageIndex =
            index;


        updateButtons();


        /*
        =====================================================
        INSTANT PAGE JUMP
        =====================================================

        Calculate the page's absolute document position.

        Then subtract the fixed navigation position so the
        top of the page lands just BELOW the arrows.
        =====================================================
        */

        const page =
            pages[
            currentPageIndex
            ];


        const pageRect =
            page.getBoundingClientRect();


        const navHeight =
            nav.getBoundingClientRect()
                .height;


        const pageDocumentTop =
            window.scrollY +
            pageRect.top;


        const targetTop =
            pageDocumentTop -
            fixedTop -
            navHeight -
            8;


        window.scrollTo({
            top:
                Math.max(
                    0,
                    targetTop
                ),

            behavior:
                "auto"
        });


        /*
        Keep keyboard focus on the arrow that was used.

        This makes repeated page navigation easy.
        */

        if (
            currentPageIndex ===
            pages.length - 1
        ) {

            previousButton.focus();

        } else {

            nextButton.focus();
        }
    }


    /*
    =========================================================
    PREVIOUS PAGE
    =========================================================
    */

    function handlePreviousClick() {

        goToPage(
            currentPageIndex - 1
        );
    }


    /*
    =========================================================
    NEXT PAGE
    =========================================================
    */

    function handleNextClick() {

        goToPage(
            currentPageIndex + 1
        );
    }


    previousButton.addEventListener(
        "click",
        handlePreviousClick
    );


    nextButton.addEventListener(
        "click",
        handleNextClick
    );


    /*
    =========================================================
    KEEP NAV HORIZONTALLY ALIGNED

    Sidebar changes can change the width and horizontal
    location of .main-landing-page.

    ResizeObserver moves the arrows horizontally while
    leaving their vertical screen position unchanged.
    =========================================================
    */

    const resizeObserver =
        new ResizeObserver(
            () => {

                positionNavigation();

            }
        );


    resizeObserver.observe(
        mainLandingPage
    );


    const mainContent =
        document.querySelector(
            ".main-content"
        );


    if (mainContent) {

        resizeObserver.observe(
            mainContent
        );
    }


    /*
    Browser resize.
    */

    window.addEventListener(
        "resize",
        positionNavigation
    );


    /*
    =========================================================
    INITIAL STATE
    =========================================================
    */

    positionNavigation();

    updateButtons();


    /*
    =========================================================
    CLEANUP
    =========================================================
    */

    cleanupCurrentFormPageNav =
        () => {

            previousButton.removeEventListener(
                "click",
                handlePreviousClick
            );


            nextButton.removeEventListener(
                "click",
                handleNextClick
            );


            window.removeEventListener(
                "resize",
                positionNavigation
            );


            resizeObserver.disconnect();


            nav.remove();
        };
}