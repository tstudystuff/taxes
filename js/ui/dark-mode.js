export function initDarkMode() {

    const body =
        document.body;


    if (!body) {
        return;
    }


    document.addEventListener(
        "keydown",
        e => {

            /*
            =================================================
            CMD + SHIFT + K
            =================================================
            */

            if (
                e.key.toLowerCase() === "k" &&
                e.metaKey &&
                e.shiftKey &&
                !e.ctrlKey &&
                !e.altKey
            ) {

                e.preventDefault();

                body.classList.toggle(
                    "light-mode"
                );

            }

        }
    );

}