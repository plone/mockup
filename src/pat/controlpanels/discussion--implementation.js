import $ from "jquery";
import Modal from "../modal/modal";

export default class Contentrules {
    constructor(el) {
        this.el = el;
    }
    disableSettings(settings) {
        $.each(settings, function (intIndex, setting) {
            setting.addClass('unclickable');
            var setting_field = $(setting).find('input,select');
            setting_field.attr('disabled', 'disabled');
        });
    }
    enableSettings(settings) {
        $.each(settings, function (intIndex, setting) {
            setting.removeClass('unclickable');
            var setting_field = $(setting).find('input,select');
            setting_field.removeAttr('disabled');
        });
    }
    updateSettings() {

        var globally_enabled = $('#content-core').hasClass('globally_enabled');
        var moderation_custom = $('#content-core').hasClass('moderation_custom');
        var invalid_mail_setup = $('#content-core').hasClass('invalid_mail_setup');

        /* If commenting is globally disabled, disable all settings. */
        if (globally_enabled === true) {
            this.enableSettings([
                $('#formfield-form-widgets-anonymous_comments'),
                $('#formfield-form-widgets-anonymous_email_enabled'),
                $('#formfield-form-widgets-moderation_enabled'),
                $('#formfield-form-widgets-edit_comment_enabled'),
                $('#formfield-form-widgets-delete_own_comment_enabled'),
                $('#formfield-form-widgets-text_transform'),
                $('#formfield-form-widgets-captcha'),
                $('#formfield-form-widgets-show_commenter_image'),
                $('#formfield-form-widgets-moderator_notification_enabled'),
                $('#formfield-form-widgets-moderator_email'),
                $('#formfield-form-widgets-user_notification_enabled')
            ]);
        }
        else {
            this.disableSettings([
                $('#formfield-form-widgets-anonymous_comments'),
                $('#formfield-form-widgets-anonymous_email_enabled'),
                $('#formfield-form-widgets-moderation_enabled'),
                $('#formfield-form-widgets-edit_comment_enabled'),
                $('#formfield-form-widgets-delete_own_comment_enabled'),
                $('#formfield-form-widgets-text_transform'),
                $('#formfield-form-widgets-captcha'),
                $('#formfield-form-widgets-show_commenter_image'),
                $('#formfield-form-widgets-moderator_notification_enabled'),
                $('#formfield-form-widgets-moderator_email'),
                $('#formfield-form-widgets-user_notification_enabled')
            ]);
        }

        /* If the mail setup is invalid, disable the mail settings. */
        if (invalid_mail_setup === true) {
            this.disableSettings([
                $('#formfield-form-widgets-moderator_notification_enabled'),
                $('#formfield-form-widgets-moderator_email'),
                $('#formfield-form-widgets-user_notification_enabled')
            ]);
        }
        else {
            /* Enable mail setup only if discussion is enabled. */
            if (globally_enabled === true) {
                this.enableSettings([
                    $('#formfield-form-widgets-moderator_notification_enabled'),
                    $('#formfield-form-widgets-moderator_email'),
                    $('#formfield-form-widgets-user_notification_enabled')
                ]);
            }
        }

        /* If a custom workflow for comments is enabled, disable the moderation
        switch. */
        if (moderation_custom === true) {
            this.disableSettings([
                $('#formfield-form-widgets-moderation_enabled')
            ]);
        }
    };

    init() {
        let self = this;
        /* Disable a control panel setting */
        //#JSCOVERAGE_IF 0

        /**************************************************************************
         * Window Load Function: Executes when complete page is fully loaded,
         * including all frames,
         **************************************************************************/

        // Update settings on page load
        self.updateSettings();
        // Set #content-core class and update settings afterwards
        $('#form-widgets-globally_enabled-0').on('change', function(){
            if (this.checked) {
                $('#content-core').addClass('globally_enabled');
            }
            else {
                $('#content-core').removeClass('globally_enabled');
            }
            self.updateSettings();
        });

        /**********************************************************************
         * Remove the disabled attribute from all form elements before
         * submitting the form. Otherwise the z3c.form will raise errors on
         * the required attributes.
         **********************************************************************/
        $('form#DiscussionSettingsEditForm').bind('submit', function () {
            $(this).find('input,select').removeAttr('disabled');
        });


    //#JSCOVERAGE_ENDIF
    }

}
