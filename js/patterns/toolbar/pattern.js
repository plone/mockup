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
 *      <ul>
 *        <li id="toolbar-icon-folderContents">
 *          <a href="folder_contents">Contents</a>
 *        </li>
 *        <li id="toolbar-icon-view">
 *          <a href="folder_contents">View</a>
 *        </li>
 *        <li id="toolbar-icon-edit">
 *          <a href="edit">Edit</a>
 *        </li>
 *        <li id="toolbar-icon-local_roles">
 *          <a href="@@sharing">Sharing</a>
 *        </li>
 *        <li id="toolbar-icon-workflow">
 *          <a href="content_status_history">
 *            State:
 *            <span class="state-published">Published</span>
 *          </a>
 *        </li>
 *        <li id="toolbar-icon-factories">
 *          <a href="folder_factories">
 *            <span class="toolbar-text">Add new...</span>
 *          </a>
 *        </li>
 *        <li id="toolbar-icon-personaltools">
 *          <a href="#">admin</a>
 *        </li>
 *      </ul>
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
      backLabel: 'Back',
      endOpacity: 0.9,
      logoSize: 50,
      mobileWidth: 450, // width of device where we switch to mobile/desktop
      position: 'left', // position of toolbar
      sizeDesktopClosed: 50,
      sizeDesktopOpen: 200,
      sizeMobileRatio: 0.8,
      startOpacity: 0.2,
      touchableSize: 10,
    },

    isMobile: function() {
      return $(window).width() < this.options.mobileWidth
    },

    getBurgerSize: function(isMobile, isClosed) {
      isClosed = isClosed || true;
      if (isMobile) {
        return $(window).width() * this.options.logoSize;
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

    // inspired by:
    //  - https://gist.github.com/lorenzopolidori/3794226 and
    //  - https://gist.github.com/jgonera/5250507
    detect3DTransform: function() {
      var $el1 = $('<div>'),
          $el2 = $('<div>'),
          $iframe = $('<iframe>'),
          BreakException = {},
          detectedTransform = false,
          detected3DTranslate = false,
          detected3DRotate = false,
          transforms = {
            'webkitTransform': '-webkit-transform',
            'MozTransform': '-moz-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'transform': 'transform'
          };

 
      // Add it to the body to get the computed style
      // Sandbox it inside an iframe to avoid Android Browser quirks
	    $iframe.appendTo('body').contents().find('body').append($el1).append($el2);
 
      try {
        [ 'transform',
          'webkitTransform',
          'MozTransform',
          'OTransform',
          'msTransform'
        ].forEach(function(transform) {
          if ($el1[0].style[transform] !== undefined) {
            detectedTransform = transforms[transform];

            // 3D translate
            $el1[0].style[transform] = 'translate3d(1px,1px,1px)';
            if (window.getComputedStyle($el1[0]).getPropertyValue(transforms[transform])) {
              detected3DTranslate = true;
            }

            // 3D rotate
            $el2[0].style[transform] = 'rotate3d(1px,1px,1px,1deg)';
            if (window.getComputedStyle($el2[0]).getPropertyValue(transforms[transform])) {
              detected3DRotate = true;
            }

            if (detected3DRotate && detected3DTranslate) {
              throw BreakException;
            }
          }
        });
      } catch(e) {
        if (e !== BreakException) {
          throw e;
        }
      }
 
	    $iframe.remove();
 
      return {
        'transform': detectedTransform,
        '3DTranslate': detected3DTranslate,
        '3DRotate': detected3DRotate
      };
    },

    getMenuItems: function($ul) {
      var self = this,
          items = [],
          $el;

      $ul.find('> li').each(function() {
        $el = $(this);

        items.push({
          id: $el.attr('id'),
          href: $el.find('>a').attr('href'),
          html: $el.find('>a').html(),
          items: $el.find('>ul').size() === 1 ? self.getMenuItems.apply(self, [$el.find('>ul')]) : []
        });
      });

      return items;
    },

    init: function() {
      var self = this,
          isMobile = self.isMobile();

      React.addons.injectEventPluginsByName({
        TapEventPlugin: React.addons.TapEventPlugin,
        ResponderEventPlugin: React.addons.ResponderEventPlugin
      });

      React.initializeTouchEvents(true);

      self.view = ToolbarView({
        backLabel: this.options.backLabel,
        touchableSize: this.options.touchableSize,
        endOpacity: this.options.endOpacity,
        logoSize: this.options.logoSize,
        menuItems: self.getMenuItems(self.$el.find('> ul')),
        position: self.options.position,
        size: $(window).width() - self.options.logoSize,
        startOpacity: this.options.startOpacity,
        '3DTransform': self.detect3DTransform()
      });

      React.renderComponent(self.view, self.$el[0]);
    }
  });

  return Toolbar;

});
