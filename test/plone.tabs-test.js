// tests for plone.tabs.js script.
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
/*global buster:false, jQuery:false, */

(function($, undefined) {
"use strict";

var testCase = buster.testCase,
    assert = buster.assert;


testCase("plone.tabs.js", {

  setUp: function() {
  },

  tearDown: function() {
    $('.modal-backdrop').remove();
  },

  //  --- tests --- //

  "generate tabs": function() {
    var el = $('' +
          '<div class="modal-backdrop">' +
          ' <div class="modal-wrapper">' +
          '  <div class="modal">' +
          '   <div class="content">' +
          '    <fieldset id="tab1">' +
          '      <legend>Tab1</legend>' +
          '      <p>Tab1 content</p>' +
          '    </fieldset>' +
          '    <fieldset id="tab2">' +
          '      <legend>Tab2</legend>' +
          '      <p>Tab1 content</p>' +
          '    </fieldset>' +
          '    <fieldset id="tab3">' +
          '      <legend>Tab3</legend>' +
          '      <p>Tab1 content</p>' +
          '    </fieldset>' +
          '   </div>' +
          '  </div>' +
          ' </div>' +
          '</div>' ).appendTo('body'),
        tabs = $('.content', el).ploneTabs({
            window: window,
            document: document
          });

    assert($('li', tabs._tabs).size() === 3);
    assert(tabs.getTabContent(0).hasClass('active'));
    assert(!tabs.getTabContent(1).hasClass('active'));
    assert(!tabs.getTabContent(2).hasClass('active'));

    var tab2 = tabs.show(1);  // show second one
    assert(tabs.getTab(1)[0] === tab2[0]);
    assert(!tabs.getTabContent(0).hasClass('active'));
    assert(tabs.getTabContent(1).hasClass('active'));
    assert(!tabs.getTabContent(2).hasClass('active'));

    var tab3 = tabs.getTab(2);
    tab3.trigger('click');
    assert(!tabs.getTabContent(0).hasClass('active'));
    assert(!tabs.getTabContent(1).hasClass('active'));
    assert(tabs.getTabContent(2).hasClass('active'));

    $('.content', el).ploneTabs({ example: 'example' });
    assert(tabs.options.example === 'example');
  }

});

}(jQuery));
