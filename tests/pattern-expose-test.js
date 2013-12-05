define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-expose'
], function(expect, $, registry, Expose) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Expose
  ========================== */

  describe("Expose", function() {
    it("default behaivour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <form class="pat-expose" data-pat-expose="backdrop: #body">' +
        '  <input value="" />' +
        ' </form>' +
        '</div>');
      registry.scan($el);
      expect($('.backdrop', $el).size()).to.equal(1);
      expect($el.hasClass('backdrop-active')).to.equal(false);
      $('input', $el).focusin();
      expect($('form', $el).css('z-index')).to.equal('1041');
      expect($el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(false);
    });
  });

});
