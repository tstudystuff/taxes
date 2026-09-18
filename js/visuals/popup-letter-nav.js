export function showLetterNavStatus({navState, NAV_MODES}) {
    const popEl = document.querySelector("#popElLetterNav");

    if (!popEl) return;

    const isLetterNav =
        navState.mode === NAV_MODES.LETTER;

    popEl.textContent =
        `letter navigation : ${isLetterNav}`;

    popEl.classList.add("show");

    clearTimeout(popEl._letterNavTimeout);

    popEl._letterNavTimeout = setTimeout(() => {
        popEl.classList.remove("show");
    }, 1500);
}