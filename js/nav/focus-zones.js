// focus-zones.js
// js/nav/focus-zones.js
export function getFocusZone(event) {

    const target = event.target;

    if (target.closest?.(".side-bar")) {
        return "side-bar";
    }

    if (target.closest?.(".main-landing-page")) {
        return "main-landing-page";
    }

    return "page";
}