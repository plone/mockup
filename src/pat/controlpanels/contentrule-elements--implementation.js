import $ from "jquery";
import Modal from "../modal/modal";

export default class Contentrules {
    constructor(el) {
        this.el = el;
        this.SKIP_OVERLAY_ACTIONS = ["plone.actions.Delete"];
    }

    /* global require */

    // require([
    //   'jquery',
    //   'mockup-patterns-modal'
    // ], function($, Modal) {
    //   'use strict';
    init() {
        let self = this;
        $(
            "#configure-conditions .rule-element input, #configure-actions .rule-element input"
        )
            .unbind("click")
            .click(function () {
                var name = $(this).attr("name");
                if (
                    name == "form.button.EditCondition" ||
                    name == "form.button.EditAction"
                ) {
                    return true;
                }
                $("#spinner").show();
                var form = $(this).parents("form").first();
                var fieldset = form.parents("fieldset").first();
                var data = form.serialize() + "&" + name + "=1";
                var url = form.attr("action");
                $.post(url, data, function (html) {
                    var newfieldset = $(html).find("#" + fieldset.attr("id"));
                    fieldset.replaceWith(newfieldset);
                    initforms();
                    $("#spinner").hide();
                });
                return false;
            });

        $('input[name="form.button.AddCondition"],input[name="form.button.AddAction"]')
            .unbind("click")
            .click(function (e) {
                var form = $(this).parent().parent();
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
                conditionAnchor.insertAfter(this);
                new Modal(conditionAnchor, {
                    actionOptions: {
                        isForm: true,
                        redirectOnResponse: true,
                        redirectToUrl: function () {
                            /* reload on submit */
                            return window.location.href;
                        },
                    },
                });
                conditionAnchor.trigger("click");
            });
    }
}
