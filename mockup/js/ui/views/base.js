define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-i18n'
], function($, _, Backbone, i18n) {
  'use strict';

  var BaseView = Backbone.View.extend({
    isUIView: true,
    eventPrefix: 'ui',
    template: null,
    appendInContainer: true,
    initialize: function(options) {
      this.options = options;
      for (var key in this.options) {
        this[key] = this.options[key];
      }
      i18n.loadCatalog('widgets');
      this._t = this.options._t = i18n.MessageFactory('widgets');
    },
    render: function() {
      this.applyTemplate();

      this.trigger('render', this);
      this.afterRender();

      if (!this.$el.attr('id') && this.options.id) {
        // apply id to element
        this.$el.attr('id', 'gen-' + this.options.id);
      }
      return this;
    },
    afterRender: function() {

    },
    serializedModel: function() {
      return this.options;
    },
    applyTemplate: function() {
      if (this.template !== null) {
        var data = $.extend({}, this.options, this.serializedModel());
        var template = this.template;
        if(typeof(template) === 'string'){
          template = _.template(template);
        }
        this.$el.html(template(data));
      }
    },
    propagateEvent: function(eventName) {
      if (eventName.indexOf(':') > 0) {
        var eventId = eventName.split(':')[0];
        if (this.eventPrefix !== '') {
          if (eventId === this.eventPrefix ||
              eventId === this.eventPrefix + '.' + this.id) { return true; }
        }
      }
      return false;
    },
    uiEventTrigger: function(name) {
      var args = [].slice.call(arguments, 0);

      if (this.eventPrefix !== '') {
        args[0] = this.eventPrefix + ':' + name;
        Backbone.View.prototype.trigger.apply(this, args);
        if (this.id) {
          args[0] =  this.eventPrefix + '.' + this.id + ':' + name;
          Backbone.View.prototype.trigger.apply(this, args);
        }
      }
    }
  });

  return BaseView;
});
