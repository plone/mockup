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
  'mockup-fakeserver',
  'mockup-registry',
  'mockup-patterns-livesearch'
], function(chai, $, sinon, server, registry, Livesearch) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup({globals: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval']});
  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Livesearch
  ========================== */

  describe('Livesearch', function() {

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

      var clock = sinon.useFakeTimers();

      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.val('ddd').trigger(d);

      clock.tick(1000);

      pattern._keyDown();
      pattern._keyDown();
      pattern._keyDown();
      pattern._keyDown();

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(3);

      pattern._keyUp();
      pattern._keyUp();

      expect($('.pat-livesearch-highlight', pattern.$results).index()).to.equal(1);

      expect(pattern.testTarget).to.be.null;

      pattern._keyEnter();

      expect(pattern.testTarget).to.not.be.null;

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
      var clock = sinon.useFakeTimers();
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

      var clock = sinon.useFakeTimers();

      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.val('none').trigger(d);
      clock.tick(1000);

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
      var clock = sinon.useFakeTimers();
      var $input = pattern.$input;

      var d = $.Event('keyup');
      d.which = 68;

      $input.val('123').trigger(d);
      clock.tick(pattern.options.delay+5);

      expect(pattern.$results.text()).to.contain('Searching...');

      $el.remove();
    });

    it('template from selector', function() {
      var $el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.json;' +
          '                          resultTemplateSelector: #tpl_livesearch">'+
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

      var clock = sinon.useFakeTimers();

      var $input= pattern.$input;
      $input.val('abcd').trigger('keyup').focus();

      clock.tick(1500);

      var $results = pattern.items();

      expect($results.length).to.be.gt(1);
      expect($results.first().text().indexOf('Money Honey')).to.be.gt(-1);

      $el.remove();
      tpl.remove();
    });

  });

});
