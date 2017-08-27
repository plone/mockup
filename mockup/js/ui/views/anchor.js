define([
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-patterns-tooltip'
], function(_, BaseView, Tooltip) {
  'use strict';

  var AnchorView = BaseView.extend({
    tagName: 'a',
    className: 'alink',
    eventPrefix: 'button',
    context: 'default',
    idPrefix: 'alink-',
    shortcut: '',
    attributes: {
      'href': '#'
    },
    extraClasses: [],
    tooltip: null,
    template: '<% if (icon) { %><span class="glyphicon glyphicon-<%= icon %>"></span><% } %> <%= title %> <span class="shortcut"><%= shortcut %></span>',
    events: {
      'click': 'handleClick'
    },
    initialize: function(options) {
      if (!options.id) {
        var title = options.title || '';
        options.id = title !== '' ? title.toLowerCase().replace(' ', '-') : this.cid;
      }
      BaseView.prototype.initialize.apply(this, [options]);

      this.on('render', function() {
        this.$el.attr('title', this.options.tooltip || this.options.title || '');
        this.$el.attr('aria-label', this.options.title || this.options.tooltip || '');
        _.each(this.extraClasses, function(klass) {
          this.$el.addClass(klass);
        });
      }, this);
    },
    handleClick: function(e) {
      e.preventDefault();
      if (!this.$el.prop('disabled')) {
        this.uiEventTrigger('click', this, e);
      }
    },
    serializedModel: function() {
      return _.extend({'icon': '', 'title': '', 'shortcut': ''}, this.options);
    },
    disable: function() {
      this.$el.prop('disabled', true);
    },
    enable: function() {
      this.$el.prop('disabled', false);
    }
  });

  return AnchorView;
});
