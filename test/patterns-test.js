// tests for modal pattern
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
/*global buster:false, require:false, describe:false, it:false, expect:false,
  before:false */


buster.spec.expose();
require([
  'jquery',
  'jam/Patterns/src/registry',
  'js/patterns/autotoc',
  'js/patterns/datetime',
  'js/patterns/toggle'
], function($, registry, AutoTOC, DateTime, Toggle) {
  "use strict";

  describe("AutoTOC", function () {
    before(function() {
      this.$el = $('' +
        '<div class="pat-autotoc">' +
        ' <div>' +
        '   <h1>Title 1</h1>' +
        '   <h1>Title 2</h1>' +
        '   <h2>Title 2.1</h2>' +
        '   <h2>Title 2.3</h2>' +
        '   <h2>Title 2.4</h2>' +
        '   <h1>Title 3</h1>' +
        '   <h2>Title 3.1</h2>' +
        '   <h3>Title 3.1.1</h3>' +
        '   <h4>Title 3.1.1.1</h4>' +
        '   <h1>Title 4</h1>' +
        ' </div>' +
        '</div>');
    });
    it("by default creates TOC from h1/h2/h3", function() {
      expect($('> nav', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).toEqual(1);
      expect($('> nav > a', this.$el).size()).toEqual(9);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).toEqual(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).toEqual(4);
      expect($('> nav > a.autotoc-level-3', this.$el).size()).toEqual(1);
      expect($('> nav > a.autotoc-level-4', this.$el).size()).toEqual(0);
    });
    it("can be used as jQuery plugin as well", function () {
      expect($('> nav', this.$el).size()).toEqual(0);
      this.$el.patAutotoc();
      expect($('> nav', this.$el).size()).toEqual(1);
    });
    it("can have custom levels", function() {
      this.$el.attr('data-pat-autotoc', 'levels:h1');
      expect($('> nav', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).toEqual(1);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).toEqual(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).toEqual(0);
    });
  });

  describe("Toggle", function() {
    before(function() {
      this.$el = $('' +
        '<div>' +
        ' <a class="pat-toggle"' +
        '    data-pat-toggle="target:#target;value:toggled;">Button</a>' +
        ' <div id="target"></div>' +
        '</div>');
    });
    it("by default toggles on click event", function() {
      expect($('.toggled', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).toEqual(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).toEqual(1);
    });
    it("can also listen to custom event", function() {
      $('.pat-toggle', this.$el).attr('data-pat-toggle',
        $('.pat-toggle', this.$el).attr('data-pat-toggle') + 'event:customEvent;');
      expect($('.toggled', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).toEqual(0);
      $('.pat-toggle', this.$el).trigger('customEvent');
      expect($('.toggled', this.$el).size()).toEqual(1);
    });
    it("can also toggle custom element attribute", function() {
      $('.pat-toggle', this.$el).attr('data-pat-toggle',
        $('.pat-toggle', this.$el).attr('data-pat-toggle') + 'attribute:rel;');
      expect($('.toggled', this.$el).size()).toEqual(0);
      expect($('[rel="toggled"]', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('[rel="toggled"]', this.$el).size()).toEqual(0);
      expect($('.toggled', this.$el).size()).toEqual(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).toEqual(0);
      expect($('[rel="toggled"]', this.$el).size()).toEqual(1);
    });
  });

  describe("DateTime", function() {
    before(function() {
      this.$el = $('' +
        '<div>' +
        ' <input class="pat-datetime" data-pat-toggle="" />' +
        '</div>');
    });
    it('creates initial structure', function() {
      expect($('.pat-datetime-wrapper', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('.pat-datetime-wrapper', this.$el).size()).toEqual(1);
      expect($('.pat-datetime-wrapper select', this.$el).size()).toEqual(8);
      expect($('.pat-datetime-wrapper .pickadate__holder select', this.$el).size()).toEqual(2);
    });
    it('doesn not work on anything else then "input" elements', function() {
      var $el = $('' +
        '<div>' +
        ' <a class="pat-datetime" data-pat-toggle="" />' +
        '</div>');
      expect($('.pat-datetime-wrapper', $el).size()).toEqual(0);
      registry.scan($el);
      expect($('.pat-datetime-wrapper', $el).size()).toEqual(0);
    });
  });

  buster.run();

});
