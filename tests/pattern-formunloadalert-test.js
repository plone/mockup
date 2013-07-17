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
  beforeEach:false, afterEach:false */

define([
  'chai',
  'jquery',
  'mockup-registry',
  'mockup-patterns-formunloadalert'
], function(chai, $, registry, FormUnloadAlert) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

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

});
