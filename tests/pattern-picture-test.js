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
  'mockup-patterns-picture'
], function(chai, $, registry, Toggle) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: Picture
  ========================== */

  describe("Picture", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div class="pat-picture" ' +
        '     data-pat-picture="alt:Alternative text;">' +
        '   <div data-src="http://placehold.it/480x320"></div> ' +
        '   <div data-src="http://placehold.it/640x427" data-media="(min-width: 480px)"></div>' +
        '</div>').appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it("create responsive image widget", function() {
      expect($('img', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
    });
    it("test alternative text is recorded", function() {
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      expect($('img', this.$el).attr('alt')).to.equal('Alternative text');
    });
    /*
    it("test state change classes", function() {
      registry.scan(this.$el);
      var img = $('img', this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      expect(img.attr('class')).to.equal('test-loading');
      expect(img.attr('class')).to.equal('test-error');
    });
    // Chrome and friends don't allow resizing except in popups
    it("resize window to see media query in action", function() {
      registry.scan(this.$el);
      expect($('img', this.$el).size()).to.equal(1);
      window.resizeTo(640, 480);
      expect($('img', this.$el).attr('src')).to.equal('http://placehold.it/640x427');
      window.resizeTo(479, 320);
      expect($('img', this.$el).attr('src')).to.equal('http://placehold.it/480x320');
    });
    */
  });

});
