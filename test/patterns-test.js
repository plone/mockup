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
  before:false, after:false */


buster.spec.expose();
require([
  'jquery',
  'jam/Patterns/src/registry',
  'js/patterns/base',
  'js/patterns/autotoc',
  'js/patterns/backdrop',
  'js/patterns/datetime',
  'js/patterns/expose',
  'js/patterns/modal',
  'js/patterns/select2',
  'js/patterns/toggle'
], function($, registry, Base, AutoTOC, Backdrop, DateTime, Expose, Modal,
      Select2, Toggle) {
  "use strict";

  // TODO: test default options and jquery integration

  describe("Base", function () {
    before(function() {
      this._patterns = $.extend({}, registry.patterns);
    });
    after(function() {
      registry.patterns = this._patterns;
    });
    it("read options from dom tree", function() {
      var $el = $('' +
        '<div data-example="{&quot;name1&quot;: &quot;value1&quot;,' +
        '    &quot;name2&quot;: &quot;value2&quot;}">' +
        ' <div class="pat-example"' +
        '      data-example-name2="something"' +
        '      data-example-some-name4="value4"></div>' +
        '</div>');

      Base.extend({
        name: "example",
        defaults: {
          name3: 'value3'
        },
        init: function() {
          expect(this.options.name1).toEqual('value1');
          expect(this.options.name2).toEqual('something');
          expect(this.options.name3).toEqual('value3');
          expect(this.options.some.name4).toEqual('value4');
        }
      });

      registry.scan($el);
    });
    // TODO: make sure that pattern is not initialized twice if scanned twice
  });

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
      this.$el.attr('data-autotoc-levels', 'h1');
      expect($('> nav', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).toEqual(1);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).toEqual(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).toEqual(0);
    });
  });

  describe("Backdrop", function() {
    it("default behaivour", function() {
      var $el = $('<div></div>'),
          backdrop = new Backdrop($el);
      expect($('.backdrop', $el).size()).toEqual(1);
      expect($el.hasClass('backdrop-active')).toBeFalse();
      backdrop.show();
      expect($el.hasClass('backdrop-active')).toBeTrue();
      backdrop.hide();
      expect($el.hasClass('backdrop-active')).toBeFalse();
      backdrop.show();
      expect($el.hasClass('backdrop-active')).toBeTrue();
      backdrop.$backdrop.trigger('click');
      expect($el.hasClass('backdrop-active')).toBeFalse();
      backdrop.show();
      expect($el.hasClass('backdrop-active')).toBeTrue();
      var keydown = $.Event("keydown");
      keydown.keyCode = 50;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).toBeTrue();
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).toBeFalse();
    });
  });

  describe("DateTime", function() {
    before(function() {
      this.$el = $('' +
        '<div>' +
        ' <input class="pat-datetime" />' +
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
        ' <a class="pat-datetime" />' +
        '</div>');
      expect($('.pat-datetime-wrapper', $el).size()).toEqual(0);
      registry.scan($el);
      expect($('.pat-datetime-wrapper', $el).size()).toEqual(0);
    });
  });

  describe("Expose", function() {
    it("default behaivour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <form class="pat-expose" data-expose-backdrop="#body">' +
        '  <input value="" />' +
        ' </form>' +
        '</div>');
      registry.scan($el);
      expect($('.backdrop', $el).size()).toEqual(1);
      expect($el.hasClass('backdrop-active')).toBeFalse();
      $('input', $el).focus();
      expect($('form', $el).css('z-index')).toEqual('1001');
      expect($el.hasClass('backdrop-active')).toBeTrue();
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).toBeFalse();
    });
  });

  describe("Modal", function() {
    it("default behaivour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-modal-backdrop="#body">Open</a>' +
        ' <div id="target">Target</div>' +
        '</div>');
      registry.scan($el);
      expect($('.modal-wrapper', $el).size()).toEqual(1);
      expect($('.modal', $el).size()).toEqual(0);
      expect($('.backdrop', $el).size()).toEqual(1);
      expect($el.hasClass('backdrop-active')).toBeFalse();
      $('a.pat-modal', $el).click();
      expect($('.modal', $el).size()).toEqual(1);
      expect($el.hasClass('backdrop-active')).toBeTrue();
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).toBeFalse();
      expect($('.modal', $el).size()).toEqual(0);
    });
    it("modal with custom template", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a href="#target"' +
        '    data-modal-backdrop="#body">Open</a>' +
        ' <div id="target"> Target </div>' +
        '</div>');

      $('a', $el).modal().on('show.modal.patterns', function(e, modal) {
        var contents = modal.$modal.html();
        modal.$modal
          .html('')
          .append($('<div class="modal-header"><h3>Title</h3></div>'))
          .append($('<div class="modal-body"></div>'))
          .append($('<div class="modal-footer"></div>'));
        $('.modal-body', modal.$modal).html(contents);
      }).click();

      expect($('.modal', $el).size()).toEqual(1);
      expect($('.modal .modal-header', $el).size()).toEqual(1);
      expect($('.modal .modal-body', $el).size()).toEqual(1);
      expect($('.modal .modal-footer', $el).size()).toEqual(1);

    });
  });

  describe("Select2", function() {
    it('tagging', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-select2" data-select2-tags="Red,Yelow,Blue"' +
        '      value="Yellow" />' +
        '</div>');
      expect($('.select2-choices', $el).size()).toEqual(0);
      registry.scan($el);
      expect($('.select2-choices', $el).size()).toEqual(1);
      expect($('.select2-choices li', $el).size()).toEqual(2);
    });
  });

  describe("Toggle", function() {
    before(function() {
      this.$el = $('' +
        '<div>' +
        ' <a class="pat-toggle"' +
        '    data-toggle-target="#target"' +
        '    data-toggle-value="toggled">Button</a>' +
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
      $('.pat-toggle', this.$el).attr('data-toggle-event', 'customEvent');
      expect($('.toggled', this.$el).size()).toEqual(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).toEqual(0);
      $('.pat-toggle', this.$el).trigger('customEvent');
      expect($('.toggled', this.$el).size()).toEqual(1);
    });
    it("can also toggle custom element attribute", function() {
      $('.pat-toggle', this.$el).attr('data-toggle-attribute', 'rel');
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

  buster.run();

});
