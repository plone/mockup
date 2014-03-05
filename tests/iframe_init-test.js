define([
  'expect',
  'mockup-iframe_init'
], function(expect) {
  'use strict';


  // ======================================================================= //
  // TESTS HELPERS                                                           //
  // ======================================================================= //

  function createElement(name, resources, content, extra) {

    var el = document.createElement('div');
    el.setAttribute('data-iframe', name);
    el.setAttribute('data-iframe-resources', resources);

    extra = extra || {};
    for (var key in extra) {
      if (extra.hasOwnProperty(key)) {
        el.setAttribute(key, extra[key]);
      }
    }

    el.innerHTML = content;
    document.body.insertBefore(el, document.body.firstChild);

    return el;
  }

  function removeElements(el) {

    if (el.parentNode === undefined) {
      if (el.length !== 0) {
        for (var i = 0; i <= el.length; i += 1) {
          el[0].parentNode.removeChild(el[0]);
        }
      }
    } else {
      el.parentNode.removeChild(el);
    }
  }

  function getElementStyle(el, property) {

    if (typeof el.currentStyle !== 'undefined') {
      if (typeof el.currentStyle.getPropertyValue === 'function') {
        return el.currentStyle.getPropertyValue(property);
      }
      return el.currentStyle[property];
    }

    if (typeof el.ownerDocument.defaultView.getComputedStyle === 'function') {
      return el.ownerDocument.defaultView.getComputedStyle(el,null).
                  getPropertyValue(property);
    }

    return '';
  }

  function onLoad(done, iframes, callable) {

    var iframesLoaded;

    function onLoadInner() {

      if (iframes.loaded !== undefined) {
        iframesLoaded = iframes.loaded;
      } else {
        iframesLoaded = true;
        for (var i = 0; i < iframes.length; i += 1) {
          if (iframesLoaded === false || iframes[i].loaded === false) {
            iframesLoaded = false;
          }
        }
      }

      if (iframesLoaded === true) {
        callable();
        done();
        return;
      }

      window.setTimeout(onLoadInner, 23);
      return;
    }

    onLoadInner();
  }


  // ======================================================================= //
  // TESTS                                                                   //
  // ======================================================================= //

  window.mocha.setup('bdd');

  describe('iframe.js', function() {
    beforeEach(function() {
      this.el = createElement('example',
        '/base/tests/example-resource.js;/base/tests/example-resource.css',
        '<p>example content</p>'
      );
    });
    afterEach(function() {
      removeElements(document.getElementsByTagName('iframe'));
      document.body.removeAttribute('style');

      var all = document.getElementsByTagName('div'),
          el, attr, toRemove = [];
      if (all.length !== 0) {
        for (var i = 0; i < all.length; i += 1) {
          el = all[i];
          attr = el.getAttribute('data-iframe');
          if (attr !== null) {
            removeElements(el);
            i -= 1;
          }
        }
      }
    });
    it('checks html of generated iframe', function(done) {
      window.iframeInitialize();
      onLoad(done, window.iframe.example, function() {
        var iframeEl = window.iframe.example.el,
            iframeDocument = window.iframe.example.document;

        expect(document.getElementsByTagName('iframe').length).to.equal(1);
        expect(iframeDocument.body.childNodes.length).to.equal(3);
        expect(iframeDocument.getElementsByTagName('p').length).to.equal(1);
        expect(iframeDocument.getElementsByTagName('p')[0].innerHTML).to.equal('example content');

        var link = iframeDocument.getElementsByTagName('link')[0];
        expect(iframeDocument.getElementsByTagName('link').length ).to.equal(1);
        expect(link.getAttribute('href') ).to.equal('/base/tests/example-resource.css');
        expect(link.getAttribute('type') ).to.equal('text/css');
        expect(link.getAttribute('rel') ).to.equal('stylesheet');

        var script = iframeDocument.getElementsByTagName('script')[0];
        expect(iframeDocument.getElementsByTagName('script').length ).to.equal(1);
        expect(script.getAttribute('src') ).to.equal('/base/tests/example-resource.js');
        expect(script.getAttribute('type') ).to.equal('text/javascript');

        expect(iframeEl.getAttribute('frameBorder') ).to.equal('0');
        expect(iframeEl.getAttribute('border') ).to.equal('0');
        expect(iframeEl.getAttribute('allowTransparency') ).to.equal('true');
        expect(iframeEl.getAttribute('scrolling') ).to.equal('no');
        expect(iframeEl.getAttribute('id') ).to.equal('example');
        expect(iframeEl.getAttribute('name') ).to.equal('example');
        expect(iframeEl.getAttribute('style').indexOf('height:0px') ).to.equal( -1 );

        expect(window.iframe.example.el ).to.equal(iframeEl);

        // TODO: test updateOption method
        // TODO: test add method
      });
    });
    it('less resources', function(done) {
      expect(document.getElementsByTagName('iframe').length).to.equal(0);
      createElement('example2', '/base/tests/example-resource.less');
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.example2
      ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(2);

        var iframe2Document = window.iframe.example2.document,
            link = iframe2Document.getElementsByTagName('link')[0];

        expect(iframe2Document.getElementsByTagName('link').length).to.equal(1);
        expect(link.getAttribute('href')).to.equal('/base/tests/example-resource.less');
        expect(link.getAttribute('type')).to.equal('text/css');
        expect(link.getAttribute('rel')).to.equal('stylesheet/less');
      });
    });
    it('z-index can be custom', function(done) {
      createElement('example2', '', '', {'data-iframe-zindex': '1000'});
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.example2
      ], function() {
        expect(getElementStyle(window.iframe.example2.el, 'z-index')).to.equal('1000');
      });
    });
    it('height of empty iframe should be 0px', function(done) {
      createElement('example2', '', '');
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.example2
      ], function() {
        expect(getElementStyle(window.iframe.example2.el, 'height')).to.equal('0px');
      });
    });
    it('2 elements gets content into DIFFERENT iframe', function(done) {
      createElement(
        'example3',
        '/base/tests/example-resource.js;/base/tests/example-resource.css',
        '<p>example content</p>'
      );
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.example3
      ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(2);
      });
    });
    it('2 elements gets content into SAME iframe', function(done) {
      createElement(
        'example',
        '/base/tests/example-resource.js;/base/tests/example-resource.css',
        '<p>example content</p>'
      );
      window.iframeInitialize();
      onLoad(done, window.iframe.example, function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(1);
      });
    });
    it('Bottom-aligned iFrame does not add to height', function(done) {
      createElement(
        'exampletop',
        '/base/tests/example-resource.js;/base/tests/example-resource.css',
        '<p>I\'m on top of the world!</p>',
        { 'data-iframe-position': 'top' }
      );
      createElement(
        'examplebottom',
        '/base/tests/example-resource.js;/base/tests/example-resource.css',
        '<p>I\'m.......<br/><br/><br/>Not.</p>',
        { 'data-iframe-position': 'bottom' }
      );
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.exampletop,
        window.iframe.examplebottom
      ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(3);

        //TODO
        expect(window.iframe.exampletop.el.offsetHeight <
               window.iframe.examplebottom.el.offsetHeight).to.equal(true);

        expect(window.iframe.exampletop.el.offsetHeight + 'px')
          .to.equal(getElementStyle(document.body, 'margin-top'));
        expect(window.iframe.examplebottom.el.offsetHeight + 'px')
          .to.equal(getElementStyle(document.body, 'margin-bottom'));
      });
    });
    it('CSS Styles only apply to inner document', function(done) {
      createElement(
        'examplepink', '',
        '<h1>I\'m a pink title</h1>',
        { 'data-iframe-styles': 'h1 { background-color: pink; }' }
      );
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.examplepink
      ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(3);
        expect(getElementStyle(window.iframe.examplepink.document.getElementsByTagName('h1')[0], 'background-color'))
          .to.not.equal(getElementStyle(document.getElementsByTagName('h1')[0], 'background-color'));
      });
    });
    it('extra attributes passed via url', function(done) {
      createElement(
        'example2',
        '/base/tests/example-resource.js?data-main="example";'
      );
      window.iframeInitialize();
      onLoad(done, [
        window.iframe.example,
        window.iframe.example2
      ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(3);
        expect(window.iframe.example2.document.getElementsByTagName('script')[0].getAttribute('data-main')).to.equal('example');
      });
    });
  });

});
