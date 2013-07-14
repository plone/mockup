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
  './../js/registry.js',
  './../js/patterns/toggle.js'
], function(chai, $, registry, Toggle) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

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

});
