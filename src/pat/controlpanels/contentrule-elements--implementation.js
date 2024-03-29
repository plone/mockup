import $ from "jquery";
import Modal from "../modal/modal";

export default class Contentrules {
    constructor(el) {
        this.el = el;
        this.SKIP_OVERLAY_ACTIONS = ["plone.actions.Delete"];
    }

    init() {
        let self = this;
        $(
            "#configure-conditions .rule-element input, #configure-actions .rule-element input"
        )
            .off("click")
            .on("click", (e) => {
                const $target = $(e.currentTarget);
                var name = $target.attr("name");
                if (
                    name == "form.button.EditCondition" ||
                    name == "form.button.EditAction"
                ) {
                    return true;
                }
                $("#spinner").show();
                var form = $target.parents("form").first();
                var fieldset = form.parents("fieldset").first();
                var data = form.serialize() + "&" + name + "=1";
                var url = form.attr("action");
                $.post(url, data, (html) => {
                    var newfieldset = $(html).find("#" + fieldset.attr("id"));
                    fieldset.replaceWith(newfieldset);
                    this.init();
                    $("#spinner").hide();
                });
                return false;
            });

        $('input[name="form.button.AddCondition"],input[name="form.button.AddAction"]')
            .off("click")
            .on("click", (e) => {
                const target = e.currentTarget;
                const $target = $(target);
                var form = $target.parent().parent();
                var data = form.serialize();
                for (var i = 0; i < self.SKIP_OVERLAY_ACTIONS.length; i++) {
                    if (data.indexOf(self.SKIP_OVERLAY_ACTIONS[i]) !== -1) {
                        return;
                    }
                }
                e.preventDefault();
                var url = form.attr("action") + "?" + data;
                var conditionAnchor = $('<a href="' + url + '" />').css(
                    "display",
                    "none"
                );
                conditionAnchor.insertAfter(target);
                new Modal(conditionAnchor, {
                    actionOptions: {
                        isForm: true,
                        redirectOnResponse: true,
                        redirectToUrl: () => {
                            // reload on submit
                            return window.location.href;
                        },
                    },
                });
                conditionAnchor.trigger("click");
            });
    }
}
