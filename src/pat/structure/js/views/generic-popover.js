import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import PopoverView from "../../../../core/ui/views/popover";
import registry from "@patternslib/patternslib/src/core/registry";

export default PopoverView.extend({
    events: {
        "click button.applyBtn": "applyButtonClicked",
        "click button.closeBtn": "toggle",
    },
    submitText: _t("Apply"),

    initialize: function (options) {
        this.app = options.app;
        this.className = "popover " + options.id;
        this.title = options.form.title || options.title;
        this.submitText = options.form.submitText || _t("Apply");
        this.submitContext = options.form.submitContext || "primary";
        this.data = {};

        this.options = options;
        this.setContent(options.form.template);

        PopoverView.prototype.initialize.apply(this, [options]);
    },

    setContent: function (content) {
        let html = "<form>" + content + "</form>";
        html +=
            '<button class="btn btn-block btn-' +
            this.submitContext +
            ' applyBtn">' +
            this.submitText +
            " </button>";
        if (this.options.form.closeText) {
            html +=
                '<button class="btn btn-block btn-default closeBtn">' +
                this.options.form.closeText +
                " </button>";
        }
        this.content = _.template(html);
    },

    getTemplateOptions: function () {
        const items = [];
        for (const item of this.app.selectedCollection) {
            items.push(item.toJSON());
        }
        return $.extend({}, true, this.options, {
            items: items,
            data: this.data,
        });
    },

    applyButtonClicked: function () {
        const data = {};
        for (const param of this.$el.find("form").serializeArray()) {
            if (param.name in data) {
                data[param.name] += "," + param.value;
            } else {
                data[param.name] = param.value;
            }
        }

        this.app.buttonClickEvent(this.triggerView, data);
        this.hide();
    },

    afterRender: function () {
        if (this.options.form.dataUrl) {
            this.$(".popover-content").html(_t("Loading..."));
            this.app.loading.show();
            const url = this.app.getAjaxUrl(this.options.form.dataUrl);
            $.ajax({
                url: url,
                dataType: "json",
                type: "POST",
                cache: false,
                data: {
                    selection: JSON.stringify(this.app.getSelectedUids()),
                    transitions: true,
                    render: "yes",
                },
            })
                .done((result) => {
                    this.data = result.data || result;
                    this.renderContent();
                    registry.scan(this.$el);
                })
                .fail(() => {
                    /* we temporarily set original html to a value here so we can
             render the updated content and then put the original back */
                    const originalContent = this.content;
                    this.setContent(
                        "<p>" + _t("Error loading popover from server.") + "</p>",
                        false
                    );
                    this.renderContent();
                    this.content = originalContent;
                })
                .always(() => {
                    this.app.loading.hide();
                    this.position();
                });
        } else {
            registry.scan(this.$el);
            this.position();
        }
    },

    toggle: function (button, e) {
        PopoverView.prototype.toggle.apply(this, [button, e]);
        if (!this.opened) {
            return;
        } else {
            this.$el.replaceWith(this.render().el);
            this.position();
        }
    },
});
