// tests for moment
//
// @author Nathan Van Gheem
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
  'mockup-patterns-moment'
], function(chai, $, registry, Moment) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Moment
  ========================== */

  describe("Moment", function () {
    beforeEach(function() {
    });
    it("test parse relative", function() {
      var date = new Date();
      date.setMinutes(date.getMinutes() + 2);
      var $el = $('<div class="pat-moment"' +
        'data-pat-moment="format:relative">' + date + '</div>');
      registry.scan($el);
      expect($el.html()).to.equal('in 2 minutes');
    });
    it("test parse calendar", function() {
      var $el = $('<div class="pat-moment"' +
        'data-pat-moment="format:calendar">2012-10-02 14:30</div>');
      registry.scan($el);
      expect($el.html()).to.equal('10/02/2012');
    });
    it("test parse custom", function() {
      var $el = $('<div class="pat-moment"' +
        'data-pat-moment="format:YYYY">2012-10-02 14:30</div>');
      registry.scan($el);
      expect($el.html()).to.equal('2012');
    });
    it("test parse custom", function() {
      var $el = $('<div class="pat-moment" data-pat-moment="format:YYYY;selector:*">' +
        '<div>2012-10-02 14:30</div>' +
      '</div>');
      registry.scan($el);
      expect($el.find('div').html()).to.equal('2012');
    });
    it("test parse no date", function() {
      var $el = $('<div class="pat-moment" data-pat-moment="format:calendar">' +
        '<div></div>' +
      '</div>');
      registry.scan($el);
      expect($el.find('div').html()).to.equal('');
    });

  });
});
