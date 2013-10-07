// tests for tooltip
//
// @author lpmayos
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
  'mockup-patterns-tooltip'
], function(chai, $, registry, ToolTip) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Tooltip
  ========================== */

  describe("Tooltip", function () {

    beforeEach(function() {
      this.$el = $('' +
        '<div><p href=".example-class" class="pat-tooltip">'+
        '  Hover over this line to see a tooltip'+
        '</p>'+
        '<p class="tooltips example-class">'+
        '  Setting the .example-class in the href makes this show up'+
        '</p></div>');
    });

    afterEach(function() {
        this.$el.remove();
    });

    it("tooltip appears and disappears", function() {
        registry.scan(this.$el);

        var trs;

        $('.pat-tooltip', this.$el).trigger('mouseenter.tooltip.patterns');
        trs = this.$el.find('.example-class');
        expect(trs.eq(0).hasClass('active')).to.be.equal(true);

        $('.pat-tooltip', this.$el).trigger('mouseleave.tooltip.patterns');
        trs = this.$el.find('.example-class');
        expect(trs.eq(0).hasClass('active')).to.be.equal(false);

    });

  });
});
