define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-structure',
  'sinon',
  'mockup-fakeserver'
], function(expect, $, registry, Structure, sinon) {
  "use strict";

  window.mocha.setup('bdd');
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

    //it('initialize', function() {
    //  registry.scan(this.$el);
    //  expect(this.$el.find('.order-support > table').size()).to.equal(1);
    //});
  });
});
