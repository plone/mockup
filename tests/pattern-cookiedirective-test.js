define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-cookiedirective'
], function(expect, $, registry, CookieDirective) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: CookieDirective
  ========================== */

  describe('CookieDirective', function () {
    beforeEach(function() {
      $.removeCookie('Allow_Cookies_For_Site');
      $.removeCookie('_cookiesEnabled');
      this.$el = $('' +
        '<div class="pat-cookiedirective"' +
        '     data-pat-cookiedirective="shouldAsk: true;' +
        '                               shouldEnable: true;">' +
        '  <div class="login"></div>' +
        '</div>');
    });
    it('test ask permission shows', function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(1);
    });
    it('test ask permission can be hidden', function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      this.$el.attr('data-pat-cookiedirective', 'shouldAsk: false');
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it('test ask permission don\'t show if replied yes', function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      $.cookie('Allow_Cookies_For_Site', 1);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it('test ask permission don\'t show if replied no', function() {
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      $.cookie('Allow_Cookies_For_Site', 0);
      registry.scan(this.$el);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
    });
    it('test ask permission allow button', function() {
      var cookie = $.cookie('Allow_Cookies_For_Site');
      if (cookie === null) {
        cookie = undefined;
      }
      expect(cookie).to.be.equal(undefined);
      registry.scan(this.$el);
      this.$el.find('.cookieallowbutton').trigger('click');
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.equal('1');
      expect(this.$el.find('.cookiedirective').is(':hidden')).to.be.equal(true);
    });
    it('test ask permission deny button', function() {
      var cookie = $.cookie('Allow_Cookies_For_Site');
      if (cookie === null) {
        cookie = undefined;
      }
      expect(cookie).to.be.equal(undefined);
      registry.scan(this.$el);
      this.$el.find('.cookiedenybutton').trigger('click');
      expect($.cookie('Allow_Cookies_For_Site'), this.$el).to.equal('0');
      expect(this.$el.find('.cookiedirective').is(':hidden')).to.be.equal(true);
    });
    it('test ask permission customizable', function() {
      this.$el.attr('data-pat-cookiedirective',
        'askPermissionMsg: Test askPermissionMsg;' +
        'allowMsg: Test allowMsg;' +
        'denyMsg: Test denyMsg'
      );
      registry.scan(this.$el);
      expect(this.$el.find('.cookiemsg').text()).to.equal('Test askPermissionMsg');
      expect(this.$el.find('.cookieallowbutton').text()).to.equal('Test allowMsg');
      expect(this.$el.find('.cookiedenybutton').text()).to.equal('Test denyMsg');

    });
    it('test enable cookies shows', function() {
      // Override the cookie function with something that returns undefined
      $.__oldCookie = $.cookie;
      $.cookie = function() { return undefined; };
      this.$el.attr('data-pat-cookiedirective', 'shouldAsk: false');
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(1);
      // Restore cookie function
      $.cookie = $.__oldCookie;
    });
    it('test enable cookies can be hidden', function() {
      // Override the cookie function with something that returns undefined
      $.__oldCookie = $.cookie;
      $.cookie = function() { return undefined; };
      this.$el.attr('data-pat-cookiedirective', 'shouldAsk: false; shouldEnable: false');
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      // Restore cookie function
      $.cookie = $.__oldCookie;
    });
    it('show enable cookies and ask permission', function() {
      // Override the cookie function with something that returns undefined
      $.__oldCookie = $.cookie;
      $.cookie = function() { return undefined; };
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      expect(this.$el.find('.cookiedirective').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(1);
      expect(this.$el.find('.cookiedirective').size()).to.equal(1);
      // Restore cookie function
      $.cookie = $.__oldCookie;
    });
    it('test enable cookies shouldn\'t show if selector is not found', function() {
      // Override the cookie function with something that returns undefined
      $.__oldCookie = $.cookie;
      $.cookie = function() { return undefined; };
      this.$el.attr('data-pat-cookiedirective', 'shouldEnableSelector: .another-login; denyMsg: Test denyMsg');
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookies').size()).to.equal(0);
      // Restore cookie function
      $.cookie = $.__oldCookie;
    });
    it('show enable cookies message customizable', function() {
      // Override the cookie function with something that returns undefined
      $.__oldCookie = $.cookie;
      $.cookie = function() { return undefined; };
      this.$el.attr('data-pat-cookiedirective', 'shouldEnableMsg: Test shouldEnableMsg');
      registry.scan(this.$el);
      expect(this.$el.find('.shouldenablecookiesmsg').text()).to.equal('Test shouldEnableMsg');
      // Restore cookie function
      $.cookie = $.__oldCookie;
    });
  });

});
