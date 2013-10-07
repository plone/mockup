// tests for Router
//
// @author Ryan Foster
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
  'mockup-router',
  'backbone'
], function(chai, $, Router, Backbone) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  Router.start();

  describe("Router", function () {

    beforeEach(function() {
      var self = this;
      Router._change_location = function(path, hash) {
        self.routerPath = path + '#' + hash;
      };
    });

    afterEach(function() {
      this.routerPath = undefined;
    });

    it("routes and calls back", function() {
      var foo = {
        set: false
      };

      var callback = function() {
        this.set = true;
      };

      Router.addRoute('test', 'foo', callback, foo, '');
      Router.navigate("test:foo", {trigger: true});

      expect(foo.set).to.equal(true);
    });

    it("redirects from added action", function() {
      var foo = {
        set: false
      };

      var callback = function() {
        this.set = true;
      };

      expect(this.routerPath).to.equal(undefined);
      Router.addRoute('test', 'foo', callback, foo, '/');
      Router.redirect();

      expect(this.routerPath).to.equal('#!/test:foo');

      Router.reset();
    });

    it("basic redirect", function() {

      Router.addRedirect('/', 'test:two');
      Router.redirect();

      expect(this.routerPath).to.equal('#!/test:two');

      Router.reset();
    });

  });

});
