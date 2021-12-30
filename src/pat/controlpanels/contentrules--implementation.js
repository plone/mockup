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

    addStatusMessage(message, type) {
        if (type === undefined) {
            type = "info";
        }
        var _show = function () {
            var msg = $(
                '<dl class="portalMessage ' +
                    type +
                    '">' +
                    "<dt>" +
                    type +
                    "</dt>" +
                    "<dd>" +
                    message +
                    "</dd>" +
                    "</dl>"
            );
            $("#content").before(msg);
            msg.fadeIn();
        };
        var vis = $("dl.portalMessage:visible");
        if (vis.length === 0) {
            _show();
        } else {
            vis.fadeOut(_show);
        }
    }

    init() {
        let self = this;
        // TODO find out why is it binding multiple times
        $(".btn-rule-action")
            .unbind("click")
            .bind("click", function (e) {
                e.preventDefault();

                var $this = $(this),
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
                        // Enable

                        if ($this.hasClass("btn-rule-enable")) {
                            $row.removeClass("state-disabled").addClass("state-enabled");
                        }

                        // Disable

                        if ($this.hasClass("btn-rule-disable")) {
                            $row.removeClass("state-enabled").addClass("state-disabled");
                        }

                        // DELETE

                        if ($this.hasClass("btn-rule-delete")) {
                            $row.remove();
                            self.updatezebra($table);
                        }
                        self.addStatusMessage($("#trns_form_success").html(), "info");
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
