// tests for Base
//
// @author Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, expr:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global buster:false, define:false, describe:false, it:false, expect:false,
  beforeEach:false, afterEach:false, getQueryVariable  */

define([
  'chai',
  'jquery',
  'sinon',
  'mockup-registry',
  'mockup-patterns-livesearch'
], function(chai, $, sinon, registry, Livesearch) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha,
      errormsg;

  mocha.setup({globals: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval']});
  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Livesearch
  ========================== */

  describe('Livesearch', function() {
    beforeEach(function(){

      this._error = $.error;
      $.error = function(msg) {
        errormsg = msg;
      };

      this.clock = sinon.useFakeTimers();
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      function getQueryVariable(url, variable) {
        var query = url.split('?')[1];
        if(query === undefined){
          return null;
        }
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i += 1) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
      }
      this.server.respondWith("GET", /search.json/, function (xhr, id) {
        var items = [
          {
            "UID": "123sdfasdf",
            "getURL": "http://localhost:8081/news/aggregator",
            "Type": "Collection", "Description": "Site News",
            "Title": "News"
          },
          {
            "UID": "fooasdfasdf1123asZ",
            "getURL": "http://localhost:8081/news/aggregator",
            "Type": "Collection", "Description": "Site News",
            "Title": "Another Item"
          },
          {
            "UID": "fooasdfasdf1231as",
            "getURL": "http://localhost:8081/news/aggregator",
            "Type": "Collection", "Description": "Site News",
            "Title": "News"
          },
          {
            "UID": "fooasdfasdf12231451",
            "getURL": "http://localhost:8081/news/aggregator",
            "Type": "Collection", "Description": "Site News",
            "Title": "Another Item"
          },
          {
            "UID": "sdfsdkfo12231451",
            "getURL": "http://localhost:8081/news/aggregator",
            "Type": "Collection", "Description": "Site News",
            "Title": "Another Item"
          }
        ];

        var results = [];
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var query = JSON.parse(getQueryVariable(xhr.url, 'query'));
        if (query.criteria[0].v === 'none*') {
          results = [];
        } else {
          if (batch) {
            var start, end;
            start = (batch.page-1) * batch.size;
            end = start + batch.size;
            results = items.slice(start, end);
          } else {
            results = items;
          }
        }
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
          total: results.length,
          results: results
        }));
      });

    });
    afterEach(function() {
      $('body').empty();
      this.clock.restore();
      this.server.restore();

      this.$el.remove();
      $.error= this._error;
      errormsg = undefined;

    });

    it('test default elements', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      expect(pattern.$results).to.have.length(1);
      expect(pattern.$input).to.have.length(1);
      expect(pattern.$toggle).to.have.length(1);

      $el.remove();
    });

    it('keyboard navigation and selection', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json; isTest: true">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      var $input = pattern.$input;

      $input.trigger('focus');

      var keyup = $.Event('keyup');
      keyup.which = 68;

      $input.val('ddd').trigger(keyup);

      this.clock.tick(1000);

      pattern._keyDown();
      pattern._keyDown();
      pattern._keyDown();
      pattern._keyDown();

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(3);

      pattern._keyUp();
      pattern._keyUp();

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      // keyleft
      keyup = $.Event('keyup');
      keyup.which = 37;
      $input.trigger(keyup);
      // nothing should happen
      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      // keyright
      keyup = $.Event('keyup');
      keyup.which = 39;
      $input.trigger(keyup);
      // nothing should happen
      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      // up arrow
      keyup = $.Event('keyup');
      keyup.which = 38;
      $input.trigger(keyup);
      // nothing should happen
      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      // down arrow
      keyup = $.Event('keyup');
      keyup.which = 40;
      $input.trigger(keyup);
      // nothing should happen
      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      // enter
      expect(pattern.testTarget).to.be.null;
      keyup = $.Event('keyup');
      keyup.which = 13; // like pattern._keyEnter();
      $input.trigger(keyup);

      expect(pattern.testTarget).to.not.be.null;

      //up arrow
      pattern._keyDown();
      var keydown = $.Event('keydown');
      keydown.which = 38;
      $input.trigger(keydown);

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      //down arrow
      keydown = $.Event('keydown');
      keydown.which = 40;
      $input.trigger(keydown);

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(2);

      // escape
      keyup = $.Event('keyup');
      keyup.which = 27; // like pattern._keyEscape()
      $input.trigger(keyup);

      this.clock.tick(1000);
      expect(pattern.$toggle.hasClass('show')).to.be.false;

      $el.remove();

    });

    it('user help is shown indicating how many chars to type', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');
      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.trigger('focus');
      expect(pattern.$results.text()).to.contain('Type 3');

      $input.val('d').trigger(d);
      expect(pattern.$results.text()).to.contain('Type 2');

      $input.val('dd').trigger(d);
      expect(pattern.$results.text()).to.contain('Type 1');
      expect(pattern.$results.text()).not.to.contain('characters');

      $el.remove();

    });

    it('no results found message', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.val('none').trigger(d);
      this.clock.tick(1000);

      expect(pattern.$results.text()).to.contain('No results');

      $el.remove();
    });

    it('searching message is displayed', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');
      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.val('123').trigger(d);
      this.clock.tick(pattern.options.delay+5);

      expect(pattern.$results.text()).to.contain('Searching...');

      $el.remove();
    });

    it('template from selector', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;' +
          '                          #tpl_livesearch">'+
          ' <input type="text" class="pat-livesearch-input" placeholder="Search" />'+
          ' <div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');
      var tpl = $('<script type="text/template" id="tpl_livesearch">' +
        '<li class="pat-livesearch-result pat-livesearch-type-<%= Type %>">' +
          '<a class="pat-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a> Money Honey' +
          '<p class="pat-livesearch-result-desc"><%= Description %></p>' +
        '</li></script>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      var $input= pattern.$input;
      $input.val('abcd').trigger('keyup');

      this.clock.tick(1000);

      var $results = pattern.items();

      expect($results.length).to.be.gt(1);
      expect($results.first().text().indexOf('Site News')).to.be.gt(-1);

      $el.remove();
      tpl.remove();
    });

    it('log error msg if there is no input field', function(){
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json">'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      $('.pat-livesearch').patternLivesearch().data('patternLivesearch');
      expect(errormsg).to.equal('Input element not found ' + $el);

      $el.remove();
    });

    it('log error msg if there is no url', function(){
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="">'+
            ' <input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      $('.pat-livesearch').patternLivesearch().data('patternLivesearch');
      expect(errormsg).to.equal('No url provided for livesearch results ' + $el);

      $el.remove();
    });

    it('hide search result if clicking somewhere', function(){
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      pattern.$toggle.addClass('show');
      $('html').click();

      expect(pattern.$toggle.hasClass('show')).to.be.false;

    });

    it('show cached result', function(){
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json; isTest: true">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>').appendTo('body');

      var pattern = $('.pat-livesearch').patternLivesearch().data('patternLivesearch');

      var $input = pattern.$input;
      var keyup = $.Event('keyup');
      keyup.which = 68;
      $input.val('cacheme').trigger(keyup);
      this.clock.tick(1000);

      var result = pattern.$results.find('.pat-livesearch-result').length;

      $input.val('cacheme').trigger(keyup);
      this.clock.tick(1000);

      expect(pattern.getCache().length).to.equal(result);

    });

  });

});
