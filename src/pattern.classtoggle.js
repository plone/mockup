
define([
    'jquery',
    'patterns'
], function($, patterns) {
    var Pattern = function($el) { this.init($el); };
    Pattern.prototype = {
      name: 'classtoggle',
      jqueryPlugin: 'classToggle',
      init: function($el) {
        var self = this;
        self.$el = $el;
        self.className = $el.attr('data-classtoggle'),
        self.eventName = $el.attr('data-classtoggle-event') || 'click',
        self.$target = $el.closest($el.attr('data-classtoggle-target')) || $el;

        $el.off(self.eventName).on(self.eventName, function(e) {
          self.toggle();
          e.stopPropagation();
          e.preventDefault();
        });
      },
      isMarked: function() {
        return this.$target.hasClass(this.className);
      },
      toggle: function() {
        if (this.isMarked()) {
          this.remove();
        } else {
          this.add();
        }
        this.$el.trigger('patterns.classtoggle.toggle');
      },
      remove: function() {
        this.$target.removeClass(this.className);
        this.$el.trigger('patterns.classtoggle.remove');
      },
      add: function() {
        this.$target.addClass(this.className);
        this.$el.trigger('patterns.classtoggle.add');
      }
    };

    patterns.register(Pattern);

    return Pattern;

});
