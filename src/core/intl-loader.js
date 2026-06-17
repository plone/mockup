/**
 * Global Intl polyfill loader for Plone Mockup.
 * Detects if the current browser supports the site's language and lazily
 * loads the required polyfills and locale data if not.
 */

export async function ensureIntlSupport(lang) {
    if (!lang) return;
    const normalizedLang = lang.replace("_", "-");
    const baseLang = normalizedLang.split("-")[0];

    // Check if natively supported
    try {
        if (
            typeof Intl !== "undefined" &&
            Intl.DateTimeFormat &&
            Intl.DateTimeFormat.supportedLocalesOf(normalizedLang).length > 0
        ) {
            return;
        }
    } catch (e) {
        // Fall through to loading polyfill if supportedLocalesOf fails
    }

    console.info(`Locale "${normalizedLang}" not supported. Loading polyfill...`);

    // Load polyfill core if needed
    if (typeof Intl === "undefined" || !Intl.DateTimeFormat) {
        await import("@formatjs/intl-datetimeformat/polyfill.js");
    }

    // Load specific locale data via Webpack dynamic chunk.
    // Note: We use the base language (e.g., 'eu' from 'eu_ES') as most
    // polyfills are grouped by base language.
    // We use a relative path to node_modules to bypass problematic package exports
    // that confuse Webpack 5 when using dynamic imports with template strings.
    try {
        await import(`../../node_modules/@formatjs/intl-datetimeformat/locale-data/${baseLang}.js`);
    } catch (e) {
        console.warn(`Could not load Intl data for ${baseLang}`, e);
    }
}
