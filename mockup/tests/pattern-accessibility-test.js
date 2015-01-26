define([
  'expect',
  'jquery',
  'pat-registry',
  'mockup-patterns-accessibility'
], function(expect, $, registry, Accessibility) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Accessibility
  ========================== */

  describe('Accessibility', function () {
    beforeEach(function() {
      $.removeCookie('fontsize');
      this.$el = $('' +
        '<div class="pat-accessibility">' +
          '<a id="btn1" />' +
          '<a id="btn2" />' +
          '<a id="btn3" />' +
        '</div>');
    });
    it('test cookie remains set', function() {
      var accessibility = new Accessibility(this.$el);
      expect($.cookie('fontsize')).to.be.equal(undefined);
      accessibility.setBaseFontSize('smallText', 1);
      // XXX breaking chrome with phantom js for some reason--new Date() is returning a date from 1969
      // expect($.cookie('fontsize')).to.be.equal('smallText');
    });
    it('test class is set', function() {
      var accessibility = new Accessibility(this.$el);
      expect(this.$el.hasClass('smallText')).to.be.equal(false);
      expect(this.$el.hasClass('largeText')).to.be.equal(false);
      accessibility.setBaseFontSize('smallText', 1);
      expect(this.$el.hasClass('smallText')).to.be.equal(true);
      expect(this.$el.hasClass('largeText')).to.be.equal(false);
      accessibility.setBaseFontSize('largeText', 1);
      expect(this.$el.hasClass('smallText')).to.be.equal(false);
      expect(this.$el.hasClass('largeText')).to.be.equal(true);
    });
    it('test class is set if a cookie is found', function() {
      $.cookie('fontsize', 'smallText');
      expect(this.$el.hasClass('smallText')).to.be.equal(false);
      registry.scan(this.$el);
      expect(this.$el.hasClass('smallText')).to.be.equal(true);
    });
    it('test setting small font size with button works', function() {
      // add pattern to anchor
      this.$el.attr('data-pat-accessibility', 'smallbtn: #btn1');
      registry.scan(this.$el);
      $('#btn1', this.$el).trigger('click');
      expect(this.$el.hasClass('smallText')).to.be.equal(true);
    });
    it('test setting large font size with button works', function() {
      // add pattern to anchor
      this.$el.attr('data-pat-accessibility', 'largebtn: #btn3; smallbtn: #btn1');
      registry.scan(this.$el);
      $('#btn3', this.$el).trigger('click');
      expect(this.$el.hasClass('largeText')).to.be.equal(true);
    });
  });

});
