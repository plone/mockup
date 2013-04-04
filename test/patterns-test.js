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
/*global buster:false, define:false, describe:false, it:false, expect:false,
  beforeEach:false, afterEach:false */


define([
  'jam/chai/chai.js',
  'jquery',
  'jam/Patterns/src/registry',
  'js/patterns/base',
  'js/patterns/autotoc',
  'js/patterns/backdrop',
  'js/patterns/datetime',
  'js/patterns/expose',
  'js/patterns/modal',
  'js/patterns/select2',
  'js/patterns/toggle',
  'js/patterns/formhelpers'
], function(chai, $, registry, 
      Base, AutoTOC, Backdrop,
      DateTime, Expose, Modal,
      Select2, Toggle, FormHelpers) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');

  // TODO: test default options and jquery integration

  describe("Base", function () {
    beforeEach(function() {
      this._patterns = $.extend({}, registry.patterns);
    });
    afterEach(function() {
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
          expect(this.options.name1).to.equal('value1');
          expect(this.options.name2).to.equal('something');
          expect(this.options.name3).to.equal('value3');
          expect(this.options.some.name4).to.equal('value4');
        }
      });

      registry.scan($el, true);
    });
    // TODO: make sure that pattern is not initialized twice if scanned twice
  });

  /* ==========================
   TEST: AutoTOC
  ========================== */

  describe("AutoTOC", function () {
    beforeEach(function() {
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
      expect($('> nav', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(1);
      expect($('> nav > a', this.$el).size()).to.equal(9);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-3', this.$el).size()).to.equal(1);
      expect($('> nav > a.autotoc-level-4', this.$el).size()).to.equal(0);
    });
    it("can be used as jQuery plugin as well", function () {
      expect($('> nav', this.$el).size()).to.equal(0);
      this.$el.patAutotoc();
      expect($('> nav', this.$el).size()).to.equal(1);
    });
    it("can have custom levels", function() {
      this.$el.attr('data-autotoc-levels', 'h1');
      expect($('> nav', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('> nav', this.$el).size()).to.equal(1);
      expect($('> nav > a.autotoc-level-1', this.$el).size()).to.equal(4);
      expect($('> nav > a.autotoc-level-2', this.$el).size()).to.equal(0);
    });
  });

  /* ==========================
   TEST: Backdrop
  ========================== */

  describe("Backdrop", function() {
    it("default behaviour", function() {
      var $el = $('<div></div>'),
          backdrop = new Backdrop($el);
      expect($('.backdrop', $el).size()).to.equal(1);
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      backdrop.hide();
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      backdrop.$backdrop.trigger('click');
      expect($el.hasClass('backdrop-active')).to.equal(false);
      backdrop.show();
      expect($el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 50;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(true);
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(false);
    });
  });

  /* ==========================
   TEST: DateTime
  ========================== */

  describe("DateTime", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div>' +
        ' <input class="pat-datetime" />' +
        '</div>');
    });
    it('creates initial structure', function() {
      expect($('.pat-datetime-wrapper', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.pat-datetime-wrapper', this.$el).size()).to.equal(1);
      expect($('.pat-datetime-wrapper select', this.$el).size()).to.equal(8);
      expect($('.pat-datetime-wrapper .pickadate__holder select', this.$el).size()).to.equal(2);
    });
    it('doesn not work on anything else then "input" elements', function() {
      var $el = $('' +
        '<div>' +
        ' <a class="pat-datetime" />' +
        '</div>');
      expect($('.pat-datetime-wrapper', $el).size()).to.equal(0);
      registry.scan($el);
      expect($('.pat-datetime-wrapper', $el).size()).to.equal(0);
    });
  });

  /* ==========================
   TEST: Expose
  ========================== */

  describe("Expose", function() {
    it("default behaivour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <form class="pat-expose" data-expose-backdrop="#body">' +
        '  <input value="" />' +
        ' </form>' +
        '</div>');
      registry.scan($el);
      expect($('.backdrop', $el).size()).to.equal(1);
      expect($el.hasClass('backdrop-active')).to.equal(false);
      $('input', $el).focus();
      expect($('form', $el).css('z-index')).to.equal('1001');
      expect($el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.equal(false);
    });
  });

  /* ==========================
   TEST: Modal
  ========================== */

  describe("Modal", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-modal-backdrop="#body">Open</a>' +
        ' <div id="target">Target</div>' +
        '</div>').appendTo('body');
    });
    afterEach(function() {
      this.$el.remove();
    });
    it("default behaivour", function() {
      registry.scan(this.$el);
      expect($('.modal-wrapper', this.$el).size()).to.equal(1);
      expect($('.modal', this.$el).size()).to.equal(0);
      expect($('.backdrop', this.$el).size()).to.equal(1);
      expect(this.$el.hasClass('backdrop-active')).to.equal(false);
      $('a.pat-modal', this.$el).click();
      expect($('.modal', this.$el).size()).to.equal(1);
      expect(this.$el.hasClass('backdrop-active')).to.equal(true);
      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect(this.$el.hasClass('backdrop-active')).to.equal(false);
      expect($('.modal', this.$el).size()).to.equal(0);
    });
    it("modal with custom template", function() {
      $('a', this.$el).modal().on('show.modal.patterns', function(e, modal) {
        var contents = modal.$modal.html();
        modal.$modal
          .html('')
          .append($('<div class="modal-header"><h3>Title</h3></div>'))
          .append($('<div class="modal-body"></div>'))
          .append($('<div class="modal-footer"></div>'));
        $('.modal-body', modal.$modal).html(contents);
      }).click();
      expect($('.modal', this.$el).size()).to.equal(1);
      expect($('.modal .modal-header', this.$el).size()).to.equal(1);
      expect($('.modal .modal-body', this.$el).size()).to.equal(1);
      expect($('.modal .modal-footer', this.$el).size()).to.equal(1);
    });
  });

  /* ==========================
   TEST: Select2
  ========================== */

  describe("Select2", function() {
    it('tagging', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-select2" data-select2-tags="Red,Yelow,Blue"' +
        '      value="Yellow" />' +
        '</div>');
      expect($('.select2-choices', $el).size()).to.equal(0);
      registry.scan($el);
      expect($('.select2-choices', $el).size()).to.equal(1);
      expect($('.select2-choices li', $el).size()).to.equal(2);
    });
  });

  /* ==========================
   TEST: Toggle
  ========================== */

  describe("Toggle", function() {
    beforeEach(function() {
      this.$el = $('' +
        '<div>' +
        ' <a class="pat-toggle"' +
        '    data-toggle-target="#target"' +
        '    data-toggle-value="toggled">Button</a>' +
        ' <div id="target"></div>' +
        '</div>');
    });
    it("by default toggles on click event", function() {
      expect($('.toggled', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).to.equal(1);
    });
    it("can also listen to custom event", function() {
      $('.pat-toggle', this.$el).attr('data-toggle-event', 'customEvent');
      expect($('.toggled', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('customEvent');
      expect($('.toggled', this.$el).size()).to.equal(1);
    });
    it("can also toggle custom element attribute", function() {
      $('.pat-toggle', this.$el).attr('data-toggle-attribute', 'rel');
      expect($('.toggled', this.$el).size()).to.equal(0);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(0);
      registry.scan(this.$el);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(0);
      expect($('.toggled', this.$el).size()).to.equal(0);
      $('.pat-toggle', this.$el).trigger('click');
      expect($('.toggled', this.$el).size()).to.equal(0);
      expect($('[rel="toggled"]', this.$el).size()).to.equal(1);
    });
  });

  describe("FormHelpers", function() {
    beforeEach(function() {
      // mock up `_confirm` func
      this._old_confirm = FormHelpers.prototype._confirm;
      FormHelpers.prototype._confirm = function(){
        this.confirmed = true;
      };
    });
    afterEach(function() {
      FormHelpers.prototype._confirm = this._old_confirm;
    });
    it('prevent form to be submitted twice', function() {
      var $el = $('' +
        '<form id="helped" class="pat-formhelpers">' +
        ' <input type="text" value="Yellow" />' +
        ' <input type="submit" class="aclass" value="Submit" />' +
        '</form>');
      registry.scan($el);

      var get_confirmed = function(el){
        return el.data('pattern-formhelpers-0').confirmed;
      };
      expect(get_confirmed($el)).to.be.undefined;
      $('input:submit', $el).trigger('click');
      expect(get_confirmed($el)).to.be.undefined;
      $('input[type="text"]', $el).trigger('keyup');
      expect($el.hasClass('formhelpers-submitting')).to.be.true;
      // XXX 2013-04-04: for some reason click on the button 
      // do not trigger 'submit' on the form. So we need to 
      // manually fire 'submit' on the form itself
      // $('input:submit', $el).trigger('click');
      $el.trigger('submit');
      expect(get_confirmed($el)).to.be.true;
    });
  });

});
