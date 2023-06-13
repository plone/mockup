import _ from "underscore";
import BaseView from "./base";
import Tooltip from "@patternslib/patternslib/src/pat/tooltip/tooltip";
import dom from "@patternslib/patternslib/src/core/dom";
import utils from "../../utils";

export default BaseView.extend({
    tagName: "a",
    className: "btn",
    eventPrefix: "button",
    context: "outline-secondary",
    idPrefix: "btn-",
    attributes: {
        href: "#",
    },
    extraClasses: [],
    tooltip: null,
    template: "<%= title %>",
    events: {
        click: "handleClick",
    },
    initialize: function (options) {
        if (!options.id) {
            const title = options.title || "";
            options.id = title !== "" ? title.toLowerCase().replace(" ", "-") : this.cid; // prettier-ignore
        }
        BaseView.prototype.initialize.apply(this, [options]);

        this.on(
            "render",
            async function () {
                this.$el.attr("title", this.options.title || "");
                this.$el.attr(
                    "aria-label",
                    this.options.title || this.options.tooltip || ""
                );
                if (this.context !== null) {
                    this.$el.addClass("btn-" + this.context);
                }
                _.each(
                    this.extraClasses,
                    function (klass) {
                        this.$el.addClass(klass);
                    }.bind(this)
                );

                if (this.icon && typeof this.icon == "string") {
                    const icon_markup = await utils.resolveIcon(this.icon);
                    const icon_el = dom.create_from_string(icon_markup);
                    if (icon_el) {
                        this.$el.prepend(icon_el);
                    }
                }

                if (this.tooltip !== null) {
                    this.$el.attr("title", this.tooltip);
                    new Tooltip(this.$el);
                    // XXX since tooltip triggers hidden
                    // suppress so it plays nice with modals, backdrops, etc
                    this.$el.on("hidden", function (e) {
                        if (e.type === "hidden") {
                            e.stopPropagation();
                        }
                    });
                }
            },
            this
        );
    },
    handleClick: function (e) {
        e.preventDefault();
        if (!this.$el.is(".disabled")) {
            this.uiEventTrigger("click", this, e);
        }
    },
    serializedModel: function () {
        return _.extend({ icon: "", title: "" }, this.options);
    },
    disable: function () {
        this.$el.addClass("disabled");
    },
    enable: function () {
        this.$el.removeClass("disabled");
    },
});
