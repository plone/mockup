define([
  'expect',
  'jquery',
  'mockup-iframe'
], function(expect, $, IFrame, undefined) {
  "use strict";

  window.mocha.setup('bdd');

  describe("Registry", function () {
    beforeEach(function() {
      this.iframe = new $.IFrame({
        el: $('<div><p>some</p><a href="#">some link</a></div>').appendTo('body'),
        position: 'top'
      });
      this.iframe._window_location = function() {};
      this.iframe._window_open = function() {};
    });
    afterEach(function() {
      this.iframe.$el.remove();
    });
    it("simple stretch and shrink", function() {
      var initial_height = this.iframe.$el.height();

      expect(initial_height).to.not.equal(0);

      this.iframe.stretch();
      expect(initial_height).to.be.below(this.iframe.$el.height());

      this.iframe.shrink();
      expect(initial_height).to.be.equal(this.iframe.$el.height());

      this.iframe.toggle();
      expect(initial_height).to.be.above(this.iframe.$el.height());

      this.iframe.toggle();
      expect(initial_height).to.be.equal(this.iframe.$el.height());
    });

  });
});

//    "defult handling of clicks inside iframe": function() {
//      var stub_location = this.stub($.iframe, '_window_location'),
//          stub_open = this.stub($.iframe, '_window_open');
//
//      $('a', $.iframe.$el).trigger({ type: 'click', which: 1 });  // left click
//      $('a', $.iframe.$el).trigger({ type: 'click', which: 2 });  // middle click
//
//      assert.calledOnceWith(stub_location, '#');
//      assert.calledOnceWith(stub_open, '#');
//      assert.callOrder(stub_location, stub_open);
//    },
//
//    "custom handling of clicks inside iframe": function() {
//      $.iframe.registerAction(
//        function(e, iframe) { return true; },
//        function(e, iframe) { assert(true); });
//      $('p', $.iframe.$el).trigger({ type: 'click' });
//    },
//
//    "when iframe is stretch click can also happen on html element": function() {
//      $.iframe.registerAction(
//        function(e, iframe) { return true; },
//        function(e, iframe) { assert(true); });
//      $.iframe.$el.parents('html').trigger({ type: 'click' });
//    }
