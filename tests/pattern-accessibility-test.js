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

define([
  'chai',
  'jquery',
  'mockup-registry',
  'mockup-patterns-accessibility'
], function(chai, $, registry, Accessibility) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

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
      expect($.cookie('fontsize')).to.be.undefined;
      accessibility.setBaseFontSize("smallText", 1);
      expect($.cookie('fontsize')).to.be.equal('smallText');
    });
    it("test class is set", function() {
      var accessibility = new Accessibility(this.$el);
      expect(this.$el.hasClass("smallText")).to.be.equal(false);
      expect(this.$el.hasClass("largeText")).to.be.equal(false);
      accessibility.setBaseFontSize("smallText", 1);
      expect(this.$el.hasClass("smallText")).to.be.equal(true);
      expect(this.$el.hasClass("largeText")).to.be.equal(false);
      accessibility.setBaseFontSize("largeText", 1);
      expect(this.$el.hasClass("smallText")).to.be.equal(false);
      expect(this.$el.hasClass("largeText")).to.be.equal(true);
    });
    it("test class is set if a cookie is found", function() {
      $.cookie('fontsize', "smallText");
      expect(this.$el.hasClass("smallText")).to.be.equal(false);
      registry.scan(this.$el);
      expect(this.$el.hasClass("smallText")).to.be.equal(true);
    });
    it("test setting small font size with button works", function(){
      // add pattern to anchor
      this.$el.attr("data-pat-accessibility", "smallbtn: #btn1");
      registry.scan(this.$el);
      $('#btn1', this.$el).trigger('click');
      expect(this.$el.hasClass('smallText')).to.be.equal(true);
    });
    it("test setting large font size with button works", function(){
      // add pattern to anchor
      this.$el.attr("data-pat-accessibility",
        "largebtn: #btn3; smallbtn: #btn1");
      registry.scan(this.$el);
      $('#btn3', this.$el).trigger('click');
      expect(this.$el.hasClass('largeText')).to.be.equal(true);
    });
  });

});
