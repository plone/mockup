import $ from "jquery";
// import jquery.form from "jquery-form";
import 'jquery-form';
import Modal from "../modal/modal";
import Base from "@patternslib/patternslib/src/core/base";
import logger from "@patternslib/patternslib/src/core/logging";
import utils from "../../core/utils";
import _t from "../../core/i18n-wrapper";

const log = logger.getLogger('pat-manage-portlets');


export default Base.extend({
    name: 'manage-portlets',
    trigger: '.pat-manage-portlets',
    parser: 'mockup',
    messageTimeout: 0,
    submitTimeout: 0,
    switchTimeout: 0,
    isModal: false,
    dirty: false,
    init: function(){
        var that = this;
        var $modal = that.$el.parents('.plone-modal');
        if($modal.length === 1){
        this.isModal = true;
        /* want to do something on exit from modal now */
        var modal = $modal.data('pattern-plone-modal');
        modal.on('hide', function(){
            if(that.dirty){
            window.location.reload();
            }
        });
        that.loading = modal.loading;
        }else{
        that.loading = utils.loading;
        }
        that.bind();
    },
    bind: function(){
        var that = this;
        that.setupAddDropdown();
        that.setupSwitchPortletManager();
        that.setupSavePortletsSettings();
        that.setupPortletEdit();
        if(that.isModal){
        /* if we're in a modal, it's possible we have a link to
            parent case, bind the link so we can reload modal */
        $('.portlets-link-to-parent').off('click').click(function(e){
            that.loading.show();
            var $el = $(this);
            e.preventDefault();
            $.ajax({
            url: $el.attr('href'),
            data: {
                ajax_load: 1
            }
            }).done(function(html){
            var $body = $(utils.parseBodyTag(html));
            var $modal = $el.parents('.plone-modal-body');
            $modal.empty();
            var $content = $('#content', $body);
            var $h1 = $('h1', $content);
            $('.plone-modal-header', $modal.parent()).find('h2').html($h1.html());
            $h1.remove();
            $modal.append($content);
            that.rebind($('.pat-manage-portlets', $content), true);
            that.loading.hide();
            });
        });
        }
    },
    rebind: function($el, suppress){
        log.info('rebind');
        if ($.contains(document, this.$el[0])) {
        // $el is not detached, replace it
        this.$el.replaceWith($el);
        }
        this.$el = $el;
        this.bind();
        if(!suppress){
        this.statusMessage();
        }
        this.dirty = true;
    },
    statusMessage: function(msg){
        if(msg === undefined){
        msg = _t("Portlet changes saved");
        }
        var that = this;

        var $message = $('#portlet-message');
        if($message.length === 0){
        $message = $('<div class="alert alert-info" role="alert" id="portlet-message" style="opacity: 0"></div>');
        if(that.isModal){
            $('.plone-modal-body:visible').prepend($message);
        }else{
            $('#content-core').prepend($message);
        }
        }
        $message.html('<strong class="mr-1">' + _t("Info") + '</strong>' + msg);
        clearTimeout(that.messageTimeout);
        $message.fadeTo(500, 1);
        that.messageTimeout = window.setTimeout(function(){
        $message.fadeTo(500, 0.6);
        }, 3000);
    },
    showEditPortlet: function(url){
        log.info('show edit portlet in modal');
        var that = this;
        var $a = $('<a/>');
        $('body').append($a);
        var pattern = new Modal($a, {
        ajaxUrl: url,
        actionOptions: {
            displayInModal: false,
            reloadWindowOnClose: false,
            isForm: true,
            onSuccess: function(modal, html){
            pattern.hide();
            var $body = $(utils.parseBodyTag(html));
            that.rebind($('#' + that.$el.attr('id'), $body).eq(0));
            that.statusMessage(_t('Portlet added'));
            }
        }
        });
        pattern.on('after-render', function(){
        var $el = $('#' + that.$el.attr('id'), pattern.$raw);
        /* this is a check that the add form doesn't just automatically
            create the portlet without an actual form.
            If element is found here, we can short circuit and
            continue on. */
        if($el.length === 1){
            /* hacky, trying to prevent modal parts from flickering here */
            $el = $el.clone();
            pattern.on('shown', function(){
            pattern.hide();
            });
            that.rebind($el);
            that.statusMessage(_t('Portlet added'));
        }
        });
        pattern.show();
    },
    setupPortletEdit: function(){
        var that = this;
        $('.managedPortlet .portletHeader > a', that.$el).click(function(e){
        e.preventDefault();
        that.showEditPortlet($(this).attr('href'));
        });
    },
    setupAddDropdown: function(){
        var that = this;
        $('.add-portlet', that.$el).change(function(e){
        e.preventDefault();
        var $select = $(this);
        var $form = $select.parents('form');
        var contextUrl = $select.attr('data-context-url');
        var url = contextUrl + $select.val() +
            '?_authenticator=' + $('[name="_authenticator"]').val() +
            '&referer=' + $('[name="referer"]', $form).val();
        that.showEditPortlet(url);
        });
    },
    setupSavePortletsSettings: function(){
        var that = this;
        $('.portlets-settings, form.portlet-action', that.$el).ajaxForm({
        beforeSubmit: function(){
            that.loading.show();
        },
        success: function(html){
            that.loading.hide();
            log.info('form submit');
            var $body = $(utils.parseBodyTag(html));
            that.rebind($('#' + that.$el.attr('id'), $body).eq(0));
        }
        });
        // Block/unblock inherited portlets (parent, group and content type portlets)
        $('.portlets-settings select', that.$el).change(function(){
        log.info('select change');
        clearTimeout(that.submitTimeout);
        that.submitTimeout = window.setTimeout(function(){
            $('.portlets-settings', that.$el).submit();
        }, 100);
        });
    },
    setupSwitchPortletManager: function(){
        var that = this;
        $('#main-container').on('change', '.switch-portlet-manager', function(e){
        e.stopImmediatePropagation();
        log.info('switch portlet manager');
        var url_ = $(this).val();
        clearTimeout(that.switchTimeout);
        that.switchTimeout = window.setTimeout(function() {
            that._reloadPortletManager(url_);
        }, 100);
        });
        // Handle back/forward browser buttons
        $(window).on('popstate', function(e) {
        e.stopImmediatePropagation();
        if (e && e.state === undefined) {
            var url_ = window.location.href;
            log.info("redirecting to: " + url_);
            that._reloadPortletManager(url_, true);
        }
        });
    },
    _reloadPortletManager: function(url_, is_popstate){
        var that = this;
        that.loading.show();
        $.get(url_, {ajax_load: 1}).done(function(html) {
        var $html = $(utils.parseBodyTag(html));
        var $content = ('#content', $html);
        $('#content').html($content);
        that.rebind($('.pat-manage-portlets', $content), true);
        if (!is_popstate) {
            window.history.pushState(null, null, url_);
        } else {
            window.history.replaceState(null, null, url_);
        }
        that.loading.hide();
        });
    }

});
