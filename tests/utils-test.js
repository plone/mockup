define([
  'expect',
  'jquery',
  'mockup-utils'
], function(expect, $, utils) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;

  describe("utils", function () {

    describe('setId', function() {

      it("by default uses 'id' as prefix", function() {
        var $el = $('<div>'),
            id = utils.setId($el);
        expect(id).to.not.be.an('undefined');
        expect(id).to.be.a('string');
        expect(id.indexOf('id')).to.be(0);
      });

      it("can use a custom prefix", function() {
        var $el = $('<div>'),
            id = utils.setId($el, 'myprefix');
        expect(id.indexOf('myprefix')).to.be(0);
      });

      it("updates the id of an element with no id", function() {
        var $el = $('<div>'),
            id;
        utils.setId($el);
        id = $el.attr('id');
        expect(id).to.not.be.an('undefined');
        expect(id).to.be.a('string');
        expect(id).to.contain('id');
      });

      it("replaces dots in ids with dashes", function() {
        var $el = $('<div id="something.with.dots"></div>'),
            id = utils.setId($el);
        id = $el.attr('id');
        expect(id).to.equal('something-with-dots');
      });
    });

    describe('parseBodyTag', function() {

      it("parses the body tag's content from a response", function() {
        var response = '<body><p>foo</p></body>',
            html = utils.parseBodyTag(response);
        expect(html).to.equal('<p>foo</p>');
      });

      it("returns an empty string for responses with an empty body", function() {
        var response = '<body></body>',
            html = utils.parseBodyTag(response);
        expect(html).to.equal('');
      });

      it("fails for empty responses", function() {
        var response = '',
            fn = function () {utils.parseBodyTag(response);};
        expect(fn).to.throwException(TypeError);
      });

      it("fails for responses without a body tag", function() {
        var response = '<div>qux</div>',
            fn = function () {utils.parseBodyTag(response);};
        expect(fn).to.throwException(TypeError);
      });

    });

    describe('bool', function() {

      it("returns true for 'true'", function() {
        expect(utils.bool('true')).to.be.equal(true);
        expect(utils.bool(' true ')).to.be.equal(true);
        expect(utils.bool('TRUE')).to.be.equal(true);
        expect(utils.bool('True')).to.be.equal(true);
      });

      it("returns true for true", function() {
        var val = utils.bool(true);
        expect(val).to.be.equal(true);
      });

      it("returns true for true", function() {
        var val = utils.bool(1);
        expect(val).to.be.equal(true);
      });

      it("returns false for strings != 'true'", function() {
        expect(utils.bool('1')).to.be.equal(false);
        expect(utils.bool('')).to.be.equal(false);
        expect(utils.bool('false')).to.be.equal(false);
      });

      it("returns false for undefined/null", function() {
        expect(utils.bool(undefined)).to.be.equal(false);
        expect(utils.bool(null)).to.be.equal(false);
      });
    });

  });

});
