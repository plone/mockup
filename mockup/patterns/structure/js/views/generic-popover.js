define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/popover',
  'translate',
  'pat-registry'
], function($, _, Backbone, PopoverView, _t, registry) {
  'use strict';

  var PropertiesView = PopoverView.extend({
    events: {
      'click button.applyBtn': 'applyButtonClicked'
    },
    submitText: _t('Apply'),
    initialize: function(options) {
      var self = this;
      self.app = options.app;
      self.className = 'popover ' + options.id;
      self.title = options.form.title || options.title;
      self.submitText = options.form.submitText || _t('Apply');
      self.submitContext = options.form.submitContext || 'primary';
      self.data = {};

      self.content = _.template('<form>' + options.form.template + '</form>' +
        '<button class="btn btn-block btn-' + self.submitContext + ' applyBtn">' + self.submitText + ' </button>');

      PopoverView.prototype.initialize.apply(this, [options]);
    },
    getTemplateOptions: function(){
      var self = this;
      var items = [];
      self.app.selectedCollection.each(function(item){
        items.push(item.toJSON());
      });
      return $.extend({}, true, self.options, {
        items: items,
        data: self.data
      });
    },
    applyButtonClicked: function() {
      var self = this;
      var data = {};
      _.each(self.$el.find('form').serializeArray(), function(param){
        data[param.name] = param.value;
      });
      this.app.buttonClickEvent(this.triggerView, data);
      this.hide();
    },
    afterRender: function(){
      var self = this;
      if(self.options.form.dataUrl){
        $.ajax({
          url: self.options.form.dataUrl,
          dataType: 'json',
          type: 'POST',
          data: {
            selection: JSON.stringify(self.app.getSelectedUids()),
            transitions: true,
            render: 'yes'
          }
        }).done(function(data){
          self.data = data;
          self.renderContent();
          registry.scan(self.$el);
        });
      }else{
        registry.scan(self.$el);
      }
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }else{
        this.$el.replaceWith(this.render().el);
      }
    }
  });

  return PropertiesView;
});
