define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/popover',
  'mockup-patterns-select2'
], function($, _, Backbone, PopoverView, Select2) {
  'use strict';

  var TagsView = PopoverView.extend({
    title: _.template('Add/Remove tags'),
    content: _.template(
      '<label><%- _t("Tags to remove") %></label>' +
      '<div class="form-group">' +
        '<select multiple class="toremove" style="width: 300px">' +
        '</select>' +
      '</div>' +
      '<label><%- _t("Tags to add") %></label>' +
      '<div class="form-group">' +
        '<input class="toadd" style="width:300px" />' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%- _t("Apply") %></button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      this.removeSelect2 = null;
      this.addSelect2 = null;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function() {
      PopoverView.prototype.render.call(this);
      this.$remove = this.$('.toremove');
      this.$add = this.$('.toadd');
      this.$remove.select2();
      this.addSelect2 = new Select2(this.$add, {
        multiple: true,
        vocabularyUrl: this.app.options.tagsVocabularyUrl
      });
      return this;
    },
    getSelect2Values: function($el) {
      var values = [];
      _.each($el.select2('data'), function(item) {
        values.push(item.id);
      });
      return values;
    },
    applyButtonClicked: function(e) {
      this.app.defaultButtonClickEvent(this.triggerView, {
        remove: JSON.stringify(this.getSelect2Values(this.$remove)),
        add: JSON.stringify(this.getSelect2Values(this.$add))
      });
      this.hide();
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!this.opened) {
        return;
      }
      // clear out
      self.$remove.select2('destroy');
      self.$remove.empty();
      self.$add.select2('data', []);

      self.app.selectedCollection.each(function(item) {
        if (!item.attributes.Subject) {
          return;
        }
        _.each(item.attributes.Subject, function(tag) {
          if (self.$remove.find('[value="' + tag + '"]').length === 0) {
            self.$remove.append('<option value="' + tag + '">' + tag + '</option>');
          }
        });
      });
      self.$remove.select2();
    }
  });

  return TagsView;
});
