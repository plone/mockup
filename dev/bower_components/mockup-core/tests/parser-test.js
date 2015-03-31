// Tests for the Mockup parser
define([
  'expect',
  'sinon',
  'jquery',
  'mockup-parser',
], function(expect, sinon, $, parser) {
  'use strict';
  window.mocha.setup('bdd');
  describe('The Mockup parser', function () {
    it("can read pattern configuraion options from the DOM", function() {
      var $el = $('' +
        '<div data-pat-example="{&quot;name1&quot;: &quot;value1&quot;,' +
        '    &quot;name2&quot;: &quot;value2&quot;}">' +
        ' <div class="pat-example"' +
        '      data-pat-example="name2: something;' +
        '                        some-thing-name4: value4;' +
        '                        some-stuff: value5"/>' +
        '</div>');

      var options = parser.getOptions(
        $('.pat-example', $el),
        'example',
        { name3: 'value3'}
      );
      expect(options.name1).to.equal('value1');
      expect(options.name2).to.equal('something');
      expect(options.name3).to.equal('value3');
      expect(options['some-thing-name4']).to.equal('value4');
      expect(options['some-stuff']).to.equal('value5');
    });
  });
});
