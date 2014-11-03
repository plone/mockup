define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var DeleteView = PopoverView.extend({
    className: 'popover delete',
    title: _.template('<%= translations.delete %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<p><%= translations.delete_question %></p>' +
      '<button class="btn btn-block btn-danger"><%= translations.yes_delete %></button>'
    ),
    events: {
      'click button': 'deleteButtonClicked'
    },
    getPath: function() {
      return this.app.getNodePath();
    },
    deleteButtonClicked: function(e) {
      var self = this;
      self.app.doAction('delete', {
        type: 'POST',
        data: {
          path: self.app.getNodePath()
        },
        success: function(data) {
          self.hide();
          self.app.$tree.tree('reload');
        }
      });
      // XXX show loading
    }
  });

  return DeleteView;
});
