// modal pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js pickadate.js
//
// Description:
//
// License:
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */
define([
  'jquery',
  'js/patterns/base',
  'js/patterns/backdrop',
  'jam/Patterns/src/registry',
  'jam/Patterns/src/core/parser'
], function($, Base, Backdrop, registry, Parser, undefined) {
  "use strict";

  var parser = new Parser("modal");

  parser.add_argument("triggers");
  // left|center|right top|middle|button
  parser.add_argument("position", "center middle");
  parser.add_argument("width", "auto");
  parser.add_argument("height", "auto");
  parser.add_argument("margin", "20px");
  parser.add_argument("klass", "modal");
  parser.add_argument("klassWrapper", "modal-wrapper");
  parser.add_argument("klassWrapperInner", "modal-wrapper-inner");
  parser.add_argument("klassLoading", "modal-loading");
  parser.add_argument("klassActive", "active");

  // XXX: should support same options as $.ajax
  parser.add_argument("ajaxUrl");
  parser.add_argument("ajaxType", "GET");

  parser.add_argument("backdrop", "body");
  parser.add_argument("backdropZIndex", "1000");
  parser.add_argument("backdropOpacity", "0.8");
  parser.add_argument("backdropKlass", "backdrop");
  parser.add_argument("backdropKlassActive", 'backdrop-active');
  parser.add_argument("backdropCloseOnEsc", true);
  parser.add_argument("backdropCloseOnClick", true);


  var Modal = Base.extend({
    name: "modal",
    parser: parser,
    init: function() {
      var self = this;


      self.backdrop = new Backdrop($(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        klass: self.options.backdropKlass,
        klassActive: self.options.backdropKlassActive,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      self.backdrop.on('hidden', function() { self.hide(); });

      self.$wrapper = $('> .' + self.options.klassWrapper, self.backdrop.$el);
      if (self.$wrapper.size() === 0) {
        self.$wrapper = $('<div/>')
          .hide()
          .css({
            'z-index': self.options.backdropZIndex + 1,
            'overflow-y': 'scroll',
            'position': 'fixed',
            'height': '100%',
            'width': '100%',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'top': '0'
          })
          .addClass(self.options.klassWrapper)
          .insertBefore(self.backdrop.$backdrop)
          .on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.backdrop.hide();
          });
      }

      self.$wrapperInner = $('> .' + self.options.klassWrapperInner, self.$wrapper);
      if (self.$wrapperInner.size() === 0) {
        self.$wrapperInner = $('<div/>')
          .addClass(self.options.klassWrapperInner)
          .css({
            'margin': self.options.margin,
            'position': 'absolute',
            'bottom': '0',
            'left': '0',
            'right': '0',
            'top': '0'
          })
          .appendTo(self.$wrapper);
      }

      self.$loading = $('> .' + self.options.klassLoading, self.$wrapperInner);
      if (self.$loading.size() === 0) {
        self.$loading = $('<div/>').hide()
          .addClass(self.options.klassLoading)
          .appendTo(self.$wrapperInner);
      }
      $(window).resize(function() {
        self.positionModal();
      });

      if (self.options.triggers) {
        $.each(self.options.triggers, function(i, item) {
          item = item.split(' ');
          $(item[1] || self.$el).on(item[0], function() {
            self.show();
          });
        });
      }

      if (self.$el.is('a')) {
        if (self.$el.attr('href')) {
          if (!self.options.target && self.$el.attr('href').substr(0, 1) === '#') {
            self.options.target = self.$el.attr('href');
          }
          if (!self.options.ajaxUrl && self.$el.attr('href').substr(0, 1) !== '#') {
            self.options.ajaxUrl = self.$el.attr('href');
          }
        }
        self.$el.on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.show();
        });
      }

      self.initModal();
      self.$wrapper.on('hidden', function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.hide();
      });
    },
    initModal: function() {
      var self = this,
          $modal = $('<div/>')
            .addClass(self.options.klass)
            .on('click', function(e) {
              e.stopPropagation();
              e.preventDefault();
            });

      if (self.options.ajaxUrl) {
        self.$modal = function() {
          self.trigger('beforeajax');
          self.$wrapper.parent().css('overflow', 'hidden');
          self.$wrapper.show();
          self.backdrop.show();
          self.$loading.show();
          self.positionLoading();
          self.ajaxXHR = $.ajax({
              url: self.options.ajaxUrl,
              type: self.options.ajaxType
          }).done(function(response, textStatus, xhr) {
            self.ajaxXHR = undefined;
            self.$loading.hide();
            self.$modal = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
              .replace('<body', '<div').replace('</body>', '</div>'))
                .addClass(self.options.klass)
                .appendTo(self.$wrapperInner);
            self.trigger('afterajax', self, textStatus, xhr);
            self.show();
          });
        };
      } else if (self.options.target) {
        self.$modal = function() {
          self.$modal = $modal
              .html($(self.options.target).clone())
              .appendTo(self.$wrapperInner);
          self.show();
        };
      } else {
        self.$modal = $modal
              .html(self.$el.clone())
              .appendTo(self.$wrapperInner);
      }

    },
    positionLoading: function() {
      var self = this;
      self.$loading.css({
        'margin-left': self.$wrapper.width()/2 - self.$loading.width()/2,
        'margin-top': self.$wrapper.height()/2 - self.$loading.height()/2,
        'position': 'absolute',
        'bottom': '0',
        'left': '0',
        'right': '0',
        'top': '0'
      });
    },
    positionModal: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive) &&
          typeof self.$modal !== 'function') {
        var postionHorizontal = self.options.position.split(' ')[0],
            postionVertical = self.options.position.split(' ')[1];

        self.$modal.css({
          'width': self.options.width === 'auto' ? self.$modal.width() : self.options.width,
          'height': self.options.height === 'auto' ? self.$modal.height() : self.options.height,
          'position': 'absolute',
          'bottom': '0',
          'left': '0',
          'right': '0',
          'top': '0'
        });
        self.$wrapperInner.css({ 'margin': '0' });
        var wrapperOffsetBefore = self.$wrapperInner.offset();
        self.$wrapperInner.css({ 'margin': self.options.margin });
        var wrapperOffset = self.$wrapperInner.offset(),
            wrapperOuterWidth = self.$wrapperInner.outerWidth(true),
            wrapperInnerWidth = self.$wrapperInner.innerWidth(),
            wrapperOuterHeight = self.$wrapperInner.outerHeight(true),
            wrapperInnerHeight = self.$wrapperInner.innerHeight();

        var topMargin = wrapperOffset.top - wrapperOffsetBefore.top,
            bottomMargin = wrapperOuterHeight - wrapperInnerHeight - topMargin,
            leftMargin = wrapperOffset.left - wrapperOffsetBefore.left,
            rightMargin = wrapperOuterWidth - wrapperInnerWidth - leftMargin;

        if (postionHorizontal === 'left') {
          self.$modal.css('left', leftMargin);
        } else if (postionHorizontal === 'center') {
          self.$modal.css('margin-left',
              self.$wrapper.width()/2 - self.$modal.width()/2 - leftMargin);
        } else if (postionHorizontal === 'right') {
          self.$modal.css('right', rightMargin);
        }

        if (self.$modal.height() > self.$wrapper.height()) {
          self.$wrapperInner.height(self.$modal.height() + bottomMargin);
        } else {
          if (postionVertical === 'top') {
            self.$modal.css('margin-top', topMargin);
          } else if (postionVertical === 'middle') {
            self.$modal.css('margin-top', self.$wrapper.height()/2 -
                self.$modal.height()/2 - topMargin);
          } else if (postionVertical === 'bottom') {
            self.$modal.css('margin-top', self.$wrapper.height() -
                self.$modal.height() - topMargin);
          }
        }

      }
    },
    show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        if (typeof self.$modal === 'function') {
          self._$modal = self.$modal;
          self.$modal();
        } else {
          self.trigger('show');
          self.backdrop.show();
          self.$wrapper.show();
          self.$wrapper.parent().css('overflow', 'hidden');
          self.$el.addClass(self.options.klassActive);
          self.$modal.addClass(self.options.klassActive);
          if (self.options.template) {
            self.options.template(self.$modal);
          }
          registry.scan(self.$modal);
          self.positionModal();
          $(window).off('resize').on('resize', function() {
            self.positionModal();
          });
          self.trigger('shown');
        }
      }
    },
    hide: function() {
      var self = this;
      if (self.ajaxXHR) {
        self.ajaxXHR.abort();
      }
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.backdrop.hide();
        self.$wrapper.hide();
        self.$wrapper.parent().css('overflow', 'visible');
        self.$el.removeClass(self.options.klassActive);
        if (self.$modal.remove) {
          self.$modal.remove();
          self.initModal();
        }
        $(window).off('resize');
        self.trigger('hidden');
      }
    }
  });

  return Modal;

});
