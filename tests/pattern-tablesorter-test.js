// tests for table sorter
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
  './../js/patterns/tablesorter.js'
], function(chai, $, registry, Tablesorter) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: TableSorter
  ========================== */

  describe("TableSorter", function () {
    beforeEach(function() {
      this.$el = $('' +
        '<table class="pat-tablesorter">'+
        '   <thead>'+
        '     <tr>'+
        '       <th>First Name</th>'+
        '       <th>Last Name</th>'+
        '       <th>Number</th>'+
        '     </tr>'+
        '   </thead>'+
        '   <tbody>'+
        '     <tr>'+
        '       <td>AAA</td>'+
        '       <td>ZZZ</td>'+
        '       <td>3</td>'+
        '     </tr>'+
        '     <tr>'+
        '       <td>BBB</td>'+
        '       <td>YYY</td>'+
        '       <td>1</td>'+
        '     </tr>'+
        '     <tr>'+
        '       <td>CCC</td>'+
        '       <td>XXX</td>'+
        '       <td>2</td>'+
        '     </tr>'+
        '   </tbody>'+
        ' </table>');
    });
    it("test headers have the sort arrow", function() {
      registry.scan(this.$el);
      expect(this.$el.find('.sortdirection').size()).to.equal(3);
    });
    it("test sort by second column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(1).trigger("click");

      var should_be = ["CCC", "BBB", "AAA"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
    it("test sort by third column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger("click");

      var should_be = ["BBB", "CCC", "AAA"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
    it("test several sorts and finally back to first column", function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger("click");
      this.$el.find('thead th').eq(3).trigger("click");
      this.$el.find('thead th').eq(2).trigger("click");
      this.$el.find('thead th').eq(1).trigger("click");
      this.$el.find('thead th').eq(3).trigger("click");
      this.$el.find('thead th').eq(1).trigger("click");

      var should_be = ["AAA", "BBB", "CCC"];
      var elem;
      for (var i=0;i<should_be.length;i++){
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i*3);
        expect(elem.text()).to.equal(should_be[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.true;
      expect(trs.eq(1).hasClass('odd')).to.be.false;
      expect(trs.eq(2).hasClass('odd')).to.be.true;
      expect(trs.eq(0).hasClass('even')).to.be.false;
      expect(trs.eq(1).hasClass('even')).to.be.true;
      expect(trs.eq(2).hasClass('even')).to.be.false;

    });
  });
});
