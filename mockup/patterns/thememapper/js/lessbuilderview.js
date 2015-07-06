define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover',
], function($, _, Backbone, PopoverView ) {
  'use strict';
  var lessBuilderTemplate = _.template(
    '<div id="lessBuilder">' +
      '<span class="message"></span>' +
      '<span style="display: none;" class="errorMessage"></span>' +
      '<div>' +
        '<a id="compileBtn" class="btn btn-success" href="#">Compile</a>' +
        '<a id="errorBtn" class="btn btn-default" href="#">Clear</a>' +
      '</div>' +
    '</div>'
  );

  var LessBuilderView = PopoverView.extend({
    className: 'popover lessbuilderview',
    title: _.template('<%= _t("LESS Builder") %>'),
    content: lessBuilderTemplate,
    $button: null,
    $start: null,
    $working: null,
    $done: null,
    $error: null,
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      self.$message = $('.message', this.$el);
      self.$error = $('.errorMessage', this.$el);
      self.$button = $('#compileBtn', this.$el);
      self.$errorButton = $('#errorBtn', this.$el);
      self.$button.on('click', function() {
        self.app.showLessBuilder();
      });
      self.$errorButton.on('click', function() {
        self.start();
        self.toggle();
      });
      self.start();
      return this;
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
    },
    start: function() {
      var self = this;
      self.$button.show();
      self.$errorButton.hide();
      self.$message.text("Click to compile the current file");
      self.$error.hide();
    },
    working: function() {
      var self = this;
      self.$button.hide();
      self.$message.text("Working....");
    },
    end: function() {
      var self = this;
      self.$message.text("Compiled successfully");
      setTimeout(self.reset.bind(self), 3000);
    },
    reset: function() {
      var self = this;
      self.start();
      self.toggle();
    },
    showError: function(error) {
      this.$message.text("");
      this.$error.text(error).show();
      this.$errorButton.show();
    }
  });

  return LessBuilderView;
});
