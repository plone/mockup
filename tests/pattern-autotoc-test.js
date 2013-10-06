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
  'mockup-registry',
  'mockup-patterns-autotoc'
], function(chai, $, Registry, AutoTOC) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

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
        '   <h1 style="margin-top: 500px;">Title 4</h1>' +
        ' </div>' +
        ' <div class="placeholder" style="height: 1000px;">' +
        '   <div id="first-elem"></div>' +
        ' </div>' +
        '</div>').appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it("by default creates TOC from h1/h2/h3", function() {
      expect($('> nav', this.$el).size()).to.equal(0);
      Registry.scan(this.$el);
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
      Registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(1);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).to.equal(0);
    });
    it("can be appended anywhere", function() {
      this.$el.attr("data-pat-autotoc", "levels: h1;appendTo:.placeholder");
      expect($('> nav', this.$el).size()).to.equal(0);
      expect($('div.placeholder > nav', this.$el).size()).to.equal(0);
      Registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(0);
      expect($('div.placeholder > nav', this.$el).size()).to.equal(1);
      expect($('div.placeholder', this.$el).children().eq(0).attr('id')).to.equal("first-elem");
      expect($('div.placeholder', this.$el).children().eq(1).attr('class')).to.equal("autotoc-nav");
    });
    it("can be prepended anywhere", function() {
      this.$el.attr("data-pat-autotoc", "levels: h1;prependTo:.placeholder");
      expect($('> nav', this.$el).size()).to.equal(0);
      expect($('div.placeholder > nav', this.$el).size()).to.equal(0);
      Registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(0);
      expect($('div.placeholder > nav', this.$el).size()).to.equal(1);
      expect($('div.placeholder', this.$el).children().eq(0).attr('class')).to.equal("autotoc-nav");
      expect($('div.placeholder', this.$el).children().eq(1).attr('id')).to.equal("first-elem");
    });
    it("custom className", function() {
      this.$el.attr('data-pat-autotoc', 'className:SOMETHING');
      Registry.scan(this.$el);
      expect(this.$el.hasClass('SOMETHING')).to.equal(true);
    });
    it("scrolls to content", function(done) {
      Registry.scan(this.$el);
      expect($(document).scrollTop()).to.equal(0);
      if (navigator.userAgent.search("PhantomJS") >= 0) {
          // TODO Make this test work in PhantomJS as well as Chrome
          //      See https://github.com/ariya/phantomjs/issues/10162
          done();
      }
      $("> nav > a.autotoc-level-1", this.$el).last()
        .on('clicked.autodoc.patterns', function() {
          var documentOffset = Math.round($(document).scrollTop());
          var headingOffset = Math.round($("#autotoc-item-autotoc-8", this.$el).offset().top);
          expect(documentOffset).to.equal(headingOffset);
          done();
        })
        .click();
    });
  });

});
