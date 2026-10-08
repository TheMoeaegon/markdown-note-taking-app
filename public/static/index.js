document.body.addEventListener("htmx:afterSwap", (e) => {
    if (e.detail.target.id === "dialog-container") {
        e.detail.target.querySelector("dialog")?.showModal();
    }
});
