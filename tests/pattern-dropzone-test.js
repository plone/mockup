// tests for Dropzone
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
  'mockup-registry',
  'mockup-patterns-dropzone'
], function(chai, $, registry, Dropzone) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: Dropzone
  ========================== */

  describe("Dropzone", function () {
    describe("Div", function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <div class="pat-dropzone"' +
          '    data-pat-dropzone="url: /upload">' +
          '  </div>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });
      it('default attributes', function() {
        expect($('.pat-dropzone', this.$el).hasClass('dropzone')).to.be.equal(false);
        expect($('.dz-notice', this.$el).size()).to.equal(0);
        expect($('.dropzone-previews', this.$el).size()).to.equal(0);
        expect($('.dz-default', this.$el).size()).to.equal(0);
        expect($('.dz-message', this.$el).size()).to.equal(0);
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dropzone')).to.be.equal(true);
        expect($('.dz-notice', this.$el).size()).to.equal(1);
        expect($('.dz-notice p', this.$el).size()).to.equal(1);
        expect($('.dz-notice p', this.$el).html()).to.equal('Drop files here...');
        expect($('.dropzone-previews', this.$el).size()).to.equal(1);
        expect($('.dropzone-previews', this.$el).html()).to.be.equal('');
        expect($('.dz-default', this.$el).size()).to.equal(1);
        expect($('.dz-message', this.$el).size()).to.equal(1);
        expect($('.dz-message', this.$el).hasClass('dz-default')).to.be.equal(true);
        expect($('.dz-default span', this.$el).size()).to.equal(1);
        expect($('.dz-default span', this.$el).html()).to.equal('Drop files here to upload');
      });
    });
    
    describe("Form", function () {
      beforeEach(function() {
        this.$el = $('' +
          '<div>' +
          '  <form method="post"' +
          '    action="/upload"' +
          '    enctype="multipart/form-data"' +
          '    class="pat-dropzone">' +
          '  </form>' +
          '</div>');
      });
      afterEach(function() {
        this.$el.remove();
      });
      it('default attributes', function() {
        expect($('.pat-dropzone', this.$el).hasClass('dropzone')).to.be.equal(false);
        expect($('.dz-notice', this.$el).size()).to.equal(0);
        expect($('.dropzone-previews', this.$el).size()).to.equal(0);
        expect($('.dz-default', this.$el).size()).to.equal(0);
        expect($('.dz-message', this.$el).size()).to.equal(0);
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dropzone')).to.be.equal(true);
        expect($('.dz-notice', this.$el).size()).to.equal(1);
        expect($('.dz-notice p', this.$el).size()).to.equal(1);
        expect($('.dz-notice p', this.$el).html()).to.equal('Drop files here...');
        expect($('.dropzone-previews', this.$el).size()).to.equal(1);
        expect($('.dropzone-previews', this.$el).html()).to.be.equal('');
        expect($('.dz-default', this.$el).size()).to.equal(1);
        expect($('.dz-message', this.$el).size()).to.equal(1);
        expect($('.dz-message', this.$el).hasClass('dz-default')).to.be.equal(true);
        expect($('.dz-default span', this.$el).size()).to.equal(1);
        expect($('.dz-default span', this.$el).html()).to.equal('Drop files here to upload');
      });
    });

  });
});
