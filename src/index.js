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
import "@patternslib/patternslib/webpack/module_federation";

// And now load this bundle's actual entry point.
import("./patterns");
