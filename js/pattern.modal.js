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
  'js/pattern.base',
  'js/pattern.backdrop',
  'jam/Patterns/src/registry',
  'jam/Patterns/src/core/parser'
], function($, Base, Backdrop, Registry, Parser, undefined) {
  "use strict";

  var parser = new Parser("modal");

  parser.add_argument("triggers");
  // left|center|right top|middle|button
  parser.add_argument("position", "center middle");
  parser.add_argument("klass", "modal");
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
      self.backdrop.on('hidden', function() { self.hide(); });
    },
    initModal: function() {
      var self = this,
          $modal = $('<div/>').hide().addClass(self.options.klass);

      if (self.options.ajaxUrl) {
        self.trigger('beforeajax');
        self.$modal = function() {
          $.ajax({
              url: self.options.ajaxUrl,
              type: self.options.ajaxType
          }).done(function(response, textStatus, xhr) {
            self.$modal = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
              .replace('<body', '<div').replace('</body>', '</div>'))
                .addClass(self.options.klass)
                .insertBefore(self.backdrop.$backdrop);
            self.trigger('afterajax', self, textStatus, xhr);
            self.show();
          });
        };
      } else if (self.options.target) {
        self.$modal = function() {
          self.$modal = $modal
              .html($(self.options.target).clone())
              .insertBefore(self.backdrop.$backdrop);
          self.show();
        };
      } else {
        self.$modal = $modal
              .html(self.$el.clone())
              .insertBefore(self.backdrop.$backdrop);
      }

    },
    positionModal: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive) &&
          typeof self.$modal === 'function') {
        var postionHorizontal= self.options.position.split(' ')[0],
            postionVertical= self.options.position.split(' ')[1];
        self.$modal.css({
          'margin': '0',
          'top': 'auto',
          'bottom': 'auto',
          'right': 'auto',
          'left': 'auto'
        });
        if (postionHorizontal === 'left') {
          self.$modal.css('left', 0);
        } else if (postionHorizontal === 'center') {
          self.$modal.css('margin-left', $(window).width()/2 - self.$modal.outerWidth()/2);
        } else if (postionHorizontal === 'right') {
          self.$modal.css('right', '0');
        }
        if (postionVertical === 'top') {
          self.$modal.css('top', '0');
        } else if (postionVertical === 'middle') {
          self.$modal.css('top', '0');
          self.$modal.css('margin-top', $(window).height()/2 - self.$modal.height()/2);
        } else if (postionVertical === 'bottom') {
          self.$modal.css('bottom', '0');
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
          self.$modal
            .addClass(self.options.klassActive)
            .on('hide.modal.patterns', function(e) {
              e.stopPropagation();
              self.hide();
            });
          self.$el.addClass(self.options.klassActive);
          self.backdrop.show();
          self.$modal.show().css({
            'z-index': self.options.backdropZIndex + 1,
            'opacity': '0'
          }).animate({ opacity: '1' }, 500);

          // scan for patterns
          Registry.scan(self.$modal);

          // position modal
          self.trigger('shown');
        }
      }
    },
    hide: function() {
      var self = this;
      if (self.$el.hasClass(self.options.klassActive)) {
        self.trigger('hide');
        self.backdrop.hide();
        if (self.$modal.remove) {
          self.$modal.remove();
          self.initModal();
        }
        self.$el.removeClass(self.options.klassActive);
        self.trigger('hidden');
      }
    }
  });

  return Modal;

});
