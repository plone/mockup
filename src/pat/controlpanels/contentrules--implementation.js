import $ from "jquery";
import Modal from "../modal/modal";

export default class Contentrules {
    constructor(el) {
        this.el = el;
    }
    updatezebra(table) {
        table.find("tr:visible:odd").removeClass("odd even").addClass("odd");
        table.find("tr:visible:even").removeClass("odd even").addClass("even");
    }

    initStatusMessageArea() {
        let msgWrapper = document.getElementById("portalMessagesWrapper");
        if (msgWrapper) {
            return;
        }
        let newNode = document.createElement("div");
        newNode.id = "portalMessagesWrapper";
        document.getElementById("content").insertAdjacentElement("afterbegin", newNode);
    }

    addStatusMessage(message, type) {
        if (type === undefined) {
            type = "info";
        }
        let msgDlNode = document.createElement("dl");
        let msgDtNode = document.createElement("dt");
        let msgDdNode = document.createElement("dd");

        msgDlNode.classList.add("alert", "alert-" + type);
        msgDtNode.innerText = type;
        msgDdNode.innerText = message;
        msgDlNode.appendChild(msgDtNode);
        msgDlNode.appendChild(msgDdNode);

        let msgWrapper = document.getElementById("portalMessagesWrapper")
        if(!msgWrapper) {return};
        msgWrapper.innerHTML = "";
        msgWrapper.appendChild(msgDlNode);
    }

    init() {
        let self = this;
        self.initStatusMessageArea();

        // TODO find out why is it binding multiple times
        $(".btn-rule-action")
            .unbind("click")
            .bind("click", function (e) {
                e.preventDefault();

                var $this = $(this),
                    triggerEl = this,
                    $row = $this.parents("tr").first(),
                    $table = $row.parent(),
                    id = $this.data("value"),
                    url = $this.data("url");

                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        "rule-id": id,
                        "_authenticator": $('input[name="_authenticator"]').val(),
                    },
                    beforeSend: function () {
                        $("#spinner").show();
                    },
                    error: function () {
                        self.addStatusMessage($("#trns_form_error").html(), "warn");
                    },
                    success: function () {
                        let ruleTitle = "";
                        ruleTitle = $row.find(".rule-title")[0].innerText;

                        // Enable
                        if ($this.hasClass("btn-rule-enable")) {
                            $row.removeClass("state-disabled").addClass("state-enabled");
                            triggerEl.parentNode.querySelector(".btn-rule-enable").classList.add("d-none")
                            triggerEl.parentNode.querySelector(".btn-rule-disable").classList.remove("d-none")
                            self.addStatusMessage($("#trns_form_success_enabled").html() + ": " + ruleTitle, "info");
                        }

                        // Disable
                        if ($this.hasClass("btn-rule-disable")) {
                            $row.removeClass("state-enabled").addClass("state-disabled");
                            triggerEl.parentNode.querySelector(".btn-rule-disable").classList.add("d-none")
                            triggerEl.parentNode.querySelector(".btn-rule-enable").classList.remove("d-none")
                            self.addStatusMessage($("#trns_form_success_disabled").html() + ": " + ruleTitle, "info");
                        }

                        // DELETE
                        if ($this.hasClass("btn-rule-delete")) {
                            $row.remove();
                            self.updatezebra($table);
                            self.addStatusMessage($("#trns_form_success_deleted").html() + ": " + ruleTitle, "info");
                        }
                    },
                    complete: function () {
                        $("#spinner").hide();
                    },
                });
            });

        $(".filter-option input")
            .unbind("change")
            .bind("change", function () {
                // Go through the checkboxes and map up what is the filtering criterea
                var $table = $("#rules_table_form table");
                var state_filters = $(".state-filters input:checked");
                var type_filters = $(".type-filters input:checked");

                $table.find("tr").show();
                if (state_filters.length > 0) {
                    $(".state-filters input:not(:checked)").each(function () {
                        $table.find("." + this.id).hide();
                    });
                }
                if (type_filters.length > 0) {
                    $(".type-filters input:not(:checked)").each(function () {
                        $table.find("." + this.id).hide();
                    });
                }
                self.updatezebra($table);
            });

        $("#rules_disable_globally").change(function () {
            var form = $("#fieldset-global form");
            var disabled = "";
            if ($("#rules_disable_globally")[0].checked) {
                disabled = "True";
            }

            $.ajax({
                type: "POST",
                url: form.attr("action"),
                data: {
                    "global_disable:boolean": disabled,
                    "_authenticator": $('input[name="_authenticator"]').val(),
                },
                beforeSend: function () {
                    $("#spinner").show();
                },
                error: function () {
                    self.addStatusMessage($("#trns_form_error").html(), "warn");
                },
                success: function () {
                    self.addStatusMessage($("#trns_form_success").html(), "info");
                },
                complete: function () {
                    $("#spinner").hide();
                },
            });
        });
    }
}
