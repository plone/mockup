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
  'jam/Patterns/src/registry'
], function($, Base, Backdrop, registry, undefined) {
  "use strict";

  var Modal = Base.extend({
    name: "modal",
    jqueryPlugin: "modal",
    defaults: {
      triggers: '',
      position: "center middle",
      width: "",
      height: "",
      margin: "20px",
      klass: "modal",
      klassWrapper: "modal-wrapper",
      klassWrapperInner: "modal-wrapper-inner",
      klassLoading: "modal-loading",
      klassActive: "active",
      backdrop: "body",
      backdropZIndex: "1000",
      backdropOpacity: "0.8",
      backdropKlass: "backdrop",
      backdropKlassActive: "backdrop-active",
      backdropCloseOnEsc: true,
      backdropCloseOnClick: true
    },
    init: function() {
      var self = this;


      self.backdrop = new Backdrop(self.$el.parents(self.options.backdrop), {
        zindex: self.options.backdropZIndex,
        klass: self.options.backdropKlass,
        klassActive: self.options.backdropKlassActive,
        styles: self.options.backdropStyles,
        opacity: self.options.backdropOpacity,
        closeOnEsc: self.options.backdropCloseOnEsc,
        closeOnClick: self.options.backdropCloseOnClick
      });
      self.backdrop.on('hidden', function(e) {
        self.hide();
      });

      self.$wrapper = $('> .' + self.options.klassWrapper, self.backdrop.$el);
      if (self.$wrapper.size() === 0) {
        self.$wrapper = $('<div/>')
          .hide()
          .css({
            'z-index': parseInt(self.options.backdropZIndex, 10) + 1,
            'overflow-y': 'auto',
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
      $(window.parent).resize(function() {
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
    initModalElement: function($modal) {
      var self = this;
      $modal
        .addClass(self.options.klass)
        .on('click', function(e) {
          e.stopPropagation();
          if ($.nodeName(e.target, 'a')) {
            e.preventDefault();
            // TODO: open links inside modal
          }
        })
        .on('destroy.modal.patterns', function(e) {
          e.stopPropagation();
          self.hide();
        })
        .on('resize.modal.patterns', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.positionModal(true);
        });
      $modal.data('pattern-' + self.name, self);
      return $modal;
    },
    initModal: function() {
      var self = this;
      if (self.options.ajaxUrl) {
        self.$modal = function() {
          self.trigger('before-ajax');
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
            self.$modal = self.initModalElement(
              $($((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                .replace('<body', '<div').replace('</body>', '</div>'))[0]))
              .appendTo(self.$wrapperInner);
            self.trigger('after-ajax', self, textStatus, xhr);
            self.show();
          });
        };
      } else if (self.options.target) {
        self.$modal = function() {
          self.$modal = self.initModalElement($('<div/>'))
              .html($(self.options.target).clone())
              .appendTo(self.$wrapperInner);
          self.show();
        };
      } else {
        self.$modal = self.initModalElement($('<div/>'))
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
    positionModal: function(preserve_top) {
      var self = this;
      if (typeof self.$modal !== 'function') {

        if (preserve_top) {
          preserve_top = self.$modal.css('top');
        }

        self.$modal.removeAttr('style');
        // if backdrop wrapper is set on body then wrapper should have height
        // of window so we can do scrolling of inner wrapper
        self.$wrapperInner.css({
          'height': '100%',
          'width': '100%'
        });
        if (self.$wrapper.parent().is('body')) {
          self.$wrapper.height($(window.parent).height());
        }

        // place modal at top left with desired width/height and margin
        self.$modal.css({
          'padding': '0',
          'margin': '0',
          'width': self.options.width,
          'height': self.options.height,
          'position': 'absolute',
          'top': preserve_top ? preserve_top : '0',
          'left': '0'
        });

        self.$modal.css({'margin': '0'});
        var modalOffsetBefore = self.$modal.offset();
        self.$modal.css({ 'margin': self.options.margin });
        var modalOffset = self.$modal.offset(),
            modalOuterWidth = self.$modal.outerWidth(true),
            modalInnerWidth = self.$modal.innerWidth(),
            modalOuterHeight = self.$modal.outerHeight(true),
            modalInnerHeight = self.$modal.innerHeight();
        self.$modal.css({ 'margin': '0' });

        var topMargin = modalOffset.top - modalOffsetBefore.top,
            bottomMargin = modalOuterHeight - modalInnerHeight - topMargin,
            leftMargin = modalOffset.left - modalOffsetBefore.left,
            rightMargin = modalOuterWidth - modalInnerWidth - leftMargin;

        // place modal in right position
        var positionHorizontal = self.options.position.split(' ')[0],
            positionVertical = self.options.position.split(' ')[1],
            positionTop, positionBottom, positionLeft, positionRight;

        if (positionHorizontal === 'left') {
          positionLeft = leftMargin + 'px';
          if (self.$wrapperInner.width() < self.$modal.width()) {
            positionRight = rightMargin + 'px';
          } else {
            positionRight = 'auto';
          }
        } else if (positionHorizontal === 'bottom') {
          positionRight = leftMargin + 'px';
          if (self.$wrapperInner.width() < self.$modal.width()) {
            positionLeft = leftMargin + 'px';
          } else {
            positionLeft = 'auto';
          }
        } else {
          if (self.$wrapperInner.width() < self.$modal.width() + leftMargin + rightMargin) {
            positionLeft = leftMargin + 'px';
            positionRight = rightMargin + 'px';
          } else {
            positionLeft = (self.$wrapperInner.innerWidth()/2 -
                self.$modal.outerWidth()/2 - leftMargin) + 'px';
            positionRight = (self.$wrapperInner.innerWidth()/2 -
                self.$modal.outerWidth()/2 - rightMargin) + 'px';
          }
        }
        self.$modal.css({
          'left': positionLeft,
          'right': positionRight,
          'width': self.$modal.width()
        });

        // if modal is bigger then wrapperInner then resize wrapperInner to
        // match modal height
        if (self.$wrapperInner.height() < self.$modal.height()) {
          self.$wrapperInner.height(self.$modal.height() + topMargin + bottomMargin);
        }

        if (preserve_top || positionVertical === 'top') {
          positionTop = topMargin + 'px';
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionBottom = bottomMargin + 'px';
          } else {
            positionBottom = 'auto';
          }
        } else if (positionVertical === 'bottom') {
          positionBottom = bottomMargin + 'px';
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionTop = topMargin + 'px';
          } else {
            positionTop= 'auto';
          }
        } else {
          if (self.$wrapperInner.height() < self.$modal.height()) {
            positionTop = topMargin + 'px';
            positionBottom = bottomMargin + 'px';
          } else {
            positionTop = positionBottom = (self.$wrapperInner.height()/2 -
                self.$modal.height()/2) + 'px';
          }
        }
        self.$modal.css({
          'top': positionTop,
          'bottom': positionBottom
        });

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
          registry.scan(self.$modal);
          self.positionModal();
          $('img', self.$modal).load(function() {
            self.positionModal();
          });
          $(window.parent).on('resize.modal.patterns', function() {
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
        $(window.parent).off('resize.modal.patterns');
        self.trigger('hidden');
      }
    }
  });

  return Modal;

});
