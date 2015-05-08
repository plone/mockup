define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/popover'
], function($, _, PopoverView) {
  'use strict';

  var RearrangeView = PopoverView.extend({
    className: 'popover rearrange',
    title: _.template('<%- _t("Rearrange items in this folder") %>'),
    content: _.template(
      '<div class="form-group">' +
        '<label><%- _t("What to rearrange on") %></label>' +
        '<select name="rearrange_on" class="form-control">' +
          '<% _.each(rearrangeProperties, function(title, property) { %>' +
            '<option value="<%- property %>"><%- title %></option>' +
          '<% }); %>' +
        '</select>' +
        '<p class="help-block">' +
          '<%- _t("This permanently changes the order of items in this folder. This operation may take a long time depending on the size of the folder.") %>' +
        '</p>' +
      '</div>' +
      '<div>' + 
        '<label> <input type="checkbox" name="reversed" /> <%- _t("Reverse") %></label>' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%- _t("Rearrange") %></button>'
    ),
    events: {
      'click button': 'rearrangeButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
      this.options.rearrangeProperties = this.app.options.rearrange.properties;
    },
    render: function() {
      PopoverView.prototype.render.call(this);
      this.$rearrangeOn = this.$('[name="rearrange_on"]');
      this.$reversed = this.$('[name="reversed"]');
      return this;
    },
    rearrangeButtonClicked: function() {
      var data = {
        'rearrange_on': this.$rearrangeOn.val(),
        reversed: false
      };
      if (this.$reversed[0].checked) {
        data.reversed = true;
      }
      this.app.defaultButtonClickEvent(this.triggerView, data);
      this.hide();
    }
  });

  return RearrangeView;
});
