/* Toolbar pattern.
 *
 * Options:
 *    name(type): Description (defaultvalue)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-toolbar">
 *      <div class="toolbar-drag-handle"></div>
 *      <div class="toolbar-container">
 *        <div>
 *          <div class="toolbar-logo">
 *            Plone
 *          </div>
 *          <div class="toolbar-container">
 *            <ul>
 *              <li id="toolbar-icon-folderContents">
 *                <a href="folder_contents">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">Contents</span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-view">
 *                <a href="folder_contents">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">View</span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-edit">
 *                <a href="edit">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">Edit</span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-local_roles">
 *                <a href="@@sharing">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">Sharing</span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-workflow">
 *                <a href="content_status_history">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">
 *                    State:
 *                    <span class="state-published">Published</span>
 *                  </span>
 *                  <span class="toolbar-caret"></span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-factories">
 *                <a href="folder_factories">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">Add new...</span>
 *                  <span class="toolbar-caret"></span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-moreoptions">
 *                <a href="#">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">More options</span>
 *                  <span class="toolbar-caret"></span>
 *                </a>
 *              </li>
 *              <li id="toolbar-icon-personaltools">
 *                <a href="#">
 *                  <span class="toolbar-icon"></span>
 *                  <span class="toolbar-text">admin</span>
 *                  <span class="toolbar-caret"></span>
 *                </a>
 *              </li>
 *            </ul>
 *          </div>
 *        </div>
 *        <div>
 *        </div>
 *      </div>
 *    </div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'react',
  'js/patterns/toolbar/view'
  //  'scroller'
], function($, Base, React, ToolbarView) {
  "use strict";

  var Toolbar = Base.extend({
    name: 'toolbar',
    defaults: {
      sizeMobileRatio: 0.87,
      sizeDesktopClosed: 50,
      sizeDesktopOpen: 200,
      mobileWidth: 450, // width of device where we switch to mobile/desktop
      position: 'left' // position of toolbar
    },

    isMobile: function() {
      return $(window).width() < this.options.mobileWidth
    },

    getBurgerSize: function(isMobile, isClosed) {
      isClosed = isClosed || true;
      if (isMobile) {
        return $(window).width() * (1 - this.options.sizeMobileRatio);
      } else {
        if (isClosed) {
          return this.options.sizeDesktopClosed;
        } else {
          return this.options.sizeDesktopOpen;
        }
      }
    },

    getToolbarSize: function(isMobile) {
      if (isMobile) {
        return $(window).width() * this.options.sizeMobileRatio;
      } else {
        return this.options.sizeDesktopOpen;
      }
    },

    init: function() {
      var self = this,
          isMobile = self.isMobile();

      React.initializeTouchEvents(true);

      self.view = ToolbarView({
        burgerSize: self.getBurgerSize(isMobile),
        isMobile: isMobile,
        position: self.options.position,
        size: self.getToolbarSize(isMobile)
      });
      console.log('view created')

      $(window).on('resize', function() {
        var isMobile = self.isMobile();
        debugger;
        self.view.setState({
          isMobile: isMobile,
          burgerSize: self.getBurgerSize.apply(self, [ isMobile, self.view.state.isClosed ]),
          size: self.getToolbarSize.apply(self, [ isMobile ])
        });
      });

      React.renderComponent(self.view, self.$el[0]);
      console.log('view rendered')
    }
  });

  return Toolbar;

});
