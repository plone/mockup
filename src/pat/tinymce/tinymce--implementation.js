import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import I18n from "../../core/i18n";
import _t from "../../core/i18n-wrapper";
import utils from "../../core/utils";

let LinkModal = null;

export default class TinyMCE {
    constructor(el, options) {
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
        var part = data[self.options.linkAttribute];
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
    async initLanguage(call_back) {
        var self = this;
        var i18n = new I18n();
        var lang = i18n.currentLanguage;
        if (lang !== "en" && self.options.tiny.language !== "en") {
            try {
                await import(`tinymce-i18n/langs5/${lang}`);
            } catch (e) {
                try {
                    // expected lang not available, let's fallback to closest one
                    if (lang.split("_") > 1) {
                        lang = lang.split("_")[0];
                    } else if (lang.split("-") > 1) {
                        lang = lang.split("-")[0];
                    } else {
                        lang = lang + "_" + lang.toUpperCase();
                    }
                    await import(`tinymce-i18n/langs5/${lang}`);
                } catch {
                    console.log("Could not load TinyMCE language:", lang);
                }
            }
            call_back();
        } else {
            call_back();
        }
    }
    async init() {
        import("./tinymce.scss");
        import("tinymce/skins/ui/oxide/content.css");
        import("tinymce/skins/ui/oxide/skin.css");

        // tinyMCE Plugins
        const tinymce = (await import("tinymce/tinymce")).default;
        await import("tinymce/models/dom");
        await import("tinymce/plugins/advlist");
        await import("tinymce/plugins/anchor");
        await import("tinymce/plugins/autolink");
        await import("tinymce/plugins/autoresize");
        await import("tinymce/plugins/autosave");
        // await import("tinymce/plugins/bbcode");
        await import("tinymce/plugins/charmap");
        await import("tinymce/plugins/code");
        // await import("tinymce/plugins/colorpicker");
        // await import("tinymce/plugins/contextmenu");
        await import("tinymce/plugins/directionality");
        await import("tinymce/plugins/emoticons");
        await import("tinymce/plugins/fullscreen");
        // await import("tinymce/plugins/hr");
        await import("tinymce/plugins/image");
        await import("tinymce/plugins/importcss");
        await import("tinymce/plugins/insertdatetime");
        // await import("tinymce/plugins/legacyoutput");
        await import("tinymce/plugins/link");
        await import("tinymce/plugins/lists");
        await import("tinymce/plugins/media");
        // await import("tinymce/plugins/nonbreaking");
        // await import("tinymce/plugins/noneditable");
        await import("tinymce/plugins/pagebreak");
        // await import("tinymce/plugins/paste");
        await import("tinymce/plugins/preview");
        // await import("tinymce/plugins/print");
        await import("tinymce/plugins/save");
        await import("tinymce/plugins/searchreplace");
        // await import("tinymce/plugins/spellchecker");
        // await import("tinymce/plugins/tabfocus");
        await import("tinymce/plugins/table");
        await import("tinymce/plugins/template");
        // await import("tinymce/plugins/textcolor");
        // await import("tinymce/plugins/textpattern");
        await import("tinymce/plugins/visualblocks");
        await import("tinymce/plugins/visualchars");
        await import("tinymce/plugins/wordcount");
        await import("tinymce/themes/silver");

        await import("tinymce/icons/default");

        LinkModal = (await import("./js/links")).default;

        var self = this;
        self.linkModal = self.imageModal = self.uploadModal = self.pasteModal = null;
        // tiny needs an id in order to initialize. Creat it if not set.
        var id = utils.setId(self.$el);

        if (self.options.imageSrcsets && typeof self.options.imageSrcsets === "string") {
            self.options.imageSrcsets = JSON.parse(self.options.imageSrcsets);
        }

        var tinyOptions = self.options.tiny;
        if (self.options.inline === true) {
            self.options.tiny.inline = true;
        }
        self.tinyId = self.options.inline ? id + "-editable" : id; // when displaying TinyMCE inline, a separate div is created.
        tinyOptions.selector = "#" + self.tinyId;
        tinyOptions.addLinkClicked = function () {
            self.addLinkClicked.apply(self, []);
        };
        tinyOptions.addImageClicked = function (file) {
            self.addImageClicked.apply(self, [file]);
        };
        // XXX: disabled skin means it wont load css files which we already
        // include in widgets.min.css
        tinyOptions.skin = false;

        tinyOptions.init_instance_callback = function (editor) {
            if (self.tiny === undefined || self.tiny === null) {
                self.tiny = editor;
            }
        };

        self.initLanguage(function () {
            if (typeof self.options.folderTypes === "string") {
                self.options.folderTypes = self.options.folderTypes.split(",");
            }

            if (typeof self.options.imageTypes === "string") {
                self.options.imageTypes = self.options.imageTypes.split(",");
            }

            if (self.options.inline === true) {
                // create a div, which will be made content-editable by TinyMCE and
                // copy contents from textarea to it. Then hide textarea.
                self.$el.after(
                    '<div id="' + self.tinyId + '">' + self.$el.val() + "</div>"
                );
                self.$el.hide();
            }

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

            /* If TinyMCE is rendered inside of a modal, set an ID on
             * .plone-modal-dialog and use that as the ui_container
             * setting for TinyMCE to anchor it there. This ensures that
             * sub-menus are displayed relative to the modal rather than
             * the document body.
             * Generate a random id and append it, because there might be
             * more than one TinyMCE in the DOM.
             */
            var modal_container = self.$el.parents(".plone-modal-dialog");

            if (modal_container.length > 0) {
                var random_id = Math.random().toString(36).substring(2, 15);
                modal_container.attr("id", "tiny-ui-container-" + random_id);
                tinyOptions["ui_container"] = "#tiny-ui-container-" + random_id;
            }
            console.log(tinyOptions)
            tinymce.init(tinyOptions);
            self.tiny = tinymce.get(self.tinyId);

            /* tiny really should be doing this by default
             * but this fixes overlays not saving data */
            var $form = self.$el.parents("form");
            $form.on("submit", function () {
                if (self.options.inline === true) {
                    // save back from contenteditable to textarea
                    self.$el.val(self.tiny.getContent());
                } else {
                    // normal case
                    self.tiny.save();
                }
            });
        });
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
