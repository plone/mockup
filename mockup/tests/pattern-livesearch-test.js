define([
  'expect',
  'jquery',
  'sinon',
  'mockup-patterns-livesearch'
], function(expect, $, sinon, LiveSearch) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
     TEST: LiveSearch
    ========================== */

  describe('LiveSearch', function() {

    beforeEach(function() {
      this.$form = $('<form action="/@@search"></form>');
      this.$el = $('<input type="text" class="pat-livesearch" value="" />');
      this.$form.append(this.$el);
      $('body').append(this.$form);
      this.$el.patternLivesearch();

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;
      this.server.respondWith('GET', /livesearch_reply/, function(xhr, id) {
        xhr.respond(200, {
            'Content-Type': 'application/html'
          },
          '<fieldset class="livesearch-container">' +
          '<legend class="livesearch-legend">Search</legend>' +
          '<div>' +
          '<ul>' +
          '<li>' +
          '<img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEX///+dsMSNvfD///9OTk6Li4vi7vvZ6vr6+/7C3Pfx9/2z0/Xe7Pvg7fr9/f32+v7u9f3J4Pi+2fbW5vn9/v/3+/6nzfPP4/nk8Pz1+f3H3/jq8/y/QnJnAAAAAXRSTlMAQObYZgAAAFNJREFUeF6NykcOwCAMRFHcSO293P+esRIJw46/mMXTuKzkiyMgTYgT6HXYAAiEtehR1ohoABtoBuswnsVRGVzg08fTLdPc7AYt3OkD/wJwyOX0AkS1AoySkvA+AAAAAElFTkSuQmCC" alt="Server Troff document" />' +
          '<a href="/one" title="one" class="contenttype-one">Document one (with description)</a>' +
          '<div class="livesearch-description">Element with a description</div>' +
          '</li>' +
          '<li>' +
          '<img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEX///+dsMSNvfD///9OTk6Li4vi7vvZ6vr6+/7C3Pfx9/2z0/Xe7Pvg7fr9/f32+v7u9f3J4Pi+2fbW5vn9/v/3+/6nzfPP4/nk8Pz1+f3H3/jq8/y/QnJnAAAAAXRSTlMAQObYZgAAAFNJREFUeF6NykcOwCAMRFHcSO293P+esRIJw46/mMXTuKzkiyMgTYgT6HXYAAiEtehR1ohoABtoBuswnsVRGVzg08fTLdPc7AYt3OkD/wJwyOX0AkS1AoySkvA+AAAAAElFTkSuQmCC" alt="Server Troff document" />' +
          '<a href="/two" title="two" class="contenttype-one">Document two (without description)</a>' +
          '<div class="livesearch-description"></div>' +
          '</li>' +
          '<li>' +
          '<a href="@@search" class="advancedsearchlink advanced-search">Advanced search…</a>' +
          '</li>' +
          '<li>' +
          '<a href="@@search?SearchableText=test%2A&path=/" class="advancedsearchlink show-all-items">Show all items</a>' +
          '</li>' +
          '</ul>' +
          '</div>' +
          '</fieldset>'
        );
      });

    });

    it('Creates a div for storing the results', function() {
      expect(this.$el.next().hasClass('livesearch-results')).to.equal(true);
    });

/*
    it('After three keystrokes it will become visible', function() {
      var event = $.Event('keydown');
      event.which = event.keyCode = 65;
      this.$el.trigger(event);
      //this.clock.tick(1000);
      expect($('.livesearch-container')).to.have.length(0);
      this.$el.trigger(event);
      //this.clock.tick(1000);
      expect($('.livesearch-container')).to.have.length(0);
      this.$el.trigger(event);
      //this.clock.tick(1000);
      expect($('.livesearch-container')).to.have.length(0);
      this.$el.trigger(event);
      //this.clock.tick(1000);
      expect($('.livesearch-container')).to.have.length(0);
      this.$el.trigger(event);
      //this.clock.tick(1000);
      expect($('.livesearch-container')).to.have.length(0);
      this.$el.trigger(event);
      ;
      expect($('.livesearch-container')).to.have.length(5);
    });
*/

    afterEach(function() {
      $('body').empty();
    });

  });
});
