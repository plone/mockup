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
  'jam/chai/chai.js',
  'jquery',
  'js/registry',
  'js/formautofocus'
], function(chai, $, registry, FormAutoFocus) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: FormAutoFocus
  ========================== */

  describe("FormAutoFocus", function() {
    beforeEach(function() {
      // We are including another form to the DOM, just to be sure we focus
      // inside the form that actually has the pattern
      this.$el = $('' +
        '<div>' +
        ' <form>' +
        '  <input value="" id="first-input-should-not-focus"/>' +
        '  <div class="error">' +
        '    <input value="" id="input-inside-error-should-not-focus" />' +
        '  </div>' +
        ' </form>' +
        '</div>')
        .appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it("when the condition is met, focus on the first one", function(done) {
      var $el = $('' +
        '<div>' +
        ' <form class="pat-formautofocus">' +
        '  <input value="" id="first-input"/>' +
        '  <div class="error">' +
        '    <input value="" id="input1-inside-error" />' +
        '  </div>' +
        '  <div class="error">' +
        '    <input value="" id="input2-inside-error" />' +
        '  </div>' +
        ' </form>' +
        '</div>')
        .appendTo('body');
      expect($('input#first-input').is(':focus')).to.be.false;
      $('input').on('focus', function() {
        expect($(this).attr('id')).to.equal('input1-inside-error');
        expect($('input#first-input-should-not-focus').is(':focus')).to.be.false;
        expect($('input#input-inside-error-should-not-focus').is(':focus')).to.be.false;
        done();
      });
      registry.scan($el);
      $el.remove();
    });
    it("when the condition is not met, focus on the first input", function(done) {
      var $el = $('' +
        '<div>' +
        ' <form class="pat-formautofocus">' +
        '  <input value="" id="first-input"/>' +
        '  <input value="" id="second-input"/>' +
        ' </form>' +
        '</div>')
        .appendTo('body');
      expect($('input#first-input').is(':focus')).to.be.false;
      $('input').on('focus', function() {
        expect($(this).attr('id')).to.equal('first-input');
        expect($('input#first-input-should-not-focus').is(':focus')).to.be.false;
        expect($('input#input-inside-error-should-not-focus').is(':focus')).to.be.false;
        done();
      });
      registry.scan($el);
      $el.remove();
    });
  });
});