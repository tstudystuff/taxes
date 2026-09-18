// js/ui/sidebar-edit-mode.js
let editMode = false;
export function toggleEditMode() {
    editMode = !editMode;
}

export function isEditMode() {
    return editMode;
}

export function exitEditMode() {
    editMode = false;
}

// ======================
// EDIT MODE BUTTON
// ======================

export function initEditButton(renderSidebar) {
    const editBtn = document.querySelector("#editSideBarBtn");
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleEditMode();
        renderSidebar();
    });
}

// ======================
// EXIT ON OUTSIDE CLICK
// ======================
export function initOutsideClickExit(renderSidebar) {
    document.addEventListener("click", (e) => {
        if (!isEditMode()) return;
        const sidebar = document.querySelector(".side-bar");
        if (!sidebar.contains(e.target)) {
            exitEditMode();
            renderSidebar();
        }
    });
}

// ======================
// EXIT ON KEY PRESS
// ======================
export function initKeyExit({renderSidebar,exitEditMode}) {
    document.addEventListener("keydown", (e) => {
        if (!isEditMode()) return;
        if (e.key === "Escape") {
            exitEditMode();
            renderSidebar();
        }
    });
}