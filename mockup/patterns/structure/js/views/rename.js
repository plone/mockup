define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/popover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var PropertiesView = PopoverView.extend({
    className: 'popover rename',
    title: _.template('<%- _t("Rename items") %>'),
    content: _.template(
      '<div class="itemstoremove"></div>' +
      '<button class="btn btn-block btn-primary"><% _t("Apply") %></button>'
    ),
    itemTemplate: _.template(
      '<div class="item">' +
        '<div class="form-group">' +
          '<input name="UID" type="hidden" value="<%- UID %>" />' +
          '<label><%- _t("Title") %></label>' +
          '<input class="form-control" name="newtitle" value="<%= Title %>" />' +
          '<label><%- _t("Short name") %></label>' +
          '<input class="form-control" name="newid" value="<%= id %>" />' +
        '</div>' +
      '</div>'
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
      this.$items = this.$('.itemstoremove');
      return this;
    },
    applyButtonClicked: function(e) {
      var torename = [];
      this.$items.find('.item').each(function() {
        var $item = $(this);
        torename.push({
          UID: $item.find('[name="UID"]').val(),
          newid: $item.find('[name="newid"]').val(),
          newtitle: $item.find('[name="newtitle"]').val()
        });
      });
      var self = this;
      this.app.defaultButtonClickEvent(this.triggerView, {
        torename: JSON.stringify(torename)
      });
      this.hide();
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      self.$items.empty();
      self.app.selectedCollection.each(function(item) {
        self.$items.append(self.itemTemplate(item.toJSON()));
      });
    }
  });

  return PropertiesView;
});





