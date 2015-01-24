define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-sticky-kit'
], function(expect, $, registry, StickyKit) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Toggle
  ========================== */

  describe('StickyKit', function() {
    beforeEach(function() {
      this.$el = $('<div>' +
          ' <style> ' +
          ' .content .sidebar { ' +
          '     width: 200px; ' +
          '     height: 66px; ' +
          '     margin: 10px; ' +
          '     margin-right: 0; ' +
          '     border: 1px solid red; ' +
          '     float: left; ' +
          '     overflow: hidden; ' +
          '     font-family: sans-serif; } ' +
          ' .content .main { ' +
          '     margin: 10px; ' +
          '     margin-left: 222px; ' +
          '     border: 1px solid blue; ' +
          '     height: 9999px; ' +
          '     overflow: hidden; } ' +
          ' </style> ' +
          ' <div class="content"> ' +
          '     <div class="sidebar pat-sticky-kit"> ' +
          '         This is a sticky column ' +
          '     </div> ' +
          '     <div class="main"> ' +
          '         This is the main column ' +
          '     </div> ' +
          ' </div> ' +
      '</div>').appendTo('body');
    });

    afterEach(function() {
      this.$el.remove();
    });

    it('element is sticky', function() {
      var sticky_kit = new StickyKit(this.$el.find('.pat-sticky-kit'));
      $(window).scrollTop(150);

      /* There is should be a wait because I don't know how to make it work in
       * test environment.
       */
      this.timeout(30000);
      setTimeout(function () {
              expect(this.$el.find('.pat-sticky-kit').hasClass('is_stuck')).to.equal(true);
      }, 30000);
    });

  });

});
