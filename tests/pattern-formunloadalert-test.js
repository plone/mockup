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
    it('prevent unload of form with changes', function(done) {
      registry.scan(this.$el);

      // current instance of the pattern
      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      expect(pattern._changed).to.be.equal(false);

      $select.trigger('change');
      expect(pattern._changed).to.be.equal(true);

      $('a', this.$el)
        .on('click', function(e){
          var returnedString = pattern._handle_unload(pattern, e);
          var returnValue = e.returnValue;
          if (e.returnValue === undefined) {
            // If we are testing in a Safari based browser, e.g. PhantomJS
            // then e.returnValue is not set, it just reads the string for
            // dialog message
            returnValue = returnedString;
          }
          expect(returnValue).to.equal(pattern.options.message);
          // Need to stop the propagation of this event otherwise
          // we get stuck in a loop.
          e.stopPropagation();
          done();
        });
      $('a', this.$el).trigger('click');
    });
    it('do not show message if submitting', function(done) {
      registry.scan(this.$el);

      // current instance of the pattern
      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      expect(pattern._changed).to.be.equal(false);

      $select.trigger('change');
      expect(pattern._changed).to.be.equal(true);

      $(this.$el).on('submit', function(e){
        var returnedString = pattern._handle_unload(pattern, e);
        var returnValue = e.returnValue;
        if (e.returnValue === undefined) {
            // If we are testing in a Safari based browser, e.g. PhantomJS
            // then e.returnValue is not set, it just reads the string for
            // dialog message
            returnValue = returnedString;
        }
        expect(returnValue).to.not.equal(pattern.options.message);
        // Need to prevent action from doing it's default thing otherwise
        // we get stuck in a loop.
        e.preventDefault();
        done();
      });
      $(this.$el).trigger('submit');
    });
    it('shows the right message on beforeunload event', function(done){
      registry.scan(this.$el);
      var returnValue = "";
      // current instance of the pattern
      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      // Override the _handle_msg of the pattern as we need to
      // get the msg string out somehow, and there's no way to
      // do this that I can find after triggering beforeunload

      pattern._handle_msg = function(e, msg) {
        // Set the msg into a variable that we can actually read
        returnValue = msg;
      };

      expect(pattern._changed).to.be.equal(false);
      $select.trigger('change');
      expect(pattern._changed).to.be.equal(true);

      $(window)
        .on('messageset.formunloadalert.patterns', function(){
        expect(returnValue).to.equal(pattern.options.message);
        done();
      });
      // Trigger the beforeunload event
      $(window).trigger('beforeunload');
    });
    it("doesn't interfere if there's no form", function() {
      this.$el = $('' +
        '<div class="pat-formunloadalert">' +
        ' <select name="aselect">' +
        '    <option value="1">1</option>' +
        '    <option value="2">2</option>' +
        '</select>' +
        '<input id="b1" type="submit" value="Submit" />' +
        '<a href="patterns.html">Click here to go somewhere else</a>' +
        '</div>');
      registry.scan(this.$el);

      var pattern = this.$el.data('pattern-formunloadalert-0');
      var $select = $('select', this.$el);

      expect(pattern._changed).to.be.equal(false);
      $select.trigger('change');
      // This should make no differnce, as there was no form so
      // the pattern should have exited.
      expect(pattern._changed).to.be.equal(false);
    });
  });

});
