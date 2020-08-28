define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/popover',
  'text!mockup-patterns-filemanager-url/templates/popover.xml',
], function($, _, PopoverView, PopoverTemplate) {
  'use strict';

  var FileManagerPopover = PopoverView.extend({
    className: 'popover',
    title: _.template('nothing'),
    content: _.template('<div/>'),
    template: PopoverTemplate,
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    afterRender: function () {
      var self = this;
      self.$el.find(".popover-close").click(function(e){
        self.hide(true);
      });
      return self;
    },
    getBodyClassName: function(){
      var name = 'popover-';
      if(this.options.id){
        name += this.options.id + '-';
      }
      name += 'active';
      return name;
    },
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      return self;
    },
    hide: function(closePopover) {
      if(this.closeOnOutClick || closePopover == true){
        this.opened = false;
        this.$el.removeClass('active');
        if (this.triggerView) {
          this.triggerView.$el.removeClass('active');
          this.triggerView.$el.attr('aria-hidden', 'true');
        }
        this.uiEventTrigger('hide', this);
        this.$el.attr('aria-hidden', 'true');
        $('body').removeClass(this.getBodyClassName());
      }
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      var $path = self.$('.current-path');
      if ($path.length !== 0) {
        $path.html(self.getPath());
      }
    },
    getPath: function() {
      return this.app.getFolderPath();
    }
  });

  return FileManagerPopover;
});
