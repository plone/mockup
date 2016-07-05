define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/popover',
  'mockup-patterns-sortable'
], function($, _, PopoverView, Sortable) {
  'use strict';

  var ColumnsView = PopoverView.extend({
    className: 'popover attribute-columns',
    title: _.template('<%- _t("Columns") %>'),
    content: _.template(
      '<label><%- _t("Select columns to show, drag and drop to reorder") %></label>' +
      '<ul>' +
      '</ul>' +
      '<button class="btn btn-block btn-success"><%- _t("Save") %></button>'
    ),
    itemTemplate: _.template(
      '<li>' +
        '<label>' +
          '<input type="checkbox" value="<%- id %>"/>' +
          '<%- title %>' +
        '</label>' +
      '</li>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    afterRender: function() {
      var self = this;

      var objKeySortCmp = function (a, b) {
        // object key sort compare function
        var ca = self.app.availableColumns[a];
        var cb = self.app.availableColumns[b];
        if (ca < cb) {
          return -1;
        } else if (ca == cb) {
          return 0;
        } else {
          return 1;
        }
      }

      self.$container = self.$('ul');

      _.each(self.app.activeColumns, function(id) {
        var $el = $(self.itemTemplate({
          title: self.app.availableColumns[id],
          id: id
        }));
        $el.find('input')[0].checked = true;
        self.$container.append($el);
      });

      var availableKeys = _.keys(_.omit(self.app.availableColumns, self.app.activeColumns)).sort(objKeySortCmp);
      _.each(availableKeys, function(id) {
          var $el = $(self.itemTemplate({
            title: self.app.availableColumns[id],
            id: id
          }));
          self.$container.append($el);
        });

      var dd = new Sortable(self.$container, {
        selector: 'li'
      });
      return this;
    },
    applyButtonClicked: function() {
      var self = this;
      this.hide();
      self.app.activeColumns = [];
      self.$('input:checked').each(function() {
        self.app.activeColumns.push($(this).val());
      });
      self.app.setCookieSetting(self.app.activeColumnsCookie, this.app.activeColumns);
      self.app.tableView.render();
    }
  });

  return ColumnsView;
});
