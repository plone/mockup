define([
  'expect',
  'jquery',
  'pat-registry',
  'plone-patterns-toolbar'
], function(expect, $, registry, Toolbar) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

   /* ==========================
   TEST: Plone Toolbar
  ========================== */

  describe('Plone Toolbar', function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div id="edit-zone">' +
        ' <div class="pat-toolbar" />' +
        '</div>').appendTo($('body'));
    });

    afterEach(function() {
      $('body').empty();
      this.$el.remove();
      this.pattern = null;
    });

    it('Initializes', function() {
      registry.scan(this.$el);
      // check if toolbar was initialized.
      expect(this.$el.find('.pat-toolbar.initialized').length).to.equal(1);
      // TODO: more and better tests.
    });

  });

});

