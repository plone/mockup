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
  'mockup-patterns-structure',
  'sinon',
  'mockup-fakeserver'
], function(chai, $, registry, Structure, sinon) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

   /* ==========================
   TEST: Structure
  ========================== */
  describe("Structure", function() {
    beforeEach(function(){
      this.$el = $('' +
        '<div class="pat-structure" ' +
             'data-pat-structure="vocabularyUrl:/relateditems-test.json;' +
                                 'uploadUrl:/upload;' +
                                 'moveUrl:/moveitem;' +
                                 'tagsVocabularyUrl:/select2-test.json;' +
                                 'usersVocabularyUrl:/tests/json/users.json;' +
                                 'indexOptionsUrl:/tests/json/queryStringCriteria.json;' +
                                 'contextInfoUrl:/tests/json/contextInfo.json;' +
                                 ' ">' +
        '</div>');
    });

    it('initialize', function() {
      registry.scan(this.$el);
      expect(this.$el.find('.order-support > table').size()).to.equal(1);
    });
  });
});
