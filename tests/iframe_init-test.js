// tests for iframe.js script.
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global buster:false, jQuery:false, createElement:false, removeElements:false,
  onLoad:false, getElementStyle: false, getElementsByAttribute:false,
  define:false, describe:false, it:false, beforeEach:false, afterEach:false */

define([
  'chai',
  'mockup-iframe_init'
], function(chai) {
  "use strict";


  // ======================================================================= //
  // TESTS HELPERS                                                           //
  // ======================================================================= //

  function createElement(name, resources, content, extra) {

    var el = document.createElement("div");
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

    return "";
  }

  function onLoad(done, iframes, callable) {

    var iframes_loaded;

    function onLoadInner() {

      if (iframes.loaded !== undefined) {
        iframes_loaded = iframes.loaded;
      } else {
        iframes_loaded = true;
        for (var i = 0; i < iframes.length; i += 1) {
          if (iframes_loaded === false || iframes[i].loaded === false) {
            iframes_loaded = false;
          }
        }
      }

      if (iframes_loaded === true) {
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

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');

  describe("iframe.js", function() {
    beforeEach(function() {
      this.el = createElement('example',
          '/base/tests/example-resource.js;/base/tests/example-resource.css',
          '<p>example content</p>');
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
    it("checks html of generated iframe", function(done) {
      window.iframe_initialize();
      onLoad(done, window.iframe.example, function() {
        var iframe_el = window.iframe.example.el,
            iframe_doc = window.iframe.example.document;

        expect(document.getElementsByTagName('iframe').length).to.equal(1);
        expect(iframe_doc.body.childNodes.length).to.equal(3);
        expect(iframe_doc.getElementsByTagName('p').length).to.equal(1);
        expect(iframe_doc.getElementsByTagName('p')[0].innerHTML).to.equal('example content');

        var link = iframe_doc.getElementsByTagName('link')[0];
        expect(iframe_doc.getElementsByTagName('link').length ).to.equal(1);
        expect(link.getAttribute('href') ).to.equal('/base/tests/example-resource.css');
        expect(link.getAttribute('type') ).to.equal('text/css');
        expect(link.getAttribute('rel') ).to.equal('stylesheet');

        var script = iframe_doc.getElementsByTagName('script')[0];
        expect(iframe_doc.getElementsByTagName('script').length ).to.equal(1);
        expect(script.getAttribute('src') ).to.equal('/base/tests/example-resource.js');
        expect(script.getAttribute('type') ).to.equal('text/javascript');

        expect(iframe_el.getAttribute('frameBorder') ).to.equal('0');
        expect(iframe_el.getAttribute('border') ).to.equal('0');
        expect(iframe_el.getAttribute('allowTransparency') ).to.equal('true');
        expect(iframe_el.getAttribute('scrolling') ).to.equal('no');
        expect(iframe_el.getAttribute('id') ).to.equal('example');
        expect(iframe_el.getAttribute('name') ).to.equal('example');
        expect(iframe_el.getAttribute('style').indexOf('height:0px') ).to.equal(-1);

        expect(window.iframe.example.el ).to.equal(iframe_el);

        // TODO: test updateOption method
        // TODO: test add method
      });
    });
    it("less resources", function(done) {
      expect(document.getElementsByTagName('iframe').length).to.equal(0);
      createElement('example2', '/base/tests/example-resource.less');
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example2 ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(2);

        var iframe2_doc = window.iframe.example2.document,
            link = iframe2_doc.getElementsByTagName('link')[0];

        expect(iframe2_doc.getElementsByTagName('link').length).to.equal(1);
        expect(link.getAttribute('href')).to.equal('/base/tests/example-resource.less');
        expect(link.getAttribute('type')).to.equal('text/css');
        expect(link.getAttribute('rel')).to.equal('stylesheet/less');
      });
    });
    it("z-index can be custom", function(done) {
      createElement('example2', '', '', {'data-iframe-zindex': '1000'});
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example2 ], function() {
        expect(getElementStyle(window.iframe.example2.el, 'z-index')).to.equal('1000');
      });
    });
    it("height of empty iframe should be 0px", function(done) {
      createElement('example2', '', '');
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example2 ], function() {
        expect(getElementStyle(window.iframe.example2.el, 'height')).to.equal('0px');
      });
    });
    it("2 elements gets content into DIFFERENT iframe", function(done) {
      createElement('example3',
          '/base/tests/example-resource.js;/base/tests/example-resource.css',
              '<p>example content</p>');
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example3 ], function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(2);
      });
    });
    it("2 elements gets content into SAME iframe", function(done) {
      createElement('example',
          '/base/tests/example-resource.js;/base/tests/example-resource.css',
              '<p>example content</p>');
      window.iframe_initialize();
      onLoad(done, window.iframe.example, function() {
        expect(document.getElementsByTagName('iframe').length).to.equal(1);
      });
    });
    it("Bottom-aligned iFrame does not add to height", function(done) {
      createElement('example_top',
          '/base/tests/example-resource.js;/base/tests/example-resource.css',
              "<p>I'm on top of the world!</p>",
              { 'data-iframe-position': 'top' });
      createElement('example_bottom',
          '/base/tests/example-resource.js;/base/tests/example-resource.css',
              "<p>I'm.......<br/><br/><br/>Not.</p>",
              { 'data-iframe-position': 'bottom' });
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example_top,
          window.iframe.example_bottom ], function() {

        expect(document.getElementsByTagName('iframe').length).to.equal(3);

        //TODO
        expect(window.iframe.example_top.el.offsetHeight <
               window.iframe.example_bottom.el.offsetHeight).to.equal(true);

        expect(window.iframe.example_top.el.offsetHeight + 'px').to.equal(
            getElementStyle(document.body, 'margin-top'));
        expect(window.iframe.example_bottom.el.offsetHeight + 'px').to.equal(
            getElementStyle(document.body, 'margin-bottom'));

      });
    });
    it("CSS Styles only apply to inner document", function(done) {
      createElement('example_pink', '',
              "<h1>I'm a pink title</h1>",
              { 'data-iframe-styles': 'h1 { background-color: pink; }' });
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example_pink ], function() {

        expect(document.getElementsByTagName('iframe').length).to.equal(3);

        expect(
          getElementStyle(window.iframe.example_pink.document.getElementsByTagName('h1')[0], 'background-color')).to.not.equal(
          getElementStyle(document.getElementsByTagName('h1')[0], 'background-color')
          );

      });
    });
    it("extra attributes passed via url", function(done) {
      createElement('example2',
          '/base/tests/example-resource.js?data-main="example";');
      window.iframe_initialize();
      onLoad(done, [
          window.iframe.example,
          window.iframe.example2 ], function() {

        expect(document.getElementsByTagName('iframe').length).to.equal(3);

        expect(window.iframe.example2.document
                  .getElementsByTagName('script')[0]
                  .getAttribute('data-main')).to.equal('example');
      });
    });
  });

});
