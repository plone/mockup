import registry from "@patternslib/patternslib/src/core/registry";
import $ from "jquery";

export default class Contentrules {
    constructor(el) {
        this.el = el;
    }

    init_moderation_eventhandler() {
        let self = this;
        /**********************************************************************
         * Delete a single comment.
         **********************************************************************/
        $("button[name='form.button.moderation.DeleteComment']").click(function (e) {
            e.preventDefault();
            var row = $(this).closest("tr");
            var path = row.find("[name='selected_obj_paths:list']").attr("value");
            var auth_key = $('input[name="_authenticator"]').val();
            var target = path + "/@@moderate-delete-comment?_authenticator=" + auth_key;
            $.ajax({
                type: "GET",
                url: target,
                success: function (msg) {
                    // fade out row
                    row.fadeOut(250).fadeIn(250, function () {
                        row.remove();
                    });
                    // reload page if all comments have been removed
                    var comments = $("table#review-comments > tbody > tr");
                    if (comments.length === 1) {
                        location.reload();
                    }
                },
                error: function (msg) {
                    alert("Error sending AJAX request:" + target);
                },
            });
        });
        /**********************************************************************
         * Transmit a single comment.
         **********************************************************************/
        $('button[name="form.button.moderation.TransmitComment"]').click(function (e) {
            e.preventDefault();
            let button = $(this);
            var row = $(this).closest("tr");
            var path = $(row).find("[name='selected_obj_paths:list']").attr("value");
            var workflow_action = $(this).attr("data-transition");
            var auth_key = $('input[name="_authenticator"]').val();
            // distinction of workflow_action
            var target =
                path +
                "/@@transmit-comment?_authenticator=" +
                auth_key +
                "&workflow_action=" +
                workflow_action;
            var moderate =
                $(this).closest("fieldset").attr("id") == "fieldset-moderate-comments";
            $.ajax({
                type: "GET",
                url: target,
                success: function (msg) {
                    if (moderate) {
                        let url = location.href;
                        $("#review-comments").load(
                            url + " #review-comments > *",
                            function () {
                                self.init_moderation_eventhandler();
                                $(".pat-plone-modal").patPloneModal();
                            }
                        );
                    } else {
                        location.reload();
                    }
                },
                error: function (msg) {
                    alert(
                        "Error transmitting comment. (Error sending AJAX request:" +
                            target +
                            ")"
                    );
                },
            });
        });

        /**********************************************************************
         * Bulk actions for comments (delete, publish)
         **********************************************************************/
        $("button[name='form.button.BulkAction']").click(function (e) {
            e.preventDefault();
            var form = $(this).closest("form");
            var target = $(form).attr("action");
            var params = $(form).serialize();
            var valArray = $("input:checkbox:checked");
            var selectField = $(form).find("[name='form.select.BulkAction']");

            if (selectField.val() === "-1") {
                // TODO: translate message
                alert("You haven't selected a bulk action. Please select one.");
            } else if (valArray.length === 0) {
                // TODO: translate message
                alert(
                    "You haven't selected any comment for this bulk action." +
                        "Please select at least one comment."
                );
            } else {
                $.post(target, params, function (data) {
                    // reset the bulkaction select
                    selectField.find("option[value='-1']").attr("selected", "selected");
                    // reload filtered comments
                    $("#review-comments").load(
                        window.location + " #review-comments",
                        function () {
                            self.init_moderation_eventhandler();
                            $(".pat-plone-modal").patPloneModal();
                        }
                    );
                });
            }
        });

        /**********************************************************************
         * Check or uncheck all checkboxes from the batch moderation page.
         **********************************************************************/
        $("input[name='check_all']").click(function () {
            if ($(this).val() === "0") {
                $(this).parents("table").find("input:checkbox").prop("checked", true);
                $(this).val("1");
            } else {
                $(this).parents("table").find("input:checkbox").prop("checked", false);
                $(this).val("0");
            }
        });

        /**********************************************************************
         * select comments with review_state
         **********************************************************************/

        $("input[name='review_state']").click(function () {
            let review_state = $(this).val();
            let url = location.href;
            if (location.search) {
                url = location.href.replace(
                    location.search,
                    "?review_state=" + review_state
                );
            } else {
                url = location.href + "?review_state=" + review_state;
            }

            $("#fieldset-moderate-comments")
                .parent()
                .load(url + " #content form > *", function () {
                    self.init_moderation_eventhandler();
                    $(".pat-plone-modal").patPloneModal();
                    let stateObj = { review_state: review_state };
                    history.pushState(stateObj, "moderate comments", url);
                });
        });

        /**********************************************************************
         * Show full text of a comment in the batch moderation page.
         **********************************************************************/
        $(".show-full-comment-text").click(function (e) {
            e.preventDefault();
            var target = $(this).attr("href");
            var parent = $(this).parent();
            $.ajax({
                type: "GET",
                url: target,
                data: "",
                success: function (data) {
                    // show full text
                    parent.html(data);
                },
                error: function (msg) {
                    alert("Error getting full comment text:" + target);
                },
            });
        });

        /**********************************************************************
         * Comments published: Load history for publishing date.
         **********************************************************************/
        $(".last-history-entry").each(function () {
            var lasthistoryentry = $(this);
            $.ajax({
                url: lasthistoryentry.attr("data-href"),
                success: function (data) {
                    lasthistoryentry.html($(data).find(".historyByLine").first());
                    // format date
                    registry.scan(lasthistoryentry);
                },
                error: function (msg) {
                    console.error("Error getting history.");
                },
            });
        });
    } // end init_moderation_eventhandler

    init() {
        let self = this;
        self.init_moderation_eventhandler();
    }
}
