/* Discussion pattern.
 *
 * Options:
 *      replyButtonSelector(string): selector used to look up reply buttons (.reply-to-comment-button)
 *      templateSelector(string): selector used to look up the template for new replies (#commenting)
 *      idSelector(string): selector used to look up the form element where the comment should be added. (input[name="form.widgets.in_reply_to"])
 *      cancelSelector(string): selector used to look up the cancel button in the reply element (input[name="form.buttons.cancel"])
 *      removeSelector(string): selector used to look up unwanted elements within the copied reply element (null)
 *      removeAttrs(string): names of attrs to remove from the copied reply element (null)
 *      removeClasses(string): names of classes to remove from the copied reply structure (null)
 *      actions(object): A hash of selector to options. Where options can include any of the defaults from actionOptions. Allows for the binding of events to elements in the reply template and provides options for handling ajax requests. ({})
 *
 * Documentation:
 *      # Example
 *
 *      {{ example-1 }}
 *
 * Example: example-1
 *      <div class="discussion pat-discussion" data-pat-discussion="templateSelector:#commenting">
 *        <div class="comment replyTreeLevel0 state-published" id="1392130992549619">
 *          <div class="commentBody">
 *            <p>This comment makes a rather interesting point</p>
 *            <div class="commentActions">
 *              <form name="delete" action="moderate-delete-comment" method="post" class="commentactionsform" id="delete">
 *                <input name="form.button.DeleteComment" class="destructive" type="submit" value="Delete">
 *              </form>
 *            </div>
 *          </div>
 *          <button class="reply-to-comment-button">Reply</button>
 *        </div>
 *      </div>
 *      <div id="commenting" class="reply">
 *        <fieldset>
 *         <legend>Add commment</legend>
 *         <form action="save-comment#12345" method="post" enctype="multipart/form-data">
 *           <div data-fieldname="form.widgets.in_reply_to" id="formfield-form-widgets-in_reply_to">
 *             <input id="form-widgets-in_reply_to" name="form.widgets.in_reply_to" value="" class="hidden-widget" type="hidden">
 *           </div>
 *           <div class="field empty" data-fieldname="form.widgets.text" id="formfield-form-widgets-comment-text">
 *             <label for="form-widgets-comment-text" class="horizontal">
 *               Comment
 *             </label>
 *             <textarea id="form-widgets-comment-text" name="form.widgets.text" class="textarea-widget required text-field autoresize"></textarea>
 *           </div>
 *           <div class="formControls">
 *             <input id="form-buttons-comment" name="form.buttons.comment" class="submit-widget button-field context" value="Save" type="submit">
 *             <input id="form-buttons-cancel" name="form.buttons.cancel" class="submit-widget button-field standalone" value="Cancel" type="submit" style="display: none;">
 *           </div>
 *         </form>
 *      </fieldset>
 *   </div>
 *
 * License:
 *    Copyright (C) 2014 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
define([
  'jquery',
  'mockup-patterns-base',
  'mockup-utils',
  'jquery.form'
], function ($, Base, utils, form) {
    "use strict";
  var actions = {
    "input[name='form.button.DeleteComment']":
    { 'success' : function (resp, status, xhr, form) {
      var $comment = form.parents(".comment");
      var clss = $comment.attr('class');

      // remove replies
      var treelevel = parseInt(clss[clss.indexOf('replyTreeLevel') + 'replyTreeLevel'.length], 10);
      // selector for all the following elements of lower level
      var selector = ".replyTreeLevel" + treelevel;
      for (var i = 0; i < treelevel; i++) {
        selector += ", .replyTreeLevel" + i;
      }
      $comment.nextUntil(selector).each(function () {
        $(this).fadeOut('fast', function () {
          $(this).remove();
        });
      });
      // remove comment
      $comment.fadeOut('fast', function () {
        $(this).remove();
      });
    }},
    "input[name='form.buttons.comment']":
    { 'success' : function (resp, status, xhr, form) {
      // TODO : get proper comment id
      var commentId = '12345';
      var comment = $('#'+commentId, resp).clone(true);
      comment.insertAfter(form.parents('.comment'));
      //utils.setupFormActions(actions, {}, comment);
    }},
    "input[name='form.button.PublishComment']":
    { 'success' : function (resp, status, xhr, form) {
      form.find("input[name='form.button.PublishComment']").remove();
      form.parents(".state-pending").toggleClass('state-pending').toggleClass('state-published');
    }}
  };

    var Discussion = Base.extend({
        name: 'discussion',
        defaults: {
          replyButtonSelector: '.reply-to-comment-button',
	  templateSelector: '#commenting', 
          removeSelector: '#formfield-form-widgets-captcha script', // should be ''
          removeAttrs: 'id', // should be ''
          removeClasses: '', // should be ''
          idSelector: 'input[name="form.widgets.in_reply_to"]',
          saveSelector: 'input[name="form.buttons.comment"]',
          cancelSelector: 'input[name="form.buttons.cancel"]',
          actionOptions: {
            preventDefault: true,
            stopPropagation: true,
            eventType: 'click',
          },
          actions: actions,
        },
        setupActions: function ($scope) {
          var self = this; 
          utils.setupFormActions(
            self.options.actions,
            self.options.actionOptions,
            $scope
          );
        },
        /**************************************************************************
         * Create a reply-to-comment form right beneath the form that is passed to
         * the function. We do this by copying the regular comment form and
         * adding a hidden in_reply_to field to the form.
         **************************************************************************/
        createReplyForm: function ($comment, $button) {
          var self = this;

          /* Clone the reply div at the end of the page template that contains
           * the regular comment form.
           */
          var reply = $(self.options.templateSelector).clone(true);

          /* Remove unwanted elements before appending the form.
           * e.g. the ReCaptcha JS code, if not removed, causes problems
           * 
           */
          reply.find(self.options.removeSelector).remove();

          /* Remove unwanted classes from all elements before appending the form.
           * e.g. validation 'error' classes on fields.
           */
          // reply.find(self.options.removeClasses).remove();
          

          /* Insert the cloned comment form right after the reply button of the
           * current comment.
           */
          reply.appendTo($comment).css("display", "none");

          /* Remove id="reply" attribute, since we use it to uniquely
             identify the main reply form. */
          reply.removeAttr(self.options.removeAttrs);

          self.setupActions(reply);
          
          /* Hide the reply button (only hide, because we may want to show it
           * again if the user hits the cancel button).
           */
          $button.css("display", "none");

          /* Populate the hidden 'in_reply_to' field with the correct comment
             id */
          reply.find(self.options.idSelector)
            .val($comment.attr('id'));

          /* Show the cancel button. */
          reply.find(self.options.cancelSelector)
            .css("display", "inline")
            .on('click', function (e) {
              e.stopPropagation();
              e.preventDefault();
              reply.slideUp("slow", function () {
                $(this).remove();
              });
              // show the reply button again
              $button.css("display", "inline");
            });

          /* Show the reply layer with a slide down effect */
          reply.slideDown("slow");
          
        },
        /**************************************************************************
         * Remove all error messages and field values from the form that is passed
         * to the function.
         **************************************************************************/
        // This should be removed - use removeSelector and add removeClass
        
        clearForm: function ($comment) {
          $comment.find(".error").removeClass("error");
          $comment.find(".fieldErrorBox").remove();
          $comment.find("input[type='text']").attr("value", "");
          $comment.find("textarea").attr("value", "");
          /* XXX: Clean all additional form extender fields. */
        },
        initComment: function ($comment) {
          var self = this;
          $(self.options.replyButtonSelector, $comment).on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            
            self.createReplyForm($comment, $(this));
            self.clearForm($comment);
          });
          self.setupActions($comment);
        },
        init: function () {
        
          var self = this;
          $('.comment', self.$el).each( function () {
            self.initComment($(this));
          });

        }
    });

    return Discussion;
});
