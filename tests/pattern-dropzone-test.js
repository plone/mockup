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
      it('required url data option', function() {
        $('.pat-dropzone', this.$el).removeAttr('data-pat-dropzone');
        // TODO: checking throw error does not work
        //expect(registry.scan(this.$el)).to.throw(new Error('No URL provided'));
      });
      it('change klass data option', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; klass: drop-zone');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('drop-zone')).to.be.equal(true);
      });
      it('update clickable data option to true', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; clickable: true');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dz-clickable')).to.be.equal(true);
      });
      it('update clickable data option to false', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; clickable: false');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dz-clickable')).to.be.equal(false);
      });
      it('update wrap data option to true', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; wrap: true');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).parent().hasClass('dropzone')).to.be.equal(true);
        expect($('.pat-dropzone', this.$el).parent().hasClass('tinymce-dropzone-container')).to.be.equal(true);
        var dzNotice = $('.pat-dropzone', this.$el).next();
        expect($(dzNotice).size()).to.equal(1);
        expect($(dzNotice).hasClass('dz-notice')).to.be.equal(true);
        expect($('p', dzNotice).size()).to.equal(1);
        expect($('p', dzNotice).html()).to.equal('Drop files here...');
        var dzPreviews = $(dzNotice).next();
        expect($(dzPreviews).size()).to.equal(1);
        expect($(dzPreviews).hasClass('dropzone-previews')).to.be.equal(true);
        expect($(dzPreviews).html()).to.be.equal('');
        var dzMessage = $(dzPreviews).next();
        expect($(dzMessage).size()).to.equal(1);
        expect($(dzMessage).hasClass('dz-message')).to.be.equal(true);
        expect($(dzMessage).hasClass('dz-default')).to.be.equal(true);
        expect($('span', dzMessage).size()).to.equal(1);
        expect($('span', dzMessage).html()).to.equal('Drop files here to upload');
      });
      it('update wrap data option to inner', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; wrap: inner');
        registry.scan(this.$el);
        var dzChildren = $('.pat-dropzone', this.$el).children();
        expect($(dzChildren).hasClass('dropzone')).to.be.equal(true);
        expect($(dzChildren).hasClass('tinymce-dropzone-container')).to.be.equal(true);
        expect($('.dz-notice', dzChildren).size()).to.equal(1);
        expect($('.dz-notice p', dzChildren).size()).to.equal(1);
        expect($('.dz-notice p', dzChildren).html()).to.equal('Drop files here...');
        expect($('.dropzone-previews', dzChildren).size()).to.equal(1);
        expect($('.dropzone-previews', dzChildren).html()).to.be.equal('');
        expect($('.dz-default', dzChildren).size()).to.equal(1);
        expect($('.dz-message', dzChildren).size()).to.equal(1);
        expect($('.dz-message', dzChildren).hasClass('dz-default')).to.be.equal(true);
        expect($('.dz-default span', dzChildren).size()).to.equal(1);
        expect($('.dz-default span', dzChildren).html()).to.equal('Drop files here to upload');
      });
      it('update autoCleanResults data option to true', function() {
        var attr = $('.pat-dropzone', this.$el).attr('data-pat-dropzone');
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', attr + '; autoCleanResults: true');
        registry.scan(this.$el);
        //TODO
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
      it('default action url', function() {
        $('.pat-dropzone', this.$el).removeAttr('action');
        registry.scan(this.$el);
        //TODO
      });
      it('change klass data option', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'klass: drop-zone');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('drop-zone')).to.be.equal(true);
      });
      it('update clickable data option to true', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'clickable: true');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dz-clickable')).to.be.equal(true);
      });
      it('update clickable data option to false', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'clickable: false');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).hasClass('dz-clickable')).to.be.equal(false);
      });
      it('update wrap data option to true', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'wrap: true');
        registry.scan(this.$el);
        expect($('.pat-dropzone', this.$el).parent().hasClass('dropzone')).to.be.equal(true);
        expect($('.pat-dropzone', this.$el).parent().hasClass('tinymce-dropzone-container')).to.be.equal(true);
        var dzNotice = $('.pat-dropzone', this.$el).next();
        expect($(dzNotice).size()).to.equal(1);
        expect($(dzNotice).hasClass('dz-notice')).to.be.equal(true);
        expect($('p', dzNotice).size()).to.equal(1);
        expect($('p', dzNotice).html()).to.equal('Drop files here...');
        var dzPreviews = $(dzNotice).next();
        expect($(dzPreviews).size()).to.equal(1);
        expect($(dzPreviews).hasClass('dropzone-previews')).to.be.equal(true);
        expect($(dzPreviews).html()).to.be.equal('');
        var dzMessage = $(dzPreviews).next();
        expect($(dzMessage).size()).to.equal(1);
        expect($(dzMessage).hasClass('dz-message')).to.be.equal(true);
        expect($(dzMessage).hasClass('dz-default')).to.be.equal(true);
        expect($('span', dzMessage).size()).to.equal(1);
        expect($('span', dzMessage).html()).to.equal('Drop files here to upload');
      });
      it('update wrap data option to inner', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'wrap: inner');
        registry.scan(this.$el);
        var dzChildren = $('.pat-dropzone', this.$el).children();
        expect($(dzChildren).hasClass('dropzone')).to.be.equal(true);
        expect($(dzChildren).hasClass('tinymce-dropzone-container')).to.be.equal(true);
        expect($('.dz-notice', dzChildren).size()).to.equal(1);
        expect($('.dz-notice p', dzChildren).size()).to.equal(1);
        expect($('.dz-notice p', dzChildren).html()).to.equal('Drop files here...');
        expect($('.dropzone-previews', dzChildren).size()).to.equal(1);
        expect($('.dropzone-previews', dzChildren).html()).to.be.equal('');
        expect($('.dz-default', dzChildren).size()).to.equal(1);
        expect($('.dz-message', dzChildren).size()).to.equal(1);
        expect($('.dz-message', dzChildren).hasClass('dz-default')).to.be.equal(true);
        expect($('.dz-default span', dzChildren).size()).to.equal(1);
        expect($('.dz-default span', dzChildren).html()).to.equal('Drop files here to upload');
      });
      it('update autoCleanResults data option to true', function() {
        $('.pat-dropzone', this.$el).attr('data-pat-dropzone', 'autoCleanResults: true');
        registry.scan(this.$el);
        //TODO
      });
      //TODO dropzone complete event, i think we need robot test?
    });

  });
});
