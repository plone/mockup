/**
 * Global Intl polyfill loader for Plone Mockup.
 * Detects if the current browser supports the site's language and lazily
 * loads the required polyfills and locale data if not.
 */

export async function ensureIntlSupport(lang) {
    if (!lang) return;
    const normalizedLang = lang.replace("_", "-");

    // Check if natively supported
    try {
        if (
            typeof Intl !== "undefined" &&
            Intl.DateTimeFormat &&
            Intl.DateTimeFormat.supportedLocalesOf(normalizedLang).length > 0
        ) {
            return;
        }
    } catch {
        // Fall through to loading polyfill if supportedLocalesOf fails
    }

    console.info(`Locale "${normalizedLang}" not supported. Loading polyfill...`);

    // The polyfill machinery (and its locale-data webpack context) lives in a
    // separate lazy module so this loader stays cheap in the eager chunk.
    const { loadIntlPolyfill } = await import("./intl-polyfill.js");
    await loadIntlPolyfill(normalizedLang);
}
