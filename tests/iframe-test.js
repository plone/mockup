// tests for iframe.js script.
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
  'mockup-iframe'
], function(chai, $, IFrame, undefined) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');

  describe("Registry", function () {
    beforeEach(function() {
      this.iframe = new $.IFrame({
        el: $('<div><p>some</p><a href="#">some link</a></div>').appendTo('body'),
        position: 'top'
      });
      this.iframe._window_location = function() {};
      this.iframe._window_open = function() {};
    });
    afterEach(function() {
      this.iframe.$el.remove();
    });
    it("simple stretch and shrink", function() {
      var initial_height = this.iframe.$el.height();

      expect(initial_height).to.not.equal(0);

      this.iframe.stretch();
      expect(initial_height).to.be.below(this.iframe.$el.height());

      this.iframe.shrink();
      expect(initial_height).to.be.equal(this.iframe.$el.height());

      this.iframe.toggle();
      expect(initial_height).to.be.above(this.iframe.$el.height());

      this.iframe.toggle();
      expect(initial_height).to.be.equal(this.iframe.$el.height());
    });

  });
});

//    "defult handling of clicks inside iframe": function() {
//      var stub_location = this.stub($.iframe, '_window_location'),
//          stub_open = this.stub($.iframe, '_window_open');
//
//      $('a', $.iframe.$el).trigger({ type: 'click', which: 1 });  // left click
//      $('a', $.iframe.$el).trigger({ type: 'click', which: 2 });  // middle click
//
//      assert.calledOnceWith(stub_location, '#');
//      assert.calledOnceWith(stub_open, '#');
//      assert.callOrder(stub_location, stub_open);
//    },
//
//    "custom handling of clicks inside iframe": function() {
//      $.iframe.registerAction(
//        function(e, iframe) { return true; },
//        function(e, iframe) { assert(true); });
//      $('p', $.iframe.$el).trigger({ type: 'click' });
//    },
//
//    "when iframe is stretch click can also happen on html element": function() {
//      $.iframe.registerAction(
//        function(e, iframe) { return true; },
//        function(e, iframe) { assert(true); });
//      $.iframe.$el.parents('html').trigger({ type: 'click' });
//    }
