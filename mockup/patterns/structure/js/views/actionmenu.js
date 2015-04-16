/* global alert:true */

define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/base',
  'mockup-utils',
  'text!mockup-patterns-structure-url/templates/actionmenu.xml',
  'translate',
  'bootstrap-dropdown'
], function($, _, Backbone, BaseView, utils, ActionMenuTemplate, _t) {
  'use strict';

  var ActionMenu = BaseView.extend({
    className: 'btn-group actionmenu',
    template: _.template(ActionMenuTemplate),
    events: {
      'click .cutItem a': 'cutClicked',
      'click .copyItem a': 'copyClicked',
      'click .pasteItem a': 'pasteClicked',
      'click .move-top a': 'moveTopClicked',
      'click .move-bottom a': 'moveBottomClicked',
      'click .set-default-page a': 'setDefaultPageClicked',
      'click .openItem a': 'openClicked',
      'click .editItem a': 'editClicked'
    },
    initialize: function(options) {
      this.options = options;
      this.app = options.app;
      this.model = options.model;
      this.selectedCollection = this.app.selectedCollection;
      if (options.canMove === false){
        this.canMove = false;
      }else {
        this.canMove = true;
      }
    },
    cutClicked: function(e) {
      e.preventDefault();
      this.cutCopyClicked('cut');
      this.app.collection.pager(); // reload to be able to now show paste button
    },
    copyClicked: function(e) {
      e.preventDefault();
      this.cutCopyClicked('copy');
      this.app.collection.pager(); // reload to be able to now show paste button
    },
    cutCopyClicked: function(operation) {
      var self = this;
      self.app.pasteOperation = operation;

      self.app.pasteSelection = new Backbone.Collection();
      self.app.pasteSelection.add(this.model);
      self.app.setStatus(operation + ' 1 item');
      self.app.pasteAllowed = true;
      self.app.buttons.primary.get('paste').enable();
    },
    pasteClicked: function(e) {
      e.preventDefault();
      this.app.pasteEvent(this.app.buttons.primary.get('paste'), e, {
        folder: this.model.attributes.path
      });
      this.app.collection.pager(); // reload to be able to now show paste button
    },
    moveTopClicked: function(e) {
      e.preventDefault();
      this.app.moveItem(this.model.attributes.id, 'top');
    },
    moveBottomClicked: function(e) {
      e.preventDefault();
      this.app.moveItem(this.model.attributes.id, 'bottom');
    },
    setDefaultPageClicked: function(e) {
      e.preventDefault();
      var self = this;
      $.ajax({
        url: self.app.getAjaxUrl(self.app.setDefaultPageUrl),
        type: 'POST',
        data: {
          '_authenticator': $('[name="_authenticator"]').val(),
          'id': this.model.attributes.id
        },
        success: function(data) {
          self.app.ajaxSuccessResponse.apply(self.app, [data]);
        },
        error: function(data) {
          self.app.ajaxErrorResponse.apply(self.app, [data]);
        }
      });
    },
    getSelectedBaseUrl: function() {
      var self = this;
      return self.model.attributes.getURL;
    },
    getWindow: function() {
      var win = window;
      if (win.parent !== window) {
        win = win.parent;
      }
      return win;
    },
    openUrl: function(url) {
      var self = this;
      var win = self.getWindow();
      var keyEvent = this.app.keyEvent;
      if (keyEvent && keyEvent.ctrlKey) {
        win.open(url);
      } else {
        win.location = url;
      }
    },
    openClicked: function(e) {
      e.preventDefault();
      var self = this;
      self.openUrl(self.getSelectedBaseUrl() + '/view');
    },
    editClicked: function(e) {
      e.preventDefault();
      var self = this;
      self.openUrl(self.getSelectedBaseUrl() + '/edit');
    },
    render: function() {
      var self = this;
      self.$el.empty();

      var data = this.model.toJSON();
      data.attributes = self.model.attributes;
      data.pasteAllowed = self.app.pasteAllowed;
      data.canSetDefaultPage = self.app.setDefaultPageUrl;
      data.inQueryMode = self.app.inQueryMode();
      data.header = self.options.header || null;
      data.canMove = self.canMove;

      self.$el.html(self.template($.extend({ _t: _t }, data)));

      self.$dropdown = self.$('.dropdown-toggle');
      self.$dropdown.dropdown();

      if (self.options.className){
        self.$el.addClass(self.options.className);
      }
      return this;
    }
  });

  return ActionMenu;
});
