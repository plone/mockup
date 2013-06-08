// tests for modal pattern
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
  'jam/chai/chai.js',
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/patterns/base',
  'js/patterns/autotoc',
  'js/patterns/backdrop',
  'js/patterns/pickadate',
  'js/patterns/expose',
  'js/patterns/modal',
  'js/patterns/select2',
  'js/patterns/toggle',
  'js/patterns/preventdoublesubmit',
  'js/patterns/formUnloadAlert',
  'js/patterns/accessibility',
  'js/patterns/cookiedirective',
  'js/patterns/relateditems',
  'js/patterns/tinymce',
  'js/patterns/tablesorter',
  'js/patterns/livesearch',
  'js/patterns/formautofocus'
], function(chai, $, sinon, registry,
      Base, AutoTOC, Backdrop,
      PickADate, Expose, Modal,
      Select2, Toggle, PreventDoubleSubmit,
      FormUnloadAlert, Accessibility, CookieDirective,
      RelatedItems, TinyMCE, Tablesorter, Livesearch,
      FormAutoFocus) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 0;
  server.respondWith("patterns-modal-load-via-ajax", function (xhr, id) {
    xhr.respond(200, { "Content-Type": "text/html" }, '' +
      '<html><body>' +
      '<div id="content">Exampel</div>' +
      '</body></html>');
  });

  describe("Base", function () {
    beforeEach(function() {
      this._patterns = $.extend({}, registry.patterns);
    });
    afterEach(function() {
      registry.patterns = this._patterns;
    });
    it("read options from dom tree", function() {
      var $el = $('' +
        '<div data-pat-example="{&quot;name1&quot;: &quot;value1&quot;,' +
        '    &quot;name2&quot;: &quot;value2&quot;}">' +
        ' <div class="pat-example"' +
        '      data-pat-example="name2: something;' +
        '                        some-thing-name4: value4;' +
        '                        some-stuff: value5"/>' +
        '</div>');

      Base.extend({
        name: "example",
        defaults: {
          name3: 'value3'
        },
        init: function() {
          expect(this.options.name1).to.equal('value1');
          expect(this.options.name2).to.equal('something');
          expect(this.options.name3).to.equal('value3');
          expect(this.options.some.thing.name4).to.equal('value4');
          expect(this.options.some.stuff).to.equal('value5');
        }
      });

      registry.scan($el, true);
    });
    // TODO: make sure that pattern is not initialized twice if scanned twice
  });


/* ==========================
   TEST: TableSorter
  ========================== */

  describe("TableSorter", function () {
    beforeEach(function() {
      this.$el = $('' +
        '<table class="pat-tablesorter">'+
        '   <thead>'+
        '     <tr>'+
        '       <th>First Name</th>'+
        '       <th>Last Name</th>'+
        '       <th>Number</th>'+
        '     </tr>'+
        '   </thead>'+
        '   <tbody>'+
        '     <tr>'+
        '       <td>AAA</td>'+
        '       <td>ZZZ</td>'+
        '       <td>3</td>'+
        '     </tr>'+
        '     <tr>'+
        '       <td>BBB</td>'+
        '       <td>YYY</td>'+
        '       <td>1</td>'+
        '     </tr>'+
        '     <tr>'+
        '       <td>CCC</td>'+
        '       <td>XXX</td>'+
        '       <td>2</td>'+
        '     </tr>'+
        '   </tbody>'+
        ' </table>');
    });
    it("test headers have the sort arrow", function() {
      registry.scan(this.$el);
      expect(this.$el.find('.sortdirection').size()).to.equal(3);
    });
    it("test sort by second column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(1).trigger("click");

      var should_be = ["CCC", "BBB", "AAA"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
    it("test sort by third column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger("click");

      var should_be = ["BBB", "CCC", "AAA"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
    it("test several sorts and finally back to first column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger("click");
      this.$el.find('thead th').eq(3).trigger("click");
      this.$el.find('thead th').eq(2).trigger("click");
      this.$el.find('thead th').eq(1).trigger("click");
      this.$el.find('thead th').eq(3).trigger("click");
      this.$el.find('thead th').eq(1).trigger("click");

      var should_be = ["AAA", "BBB", "CCC"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
  });

/* ==========================
   TEST: CookieDirective
  ========================== */

  describe("CookieDirective", function () {
    beforeEach(function() {
      $.removeCookie("Allow_Cookies_For_Site");
      $.removeCookie("_cookiesEnabled");
      this.$el = $('' +
        '<div class="pat-cookiedirective"' +
        '     data-pat-cookiedirective="shouldAsk: true;' +
        '                               shouldEnable: true;">' +
        '  <div class="login"></div>' +
        '</div>');
    });
    it("test ask permission shows", function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(1);
    });
    it("test ask permission can be hidden", function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      this.$el.attr("data-pat-cookiedirective", "shouldAsk: false");
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it("test ask permission don't show if replied yes", function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      $.cookie('Allow_Cookies_For_Site', 1);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it("test ask permission don't show if replied no", function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      $.cookie('Allow_Cookies_For_Site', 0);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it("test ask permission allow button", function() {
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.be.undefined;
      registry.scan(this.$el);
      this.$el.find('.cookieallowbutton').trigger('click');
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.equal("1");
      expect(this.$el.find('.cookiedirective').is(':hidden')).to.be.true;
    });
    it("test ask permission deny button", function() {
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.be.undefined;
      registry.scan(this.$el);
      this.$el.find('.cookiedenybutton').trigger('click');
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.equal("0");
      expect(this.$el.find('.cookiedirective').is(':hidden')).to.be.true;
    });
    it("test ask permission customizable", function() {
      this.$el.attr("data-pat-cookiedirective",
        "askPermissionMsg: Test askPermissionMsg;" +
        "allowMsg: Test allowMsg;" +
        "denyMsg: Test denyMsg");
      registry.scan(this.$el);
      expect(this.$el.find('.cookiemsg').text()).to.equal("Test askPermissionMsg");
      expect(this.$el.find('.cookieallowbutton').text()).to.equal("Test allowMsg");
      expect(this.$el.find('.cookiedenybutton').text()).to.equal("Test denyMsg");

    });
    it("test enable cookies shows", function() {
      // Override the cookie function with something that returns undefined
      $.__old__cookie = $.cookie;
      $.cookie = function (){return undefined;};
      this.$el.attr("data-pat-cookiedirective", "shouldAsk: false");
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(1);
      // Restore cookie function
      $.cookie = $.__old__cookie;
    });
    it("test enable cookies can be hidden", function() {
      // Override the cookie function with something that returns undefined
      $.__old__cookie = $.cookie;
      $.cookie = function (){return undefined;};
      this.$el.attr("data-pat-cookiedirective",
        "shouldAsk: false; shouldEnable: false");
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      // Restore cookie function
      $.cookie = $.__old__cookie;
    });
    it("show enable cookies and ask permission", function() {
      // Override the cookie function with something that returns undefined
      $.__old__cookie = $.cookie;
      $.cookie = function (){return undefined;};
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(1);
      expect(this.$el.find('.cookiedirective').size()).to.equal(1);
      // Restore cookie function
      $.cookie = $.__old__cookie;
    });
    it("test enable cookies shouldn't show if selector is not found", function() {
      // Override the cookie function with something that returns undefined
      $.__old__cookie = $.cookie;
      $.cookie = function (){return undefined;};
      this.$el.attr("data-pat-cookiedirective",
        "shouldEnableSelector: .another-login; denyMsg: Test denyMsg");
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      // Restore cookie function
      $.cookie = $.__old__cookie;
    });
    it("show enable cookies message customizable", function() {
      // Override the cookie function with something that returns undefined
      $.__old__cookie = $.cookie;
      $.cookie = function (){return undefined;};
      this.$el.attr("data-pat-cookiedirective",
        "shouldEnableMsg: Test shouldEnableMsg");
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookiesmsg').text()).to.equal("Test shouldEnableMsg");
      // Restore cookie function
      $.cookie = $.__old__cookie;
    });
  });

/* ==========================
   TEST: Accessibility
  ========================== */

  describe("Accessibility", function () {
    beforeEach(function() {
      $.removeCookie('fontsize');
      this.$el = $('' +
        '<div class="pat-accessibility">' +
          '<a id="btn1" />' +
          '<a id="btn2" />' +
          '<a id="btn3" />' +
        '</div>');
    });
    it("test cookie remains set", function() {
      var accessibility = new Accessibility(this.$el);
      expect($.cookie('fontsize'), this.$el).to.be.undefined;
      accessibility.setBaseFontSize("smallText", 1);
      expect($.cookie('fontsize'), this.$el).to.not.be.undefined;
    });
    it("test class is set", function() {
      var accessibility = new Accessibility(this.$el);
      expect(this.$el.hasClass("smallText")).to.be.false;
      expect(this.$el.hasClass("largeText")).to.be.false;
      accessibility.setBaseFontSize("smallText", 1);
      expect(this.$el.hasClass("smallText")).to.be.true;
      expect(this.$el.hasClass("largeText")).to.be.false;
      accessibility.setBaseFontSize("largeText", 1);
      expect(this.$el.hasClass("smallText")).to.be.false;
      expect(this.$el.hasClass("largeText")).to.be.true;
    });
    it("test class is set if a cookie is found", function() {
      $.cookie('fontsize', "smallText");
      expect(this.$el.hasClass("smallText")).to.be.false;
      registry.scan(this.$el);
      expect(this.$el.hasClass("smallText")).to.be.true;
    });
    it("test setting small font size with button works", function(){
      // add pattern to anchor
      this.$el.attr("data-pat-accessibility", "smallbtn: #btn1");
      var accessibility = new Accessibility(this.$el);
      $('#btn1', this.$el).trigger('click');
      expect(this.$el.hasClass('smallText')).to.be.true;
    });
    it("test setting large font size with button works", function(){
      // add pattern to anchor
      this.$el.attr("data-pat-accessibility",
        "largebtn: #btn3; smallbtn: #btn1");
      var accessibility = new Accessibility(this.$el);
      $('#btn3', this.$el).trigger('click');
      expect(this.$el.hasClass('largeText')).to.be.true;
    });
  });


  /* ==========================
   TEST: AutoTOC
  ========================== */

  describe("AutoTOC", function () {
    beforeEach(function() {
      this.$el = $('' +
        '<div class="pat-autotoc">' +
        ' <div>' +
        '   <h1>Title 1</h1>' +
        '   <h1>Title 2</h1>' +
        '   <h2>Title 2.1</h2>' +
        '   <h2>Title 2.3</h2>' +
        '   <h2>Title 2.4</h2>' +
        '   <h1>Title 3</h1>' +
        '   <h2>Title 3.1</h2>' +
        '   <h3>Title 3.1.1</h3>' +
        '   <h4>Title 3.1.1.1</h4>' +
        '   <h1>Title 4</h1>' +
        ' </div>' +
        '</div>');
    });
    it("by default creates TOC from h1/h2/h3", function() {
      expect($('> nav', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(1);
      expect($('> nav > a', this.$el).size()).to.equal(9);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-3', this.$el).size()).to.equal(1);
      expect($('> nav > a.autotoc-level-4', this.$el).size()).to.equal(0);
    });
    it("can be used as jQuery plugin as well", function () {
      expect($('> nav', this.$el).size()).to.equal(0);
      this.$el.patternAutotoc();
      expect($('> nav', this.$el).size()).to.equal(1);
    });
    it("can have custom levels", function() {
      this.$el.attr("data-pat-autotoc", "levels: h1");
      expect($('> nav', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(1);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).to.equal(0);
    });
  });

  /* ==========================
   TEST: Backdrop
  ========================== */

  describe("Backdrop", function() {
    it("default behaviour", function() {
      var $el = $('<div></div>'),
          backdrop = new Backdrop($el);
      expect($('.backdrop', $el).size()).to.equal(1);
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      backdrop.hide();
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      backdrop.$backdrop.trigger('click');
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 50;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(true);
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(false);
    });
  });

  /* ==========================
   TEST: PickADate
  ========================== */

  describe("PickADate", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div>' +
        ' <input class="pat-pickadate" />' +
        '</div>');
    });
    it('creates initial structure', function() {
      expect($('.pat-pickadate-wrapper', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.pat-pickadate-wrapper', this.$el).size()).to.equal(1);
      expect($('.pat-pickadate-wrapper select', this.$el).size()).to.equal(8);
      expect($('.pat-pickadate-wrapper .pickadate__holder select', this.$el).size()).to.equal(2);
    });
    it('doesn not work on anything else then "input" elements', function() {
      var $el = $('' +
        '<div>' +
        ' <a class="pat-pickadate" />' +
        '</div>');
      expect($('.pat-pickadate-wrapper', $el).size()).to.equal(0);
      registry.scan($el);
      expect($('.pat-pickadate-wrapper', $el).size()).to.equal(0);
    });
  });

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
      $('input', $el).focus();
      expect($('form', $el).css('z-index')).to.equal('1001');
      expect($el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(false);
    });
  });

  /* ==========================
   TEST: Modal
  ========================== */

  describe("Modal", function() {
    it("default behaivour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-pat-modal="backdrop: #body">Open</a>' +
        ' <div id="target" style="display:none;">Target</div>' +
        '</div>').appendTo('body');

      registry.scan($el);

      expect($('.backdrop', $el).is(':hidden')).to.be.true;
      expect($el.hasClass('backdrop-active')).to.be.false;
      expect($('.modal-wrapper', $el).is(':hidden')).to.be.true;
      expect($('.modal', $el).size()).to.equal(0);

      $('a.pat-modal', $el).click();

      expect($('.backdrop', $el).is(':visible')).to.be.true;
      expect($el.hasClass('backdrop-active')).to.be.true;
      expect($('.modal-wrapper', $el).is(':visible')).to.be.true;
      expect($('.modal', $el).size()).to.equal(1);
      expect($('.modal .modal-header', $el).size()).to.equal(1);
      expect($('.modal .modal-body', $el).size()).to.equal(1);
      expect($('.modal .modal-footer', $el).size()).to.equal(1);

      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.be.false;
      expect($('.modal', $el).size()).to.equal(0);

      $el.remove();
    });
    it("customize modal on show event", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-pat-modal="backdrop: #body">Open</a>' +
        ' <div id="target">Target</div>' +
        '</div>').appendTo('body');

      $('a', $el)
        .patternModal()
        .on('show.modal.patterns', function(e, modal) {
            $('.modal-header h3', modal.$modal).text('New Title');
          })
        .click();
      expect($('.modal .modal-header h3', $el).text()).to.equal('New Title');

      $el.remove();
    });
    it("load modal content via ajax", function(done) {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="patterns-modal-load-via-ajax"' +
        '    data-pat-modal="backdrop: #body">Open</a>' +
        '</div>').appendTo('body');

      $('a', $el)
        .patternModal()
        .on('show.modal.patterns', function() {
          console.log('works');

          $el.remove();
          done();
        })
        .click();
    });

    describe("modal positioning (findPosition) ", function() {
      //
      // -- CHANGE POSITION ONLY ----------------------------------------------
      //
      it('position: center middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos['top']).to.equal('10px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos['left']).to.equal('30px');
        }).click();
      });
      it('position: left middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos['top']).to.equal('10px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: right middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos['top']).to.equal('10px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos['left']).to.equal('30px');
        }).click();
      });
      it('position: center bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos['left']).to.equal('30px');
        }).click();
      });
      it('position: left top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: left bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: right top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });

      //
      // -- NON-ZERO MARGIN ---------------------------------------------------
      //
      it('position: center middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
          expect(pos['top']).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos['left']).to.equal('25px');
        }).click();
      });
      it('position: left middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 = 5
          expect(pos['top']).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('5px');
        }).click();
      });
      it('position: right middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
          expect(pos['top']).to.equal('5px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('5px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos['left']).to.equal('25px');
        }).click();
      });
      it('position: center bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('5px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos['left']).to.equal('25px');
        }).click();
      });
      it('position: left top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('5px');
        }).click();
      });
      it('position: left bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('5px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('5px');
        }).click();
      });
      it('position: right top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('5px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('5px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('5px');
          expect(pos['top']).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('5px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });

      //
      // -- WRAPPER SMALLER THAN MODAL ----------------------------------------
      //
      it('position: center middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: left middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: right middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: center bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: left top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: left bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['left']).to.equal('0px');
        }).click();
      });
      it('position: right top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['top']).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, modal) {
          var modal =  modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos['bottom']).to.equal('0px');
          expect(pos['top']).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos['right']).to.equal('0px');
          expect(pos['left']).to.equal('auto');
        }).click();
      });
    });
  });

  /* ==========================
   TEST: Select2
  ========================== */

  describe("Select2", function() {
    it('tagging', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-select2" data-pat-select2="tags: Red,Yellow,Blue"' +
        '        value="Yellow" />' +
        '</div>');
      expect($('.select2-choices', $el).size()).to.equal(0);
      registry.scan($el);
      expect($('.select2-choices', $el).size()).to.equal(1);
      expect($('.select2-choices li', $el).size()).to.equal(2);
    });

    it('init value map', function() {
        var $el = $(
        '<div>' +
        ' <input class="pat-select2"' +
        '        data-pat-select2="{' +
        '          &quot;tags&quot;: &quot;Red,Yellow,Blue&quot;,' +
        '          &quot;initvaluemap&quot;: {' +
        '            &quot;Yellow&quot;: &quot;YellowTEXT&quot;,' +
        '            &quot;Red&quot;: &quot;RedTEXT&quot;' +
        '          }' +
        '        }"' +
        '        value="Yellow,Red"/>' +
        '</div>');

        registry.scan($el);
        expect($('.select2-choices li', $el).size()).to.equal(3);
    });

    it('ajax vocabulary', function() {
        var $el = $(
        ' <input class="pat-select2"' +
        '        data-pat-select2="ajaxvocabulary: select2-users-vocabulary"' +
        '        />'
        );

        var select2 = new Select2($el);
        expect(select2.options.ajax.url).to.equal("select2-users-vocabulary");
    });

    it('orderable tags', function() {
        var $el = $(
        '<div>' +
        ' <input class="pat-select2"' +
        '        data-pat-select2="orderable: true; tags: Red,Yellow,Blue"' +
        '        value="Red"' +
        '        />' +
        '</div>'
        );

        registry.scan($el);
        expect($('.select2-container', $el).hasClass('select2-orderable')).to.be.true;
    });
  });

  /* ==========================
   TEST: Related Items
  ========================== */

  describe("Related Items", function() {
    it('test initialize', function(){
      var $el = $(
        '<div>' +
        ' <input class="pat-relateditems" />' +
        '</div>'
        );
      registry.scan($el);
      expect($('.select2-container-multi', $el)).to.not.be.undefined;
    });
  });

  /* ==========================
   TEST: Toggle
  ========================== */

  describe("Toggle", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div>' +
        ' <a class="pat-toggle"' +
        '    data-pat-toggle="target: #target;' +
        '                     value: toggled">Button</a>' +
        ' <div id="target">' +
        '   <a href="patterns.html">Click here to go somewhere else</a>' +
        ' </div>' +
        '</div>').appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it("by default toggles on click event", function() {
      expect($('.toggled', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).to.equal(1);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).to.equal(0);
    });
    it("can also listen to custom event", function() {
      $('.pat-toggle', this.$el).attr('data-pat-toggle', 'target: #target; value: toggled; event: customEvent');
      expect($('.toggled', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('customEvent');
      expect($('.toggled', this.$el).size()).to.equal(1);
    });
    it("can also toggle custom element attribute", function() {
      $('.pat-toggle', this.$el).attr('data-pat-toggle', 'target: #target; value: toggled; attribute: rel');
      expect($('.toggled', this.$el).size()).to.equal(0);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(0);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).to.equal(0);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(1);
    });
    it("toggle multiple targets", function() {
       var $el = $('' +
        '<div>' +
        '  <div>' +
        '    <div>' +
        '      <div>' +
        '        <a class="pat-toggle"' +
        '          data-pat-toggle="target: .target;' +
        '                           value: toggled">Button</a>' +
        '      </div>' +
        '      <div class="target"></div>' +
        '    </div>' +
        '    <div class="target"></div>' +
        '    <div class="target"></div>' +
        '  </div>' +
        '  <div class="target"></div>' +
        '  <div class="target"></div>' +
        '</div>').appendTo('body');
      registry.scan($el);
      expect($('.toggled', $el).size()).to.equal(0);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(5);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(0);
      $el.remove();
    });
    it("if some elements already marked, mark all with first click", function() {
       var $el = $('' +
        '<div>' +
        '  <div>' +
        '    <div>' +
        '      <div>' +
        '        <a class="pat-toggle"' +
        '          data-pat-toggle="target: .target;' +
        '                           value: toggled">Button</a>' +
        '      </div>' +
        '      <div class="target toggled"></div>' +
        '    </div>' +
        '    <div class="target"></div>' +
        '    <div class="target toggled"></div>' +
        '  </div>' +
        '  <div class="target toggled"></div>' +
        '  <div class="target"></div>' +
        '</div>').appendTo('body');
      registry.scan($el);
      expect($('.toggled', $el).size()).to.equal(3);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(5);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(0);
      $el.remove();
    });
    it("if all elements already marked, unmark all with first click", function() {
       var $el = $('' +
        '<div>' +
        '  <div>' +
        '    <div>' +
        '      <div>' +
        '        <a class="pat-toggle"' +
        '          data-pat-toggle="target: .target;' +
        '                           value: toggled">Button</a>' +
        '      </div>' +
        '      <div class="target toggled"></div>' +
        '    </div>' +
        '    <div class="target toggled"></div>' +
        '    <div class="target toggled"></div>' +
        '  </div>' +
        '  <div class="target toggled"></div>' +
        '  <div class="target toggled"></div>' +
        '</div>').appendTo('body');
      registry.scan($el);
      expect($('.toggled', $el).size()).to.equal(5);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(0);
      $el.remove();
    });
    it("should also be able to mark the toggle itself", function() {
       var $el = $('' +
        '<div>' +
        '  <div>' +
        '    <div>' +
        '      <div>' +
        '        <a class="pat-toggle target"' +
        '          data-pat-toggle="target: .target;' +
        '                           value: toggled">Button</a>' +
        '      </div>' +
        '      <div class="target"></div>' +
        '    </div>' +
        '    <div class="target"></div>' +
        '    <div class="target"></div>' +
        '  </div>' +
        '  <div class="target"></div>' +
        '  <div class="target"></div>' +
        '</div>').appendTo('body');
      registry.scan($el);
      expect($('.toggled', $el).size()).to.equal(0);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(6);
      $('.pat-toggle', $el).trigger('click');
      expect($('.toggled', $el).size()).to.equal(0);
      $el.remove();
    });
  });

  /* ==========================
   TEST: PreventDoubleSubmit
  ========================== */

  describe("PreventDoubleSubmit", function() {
    beforeEach(function() {
      // mock up `_confirm` func
      this._old_confirm = PreventDoubleSubmit.prototype._confirm;
      PreventDoubleSubmit.prototype._confirm = function(){
        this.confirmed = true;
      };
    });
    afterEach(function() {
      PreventDoubleSubmit.prototype._confirm = this._old_confirm;
    });
    it('prevent form to be submitted twice', function() {
      var $el = $('' +
        '<form id="helped" class="pat-preventdoublesubmit">' +
        ' <input type="text" value="Yellow" />' +
        ' <select name="aselect">' +
        '    <option value="1">1</option>' +
        '    <option value="2">2</option>' +
        '</select>' +
        ' <input id="b1" type="submit" value="Submit 1" />' +
        ' <input id="b2" type="submit" class="allowMultiSubmit" value="Submit 2" />' +
        '</form>');
      registry.scan($el);

      var guardKlass = 'submitting';
      var optOutKlass = 'allowMultiSubmit';
      var get_confirmed = function(el){
        return el.data('pattern-preventdoublesubmit-0').confirmed;
      };
      var reset_confirmed = function(el){
        el.data('pattern-preventdoublesubmit-0').confirmed = undefined;
      };

      var $b1 = $('#b1', $el);
      var $b2 = $('#b2', $el);

      expect(get_confirmed($el)).to.be.undefined;
      $b1.trigger('click');
      expect(get_confirmed($el)).to.be.undefined;
      expect($b1.hasClass(guardKlass)).to.be.true;
      $b1.trigger('click');
      expect(get_confirmed($el)).to.be.true;

      // reset confirmed flag
      reset_confirmed($el);

      $b2.trigger('click');
      expect($b2.hasClass(guardKlass)).to.be.true;
      expect(get_confirmed($el)).to.be.undefined;

    });
  });

  /* ==========================
   TEST: FormUnloadAlert
  ========================== */

  describe("FormUnloadAlert", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<form class="pat-formunloadalert">' +
        ' <select name="aselect">' +
        '    <option value="1">1</option>' +
        '    <option value="2">2</option>' +
        '</select>' +
        '<input id="b1" type="submit" value="Submit" />' +
        '<a href="patterns.html">Click here to go somewhere else</a>' +
        '</form>');
    });
    afterEach(function() {
      var pattern = this.$el.data('pattern-formunloadalert-0');
      pattern._changed = false;
    });
    it('prevent unload of form with changes', function() {
      registry.scan(this.$el);

      // current instance of the pattern
      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      // expect(pattern.unload_msg).to.be.undefined;
      // expect(pattern.hasChanges()).to.be.false;

      $select.trigger('change');
      expect(pattern._changed).to.be.true;

      $('a', this.$el).click(function(e){
        pattern._handle_unload(pattern, e);
        expect(e.returnValue).to.equal(pattern.options.message);
      });
      $('a', this.$el).trigger('click');
    });
    it('do not show message if submitting', function() {
      registry.scan(this.$el);

      // current instance of the pattern
      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      // expect(pattern.unload_msg).to.be.undefined;
      // expect(pattern.hasChanges()).to.be.false;

      $select.trigger('change');
      expect(pattern._changed).to.be.true;

      $(this.$el).on('submit', function(e){
        pattern._handle_unload(pattern, e);
        expect(e.returnValue).to.not.equal(pattern.options.message);
      });
      $(this.$el).trigger('submit');
    });
  });

  /* ==========================
   TEST: Livesearch
  ========================== */

  describe('Livesearch', function() {
    beforeEach(function() {
      this.$el = $(''+
          '<div class="pat-livesearch"'+
              'data-pat-livesearch="url:/search.html">'+
            '<input type="text" class="pat-livesearch-input" placeholder="Search" />'+
            '<div class="pat-livesearch-container">'+
              '<div class="pat-livesearch-results">'+
              '</div>'+
            '</div>'+
          '</div>');

      var search = '' +
        '<html>' +
        '<body>'+
        ' <ul>'+
        '   <li>'+
        '     <a href="http://localhost:8080/plone/front-page">Welcome to Plone</a>'+
        '     <p>Congratulations! You have successfully installed Plone.</p>'+
        '   </li>'+
        '   <li>'+
        '     <a href="http://localhost:8080/plone/front-page">Example Item</a>'+
        '     <p>This is an example item from the depths of somewhere.</p>'+
        '   </li>'+
        ' </ul>'+
        '</body>'+
        '</html>';

      var server = sinon.fakeServer.create();
      server.autoRespond = true;
      server.autoRespondAfter = 500;
      server.respondWith(/search.html/, function (xhr, id) {
        xhr.respond(200, { "Content-Type": "html/html" }, search);
      });
    });
    afterEach(function() {

    });

    it('test default elements', function() {

      registry.scan(this.$el);
      var pattern = this.$el.data('pattern-livesearch-0');

      expect(pattern.$toggle).to.have.length(1);
      expect(pattern.$input).to.have.length(1);
      expect(pattern.$results).to.have.length(1);
    });

    it('search after 3 characters and after delay', function() {

      var clock = sinon.useFakeTimers();

      registry.scan(this.$el);
      var pattern = this.$el.data('pattern-livesearch-0');

      expect(pattern.items()).to.have.length(0);

      pattern.$input.val('123');
      pattern.$input.trigger('keyup');

      expect(pattern.timeout).to.not.be.null;
      expect(pattern.items()).to.have.length(0);

      clock.tick(1000);

      expect(pattern.items()).to.have.length(2);

    });

    it('keyboard navigation', function() {
      var clock = sinon.useFakeTimers();

      registry.scan(this.$el);
      var pattern = this.$el.data('pattern-livesearch-0');

      pattern.$input.val('123');
      pattern.$input.trigger('keyup');

      clock.tick(1000);

      expect(pattern.$selected).to.be.null;

      // Arrow down
      pattern._keyDown();
      expect(pattern.$selected).to.have.length(1);
      expect(pattern.$selected.index()).to.equal(0);
      pattern._keyDown();
      expect(pattern.$selected.index()).to.equal(1);
      // We are at the end and should end up on the first item
      pattern._keyDown();
      expect(pattern.$selected.index()).to.equal(0);

      // Arrow up, starting from the top will move us to the bottom
      pattern._keyUp();
      expect(pattern.$selected.index()).to.equal(1);
      pattern._keyUp();
      expect(pattern.$selected.index()).to.equal(0);

      // Escape
      expect(pattern.$toggle.hasClass('show')).to.be.true;

      pattern._keyEscape();
      expect(pattern.$toggle.hasClass('show')).to.be.false;
    });

  });


  /* ==========================
   TEST: TinyMCE
  ========================== */

  describe("TinyMCE", function() {
    beforeEach(function() {
      this.$el = $('<div><textarea class="pat-tinymce"></textarea></div>')
        .appendTo('body');
    });
    afterEach(function() {
    });
    it('test tinymce loaded', function() {
      registry.scan(this.$el);
      expect(this.$el.attr('id')).to.not.be.null;
    });
  });

  /* ==========================
   TEST: RE
  ========================== */
  describe("Regular expressions", function() {
    beforeEach(function() {
    });
    afterEach(function() {
    });
    it('test parses escaped semi-colon', function() {
      //var options = "foo:bar; foo2:\;; bar: foo;";
      //var optRegex = new RegExp("[^\\;];"); 
      //var result = options.split(optRegex);
      //expect(result[0]).to.be.equal('foo:bar');
      //expect(result[1]).to.be.equal('foo2:\;');
      //expect(result[2]).to.be.equal('bar:foo');
    });

  });

  /* ==========================
   TEST: FormAutoFocus
  ========================== */

  describe("FormAutoFocus", function() {
    it("default behaivour", function(done) {
      var $el = $('' +
        '<div id="body">' +
        ' <form class="pat-formautofocus" ' +
        '       data-pat-formautofocus="condition:.error;target:input">' +
        '  <input value="" />' +
        '  <div class="error">Some error</div>' +
        ' </form>' +
        '</div>');
      expect($('input', $el).is(':focus')).to.be.false;
      $('input', $el).on('focus', function() {
        done();
      });
      registry.scan($el);
    });
  });


});






