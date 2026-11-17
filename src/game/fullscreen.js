const originalHTML = document.querySelector("html").outerHTML;

function canFullscreen() {
    return window.location.href.includes("kasandbox") && !window.isFullscreen && !window.opener;
}

function fullscreen() {
    const w = window.open();
    w.document.open();
    w.document.write(`<!DOCTYPE html>${originalHTML}`);
    w.document.close();
    w.isFullscreen = true;
}

export { canFullscreen, fullscreen };

