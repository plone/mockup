define([
  'expect',
  'jquery',
  'mockup-i18n',
  'sinon'
], function(expect, $, i18n, sinon) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

  describe('i18n', function () {

    describe('configure', function() {

      it('ttl', function() {
        i18n.configure({ ttl: 10 });
        expect(i18n.ttl).to.be(10);
      });
      it('baseUrl', function() {
        i18n.configure({ baseUrl: '/something' });
        expect(i18n.baseUrl).to.be('/something');
        i18n.configure({ baseUrl: '/jsi18n' });
      });
    });

    describe('getUrl', function() {

      it('correct params', function() {
        i18n.configure({ baseUrl: '/foobar' });
        expect(i18n.getUrl('foobar', 'es')).to.be('/foobar?domain=foobar&language=es');
        i18n.configure({ baseUrl: '/jsi18n' });
      });
    });

    describe('MessageFactory', function() {
      it('loads default message if no catalog', function() {
        var _ = i18n.MessageFactory('foobar');
        expect(_('foobar')).to.be('foobar');
      });

      it('loads from stored catalog', function() {
        i18n.configure({
          currentLanguage: 'en',
          catalogs: {
            foobar: {
              en: {
                'foo': 'bar'
              }
            }
          }
        });
        var _ = i18n.MessageFactory('foobar');
        expect(_('foo')).to.be('bar');
        i18n.configure({
          catalogs: {},
          currentLanguage: null
        });

      });

      it('loads from server', function() {
        var server = sinon.fakeServer.create();
        server.autoRespond = true;
        var clock = sinon.useFakeTimers();

        server.respondWith('GET', /jsi18n/, function (xhr) {
          xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
            foo: 'bar',
          }));
        });
        i18n.configure({
          currentLanguage: 'en',
          baseUrl: '/jsi18n'
        });
        i18n.loadCatalog('foobar');
        clock.tick(500);
        var _ = i18n.MessageFactory('foobar');
        expect(_('foo')).to.be('bar');
        server.restore();
      });
    });

  });

});
