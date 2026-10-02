/**
 * formatjs Intl.DateTimeFormat polyfill + locale data loader.
 *
 * Kept in its own lazy module so the polyfill core and the locale-data
 * webpack context are only fetched by browsers whose native Intl does not
 * support the site language — see ensureIntlSupport() in intl-loader.js.
 */

export async function loadIntlPolyfill(normalizedLang) {
    const baseLang = normalizedLang.split("-")[0];

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
        // The webpackInclude restricts the context to base-language files
        // (de.js, pt.js, ...): baseLang never contains a region/script suffix,
        // so the ~450 variant files (pt-BR.js, zh-Hans.js, ...) can never be
        // requested and would only bloat the chunk map and dist. Regional
        // variants still resolve through the polyfill's own fallback
        // (pt-BR -> pt, de-AT -> de).
        // NOTE: webpack tests webpackInclude against the absolute file path,
        // not against the "./de.js" request, so the pattern must not be
        // anchored at "./".
        await import(
            /* webpackInclude: /[\\/][a-z]{2,3}\.js$/ */
            `@formatjs/intl-datetimeformat/locale-data/${baseLang}.js`
        );

        if (Intl.DateTimeFormat.supportedLocalesOf(normalizedLang).length > 0) {
            console.info(`Locale "${normalizedLang}" is now supported.`);
        }
    } catch (e) {
        console.warn(`Could not load Intl data for ${baseLang}`, e);
    }
}
