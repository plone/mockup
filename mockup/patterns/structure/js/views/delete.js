define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/popover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var DeleteView = PopoverView.extend({
    className: 'popover delete',
    title: _.template('<%- _t("Delete selected items") %>'),
    content: _.template(
      '<label><%- _t("Are you certain you want to delete the selected items") %></label>' +
      '<button class="btn btn-block btn-danger"><%- _t("Yes") %></button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function() {
      PopoverView.prototype.render.call(this);
      return this;
    },
    applyButtonClicked: function(e) {
      var self = this;
      this.app.defaultButtonClickEvent(this.triggerView, {}, function(data) {
        self.app.selectedCollection.reset();
      });
      this.hide();
    }
  });

  return DeleteView;
});





