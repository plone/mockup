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
  'tinymce',
  'mockup-patterns-tinymce'
], function(chai, $, registry, tinymce, TinyMCE) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

   /* ==========================
   TEST: TinyMCE
  ========================== */

  describe("TinyMCE", function() {
    afterEach(function(){
      $('body').empty();
    });

    it('creates tinymce', function(){
      var $el = $(
       '<div>' +
       '  <textarea class="pat-tinymce">' +
       '  </textarea>' +
       '</div>').appendTo('body');
      registry.scan($el);
      expect($el.children().length).to.be.gt(1);
      tinymce.get(0).remove();
    });

    it('maintains an initial textarea value', function(){
      var $el = $(
       '<div>' +
       '  <textarea class="pat-tinymce">' +
       '    foobar' +
       '  </textarea>' +
       '</div>').appendTo('body');
      registry.scan($el);
      expect(tinymce.get(0).getContent()).to.be.equal('<p>foobar</p>');
    });

    it('loads buttons for plugins', function() {
      var $el = $(
       '<div>' +
       '  <textarea class="pat-tinymce">' +
       '  </textarea>' +
       '</div>').appendTo('body');
      registry.scan($el);
      expect(tinymce.get(0).buttons).to.contain.keys('plonelink', 'ploneimage');
    });

    it('on form submit, save data to form', function(){
      var $container = $(
       '<form>' +
       '  <textarea class="pat-tinymce">' +
       '  </textarea>' +
       '</form>').appendTo('body');

      var $el = $container.find('textarea');
      var tinymce = new TinyMCE($el);
      tinymce.tiny.setContent('<p>foobar</p>');
      $container.submit(function(e){
        e.preventDefault();
      });
      $container.trigger('submit');

      expect($el.val()).to.equal('<p>foobar</p>');
    });

    it('auto adds image on upload', function(){
      var $el = $(
       '<textarea class="pat-tinymce">' +
       '</textarea>').appendTo('body');

      var tinymce = new TinyMCE($el);

      tinymce.fileUploaded({
        filename: 'foobar.png',
        uid: 'foobar'
      });
      expect(tinymce.tiny.getContent()).to.contain('resolveuid/foobar');

    });
    it('auto adds link on file upload', function(){
      var $el = $(
       '<textarea class="pat-tinymce">' +
       '</textarea>').appendTo('body');

      var tinymce = new TinyMCE($el);

      tinymce.fileUploaded({
        filename: 'foobar.txt',
        uid: 'foobar'
      });
      expect(tinymce.tiny.getContent()).to.contain('foobar.txt</a>');

    });

  });

});

