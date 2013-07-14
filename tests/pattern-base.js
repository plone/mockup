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
  'js/base'
], function(chai, $, sinon, registry, Base) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  describe("Base", function () {
    beforeEach(function() {
      this._patterns = $.extend({}, registry.patterns);
    });
    afterEach(function() {
      registry.patterns = this._patterns;
    });
    it("read options from dom tree", function() {
      var $el = $('' +
        '<div data-pat-example="{&quot;name1&quot;: &quot;value1&quot;,' +
        '    &quot;name2&quot;: &quot;value2&quot;}">' +
        ' <div class="pat-example"' +
        '      data-pat-example="name2: something;' +
        '                        some-thing-name4: value4;' +
        '                        some-stuff: value5"/>' +
        '</div>');

      Base.extend({
        name: "example",
        defaults: {
          name3: 'value3'
        },
        init: function() {
          expect(this.options.name1).to.equal('value1');
          expect(this.options.name2).to.equal('something');
          expect(this.options.name3).to.equal('value3');
          expect(this.options.some.thing.name4).to.equal('value4');
          expect(this.options.some.stuff).to.equal('value5');
        }
      });

      registry.scan($el, true);
    });
    // TODO: make sure that pattern is not initialized twice if scanned twice
  });

});