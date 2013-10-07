// tests for tree
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
  'mockup-patterns-tree'
], function(chai, $, registry, Tree) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  describe("Tree", function() {
    beforeEach(function() {
    });
    afterEach(function() {
    });
    it("loads the tree with data", function() {
      var $el = $('<div class="pat-tree"/>').appendTo('body');
      var tree = new Tree($el, {
        autoOpen: true,
        data: [
          {"label": "node1",
          "children": [{
            "label": "child1"
            },{
            "label": "child2"
            }]
          },{
          "label": "node2",
          "children": [{
            "label": "child3"
            }]
          }]
      });
      expect(tree.$el.find('ul').length).to.be.equal(3);
    });
    it("load string of json", function() {
      var $el = $('<div class="pat-tree"/>').appendTo('body');
      var tree = new Tree($el, {
        autoOpen: true,
        data: '[' +
          '{"label": "node1",' +
          '"children": [{' +
            '"label": "child1"' +
            '},{' +
            '"label": "child2"' +
            '}]' +
          '}]'
      });
      expect(tree.$el.find('ul').length).to.be.equal(2);
    });

  });

});
