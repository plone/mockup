define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/buttongroup',
  'text!mockup-ui-url/templates/dropdown.xml',
], function($, _, ButtonGroup, DropdownTemplate) {
  'use strict';

  var DropdownView = ButtonGroup.extend({
    idPrefix: 'btngroup-dropdown-',
    template: DropdownTemplate,
    className: 'btn-group-dropdown',
    itemContainer: "ul.dropdown-content",
    title: null,

    initialize: function(options) {
      ButtonGroup.prototype.initialize.apply(this, [options]);

      this.on('render', function() {
        this.renderTitle();
      }, this);
    },

    renderTitle: function() {
      var title = this.options.title;
      if(this.options.title === undefined) {
        title = this.title;
        if(this.title === null) {
          title = "Menu Option";
        }
      }
      this.$('.dropdown-title').empty().append(title);
    },

    renderItems: function() {
      var self = this;
      var $container;

      if (this.itemContainer !== null) {
        $container = $(this.itemContainer, this.$el);
        if ($container.length === 0) {
          throw 'Item Container element not found.';
        }
      } else {
        $container = this.$el;
      }

      var $item = null;
      _.each(this.items, function(view) {
        $item = $("<li></li>");
        $item.append(view.render().$el.removeClass("btn"));
        $container.append($item);
      }, this);
    },

  });

  return DropdownView;
});
