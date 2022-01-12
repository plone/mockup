import $ from "jquery";
import Modal from "../modal/modal";

export default class Contentrules {
    constructor(el) {
        this.el = el;
    }
    /**************************************************************************
     * Create a reply-to-comment form right beneath the form that is passed to
     * the function. We do this by copying the regular comment form and
     * adding a hidden in_reply_to field to the form.
     **************************************************************************/
    createReplyForm(comment_div) {
        var comment_id = comment_div.attr("id");

        var reply_button = comment_div.find(".reply-to-comment-button");

        /* Clone the reply div at the end of the page template that contains
         * the regular comment form.
         */
        var reply_div = $("#commenting").clone(true);

        /* Remove the ReCaptcha JS code before appending the form. If not
         * removed, this causes problems
         */
        reply_div.find("#formfield-form-widgets-captcha").find("script").remove();

        /* Insert the cloned comment form right after the reply button of the
         * current comment.
         */
        reply_div.appendTo(comment_div).css("display", "none");

        /* Remove id='commenting' attribute, since we use it to uniquely define
            the main reply form. */
        // Still belongs to class='reply'
        reply_div.removeAttr("id");

        /* Hide the reply button (only hide, because we may want to show it
         * again if the user hits the cancel button).
         */
        $(reply_button).css("display", "none");

        /* Fetch the reply form inside the reply div */
        var reply_form = reply_div.find("form");

        /* Change the id of the textarea of the reply form
         * To avoid conflict later between textareas with same id 'form-widgets-comment-text' while implementing a seperate instance of TinyMCE
         * */
        reply_form
            .find("#formfield-form-widgets-comment-text")
            .attr("id", "formfield-form-widgets-new-textarea" + comment_id);
        reply_form
            .find("#form-widgets-comment-text")
            .attr("id", "form-widgets-new-textarea" + comment_id);

        /* Populate the hidden 'in_reply_to' field with the correct comment
            id */
        reply_form.find('input[name="form.widgets.in_reply_to"]').val(comment_id);

        /* Add a remove-reply-to-comment Javascript function to remove the
            form */
        var cancel_reply_button = reply_div.find(".cancelreplytocomment");
        cancel_reply_button.attr("id", comment_id);

        /* Show the cancel buttons. */
        reply_form.find('input[name="form.buttons.cancel"]').css("display", "inline");

        /* Show the reply layer with a slide down effect */
        reply_div.slideDown("slow");

        /* Show the cancel button in the reply-to-comment form */
        cancel_reply_button.css("display", "inline");
    }

    /**************************************************************************
     * Remove all error messages and field values from the form that is passed
     * to the function.
     **************************************************************************/
    clearForm(form_div) {
        form_div.find(".error").removeClass("error");
        form_div.find(".fieldErrorBox").remove();
        form_div.find('input[type="text"]').attr("value", "");
        form_div.find("textarea").attr("value", "");
        /* XXX: Clean all additional form extender fields. */
    }

    init_comment_eventhandler() {
        /**********************************************************************
         * Transmit a single comment.
         **********************************************************************/
        $('input[name="form.button.TransmitComment"]').on("click", function (e) {
            e.preventDefault();
            var trigger = this;
            var form = $(this).parents("form");
            var data = $(form).serialize();
            var form_url = $(form).attr("action");
            var comment_id = $(this).parents(".comment").attr("id");
            $.ajax({
                type: "GET",
                url: form_url,
                data: data,
                context: trigger,
                success: function (msg) {
                    let url = location.href;
                    $(this)
                        .parents(".comment")
                        .load(
                            // loading child nodes is not enough,
                            // class attributes are needed for visualization of workflow_state
                            url + " #" + comment_id + ".comment",
                            function () {
                                $(this).find(".comment").unwrap();
                                init_comment_eventhandler();
                                $(".pat-plone-modal").patPloneModal();
                            }
                        );
                },
                error: function (msg) {
                    return true;
                },
            });
            return false;
        });

        /**********************************************************************
         * Edit a comment
         **********************************************************************/
        if ($.fn.prepOverlay) {
            $('form[name="edit"]').prepOverlay({
                cssclass: "overlay-edit-comment",
                width: "60%",
                subtype: "ajax",
                filter: "#content>*",
            });
        }

        /**********************************************************************
         * Delete a comment and its answers.
         **********************************************************************/
        $('input[name="form.button.DeleteComment"]').on("click", function (e) {
            e.preventDefault();
            var trigger = this;
            var form = $(this).parents("form");
            var data = $(form).serialize();
            var form_url = $(form).attr("action");
            $.ajax({
                type: "POST",
                url: form_url,
                data: data,
                context: $(trigger).parents(".comment"),
                success: function (data) {
                    // jshint ignore:line
                    var comment = $(this);
                    var clss = comment.attr("class");
                    // remove replies
                    var treelevel = parseInt(
                        clss[clss.indexOf("replyTreeLevel") + "replyTreeLevel".length],
                        10
                    );
                    // selector for all the following elements of lower level
                    var selector = ".replyTreeLevel" + treelevel;
                    for (var i = 0; i < treelevel; i++) {
                        selector += ", .replyTreeLevel" + i;
                    }
                    comment.nextUntil(selector).each(function () {
                        $(this).fadeOut("fast", function () {
                            $(this).remove();
                        });
                    });
                    // Add delete button to the parent
                    var parent = comment.prev(
                        '[class*="replyTreeLevel' + (treelevel - 1) + '"]'
                    );
                    parent.find('form[name="delete"]').css("display", "inline");
                    // remove comment
                    $(this).fadeOut("fast", function () {
                        $(this).remove();
                    });
                },
                error: function (req, error) {
                    // jshint ignore:line
                    return true;
                },
            });
            return false;
        });
    }

    init() {
        let self = this;
        self.init_comment_eventhandler();

        /**********************************************************************
         * If the user has hit the reply button of a reply-to-comment form
         * (form was submitted with a value for the 'in_reply_to' field in the
         * request), create a reply-to-comment form right under this comment.
         **********************************************************************/
        var post_comment_div = $("#commenting");
        var in_reply_to_field = post_comment_div.find(
            'input[name="form.widgets.in_reply_to"]'
        );
        if (in_reply_to_field.length !== 0 && in_reply_to_field.val() !== "") {
            var current_reply_id = "#" + in_reply_to_field.val();
            var current_reply_to_div = $(".discussion").find(current_reply_id);
            self.createReplyForm(current_reply_to_div);
            self.clearForm(post_comment_div);
        }

        /**********************************************************************
         * If the user hits the 'reply' button of an existing comment, create a
         * reply form right beneath this comment.
         **********************************************************************/
        $(".reply-to-comment-button").bind("click", function (e) {
            // jshint ignore:line
            var comment_div = $(this).parents().filter(".comment");
            self.createReplyForm(comment_div);
            self.clearForm(comment_div);
        });

        /**********************************************************************
         * If the user hits the 'clear' button of an open reply-to-comment form,
         * remove the form and show the 'reply' button again.
         **********************************************************************/
        $("#commenting #form-buttons-cancel").bind("click", function (e) {
            e.preventDefault();
            var reply_to_comment_button = $(this)
                .parents()
                .filter(".comment")
                .find(".reply-to-comment-button");

            /* Find the reply-to-comment form and hide and remove it again. */
            self.reply_to_comment_form = $(this).parents().filter(".reply");
            self.reply_to_comment_form.slideUp("slow", function () {
                $(this).remove();
            });

            /* Show the reply-to-comment button again. */
            reply_to_comment_button.css("display", "inline");
        });

        /**********************************************************************
         * By default, hide the reply and the cancel button for the regular add
         * comment form.
         **********************************************************************/
        $(".reply").find('input[name="form.buttons.reply"]').css("display", "none");
        $(".reply").find('input[name="form.buttons.cancel"]').css("display", "none");

        /**********************************************************************
         * By default, show the reply button only when Javascript is enabled.
         * Otherwise hide it, since the reply functions only work with JS
         * enabled.
         **********************************************************************/
        $(".reply-to-comment-button").removeClass("hide");
    }
}
