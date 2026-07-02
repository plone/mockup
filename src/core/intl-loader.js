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
    } catch {
        // Fall through to loading polyfill if supportedLocalesOf fails
    }

    console.info(`Locale "${normalizedLang}" not supported. Loading polyfill...`);

    // Load polyfill core if native support is missing for this locale.
    try {
        // Use polyfill-force to ensure we get a version that supports adding locale data,
        // as native versions might not have the hooks for the locale-data files.
        await import("@formatjs/intl-datetimeformat/polyfill-force.js");
    } catch (e) {
        console.error("Failed to load Intl polyfill core", e);
    }

    // Load specific locale data via Webpack dynamic chunk.
    try {
        // Use the package name with explicit .js extension.
        // We have an alias in webpack.config.js to help resolve this path correctly
        // without triggering package export warnings in Webpack 5.
        await import(`@formatjs/intl-datetimeformat/locale-data/${baseLang}.js`);

        if (Intl.DateTimeFormat.supportedLocalesOf(normalizedLang).length > 0) {
            console.info(`Locale "${normalizedLang}" is now supported.`);
        }
    } catch (e) {
        console.warn(`Could not load Intl data for ${baseLang}`, e);
    }
}
