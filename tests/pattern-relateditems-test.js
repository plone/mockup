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
  beforeEach:false, afterEach:false, getQueryVariable, _ */

define([
  'chai',
  'jquery',
  'sinon',
  'mockup-fakeserver',
  'mockup-registry',
  'mockup-patterns-relateditems'
], function(chai, $, sinon, server, registry, RelatedItems) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd').globals(['jQuery*']);
  $.fx.off = true;

  /* ==========================
   TEST: Related Items
  ========================== */

  describe("Related Items", function() {

    it('test initialize', function(){
      var $el = $('' +
        '<div>' +
        ' <input class="pat-relateditems"' +
        '        pat-relateditems="width: 300px;' +
        '                          ajaxvocabulary: /relateditems-test.json" />' +
        '</div>').appendTo('body');
      var pattern = $('.pat-relateditems').patternRelateditems().data('patternRelateditems');
      
      expect($('.select2-container-multi', $el)).to.have.length(1);
      expect($('.pat-relateditems-container', $el)).to.have.length(1);
      expect($('.pat-relateditems-tabs', $el)).to.have.length(1);
      expect($('.pat-relateditems-path', $el)).to.have.length(1);

      $el.remove();
      $('.select2-sizer, .select2-drop').remove();
    });

    it('tabs toggle modes', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-relateditems"' +
        '        pat-relateditems="width: 300px;' +
        '                          ajaxvocabulary: /relateditems-test.json" />' +
        '</div>').appendTo('body');
      var pattern = $('.pat-relateditems').patternRelateditems().data('patternRelateditems');

      $('.pat-relateditems-tabs-search', $el).on('click', function(){
        expect(pattern.browsing).to.be.false;
        expect($(this).hasClass('pat-active')).to.be.true;
        expect($('.pat-relateditems-tabs-browse', $el).hasClass('pat-active')).to.be.false;
        expect(pattern.$browsePath.html()).to.equal('');
      }).click();
      $('.pat-relateditems-tabs-browse', $el).on('click', function(){
        expect(pattern.browsing).to.be.true;
        expect($(this).hasClass('pat-active')).to.be.true;
        expect($('.pat-relateditems-tabs-search', $el).hasClass('pat-active')).to.be.false;
        expect(pattern.$browsePath.html()).to.not.equal('');
      }).click();

      $el.remove();
      $('.select2-sizer, .select2-drop').remove();
    });

    it('select an item by clicking add button', function () {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-relateditems"' +
        '        pat-relateditems="width: 300px;' +
        '                          ajaxvocabulary: /relateditems-test.json" />' +
        '</div>').appendTo('body');
      var pattern = $('.pat-relateditems').patternRelateditems().data('patternRelateditems');

      var clock = sinon.useFakeTimers();

      $('.pat-relateditems-tabs-search', $el).click();
      clock.tick(1000);
      expect(pattern.$el.select2('data')).to.have.length(0);
      $('.pat-relateditems-result-select', $el).first().on('click', function() {
        expect(pattern.$el.select2('data')).to.have.length(1);
      }).click();

      $el.remove();
      $('.select2-sizer, .select2-drop').remove();
    });

    it('clicking folder button switches to browse mode and browses', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-relateditems"' +
        '        pat-relateditems="width: 300px;' +
        '                          ajaxvocabulary: /relateditems-test.json" />' +
        '</div>').appendTo('body');
      var pattern = $('.pat-relateditems').patternRelateditems().data('patternRelateditems');

      var clock = sinon.useFakeTimers();
      $('.pat-relateditems-tabs-search', $el).click();
      clock.tick(1000);
      var $items = $('.select2-results > li');
      expect(pattern.browsing).to.be.false;
      $('.pat-relateditems-result-browse', $items).first().on('click', function() {
        expect(pattern.browsing).to.be.true;
        expect(pattern.currentPath).to.equal($(this).attr('href'));
      }).click();

      $el.remove();
      $('.select2-sizer, .select2-drop, .select2-drop-mask').remove();
    });

  });

});
