import $ from "jquery";
import I18n from "../../core/i18n";
import events from "@patternslib/patternslib/src/core/events";
import logger from "@patternslib/patternslib/src/core/logging";
import _t from "../../core/i18n-wrapper";
import utils from "../../core/utils";

const log = logger.getLogger("tinymce--implementation");

let LinkModal = null;

export default class TinyMCE {
    constructor(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = options;
    }
    addLinkClicked() {
        var self = this;
        if (self.linkModal === null) {
            var $el = $("<div/>").insertAfter(self.$el);
            var linkTypes = ["internal", "upload", "external", "email", "anchor"];
            if (!self.options.upload) {
                linkTypes.splice(1, 1);
            }
            self.linkModal = new LinkModal(
                $el,
                $.extend(true, {}, self.options, {
                    tinypattern: self,
                    linkTypes: linkTypes,
                })
            );
            self.linkModal.show();
        } else {
            self.linkModal.reinitialize();
            self.linkModal.show();
        }
    }
    addImageClicked() {
        var self = this;
        if (self.imageModal === null) {
            var linkTypes = ["image", "uploadImage", "externalImage"];
            if (!self.options.upload) {
                linkTypes.splice(1, 1);
            }
            var options = $.extend(true, {}, self.options, {
                tinypattern: self,
                linkTypes: linkTypes,
                initialLinkType: "image",
                text: {
                    insertHeading: _t("Insert Image"),
                },
                relatedItems: {
                    selectableTypes: self.options.imageTypes,
                },
            });
            var $el = $("<div/>").insertAfter(self.$el);
            self.imageModal = new LinkModal($el, options);
            self.imageModal.show();
        } else {
            self.imageModal.reinitialize();
            self.imageModal.show();
        }
    }
    generateUrl(data) {
        var self = this;
        let part = "undefined";
        if (typeof data === "object" && Object.keys(data).indexOf(self.options.linkAttribute) != -1) {
            part = data[self.options.linkAttribute];
        } else if (typeof data === "string") {
            part = data;
        }
        return self.options.prependToUrl + part + self.options.appendToUrl;
    }
    generateImageUrl(data, scale_name) {
        var self = this;
        var url = self.generateUrl(data);
        if (scale_name) {
            url =
                url +
                self.options.prependToScalePart +
                scale_name +
                self.options.appendToScalePart;
        } else {
            url = url + self.options.appendToOriginalScalePart;
        }
        return url;
    }
    stripGeneratedUrl(url) {
        // to get original attribute back
        var self = this;
        url = url.split(self.options.prependToScalePart, 2)[0];
        if (self.options.prependToUrl) {
            var parts = url.split(self.options.prependToUrl, 2);
            if (parts.length === 2) {
                url = parts[1];
            }
        }
        if (self.options.appendToUrl) {
            url = url.split(self.options.appendToUrl)[0];
        }
        return url;
    }
    getScaleFromUrl(url) {
        var self = this;
        var split = url.split(self.options.prependToScalePart);
        if (split.length !== 2) {
            // not valid scale, screw it
            return null;
        }
        if (self.options.appendToScalePart) {
            url = split[1].split(self.options.appendToScalePart)[0];
        } else {
            url = split[1];
        }
        if (url.indexOf("/image_") !== -1) {
            url = url.split("/image_")[1];
        }
        return url;
    }
    async initLanguage() {
        var self = this;
        var i18n = new I18n();
        var lang = i18n.currentLanguage;

        // Fix for country specific languages
        if (lang.split("-").length > 1) {
            lang =
                lang.split("-")[0] +
                "_" +
                lang.split("-")[1].toUpperCase();
        }

        self.options.tiny.language = lang;

        if (lang !== "en") {
            // load translations from tinymce-i18n
            try {
                await import(`tinymce-i18n/langs7/${lang}`);
            } catch {
                log.debug("Could not load TinyMCE language: ", lang);
                try {
                    // expected lang not available, let's fallback to closest one
                    if (lang.split("_").length > 1) {
                        lang = lang.split("_")[0];
                    } else {
                        lang = lang + "_" + lang.toUpperCase();
                    }
                    log.debug("Trying with: ", lang);
                    await import(`tinymce-i18n/langs7/${lang}`);
                    self.options.tiny.language = lang;
                } catch {
                    log.debug("Could not load TinyMCE language. Fallback to English");
                    self.options.tiny.language = "en";
                }
            }
        }
    }

    async initPlugins() {
        var self = this;

        const lang = self.options.tiny.language;

        let valid_plugins = [];

        // tinyMCE Plugins
        for (const plugin of self.options.tiny.plugins) {

            if (plugin == "plonelink" || plugin == "ploneimage") {
                valid_plugins.push(plugin);
                continue;
            } else if (plugin == "template") {
                // load backported template plugin
                const TemplatePlugin = (await import("./js/template")).default;
                TemplatePlugin();
                valid_plugins.push(plugin);
                continue;
            } else if (plugin == "emoticons") {
                // fix emiticons plugin
                // see https://community.plone.org/t/tinymce-menubar-settings-not-working-6-1-1/22190/1
                await import(`tinymce/plugins/emoticons/js/emojis.min.js`);

            } else if (plugin == "help") {
                // fix help plugin
                // see https://community.plone.org/t/tinymce-menubar-settings-not-working-6-1-1/22190/1
                await import(`tinymce/plugins/help/js/i18n/keynav/${lang}.js`);
            }

            try {
                await import("tinymce/plugins/" + plugin);
                valid_plugins.push(plugin);
            } catch {
                log.debug("Could not load TinyMCE plugin: ", plugin);
            }
        }

        self.options.tiny.plugins = valid_plugins;

    }

    async init() {
        import("./tinymce.scss");

        const theme = $('html').attr('data-bs-theme');
        let css = 'oxide';
        if (theme && theme == 'dark') {
            css = 'oxide-dark';
        }
        import(`tinymce/skins/ui/${css}/content.css`);
        import(`tinymce/skins/ui/${css}/skin.css`);

        const tinymce = (await import("tinymce/tinymce")).default;
        await import("tinymce/models/dom");

        await this.initLanguage();

        await this.initPlugins();

        await import("tinymce/themes/silver");

        await import("tinymce/icons/default");

        LinkModal = (await import("./js/links")).default;

        var self = this;
        self.linkModal = self.imageModal = self.uploadModal = self.pasteModal = null;
        // tiny needs an id in order to initialize. Creat it if not set.
        var id = utils.setId(self.$el);

        if (
            self.options.pictureVariants &&
            typeof self.options.pictureVariants === "string"
        ) {
            self.options.pictureVariants = JSON.parse(self.options.pictureVariants);
        }

        var tinyOptions = self.options.tiny;
        if (self.options.inline === true) {
            self.options.tiny.inline = true;
            self.options.tiny.toolbar_mode = "scrolling";
        }
        self.tinyId = self.options.inline ? id + "-editable" : id; // when displaying TinyMCE inline, a separate div is created.
        tinyOptions.selector = "#" + self.tinyId;
        // XXX: disabled skin means it wont load css files which we already
        // include in widgets.min.css
        tinyOptions.skin = false;
        // do not show the "upgrade" button for plugins
        tinyOptions.promotion = false;
        // TinyMCE 7 needs "license_key": "gpl" explicitly
        tinyOptions.license_key = "gpl";

        tinyOptions.init_instance_callback = function (editor) {
            if (self.tiny === undefined || self.tiny === null) {
                self.tiny = editor;
            }

        };
        tinyOptions["setup"] = (editor) => {
            editor.ui.registry.addMenuButton("inserttable", {
                icon: "table",
                tooltip: _t("Insert table with header row"),
                fetch: function (callback) {
                    callback([
                        {
                            type: "fancymenuitem",
                            fancytype: "inserttable",
                            onAction: function (data) {
                                // https://www.tiny.cloud/docs/plugins/table/#commands
                                editor.execCommand("mceInsertTable", false, {
                                    rows: data.numRows,
                                    columns: data.numColumns,
                                    options: { headerRows: 1 },
                                });
                            },
                        },
                    ]);
                },
            });
            // handle 'change' event to ensure correct validation (eg. required textfield)
            // eslint-disable-next-line no-unused-vars
            editor.on("change", (e) => {
                // setting tiny content manually
                this.el.value = editor.getContent();
                // dispatch "change" event for pat-validation
                this.el.dispatchEvent(events.change_event());
            });
        };

        if (typeof self.options.folderTypes === "string") {
            self.options.folderTypes = self.options.folderTypes.split(",");
        }

        if (typeof self.options.imageTypes === "string") {
            self.options.imageTypes = self.options.imageTypes.split(",");
        }

        if (self.options.inline === true) {
            // create a div, which will be made content-editable by TinyMCE and
            // copy contents from textarea to it. Then hide textarea.
            self.$el.after('<div id="' + self.tinyId + '">' + self.$el.val() + "</div>");
            self.$el.hide();
        }

        // The `importcss_file_filter` is used to filter the CSS files
        // from `content_css` which should be used to automatically create the
        // styles dropdown.
        // Also see:
        // https://6.docs.plone.org/classic-ui/tinymce-customization.html#inject-formats-with-files-named-tinymce-formats-css
        if (
            tinyOptions.importcss_file_filter &&
            typeof tinyOptions.importcss_file_filter.indexOf === "function" &&
            tinyOptions.importcss_file_filter.indexOf(",") !== -1
        ) {
            // need a custom function to check now
            var files = tinyOptions.importcss_file_filter.split(",");

            tinyOptions.importcss_file_filter = function (value) {
                for (var i = 0; i < files.length; i++) {
                    if (value.indexOf(files[i]) !== -1) {
                        return true;
                    }
                }
                return false;
            };
        }

        if (
            tinyOptions.importcss_selector_filter &&
            tinyOptions.importcss_selector_filter.length
        ) {
            tinyOptions.importcss_selector_filter = new RegExp(
                tinyOptions.importcss_selector_filter
            );
        }

        if (tinyOptions.importcss_groups && tinyOptions.importcss_groups.length) {
            for (var i = 0; i < tinyOptions.importcss_groups.length; i++) {
                if (
                    tinyOptions.importcss_groups[i].filter &&
                    tinyOptions.importcss_groups[i].filter.length
                ) {
                    tinyOptions.importcss_groups[i].filter = new RegExp(
                        tinyOptions.importcss_groups[i].filter
                    );
                }
            }
        }

        // add "urlconverter_callback" to leave external URLs/Images as is
        tinyOptions["urlconverter_callback"] = (url) => {
            if (url.indexOf("http") === 0) {
                // if url starts with "http" return it as is
                return url;
            }
            // otherwise default tiny behavior
            if (self.tiny.options.get('relative_urls')) {
                return self.tiny.documentBaseURI.toRelative(url);
            }
            url = self.tiny.documentBaseURI.toAbsolute(url, self.tiny.options.get('remove_script_host'));
            return url;
        }

        // BBB: TinyMCE 6+ has renamed toolbar and menuitem plugins.
        // map them here until they are updated in Plone's configuration:
        // menu: "formats" -> "styles"
        if (tinyOptions?.menu?.format) {
            tinyOptions.menu.format.items = tinyOptions.menu.format.items.replace('formats', 'styles');
        }
        // toolbar: "styleselect" -> "styles"
        if (tinyOptions?.toolbar) {
            tinyOptions.toolbar = tinyOptions.toolbar.replace('styleselect', 'styles');
        }

        // XXX: This is a quickfix for the wrong "menubar" type in "plone.base.interfaces.controlpanel.ITinyMCEPluginSchema"
        if (tinyOptions.menubar && Array.isArray(tinyOptions.menubar)) {
            tinyOptions.menubar = tinyOptions.menubar.join(" ").trim();
        }

        tinymce.init(tinyOptions);
        self.tiny = tinymce.get(self.tinyId);
    }

    destroy() {
        if (this.tiny) {
            if (this.options.inline === true) {
                // destroy also inline editable
                this.$el.val(this.tiny.getContent());
                $("#" + this.tinyId).remove();
                this.$el.show();
            }
            this.tiny.destroy();
            this.tiny = undefined;
        }
    }
}
