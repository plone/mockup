/**
 * Module Federation support for Mockup.
 *
 * In this module federation setup Mockup is the main host, which loads other
 * "remote" bundles.
 *
 * Those remotes need to be registered via the Patternslib's Webpack Module
 * Federation helper, just like Mockup itself (See Mockup's webpack.config.js).
 * Patternslib' Module Federation helper registers the bundle under a prefix
 * (``MF_NAME_PREFIX``) in the global namespace.
 *
 * Here, we filter for all the globally registered bundles with this prefix and
 * load them.
 *
 * Note: loading in this context only means that the module federation
 * functionality for each bundle is initialized.
 *
 */
import "@patternslib/dev/webpack/module_federation";

// And now load this bundle's actual entry point.
// The import needs to be kept dynamic (async boundary for shared modules) and
// is exported as default, so that the Patternslib Module Federation helper
// can wait for it before resolving ``window.__patternslib_mf_initialized``.
export default import("./patterns");

// Register Bootstrap and jQuery gloablly
async function register_global_libraries() {
    // Register Bootstrap globally
    const bootstrap = await import("bootstrap");
    window.bootstrap = bootstrap;

    // Register jQuery globally
    const jquery = (await import("jquery")).default;
    window.jQuery = jquery;
    window.$ = jquery;
}
register_global_libraries();
