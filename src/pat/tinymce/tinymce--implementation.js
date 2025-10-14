import $ from "jquery";
import I18n from "../../core/i18n";
import events from "@patternslib/patternslib/src/core/events";
import logger from "@patternslib/patternslib/src/core/logging";
import _t from "../../core/i18n-wrapper";
import utils from "../../core/utils";

const log = logger.getLogger("tinymce--implementation");

let LinkModal = null;

export default class TinyMCE {
    linkModal;
    imageModal;

    constructor(el, options) {
        this.el = el;
        this.$el = $(el);
        this.options = options;
    }
    addLinkClicked() {
        if (!this.linkModal) {
            const $el = $("<div/>").insertAfter(this.$el);
            const linkTypes = ["internal", "external", "email", "anchor"];
            this.linkModal = new LinkModal(
                $el,
                $.extend(true, {}, this.options, {
                    tinypattern: this,
                    linkTypes: linkTypes,
                }),
            );
            this.linkModal.show();
        } else {
            this.linkModal.reinitialize();
            this.linkModal.show();
        }
    }
    addImageClicked() {
        if (!this.imageModal) {
            const linkTypes = ["image", "externalImage"];
            const options = $.extend(true, {}, this.options, {
                tinypattern: this,
                linkTypes: linkTypes,
                initialLinkType: "image",
                text: {
                    insertHeading: _t("Insert Image"),
                },
                relatedItems: {
                    selectableTypes: this.options.imageTypes,
                },
            });
            const $el = $("<div/>").insertAfter(this.$el);
            this.imageModal = new LinkModal($el, options);
            this.imageModal.show();
        } else {
            this.imageModal.reinitialize();
            this.imageModal.show();
        }
    }
    generateUrl(data) {
        let part = "undefined";
        if (
            typeof data === "object" &&
            Object.keys(data).indexOf(this.options.linkAttribute) != -1
        ) {
            part = data[this.options.linkAttribute];
        } else if (typeof data === "string") {
            part = data;
        }
        return this.options.prependToUrl + part + this.options.appendToUrl;
    }
    generateImageUrl(data, scale_name) {
        let url = this.generateUrl(data);
        if (scale_name) {
            url =
                url +
                this.options.prependToScalePart +
                scale_name +
                this.options.appendToScalePart;
        } else {
            url = url + this.options.appendToOriginalScalePart;
        }
        return url;
    }
    stripGeneratedUrl(url) {
        // to get original attribute back
        url = url.split(this.options.prependToScalePart, 2)[0];
        if (this.options.prependToUrl) {
            const parts = url.split(this.options.prependToUrl, 2);
            if (parts.length === 2) {
                url = parts[1];
            }
        }
        if (this.options.appendToUrl) {
            url = url.split(this.options.appendToUrl)[0];
        }
        return url;
    }
    getScaleFromUrl(url) {
        const split = url.split(this.options.prependToScalePart);
        if (split.length !== 2) {
            // not valid scale, screw it
            return null;
        }
        if (this.options.appendToScalePart) {
            url = split[1].split(this.options.appendToScalePart)[0];
        } else {
            url = split[1];
        }
        if (url.indexOf("/image_") !== -1) {
            url = url.split("/image_")[1];
        }
        return url;
    }

    async init() {
        import("./tinymce.scss");

        const theme = $("html").attr("data-bs-theme");
        let css = "oxide";
        if (theme && theme == "dark") {
            css = "oxide-dark";
        }
        import(`tinymce/skins/ui/${css}/content.css`);
        import(`tinymce/skins/ui/${css}/skin.css`);

        const tinymce = (await import("tinymce/tinymce")).default;
        await import("tinymce/models/dom");
        await import("tinymce/themes/silver");
        await import("tinymce/icons/default");

        LinkModal = (await import("./js/links")).default;

        // tiny needs an id in order to initialize. Creat it if not set.
        const id = utils.setId(this.$el);

        if (
            this.options.pictureVariants &&
            typeof this.options.pictureVariants === "string"
        ) {
            this.options.pictureVariants = JSON.parse(this.options.pictureVariants);
        }

        // TinyMCE editor options
        const tinyOptions = structuredClone(this.options.tiny);
        this.lang = tinyOptions.language = await this.initLanguage();
        tinyOptions.plugins = await this.initPlugins();

        if (this.options.inline === true) {
            tinyOptions.inline = true;
            tinyOptions.toolbar_mode = "scrolling";
        }
        this.tinyId = this.options.inline ? `${id}-editable` : id; // when displaying TinyMCE inline, a separate div is created.
        tinyOptions.selector = `#${this.tinyId}`;
        // XXX: disabled skin means it wont load css files which we already
        // include in widgets.min.css
        tinyOptions.skin = false;
        // do not show the "upgrade" button for plugins
        tinyOptions.promotion = false;
        // TinyMCE 7 needs "license_key": "gpl" explicitly
        tinyOptions.license_key = "gpl";

        tinyOptions.init_instance_callback = (editor) => {
            if (this.tiny === undefined || this.tiny === null) {
                this.tiny = editor;
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

        if (typeof this.options.folderTypes === "string") {
            this.options.folderTypes = this.options.folderTypes.split(",");
        }

        if (typeof this.options.imageTypes === "string") {
            this.options.imageTypes = this.options.imageTypes.split(",");
        }

        if (this.options.inline === true) {
            // create a div, which will be made content-editable by TinyMCE and
            // copy contents from textarea to it. Then hide textarea.
            this.$el.after('<div id="' + this.tinyId + '">' + this.$el.val() + "</div>");
            this.$el.hide();
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
            const files = tinyOptions.importcss_file_filter.split(",");

            tinyOptions.importcss_file_filter = function (value) {
                for (const file of files) {
                    if (value.indexOf(file) !== -1) {
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
                tinyOptions.importcss_selector_filter,
            );
        }

        if (tinyOptions.importcss_groups && tinyOptions.importcss_groups.length) {
            for (const group of tinyOptions.importcss_groups) {
                if (group.filter?.length) {
                    group.filter = new RegExp(group.filter);
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
            if (this.tiny.options.get("relative_urls")) {
                return this.tiny.documentBaseURI.toRelative(url);
            }
            url = this.tiny.documentBaseURI.toAbsolute(
                url,
                this.tiny.options.get("remove_script_host"),
            );
            return url;
        };

        // BBB: TinyMCE 6+ has renamed toolbar and menuitem plugins.
        // map them here until they are updated in Plone's configuration:
        // menu: "formats" -> "styles"
        if (tinyOptions?.menu?.format) {
            tinyOptions.menu.format.items = tinyOptions.menu.format.items.replace(
                "formats",
                "styles",
            );
        }
        // toolbar: "styleselect" -> "styles"
        if (tinyOptions?.toolbar) {
            tinyOptions.toolbar = tinyOptions.toolbar.replace("styleselect", "styles");
        }

        // XXX: This is a quickfix for the wrong "menubar" type in "plone.base.interfaces.controlpanel.ITinyMCEPluginSchema"
        if (tinyOptions.menubar && Array.isArray(tinyOptions.menubar)) {
            tinyOptions.menubar = tinyOptions.menubar.join(" ").trim();
        }

        tinymce.init(tinyOptions);
        this.tiny = tinymce.get(this.tinyId);
    }

    async initLanguage() {
        const i18n = new I18n();
        let lang = i18n.currentLanguage;

        // Fix for country specific languages
        if (lang.split("-").length > 1) {
            lang = lang.split("-")[0] + "_" + lang.split("-")[1].toUpperCase();
        }

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
                } catch {
                    log.debug("Could not load TinyMCE language. Fallback to English");
                    lang = "en";
                }
            }
        }
        return lang;
    }

    async initPlugins() {
        const valid_plugins = [];

        // tinyMCE Plugins
        for (const plugin of this.options.tiny.plugins) {
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
                await import(`tinymce/plugins/help/js/i18n/keynav/${this.lang}.js`);
            }

            try {
                await import("tinymce/plugins/" + plugin);
                valid_plugins.push(plugin);
            } catch {
                log.debug("Could not load TinyMCE plugin: ", plugin);
            }
        }

        return valid_plugins;
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
