define([
  'expect',
  'jquery',
  'mockup-patterns-livesearch'
], function(expect, $, registry, LiveSearch) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: LiveSearch
  ========================== */

  describe('LiveSearch', function () {

    beforeEach(function() {
      this.$el = $(
        '<div><input type="text" class="pat-livesearch" /> +
      );
    });

    afterEach(function() {
      this.$el.remove();
    });

  });
});
