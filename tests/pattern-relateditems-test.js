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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global buster:false, define:false, describe:false, it:false, expect:false,
  beforeEach:false, afterEach:false */

define([
  'chai',
  'jquery',
  'sinon-fakeserver',
  'mockup-registry',
  'mockup-patterns-relateditems'
], function(chai, $, registry, RelatedItems) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 0;
  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var root = [
      {"id": "asdlfkjasdlfkjasdf", "title": "News", "path": "/news", "type": "folder"},
      {"id": "124asdf", "title": "About", "path": "/about", "type": "folder"},
      {"id": "asdf1234", "title": "Projects", "path": "/projects", "type": "folder"},
      {"id": "asdf1234gsad", "title": "Contact", "path": "/contact", "type": "page"},
      {"id": "asdv34sdfs", "title": "Privacy Policy", "path": "/policy", "type": "page"},
      {"id": "asdfasdf234sdf", "title": "Our Process", "path": "/our-process", "type": "folder"},
      {"id": "asdhsfghyt45", "title": "Donate", "path": "/donate-now", "type": "page"}
    ];
    var about = [
      {"id": "gfn5634f", "title": "About Us", "path": "/about/about-us", "type": "page"},
      {"id": "45dsfgsdcd", "title": "Philosophy", "path": "/about/philosophy", "type": "page"},
      {"id": "dfgsdfgj675", "title": "Staff", "path": "/about/staff", "type": "folder"},
      {"id": "sdfbsfdh345", "title": "Board of Directors", "path": "/about/board-of-directors", "type": "page"}
    ];

    var staff = [
      {"id": "asdfasdf9sdf", "title": "Mike", "path": "/about/staff/mike", "type": "page"},
      {"id": "cvbcvb82345", "title": "Joe", "path": "/about/staff/joe", "type": "page"}
    ];
    var searchables = about.concat(root).concat(staff);

    var results = [];

    // grab the page number and number of items per page -- note, page is 1-based from Select2
    var page = Number(getQueryVariable(xhr.url, 'page')) - 1;
    var page_size = Number(getQueryVariable(xhr.url, 'page_limit'));

    // just return an empty result set if no page is found
    if(page < 0) {
      xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify({"total": 0, "results": []}));
      return;
    }

    var query = getQueryVariable(xhr.url, 'q');
    var path = getQueryVariable(xhr.url, 'browse');

    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(items, q) {
      results = [];
      if (q === undefined) return searchables;
      _.each(items, function(item) {
        var keys = (item.id + ' ' + item.title + ' ' + item.path).toLowerCase();
        var query = q.toLowerCase();
        if (keys.indexOf(query) > -1) results.push(item);
      });
    }

    function browse(items, q, p) {
      results = [];
      var path = p.substring(0, p.length-1);
      var splitPath = path.split('/');
      var fromPath = [];
      _.each(items, function(item) {
        var itemSplit = item.path.split('/');
        if (item.path.indexOf(path) === 0 && itemSplit.length-1 == splitPath.length) {
          fromPath.push(item);
        }
      });
      if (q === undefined) return fromPath;
      search(fromPath, q);
    }

    if (path) {
      browse(searchables, query, path);
    } else {
      search(searchables, query);
    }

    xhr.respond(200, { "Content-Type": "application/json" },
      JSON.stringify({
        "total": results.length,
        "results": results.slice(page*page_size, (page*page_size)+(page_size-1))
    }));
  });

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
        expect($(this).hasClass('active')).to.be.true;
        expect($('.pat-relateditems-tabs-browse', $el).hasClass('active')).to.be.false;
        expect(pattern.$browsePath.html()).to.equal('');
      }).click();
      $('.pat-relateditems-tabs-browse', $el).on('click', function(){
        expect(pattern.browsing).to.be.true;
        expect($(this).hasClass('active')).to.be.true;
        expect($('.pat-relateditems-tabs-search', $el).hasClass('active')).to.be.false;
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
