// tests for utils
//
// @author David Erni
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

/*global define:false, describe:false, it:false, expect:false */

define([
  'chai',
  'jquery',
  'mockup-utils'
], function(chai, $, utils) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  describe("utils", function () {
    
    describe('setId', function() {
      
      it("by default uses 'id' as prefix", function() {
        var $el = $('<div>'),
            id = utils.setId($el);
        expect(id).to.not.be.an('undefined');
        expect(id).to.be.a('string');
        expect(id).to.satisfy(function (val) {
          return val.indexOf('id') === 0;
        });
      });

      it("can use a custom prefix", function() {
        var $el = $('<div>'),
            id = utils.setId($el, 'myprefix');
        expect(id).to.satisfy(function (val) {
          return val.indexOf('myprefix') === 0;
        });
      });

      it("updates the id of an element with no id", function() {
        var $el = $('<div>'),
            id;
        utils.setId($el);
        id = $el.attr('id');
        expect(id).to.not.be.an('undefined');
        expect(id).to.be.a('string');
        expect(id).to.contain('id');
      });

      it("replaces dots in ids with dashes", function() {
        var $el = $('<div id="something.with.dots"></div>'),
            id = utils.setId($el);
        id = $el.attr('id');
        expect(id).to.equal('something-with-dots');
      });
    });

    describe('parseBodyTag', function() {

      it("parses the body tag's content from a response", function() {
        var response = '<body><p>foo</p></body>',
            html = utils.parseBodyTag(response);
        expect(html).to.equal('<p>foo</p>');
      });
      
      it("returns an empty string for responses with an empty body", function() {
        var response = '<body></body>',
            html = utils.parseBodyTag(response);
        expect(html).to.equal('');
      });
      
      it("fails for empty responses", function() {
        var response = '',
            fn = function () {utils.parseBodyTag(response);};
        expect(fn).to.throw(TypeError);
      });

      it("fails for responses without a body tag", function() {
        var response = '<div>qux</div>',
            fn = function () {utils.parseBodyTag(response);};
        expect(fn).to.throw(TypeError);
      });

    });
    
    describe('bool', function() {
      
      it("returns true for 'true'", function() {
        expect(utils.bool('true')).to.be.true;
        expect(utils.bool(' true ')).to.be.true;
        expect(utils.bool('TRUE')).to.be.true;
        expect(utils.bool('True')).to.be.true;
      });
      
      it("returns true for true", function() {
        var val = utils.bool(true);
        expect(val).to.be.true;
      });

      it("returns true for true", function() {
        var val = utils.bool(1);
        expect(val).to.be.true;
      });
      
      it("returns false for strings != 'true'", function() {
        expect(utils.bool('1')).to.be.false;
        expect(utils.bool('')).to.be.false;
        expect(utils.bool('false')).to.be.false;
      });
      
      it("returns false for undefined/null", function() {
        expect(utils.bool(undefined)).to.be.false;
        expect(utils.bool(null)).to.be.false;
      });
    });

  });

});
