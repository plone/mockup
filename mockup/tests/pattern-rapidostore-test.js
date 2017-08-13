define([
  'expect',
  'sinon',
  'jquery',
  'pat-registry',
  'mockup-patterns-thememapper',
  'mockup-patterns-thememapper-url/js/rapidostore',
], function(expect, sinon, $, registry, Thememapper, RapidoStore) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Thememapper
  ========================== */

  describe('Thememapper', function () {

    beforeEach(function() {
      this.$el = $('' +
        '<div>' +
        '  <div class="pat-thememapper"' +
        ' data-pat-thememapper=\'filemanagerConfig:{"actionUrl":"/filemanager-actions"}; ' +
        ' themeUrl: "";\'>'  +
        '  </div>' +
        '</div>').appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });


    it('Test modal on button click', function() {
      registry.scan(this.$el);

      this.clock = sinon.useFakeTimers();
      this.clock.tick(1000);
      
      
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;
      this.clock = sinon.useFakeTimers();
      
      expect($('#btn-rapidostore', this.$el).length > 0).to.be.equal(true);
      $('#btn-rapidostore').click();
      // expect($('#url-data').html()).to.be.equal("items");
      expect($('#rapido-local-app-listing').length > 0).to.be.equal(true);
      

    });
  });
});
