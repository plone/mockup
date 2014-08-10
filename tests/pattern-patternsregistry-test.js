define([
  'sinon',
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-patternsregistry'
], function(sinon, expect, $, registry) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

  describe('Patterns registry', function() {
    beforeEach(function() {
      var testData = {
        registry: [{
          name: "plone", url: "js/bundles", js: "plone.js", css: [],
          css_deps: [], deps: "", export: "", conf: "", bundle: true,
          condition: "", enabled: true, skinnames: []
        }, {
          name: "modal", url: "patterns/modal", js: "pattern.js", css: [],
          css_deps: [], deps: "", export: "", conf: "", bundle: false,
          condition: "", enabled: true, skinnames: []
        }, {
          name: "autotoc", url: "patterns/autotoc", js: "pattern.js", css: [],
          css_deps: [], deps: "", export: "", conf: "", bundle: false,
          condition: "", enabled: true, skinnames: []
        }],
        bundleOrder: ["plone"],
        overrides: ["patterns/autotoc/pattern.js"],
        baseUrl: "/patterns-resources",
        overrideManageUrl: "/pattern-override-manager",
        saveUrl: "/"
      };
      this.$el = $('' +
        '<div>' +
        '  <div class="pat-patternsregistry "' +
        "    data-pat-patternsregistry='" + JSON.stringify(testData) + "'>" +
        '  </div>' +
        '</div>');

      registry.scan(this.$el);
      this.$pat =  this.$el.find('.pat-patternsregistry');
      this.pat = this.$pat.data('pattern-patternsregistry');
    });
    afterEach(function() {
      this.$el.remove();
    });

    it('loads', function() {
      expect(this.$el.find('ul.bundles li').length).to.equal(2);
      expect(this.$el.find('ul.patterns li').length).to.equal(3);
    });

    it('searches', function(){
      this.pat.tabs.showOverrides = true;
      this.pat.tabs.hideShow();
      this.$el.find('.search-field').attr('value', 'pattern');
      this.pat.tabs.overridesView.textChange();
      expect(this.$el.find('.search-results li').length).to.equal(3);
    });

    it('customize resource', function(){
      this.pat.tabs.showOverrides = true;
      this.pat.tabs.hideShow();
      this.$el.find('.search-field').attr('value', 'pattern');
      this.pat.tabs.overridesView.textChange();
      this.$el.find('.search-results li:last button').trigger('click');
      expect(this.pat.options.overrides.length).to.equal(2);
    });
  });

});