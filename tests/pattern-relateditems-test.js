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
  'mockup-registry',
  'mockup-patterns-relateditems'
], function(chai, $, sinon, registry, RelatedItems) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd').globals(['jQuery*']);
  $.fx.off = true;

  /* ==========================
   TEST: Related Items
  ========================== */

  describe("Related Items", function() {
    beforeEach(function(){
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
      this.server.respondWith(/relateditems-test.json/, function(xhr, id) {
        var root = [
          {"UID": "jasdlfdlkdkjasdf", "Title": "Some Image", "path": "/test.png", "Type": "Image"},
          {"UID": "asdlfkjasdlfkjasdf", "Title": "News", "path": "/news", "Type": "Folder"},
          {"UID": "124asdfasasdaf34", "Title": "About", "path": "/about", "Type": "Folder"},
          {"UID": "asdf1234", "Title": "Projects", "path": "/projects", "Type": "Folder"},
          {"UID": "asdf1234gsad", "Title": "Contact", "path": "/contact", "Type": "Document"},
          {"UID": "asdv34sdfs", "Title": "Privacy Policy", "path": "/policy", "Type": "Document"},
          {"UID": "asdfasdf234sdf", "Title": "Our Process", "path": "/our-process", "Type": "Folder"},
          {"UID": "asdhsfghyt45", "Title": "Donate", "path": "/donate-now", "Type": "Document"},
        ];
        var about = [
          {"UID": "gfn5634f", "Title": "About Us", "path": "/about/about-us", "Type": "Document"},
          {"UID": "45dsfgsdcd", "Title": "Philosophy", "path": "/about/philosophy", "Type": "Document"},
          {"UID": "dfgsdfgj675", "Title": "Staff", "path": "/about/staff", "Type": "Folder"},
          {"UID": "sdfbsfdh345", "Title": "Board of Directors", "path": "/about/board-of-directors", "Type": "Document"}
        ];

        var staff = [
          {"UID": "asdfasdf9sdf", "Title": "Mike", "path": "/about/staff/mike", "Type": "Document"},
          {"UID": "cvbcvb82345", "Title": "Joe", "path": "/about/staff/joe", "Type": "Document"}
        ];
        var searchables = about.concat(root).concat(staff);

        var addUrls = function(list){
          /* add getURL value */
          for(var i=0; i<list.length; i=i+1){
            var data = list[i];
            data.getURL = window.location.origin + data.path;
          }
        };
        addUrls(searchables);
        addUrls(root);
        root[0].getURL = window.location.origin + '/exampledata/test.png';

        var results = [];

        // grab the page number and number of items per page -- note, page is 1-based from Select2
        var batch = getQueryVariable(xhr.url, 'batch');
        var page = 1;
        var page_size = 10;
        if(batch){
          batch = $.parseJSON(batch);
          page = batch.page;
          page_size = batch.size;
        }
        page = page - 1;

        var query = getQueryVariable(xhr.url, 'query');
        var path = null;
        var term = '';
        if(query){
          query = $.parseJSON(query);
          term = query.criteria[0].v;
          if(query.criteria.length > 1){
            path = query.criteria[1].v;
          }
        }

        // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
        function search(items, term) {
          results = [];
          if (term === undefined){
            return searchables;
          }
          _.each(items, function(item) {
            var q;
            var keys = (item.UID + ' ' + item.Title + ' ' + item.path + ' ' + item.Type).toLowerCase();
            if(typeof(term) === 'object'){
              for(var i=0; i<term.length; i=i+1){
                q = term[i].toLowerCase();
                if (keys.indexOf(q) > -1){
                  results.push(item);
                  break;
                }
              }
            }else{
              q = term.toLowerCase();
              if (keys.indexOf(q) > -1){
                results.push(item);
              }
            }
          });
        }

        function browse(items, q, p) {
          results = [];
          var path = p.substring(0, p.length-1);
          var splitPath = path.split('/');
          var fromPath = [];
          _.each(items, function(item) {
            var itemSplit = item.path.split('/');
            if (item.path.indexOf(path) === 0 && itemSplit.length-1 === splitPath.length) {
              fromPath.push(item);
            }
          });
          if (q === undefined){
            return fromPath;
          }
          search(fromPath, q);
        }
        if (path) {
          browse(searchables, term, path);
        } else {
          search(searchables, term);
        }

        xhr.respond(200, { "Content-Type": "application/json" },
          JSON.stringify({
            "total": results.length,
            "results": results.slice(page*page_size, (page*page_size)+(page_size-1))
        }));
      });
    });

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

    it('allow only a single type to be selectable', function () {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-relateditems" />' +
        '</div>').appendTo('body');
      var opts = {
        ajaxvocabulary: '/relateditems-test.json',
        selectableTypes: ['Image']
      };
      var pattern = $('.pat-relateditems').attr('data-pat-relateditems', JSON.stringify(opts)).patternRelateditems().data('patternRelateditems');

      var clock = sinon.useFakeTimers();

      pattern.$el.select2('open');
      clock.tick(1000);
      expect(pattern.$el.select2('data')).to.have.length(0);

      $('.pat-relateditems-result-select').first().click();
      expect(pattern.$el.select2('data')).to.have.length(0);

      $('.pat-relateditems-type-Image .pat-relateditems-result-select').first().click();
      expect(pattern.$el.select2('data')).to.have.length(1);

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
