
define([
  'raptorize',
  'mockup-patterns-base',
  'modernizr'
], function(raptorize, Base) {
  "use strict";

  var Raptorize = Base.extend({
    name: 'raptorize',
    defaults: {
    },
    
    init: function() {
      this.$el.raptorize(self.options);
    }
  });

  return Raptorize;
});
