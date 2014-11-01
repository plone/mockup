define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-tooltip'
], function(expect, $, registry, ToolTip) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Tooltip
  ========================== */

  describe('Tooltip', function () {

    beforeEach(function() {
      this.$el = $('' +
        '<div><p href=".example-class" class="pat-tooltip">' +
        '  Hover over this line to see a tooltip' +
        '</p>' +
        '<p class="tooltips example-class">' +
        '  Setting the .example-class in the href makes this show up' +
        '</p></div>');
    });

    afterEach(function() {
      this.$el.remove();
    });

    it('tooltip appears and disappears', function() {
      registry.scan(this.$el);

      var trs;

      $('.pat-tooltip', this.$el).trigger('mouseenter.tooltip.patterns');
      trs = this.$el.find('.example-class');
      expect(trs.eq(0).hasClass('active')).to.be.equal(true);

      $('.pat-tooltip', this.$el).trigger('mouseleave.tooltip.patterns');
      trs = this.$el.find('.example-class');
      expect(trs.eq(0).hasClass('active')).to.be.equal(false);
    });

  });
});
