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
  'mockup-patterns-pickadate'
], function(chai, $, registry, PickADate) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: PickADate
  ========================== */

  describe("PickADate", function() {
    beforeEach(function() {
      this.$el = $('<div><input class="pat-pickadate" /></div>');
    });
    it('date and time element', function() {
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-date', this.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-time', this.$el).size()).to.equal(1);
    });
    it('only date element', function() {
      $('input', this.$el).attr('data-pat-pickadate', 'time:false');
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-date', this.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-time', this.$el).size()).to.equal(0);
    });
    it('only time element', function() {
      $('input', this.$el).attr('data-pat-pickadate', 'time:true;date:false');
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-date', this.$el).size()).to.equal(0);
      expect($('.pattern-pickadate-time', this.$el).size()).to.equal(1);
    });
    it('getting around bug in pickatime', function() {
      $('input', this.$el).attr('data-pat-pickadate', '{"time": {"value": "00:00"}}');
      registry.scan(this.$el);
      expect($('.picker__list-item--selected', $('.pattern-pickadate-time', this.$el).parent()).text()).to.equal('12:00 AM');
    });
  });

});
