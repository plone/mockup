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
  'mockup-patterns-preventdoublesubmit'
], function(chai, $, registry, PreventDoubleSubmit) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: PreventDoubleSubmit
  ========================== */

  describe("PreventDoubleSubmit", function() {
    beforeEach(function() {
      var self = this;
      // mock up `_confirm` func
      self._old_confirm = PreventDoubleSubmit.prototype._confirm;
      PreventDoubleSubmit.prototype._confirm = function() {
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
        '</form>').on('submit', function(e) { e.preventDefault(); });
      registry.scan($el);

      var guardKlass = 'submitting';
      var optOutKlass = 'allowMultiSubmit';
      var get_confirmed = function(el) {
        return el.data('pattern-preventdoublesubmit').confirmed;
      };
      var reset_confirmed = function(el) {
        el.data('pattern-preventdoublesubmit').confirmed = undefined;
      };

      var $b1 = $('#b1', $el);
      var $b2 = $('#b2', $el);

      expect(get_confirmed($el)).to.be.equal(undefined);
      $b1.trigger('click');
      expect(get_confirmed($el)).to.be.equal(undefined);
      expect($b1.hasClass(guardKlass)).to.be.equal(true);
      $b1.trigger('click');
      expect(get_confirmed($el)).to.be.equal(true);

      // reset confirmed flag
      reset_confirmed($el);

      $b2.trigger('click');
      expect($b2.hasClass(guardKlass)).to.be.equal(true);
      expect(get_confirmed($el)).to.be.equal(undefined);

    });
  });

});
