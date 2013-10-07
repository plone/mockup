// tests for Base
//
// @author Nathan Van Gheem
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
//  'mockup-patterns-structure',
//  'sinon',
], function(chai, $, registry, Structure, sinon) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

   /* ==========================
   TEST: Select2
  ========================== */
/*
  describe("Structure", function() {
    beforeEach(function(){
      var results = [
        {"UID": "jasdlfdlkdkjasdf", "Title": "Some Image", "path": "/test.png", "Type": "Image"},
        {"UID": "asdlfkjasdlfkjasdf", "Title": "News", "path": "/news", "Type": "Folder"},
        {"UID": "124asdfasasdaf34", "Title": "About", "path": "/about", "Type": "Folder"},
        {"UID": "asdf1234", "Title": "Projects", "path": "/projects", "Type": "Folder"},
      ];
      var addSomeData = function(list){
        for(var i=0; i<list.length; i=i+1){
          var data = list[i];
          data.getURL = window.location.origin + data.path;
          data.review_state = 'published';
          data.CreationDate = 'January 1, 2012';
          data.ModificationDate = 'January 2, 2012';
          data.EffectiveDate = 'January 3, 2012';
          data.Subject = ['one', 'two'];
          if(data.Type === 'Folder'){
            data.is_folderish = true;
          }else{
            data.is_folderish = false;
          }
        }
      };
      addSomeData(results);
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;
      this.server.respondWith(/relateditems-test.json/, function (xhr, id) {
        xhr.respond(200, { "Content-Type": "application/json" },
          JSON.stringify({
            "total": results.length,
            "results": results
          })
        );
      });
    });

    it('initialize', function() {
      var $el = $('' +
        '<div class="pat-structure" ' +
             'data-pat-structure="ajaxVocabulary:/relateditems-test.json;' +
                                 'uploadUrl:/upload;' +
                                 'moveUrl:/moveitem;' +
                                 'tagsAjaxVocabulary:/select2-test.json;">' +
        '</div>');
      registry.scan($el);
      expect($el.find('.order-support > table').size()).to.equal(1);
    });
  });
*/
});

