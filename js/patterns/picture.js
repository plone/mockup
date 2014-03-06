/* Picture pattern.
 *
 * Options:
 *    alt(string): Alternate text to be used on the resulting responsive image tag. (null)
 *    attribute(object): The mapping of attributes between pattern configuration and the resulting image element. For example, by default, the mapping looks for data-src attributes to use as the resulting src attribute for the resulting element. Ditto for data-media, which maps to media for mediaquery information. ({ src: 'data-src', media: 'data-media' })
 *    className(object): The relevant classes to be applied to the given image element at different stages of handling. loading is the CSS class added to the element whilst an image is loading, and error is the CSS class added to the element if an error occurred whilst loading the image. ({ loading: 'picture-loading', error: 'picture-error' })
 *
 * Documentation:
 *    # Responsive images pattern
 *
 *    This pattern loads the last image that fulfills the media-query
 *    criteria. When multiple pictures are displayed, it loads the images
 *    within the visible viewport first. Will update images on resize event.
 *
 *    # Examples
 *
 *    ## Alternative text
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-picture" data-pat-picture="alt:Alternative text;">
 *      <div data-src="http://placehold.it/480x320"></div>
 *      <div data-src="http://placehold.it/640x427" data-media="(min-width: 480px)"></div>
 *      <div data-src="http://placehold.it/800x533" data-media="(min-width: 640px)"></div>
 *      <div data-src="http://placehold.it/960x640" data-media="(min-width: 800px)"></div>
 *      <div data-src="http://placehold.it/1200x800" data-media="(min-width: 960px)"></div>
 *      <!--[if (lt IE 9) & (!IEMobile)]>
 *        <div data-src="http://placehold.it/800x533"></div>
 *      <![endif]-->
 *      <noscript>
 *        <img src="http://placehold.it/800x533" alt="Alternative text" />
 *      </noscript>
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


/*
 * At the moment the images are loaded when they first are visible,
 * this is sluggish! We should have a queue for loading images, where
 * visible images are prioritized.
 */

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  'use strict';

  var Picture = Base.extend({
    name: 'picture',
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
      if (Picture.__queuePicturePatterns === undefined) {
        Picture.__queuePicturePatterns = [];
        $(window).on('queue.picture.patterns', function() {
          if ($('.pat-picture').length === Picture.__queuePicturePatterns.length) {
            $.each(Picture.__queuePicturePatterns, function(index, val) {
              val.display();
            });
            Picture.__queuePicturePatterns = [];
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
        Picture.__queuePicturePatterns.unshift(self);
      } else {
        Picture.__queuePicturePatterns.push(self);
      }
      self.trigger('queue');
    },

    display: function() {
      var self = this,
          matches = [],
          $img = $('img', self.$el);

      $('[' + self.options.attribute.src + ']', self.$el).each(function() {
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

      div.id = 'mq-test-1';
      div.style.cssText = 'position:absolute;top:-100em';
      fakeBody.style.background = 'none';
      fakeBody.appendChild(div);

      div.innerHTML = '&shy;<style media="' + mediaQuery + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);

      return bool;
    }
  });

  return Picture;
});
