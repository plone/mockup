/* RequireJS configuration
 */

/* global module:true */

(function () {
    "use strict";

    var tinymcePlugins = [
        "advlist",
        "anchor",
        "autolink",
        "autoresize",
        "autosave",
        "bbcode",
        "charmap",
        "code",
        "codesample",
        "colorpicker",
        "contextmenu",
        "directionality",
        "emoticons",
        "fullpage",
        "fullscreen",
        "help",
        "hr",
        "image",
        "imagetools",
        "importcss",
        "insertdatetime",
        "legacyoutput",
        "link",
        "lists",
        "media",
        "nonbreaking",
        "noneditable",
        "pagebreak",
        "paste",
        "preview",
        "print",
        "quickbars",
        "save",
        "searchreplace",
        "spellchecker",
        "tabfocus",
        "table",
        "template",
        "textcolor",
        "textpattern",
        "toc",
        "visualblocks",
        "visualchars",
        "wordcount",
    ];

    // prettier-ignore
    var requirejsOptions = {
        baseUrl: "./",
        optimize: "none",
        paths: {
            // Patternslib
            "logging":                                   "node_modules/logging/src/logging",
            "pat-base":                                  "node_modules/patternslib/src/core/base",
            "pat-compat":                                "node_modules/patternslib/src/core/compat",
            "pat-jquery-ext":                            "node_modules/patternslib/src/core/jquery-ext",
            "pat-logger":                                "node_modules/patternslib/src/core/logger",
            "pat-mockup-parser":                         "node_modules/patternslib/src/core/mockup-parser",
            "pat-registry":                              "node_modules/patternslib/src/core/registry",
            "pat-utils":                                 "node_modules/patternslib/src/core/utils",

            // Core
            "docs-contribute":                           "CONTRIBUTE.md",
            "docs-getting-started":                      "GETTING_STARTED.md",
            "docs-learn":                                "LEARN.md",
            "mockup-docs":                               "js/docs/app",
            "mockup-docs-navigation":                    "js/docs/navigation",
            "mockup-docs-page":                          "js/docs/page",
            "mockup-docs-pattern":                       "js/docs/pattern",
            "mockup-docs-view":                          "js/docs/view",
            "mockup-fakeserver":                         "tests/fakeserver",
            "mockup-i18n":                               "js/i18n",
            "mockup-router":                             "js/router",
            "mockup-ui-url":                             "js/ui",
            "mockup-utils":                              "js/utils",
            "translate":                                 "js/i18n-wrapper",

            // Bundles
            "mockup-bundles-docs":                       "js/bundles/docs",
            "mockup-bundles-filemanager":                "js/bundles/filemanager",
            "mockup-bundles-plone":                      "js/bundles/plone",
            "mockup-bundles-resourceregistry":           "js/bundles/resourceregistry",
            "mockup-bundles-structure":                  "js/bundles/structure",
            "mockup-bundles-tiles":                      "js/bundles/widgets",
            "mockup-bundles-widgets":                    "js/bundles/widgets",

            // Patterns
            "mockup-patterns-autotoc":                   "patterns/autotoc/pattern",
            "mockup-patterns-backdrop":                  "patterns/backdrop/pattern",
            "mockup-patterns-base":                      "patterns/base/pattern",
            "mockup-patterns-contentloader":             "patterns/contentloader/pattern",
            "mockup-patterns-cookietrigger":             "patterns/cookietrigger/pattern",
            "mockup-patterns-datatables":                "patterns/datatables/pattern",
            "mockup-patterns-eventedit":                 "patterns/eventedit/pattern",
            "mockup-patterns-filemanager":               "patterns/filemanager/pattern",
            "mockup-patterns-filemanager-url":           "patterns/filemanager",
            "mockup-patterns-formautofocus":             "patterns/formautofocus/pattern",
            "mockup-patterns-formunloadalert":           "patterns/formunloadalert/pattern",
            "mockup-patterns-inlinevalidation":          "patterns/inlinevalidation/pattern",
            "mockup-patterns-livesearch":                "patterns/livesearch/pattern",
            "mockup-patterns-markspeciallinks":          "patterns/markspeciallinks/pattern",
            "mockup-patterns-modal":                     "patterns/modal/pattern",
            "mockup-patterns-moment":                    "patterns/moment/pattern",
            "mockup-patterns-navigationmarker":          "patterns/navigationmarker/pattern",
            "mockup-patterns-passwordstrength":          "patterns/passwordstrength/pattern",
            "mockup-patterns-passwordstrength-url":      "patterns/passwordstrength",
            "mockup-patterns-pickadate":                 "patterns/pickadate/pattern",
            "mockup-patterns-preventdoublesubmit":       "patterns/preventdoublesubmit/pattern",
            "mockup-patterns-querystring":               "patterns/querystring/pattern",
            "mockup-patterns-recurrence":                "patterns/recurrence/pattern",
            "mockup-patterns-relateditems":              "patterns/relateditems/pattern",
            "mockup-patterns-relateditems-upload":       "patterns/relateditems/upload",
            "mockup-patterns-relateditems-url":          "patterns/relateditems",
            "mockup-patterns-resourceregistry":          "patterns/resourceregistry/pattern",
            "mockup-patterns-resourceregistry-url":      "patterns/resourceregistry",
            "mockup-patterns-select2":                   "patterns/select2/pattern",
            "mockup-patterns-sortable":                  "patterns/sortable/pattern",
            "mockup-patterns-structure":                 "patterns/structure/pattern",
            "mockup-patterns-structure-url":             "patterns/structure",
            "mockup-patterns-structureupdater":          "patterns/structure/pattern-structureupdater",
            "mockup-patterns-textareamimetypeselector":  "patterns/textareamimetypeselector/pattern",
            "mockup-patterns-texteditor":                "patterns/texteditor/pattern",
            "mockup-patterns-thememapper":               "patterns/thememapper/pattern",
            "mockup-patterns-thememapper-url":           "patterns/thememapper",
            "mockup-patterns-tinymce":                   "patterns/tinymce/pattern",
            "mockup-patterns-tinymce-url":               "patterns/tinymce",
            "mockup-patterns-toggle":                    "patterns/toggle/pattern",
            "mockup-patterns-tooltip":                   "patterns/tooltip/pattern",
            "mockup-patterns-tree":                      "patterns/tree/pattern",
            "mockup-patterns-upload":                    "patterns/upload/pattern",
            "mockup-patterns-upload-url":                "patterns/upload",
            "plone-patterns-toolbar":                    "patterns/toolbar/pattern",

            // External libraries
            "ace":                                       "node_modules/ace-builds/src/ace",
            "backbone":                                  "node_modules/backbone/backbone",
            "backbone.paginator":                        "node_modules/backbone.paginator/lib/backbone.paginator",
            "bootstrap-alert":                           "node_modules/bootstrap/js/alert",
            "bootstrap-collapse":                        "node_modules/bootstrap/js/collapse",
            "bootstrap-dropdown":                        "node_modules/bootstrap/js/dropdown",
            "bootstrap-transition":                      "node_modules/bootstrap/js/transition",
            "datatables.net":                            "node_modules/datatables.net/js/jquery.dataTables",
            "datatables.net-autofill":                   "node_modules/datatables.net-autofill/js/dataTables.autoFill",
            "datatables.net-autofill-bs":                "node_modules/datatables.net-autofill-bs/js/autoFill.bootstrap",
            "datatables.net-bs":                         "node_modules/datatables.net-bs/js/dataTables.bootstrap",
            "datatables.net-buttons":                    "node_modules/datatables.net-buttons/js/dataTables.buttons.min",
            "datatables.net-buttons-bs":                 "node_modules/datatables.net-buttons-bs/js/buttons.bootstrap.min",
            "datatables.net-buttons-colvis":             "node_modules/datatables.net-buttons/js/buttons.colVis.min",
            "datatables.net-buttons-flash":              "node_modules/datatables.net-buttons/js/buttons.flash.min",
            "datatables.net-buttons-html5":              "node_modules/datatables.net-buttons/js/buttons.html5.min",
            "datatables.net-buttons-print":              "node_modules/datatables.net-buttons/js/buttons.print.min",
            "datatables.net-colreorder":                 "node_modules/datatables.net-colreorder/js/dataTables.colReorder.min",
            "datatables.net-fixedcolumns":               "node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns.min",
            "datatables.net-fixedheader":                "node_modules/datatables.net-fixedheader/js/dataTables.fixedHeader.min",
            "datatables.net-keytable":                   "node_modules/datatables.net-keytable/js/dataTables.keyTable.min",
            "datatables.net-responsive":                 "node_modules/datatables.net-responsive/js/dataTables.responsive.min",
            "datatables.net-responsive-bs":              "node_modules/datatables.net-responsive-bs/js/responsive.bootstrap.min",
            "datatables.net-rowreorder":                 "node_modules/datatables.net-rowreorder/js/dataTables.rowReorder.min",
            "datatables.net-scroller":                   "node_modules/datatables.net-scroller/js/dataTables.scroller.min",
            "datatables.net-select":                     "node_modules/datatables.net-select/js/dataTables.select.min",
            "dropzone":                                  "node_modules/dropzone/dist/dropzone-amd-module",
            "expect":                                    "node_modules/expect/index",
            "jqtree":                                    "node_modules/jqtree/tree.jquery",
            "jqtree-contextmenu":                        "node_modules/cs-jqtree-contextmenu/src/jqTreeContextMenu",
            "jquery":                                    "node_modules/jquery/dist/jquery",
            "jquery.browser":                            "node_modules/jquery.browser/dist/jquery.browser",
            "jquery.cookie":                             "node_modules/jquery.cookie/jquery.cookie",
            "jquery.form":                               "node_modules/jquery-form/src/jquery.form",
            "jquery.recurrenceinput":                    "node_modules/jquery.recurrenceinput.js/src/jquery.recurrenceinput",
            "jquery.tmpl":                               "node_modules/jquery.recurrenceinput.js/lib/jquery.tmpl",
            "jquery.tools.dateinput":                    "node_modules/jquery.recurrenceinput.js/lib/jquery.tools.dateinput",
            "jquery.tools.overlay":                      "node_modules/jquery.recurrenceinput.js/lib/jquery.tools.overlay",
            "moment":                                    "node_modules/moment/moment",
            "moment-url":                                "node_modules/moment/locale",
            "picker":                                    "node_modules/pickadate/lib/picker",
            "picker.date":                               "node_modules/pickadate/lib/picker.date",
            "picker.time":                               "node_modules/pickadate/lib/picker.time",
            "select2":                                   "node_modules/select2/select2",
            "sinon":                                     "node_modules/sinon/pkg/sinon",
            "sortable":                                  "node_modules/sortablejs/dist/sortable.umd",
            "text":                                      "node_modules/requirejs-text/text",
            "tinymce":                                   "node_modules/tinymce/tinymce",
            "tinymce-theme":                             "node_modules/tinymce/themes/silver/theme",
            "underscore":                                "node_modules/underscore/underscore",

            // For the docs viewer
            "JSXTransformer":                            "node_modules/react/JSXTransformer",
            "marked":                                    "node_modules/marked/lib/marked",
            "react":                                     "node_modules/react/react",
        },
        shim: {
            "backbone": {
                exports: "window.Backbone",
                deps: ["underscore", "jquery"],
            },
            "backbone.paginator": {
                exports: "window.Backbone.Paginator",
                deps: ["backbone"],
            },
            "bootstrap-alert": {
                exports: "window.jQuery.fn.alert.Constructor",
                deps: ["jquery"],
            },
            "bootstrap-collapse": {
                exports: "window.jQuery.fn.collapse.Constructor",
                deps: ["jquery"],
            },
            "bootstrap-dropdown": {
                exports: "window.jQuery.fn.dropdown.Constructor",
                deps: ["jquery"],
            },
            "bootstrap-transition": {
                exports: "window.jQuery.support.transition",
                deps: ["jquery"],
            },
            "expect": { exports: "window.expect" },
            "jqtree": { deps: ["jquery"] },
            "jqtree-contextmenu": { deps: ["jqtree"] },
            "select2": { deps: ["jquery"] },
            "jquery.cookie": { deps: ["jquery"] },
            "picker.date": { deps: ["picker"] },
            "picker.time": { deps: ["picker"] },
            "sinon": { exports: "window.sinon" },
            "tinymce": {
                exports: "window.tinyMCE",
                init: function () {
                    this.tinyMCE.DOM.events.domLoaded = true;
                    return this.tinyMCE;
                },
            },
            "tinymce-modern-theme": { deps: ["tinymce"] },
            "underscore": { exports: "window._" },
            "jquery.recurrenceinput": {
                deps: [
                    "jquery",
                    "jquery.tools.overlay",
                    "jquery.tools.dateinput",
                    "jquery.tmpl",
                ],
            },
            "jquery.tools.dateinput": { deps: ["jquery"] },
            "jquery.tools.overlay": { deps: ["jquery"] },
            "jquery.tmpl": { deps: ["jquery"] },

            // Docs
            "JSXTransformer": { exports: "window.JSXTransformer" },
        },
        wrapShim: true,
    };
    for (var i = 0; i < tinymcePlugins.length; i = i + 1) {
        var plugin = tinymcePlugins[i];
        requirejsOptions.paths["tinymce-" + plugin] =
            "node_modules/tinymce/plugins/" + plugin + "/plugin";
        requirejsOptions.shim["tinymce-" + plugin] = {
            deps: ["tinymce"],
        };
    }

    if (typeof exports !== "undefined" && typeof module !== "undefined") {
        module.exports = requirejsOptions;
    }
    if (typeof requirejs !== "undefined" && requirejs.config) {
        requirejs.config(requirejsOptions);
    }
})();
