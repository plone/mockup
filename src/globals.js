import jquery from "jquery";

// Register jQuery globally
window.jQuery = jquery;
window.$ = jquery;

// Register Bootstrap globally
window.bootstrap = "__deferred__";

document.addEventListener("DOMContentLoaded", async (e) => {
    const bootstrap = await import("bootstrap");
    window.bootstrap = bootstrap;
});
