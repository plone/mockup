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
  onLoad:false, getElementStyle: false, getElementsByAttribute:false */


(function(undefined) {
"use strict";

var testCase = buster.testCase,
    assert = buster.assert;


testCase("iframe.js", {

  setUp: function() {
    this.timeout = 5000;
    this.el = createElement('example',
        'test/example-resource.js;test/example-resource.css',
        '<p>example content</p>');
  },

  tearDown: function() {
    removeElements(document.getElementsByTagName('iframe'));
    document.body.removeAttribute('style');

    var all = document.getElementsByTagName('div'),
        el, attr, toRemove = [];
    if (all.length !== 0) {
      for (var i = 0; i < all.length; i += 1) {
        el = all[i];
        attr = el.getAttribute('data-iframe');
        if (attr !== undefined) {
          removeElements(el);
          i -= 1;
        }
      }
    }
  },

  //  --- tests --- //

  "check html of generated iframe": function(done) {
    window.iframe_initialize();
    onLoad(done, window.iframe.example, function() {
      var iframe_el = window.iframe.example.el,
          iframe_doc = window.iframe.example.document;

      assert(document.getElementsByTagName('iframe').length === 1);

      assert(iframe_doc.body.childNodes.length === 3);
      assert(iframe_doc.getElementsByTagName('p').length === 1);
      assert(iframe_doc.getElementsByTagName('p')[0].innerHTML === 'example content');

      var link = iframe_doc.getElementsByTagName('link')[0];
      assert(iframe_doc.getElementsByTagName('link').length === 1);
      assert(link.getAttribute('href') === 'test/example-resource.css');
      assert(link.getAttribute('type') === 'text/css');
      assert(link.getAttribute('rel') === 'stylesheet');

      var script = iframe_doc.getElementsByTagName('script')[0];
      assert(iframe_doc.getElementsByTagName('script').length === 1);
      assert(script.getAttribute('src') === 'test/example-resource.js');
      assert(script.getAttribute('type') === 'text/javascript');

      assert(iframe_el.getAttribute('frameBorder') === '0');
      assert(iframe_el.getAttribute('border') === '0');
      assert(iframe_el.getAttribute('allowTransparency') === 'true');
      assert(iframe_el.getAttribute('scrolling') === 'no');
      assert(iframe_el.getAttribute('id') === 'example');
      assert(iframe_el.getAttribute('name') === 'example');
      assert(iframe_el.getAttribute('style').indexOf('height:0px') === -1);

      assert(window.iframe.example.el === iframe_el);

      // TODO: test updateOption method
      // TODO: test add method
    });
  },

  "less resources": function(done) {
    assert(document.getElementsByTagName('iframe').length === 0);
    createElement('example2', 'test/example-resource.less');
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example2 ], function() {
      assert(document.getElementsByTagName('iframe').length === 2);

      var iframe2_doc = window.iframe.example2.document,
          link = iframe2_doc.getElementsByTagName('link')[0];

      assert(iframe2_doc.getElementsByTagName('link').length === 1);
      assert(link.getAttribute('href') === 'test/example-resource.less');
      assert(link.getAttribute('type') === 'text/css');
      assert(link.getAttribute('rel') === 'stylesheet/less');
    });
  },

  "height of empty iframe should be 0px": function(done) {
    createElement('example2', '', '');
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example2 ], function() {
      assert(getElementStyle(window.iframe.example2.el, 'height') === '0px');
    });
  },

  "2 elements gets content into DIFFERENT iframe": function(done) {
    createElement('example3',
        'test/example-resource.js;test/example-resource.css',
            '<p>example content</p>');
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example3 ], function() {
      assert(document.getElementsByTagName('iframe').length === 2);
    });
  },

  "2 elements gets content into SAME iframe": function(done) {
    createElement('example',
        'test/example-resource.js;test/example-resource.css',
            '<p>example content</p>');
    window.iframe_initialize();
    onLoad(done, window.iframe.example, function() {
      assert(document.getElementsByTagName('iframe').length === 1);
    });
  },

  "Bottom-aligned iFrame does not add to height": function(done) {
    createElement('example_top',
        'test/example-resource.js;test/example-resource.css',
            "<p>I'm on top of the world!</p>",
            { 'data-iframe-position': 'top' });
    createElement('example_bottom',
        'test/example-resource.js;test/example-resource.css',
            "<p>I'm.......<br/><br/><br/>Not.</p>",
            { 'data-iframe-position': 'bottom' });
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example_top,
        window.iframe.example_bottom ], function() {

      assert(document.getElementsByTagName('iframe').length === 3);

      assert(window.iframe.example_top.el.offsetHeight <
             window.iframe.example_bottom.el.offsetHeight);

      assert(window.iframe.example_top.el.offsetHeight + 'px' ===
          getElementStyle(document.body, 'margin-top'));
      assert(window.iframe.example_bottom.el.offsetHeight + 'px' ===
          getElementStyle(document.body, 'margin-bottom'));

    });
  },

  "CSS Styles only apply to inner document": function(done) {
    createElement('example_pink', '',
            "<h1>I'm a pink title</h1>",
            { 'data-iframe-styles': 'h1 { background-color: pink; }' });
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example_pink ], function() {

      if (document.getElementsByTagName('iframe').length === 3) {
        var iframes = document.getElementsByTagName('iframe');
      }
      assert(document.getElementsByTagName('iframe').length === 2);

      assert(
        getElementStyle(window.iframe.example_pink.document.getElementsByTagName('h1')[0], 'background-color') !==
        getElementStyle(document.getElementsByTagName('h1')[0], 'background-color')
        );

    });
  },

  "extra attributes passed via url": function(done) {
    createElement('example2',
        'test/example-resource.js?data-main="example";');
    window.iframe_initialize();
    onLoad(done, [
        window.iframe.example,
        window.iframe.example2 ], function() {

      assert(document.getElementsByTagName('iframe').length === 2);

      assert(window.iframe.example2.document
                .getElementsByTagName('script')[0]
                .getAttribute('data-main') === 'example');
    });
  }

});

}());
