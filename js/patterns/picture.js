// Pattern which provide responsive image support:
//
// Author: Torkel Lyng
// Contact: torkel.lyng@gmail.com
// Version: 1.0
//
// License:
//
// Copyright (C) 2013 Plone Foundation
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


/*
 * At the moment the images are loaded when they first are visible,
 * this is sluggish! We should have a queue for loading images, where
 * visible images are prioritized.
 */

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  "use strict";

  var Picture = Base.extend({
    name: "picture",
    defaults: {
      alt: null,
      className: {
        loading: 'picture-loading',
        error: 'picture-error'
      },
      attribute: {
        src: 'data-src',
        media: 'data-media'
      }
    },

    init: function() {
      var self = this,
          resizeHandler;
      if (Picture.__queue_picture_patterns === undefined) {
        Picture.__queue_picture_patterns = [];
        $(window).on('queue.picture.patterns', function() {
          if ($('.pat-picture').length === Picture.__queue_picture_patterns.length) {
            $.each(Picture.__queue_picture_patterns, function(index, val) {
              val.display();
            });
            Picture.__queue_picture_patterns = [];
          }
        });
      }

      resizeHandler = function(event) {
        var self = event.data.context;
        self.queue();
      };

      $(window).on('resize', {context: self}, resizeHandler);
      self.queue();
    },

    queue: function() {
      var self = this;

      if (self.visible()) {
        Picture.__queue_picture_patterns.unshift(self);
      } else {
        Picture.__queue_picture_patterns.push(self);
      }
      self.trigger('queue');
    },

    display: function() {
      var self = this,
          matches = [],
          $img = $('img', self.$el);

      $('[' + self.options.attribute.src +']', self.$el).each(function() {
        var $candidate = $(this);
        if (!$candidate.attr(self.options.attribute.media) ||
            self.matchMedia($candidate.attr(self.options.attribute.media))) {
          matches.push($candidate);
        }
      });

      if (!matches.length) {
        return;
      }

      if (!$img.length) {
        $img = $('<img />')
          .attr('alt', self.options.alt);
        self.$el.append($img);
      }

      $img
        .load(function() {
          self.$el.removeClass(self.options.className.loading);
          self.trigger('complete');
        })
        .error(function() {
          self.$el.addClass(self.options.className.error);
          self.trigger('error');
        });

      self.$el.addClass(self.options.className.loading);
      $img.attr('src', matches.pop().attr(self.options.attribute.src));
      self.trigger('loading');
    },

    visible: function() {
      var self = this,
          viewTop = $(window).scrollTop(),
          viewBottom = viewTop + $(window).height(),
          top = self.$el.offset().top,
          bottom = top + self.$el.height();

      return ((bottom >= viewTop) && (top <= viewBottom));
    },

    matchMedia: function(mediaQuery) {
      var bool,
          docElem = document.documentElement,
          refNode = docElem.firstElementChild || docElem.firstChild,
          fakeBody = document.createElement('body'),
          div = document.createElement('div');

      div.id = "mq-test-1";
      div.style.cssText = "position:absolute;top:-100em";
      fakeBody.style.background = "none";
      fakeBody.appendChild(div);

      div.innerHTML = "&shy;<style media=\"" + mediaQuery + "\"> #mq-test-1 { width: 42px; }</style>";
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);

      return bool;
    }
  });

  return Picture;
});
