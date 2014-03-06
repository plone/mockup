define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-picture'
], function(expect, $, registry, Toggle) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Picture
  ========================== */

  describe('Picture', function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div class="pat-picture" ' +
        '     data-pat-picture="alt:Alternative text;">' +
        '   <div data-src="http://placehold.it/480x320"></div> ' +
        '   <div data-src="http://placehold.it/640x427" data-media="(min-width: 480px)"></div>' +
        '</div>'
      ).appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it('create responsive image widget', function() {
      expect($('img', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
    });
    it('test alternative text is recorded', function() {
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      expect($('img', this.$el).attr('alt')).to.equal('Alternative text');
    });
    /*
    it('test state change classes', function() {
      registry.scan(this.$el);
      var img = $('img', this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      expect(img.attr('class')).to.equal('test-loading');
      expect(img.attr('class')).to.equal('test-error');
    });
    // Chrome and friends don't allow resizing except in popups
    it('resize window to see media query in action', function() {
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      window.resizeTo(640, 480);
      expect($('img', this.$el).attr('src')).to.equal('http://placehold.it/640x427');
      window.resizeTo(479, 320);
      expect($('img', this.$el).attr('src')).to.equal('http://placehold.it/480x320');
    });
    */
  });

});
