// This plugin is used to handle all clicks inside iframe.
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


define([
  'jquery'
], function($, undefined) {
  'use strict';

  $.IFrame = function(iframe) { this._init(iframe); };
  $.IFrame.prototype = {

    // # Initialization
    _init: function(iframe) {
      var self = this;

      self._iframe = iframe;
      self.$el = $(iframe.el);
      self.window = window.parent;
      self.document = window.parent.document;
      self.isStretched = false;

      // # Handle clicks inside iframe
      $(document).on('click', function(e) {

        // opens link in top frame if clicked on it
        // TODO: only if on same base url
        if ($.nodeName(e.target, 'a') ||
            $(e.target).parents('a').size() === 1) {

          e.stopPropagation();
          e.preventDefault();

          var url = $(e.target).attr('href');
          if (!$.nodeName(e.target, 'a')) {
            url = $(e.target).parents('a').attr('href');
          }

          if (e.which === 1) {
            self._sameWindow(url);
          } else if (e.which === 2) {
            self._neWindow(url);
          }

        // if we click on empty part of iframe then shrink it
        } else if ($.nodeName(e.target, 'html')) {
          self.shrink();

        // if click on any other element then 'a' of iframe trigger iframe.click
        // event
        } else {
          self.$el.trigger('click.iframe', e);
        }

      });

      // make sure all content of iframe is visible
      self.fit();
      $(window).on('resize', function(e) { self.fit(); });
    },

    // Abstract calls to window.parent so its easier to stub/mock in tests
    _sameWindow: function(url) {
      this.window.location.href = url;
    },
    _neWindow: function(url) {
      this.window.open(url);
    },

    // # Shrink IFrame Object
    //
    // Shrink current frame to the size that was before stretching it.
    shrink: function() {
      var self = this;
      if (self.isStretched) {
        self.$el.trigger('shrink.iframe');
        self.isStretched = false;
        self.fit();
        self.$el.trigger('shrinked.iframe');
      }
    },

    // # Stretch IFrame Object
    //
    // This function stretches current frame over whole top frame while keeping
    // iframe object trasparent
    stretch: function() {
      var self = this;
      if (!self.isStretched) {
        self.$el.trigger('stretch.iframe');
        self.isStretched = true;
        self.$el.css({ height: $(self.document).height() });
        self.$el.trigger('stretched.iframe');
      }
    },

    // # Toggle IFrame Object
    //
    // This function check in which state current object is and calls appropriate
    // action (stretch or shrink)
    toggle: function() {
      var self = this;
      if (!self.isStretched) {
        self.stretch();
      } else {
        self.shrink();
      }
    },

    fit: function() {
      var self = this;
      if (!self.isStretched) {
        self.$el.css({ height: $('body', document).height() });
        $('body', self.document).css('margin-top', $('body', document).height());
      } else {
        self.$el.css({ height: $(self.document).height() });
      }
    }
  };

  if (window.parent.iframe !== undefined && window.name &&
      window.parent.iframe[window.name] !== undefined) {
    $.iframe = new $.IFrame(window.parent.iframe[window.name]);
  }

  return $.iframe;

});
