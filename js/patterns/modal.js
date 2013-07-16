// modal pattern.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends: jquery.js patterns.js jquery.form.js
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


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-patterns-backdrop',
  'mockup-registry',
  'jquery.form'
], function($, Base, Backdrop, registry) {
  "use strict";

  var Modal = Base.extend({
    name: "modal",
    createModal: null,
    defaults: {
      triggers: '',
      position: "center middle", // format: "<horizontal> <vertical>" -- allowed values: top, bottom, left, right, center, middle
      width: "",
      height: "",
      margin: function() { return 20; }, // can be int or function that returns an int -- int is a pixel value
      klass: "modal",
      klassWrapper: "modal-wrapper",
      klassWrapperInner: "modal-wrapper-inner",
      klassLoading: "modal-loading",
      klassActive: "active",
      backdrop: "body",
      backdropOptions: {
        zIndex: "1040",
        opacity: "0.8",
        klass: "backdrop",
        klassActive: "backdrop-active",
        closeOnEsc: true,
        closeOnClick: true
      },
      templateOptions: {
        title: 'h1:first',
        buttons: '.formControls > input[type="submit"]',
        content: '#content',
        actions: [],
        actionsOptions: {
          timeout: 5000,
          error: '.portalMessage.error',
          loading: '' +
            '<div class="progress progress-striped active">' +
            '  <div class="bar" style="width: 100%;"></div>' +
            '</div>'
        },
        form: function($modal, actions, defaultOptions) {
          var self = this;

          $.each(actions, function(action, options) {
            options = $.extend({}, defaultOptions, options);
            $(action, $modal).each(function(action) {
              var $action = $(this);
              $action.on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();

                // loading "spinner"
                var backdrop = $modal.data('patterns-backdrop');
                if (!backdrop) {
                  backdrop = new Backdrop($modal, {
                    closeOnEsc: false,
                    closeOnClick: false
                  });
                  backdrop.$backdrop
                    .html('')
                    .append(
                      $(options.loading)
                        .css({
                          position: 'absolute',
                          left: $modal.width() * 0.1,
                          top: $modal.height()/2 + 10,
                          width: $modal.width() * 0.8
                        })
                    );
                  $modal.data('patterns-backdrop', backdrop);
                } else {
                  $modal.append(backdrop.$backdrop);
                }
                backdrop.show();

                // handle click on input/button using jquery.form library
                if ($.nodeName($action[0], 'input') || $.nodeName($action[0], 'button')) {

                  // pass action that was clicked when submiting form
                  var extraData = {};
                  extraData[$action.attr('name')] = $action.attr('value');

                  $action.parents('form').ajaxSubmit({
                    timeout: options.timeout,
                    data: extraData,
                    url: $action.parents('form').attr('action'),
                      error: function(xhr, textStatus, errorStatus) {
                        if (textStatus === 'timeout' && options.onTimeout) {
                          options.onTimeout.apply(self, xhr, errorStatus);
                        // on "error", "abort", and "parsererror"
                        } else if (options.onError) {
                          options.onError(xhr, textStatus, errorStatus);
                        } else {
                          console.log('error happened do something');
                        }
                      },
                      success: function(response, state, xhr, form) {
                        // if error is found
                        if ($(options.error, response).size() !== 0) {
                          if (options.onFormError) {
                            options.onFormError(self, response, state, xhr, form);
                          } else {
                            self.$modal.remove();
                            self.$modal = self.initModalElement(
                              $($((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                                .replace('<body', '<div').replace('</body>', '</div>'))[0]));
                            self.options.template.apply(self,
                              [self.$modal, self.options.templateOptions]);
                            self.positionModal();
                            registry.scan(self.$modal);
                          }

                        // custom success function
                        } else if (options.onSuccess) {
                          options.onSuccess(self, response, state, xhr, form);

                        } else {
                          $action.trigger('destroy.modal.patterns');
                        }
                      }
                  });

                // handle click on link with jQuery.ajax
                } else if ($.nodeName($action[0], 'a')) {
                  $.ajax({
                    url: $action.attr('href'),
                    error: function(xhr, textStatus, errorStatus) {
                      if (textStatus === 'timeout' && options.onTimeout) {
                        options.onTimeout(self.$modal, xhr, errorStatus);

                      // on "error", "abort", and "parsererror"
                      } else if (options.onError) {
                        options.onError(xhr, textStatus, errorStatus);
                      } else {
                        console.log('error happened do something');
                      }
                    },
                    success: function(response, state, xhr) {
                      // if error is found
                      if ($(options.error, response).size() !== 0) {
                        if (options.onFormError) {
                          options.onFormError(self, response, state, xhr);
                        } else {
                            self.$modal.remove();
                            self.$modal = self.initModalElement(
                              $($((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                                .replace('<body', '<div').replace('</body>', '</div>'))[0]));
                            self.options.template.apply(self,
                              [self.$modal, self.options.templateOptions]);
                            self.positionModal();
                            registry.scan(self.$modal);
                        }

                      // custom success function
                      } else if (options.onSuccess) {
                        options.onSuccess(self, response, state, xhr);

                      } else {
                        $action.trigger('destroy.modal.patterns');
                      }
                    }
                  });
                }

              });
            });
          });

        }
      },
      template: function($modal, options) {
        var self = this;
        var $content = $modal.html();
        $modal.html('' +
          '<div class="modal-header">' +
          '  <a class="close">&times;</a>' +
          '  <h3></h3>' +
          '</div>' +
          '<div class="modal-body"></div>' +
          '<div class="modal-footer"></div>');

        $('.modal-header > h3', $modal).html($(options.title, $content).html());
        if (options.content) {
          $('.modal-body', $modal).html($(options.content, $content).html());
        } else {
          $('.modal-body', $modal).html($content);
        }
        $(options.title, $modal).remove();
        $('.modal-header > a.close', $modal)
          .off('click')
          .on('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(e.target).trigger('destroy.modal.patterns');
          });

        // cleanup html
        $('.row', $modal).removeClass('row');

        $(options.buttons, $modal).each(function() {
          var $button = $(this);
          $button
            .on('click', function(e) {
              e.stopPropagation();
              e.preventDefault();
            })
            .clone()
            .appendTo($('.modal-footer', $modal))
            .off('click').on('click', function(e) {
              e.stopPropagation();
              e.preventDefault();
              $button.trigger('click');
            });
          $button.hide();
        });

        // form
        if (options.form) {
          options.form.apply(self,
              [$modal, options.actions, options.actionsOptions]);
        }
      },
    },
    init: function() {
      var self = this;

      self.backdrop = new Backdrop(
          self.$el.parents(self.options.backdrop),
          self.options.backdropOptions);
      self.backdrop.on('hidden', function(e) {
        self.hide();
      });

      self.$wrapper = $('> .' + self.options.klassWrapper, self.backdrop.$el);
      if (self.$wrapper.size() === 0) {
        self.$wrapper = $('<div/>')
          .hide()
          .css({
            'z-index': parseInt(self.options.backdropOptions.zIndex, 10) + 1,
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
      self.$wrapper.on('hidden', function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.hide();
      });

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
            self.options.templateOptions.content = '';
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
            // and slide modal body
          }
        })
        .on('destroy.modal.patterns', function(e) {
          e.stopPropagation();
          self.hide();
        })
        .on('resize.modal.patterns', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.positionModal();
        })
        .appendTo(self.$wrapperInner);
      $modal.data('pattern-' + self.name, self);
      return $modal;
    },
    createAjaxModal: function() {
      var self = this;
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
            .replace('<body', '<div').replace('</body>', '</div>'))[0]));
        self.trigger('after-ajax', self, textStatus, xhr);
        self._show();
      });
    },
    createTargetModal: function() {
      var self = this;
      self.$modal = self.initModalElement($('<div/>'))
              .html($(self.options.target).clone());
      self._show();
    },
    createBasicModal: function() {
      var self = this;
      self.$modal = self.initModalElement($('<div/>'))
              .html(self.$el.clone());
      self._show();
    },
    createHtmlModal: function() {
      var self = this;
      var $el = $(self.options.html);
      self.$modal = self.initModalElement($('<div/>')).html($el);
      self._show();
    },
    initModal: function() {
      var self = this;
      if (self.options.ajaxUrl) {
        self.createModal = self.createAjaxModal;
      } else if (self.options.target) {
        self.createModal = self.createTargetModal;
      } else if (self.options.html) {
        self.createModal = self.createHtmlModal;
      } else {
        self.createModal = self.createBasicModal;
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
    findPosition: function(horpos, vertpos, margin, modalWidth, modalHeight,
                           wrapperInnerWidth, wrapperInnerHeight) {
      var returnpos = {};
      var absTop, absBottom, absLeft, absRight;
      absRight = absLeft = absTop = absLeft = 'auto';

      // -- HORIZONTAL POSITION -----------------------------------------------
      if(horpos === 'left') {
        absLeft = margin + 'px';
        // if the width of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the left to simply be 0
        if(modalWidth > wrapperInnerWidth) {
          absLeft = '0px';
        }
        returnpos.left = absLeft;
      }
      else if(horpos === 'right') {
        absRight =  margin + 'px';
        // if the width of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the right to simply be 0
        if(modalWidth > wrapperInnerWidth) {
          absRight = '0px';
        }
        returnpos.right = absRight;
        returnpos.left = 'auto';
      }
      // default, no specified location, is to center
      else {
        absLeft = ((wrapperInnerWidth / 2) - (modalWidth / 2) - margin) + 'px';
        // if the width of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the left to simply be 0
        if(modalWidth > wrapperInnerWidth) {
          absLeft = '0px';
        }
        returnpos.left = absLeft;
      }

      // -- VERTICAL POSITION -------------------------------------------------
      if(vertpos === 'top') {
        absTop = margin + 'px';
        // if the height of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the top to simply be 0
        if(modalHeight > wrapperInnerHeight) {
          absTop = '0px';
        }
        returnpos.top = absTop;
      }
      else if(vertpos === 'bottom') {
        absBottom = margin + 'px';
        // if the height of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the bottom to simply be 0
        if(modalHeight > wrapperInnerHeight) {
          absBottom = '0px';
        }
        returnpos.bottom = absBottom;
        returnpos.top = 'auto';
      }
      else {
        // default case, no specified location, is to center
        absTop = ((wrapperInnerHeight / 2) - (modalHeight / 2) - margin) + 'px';
        // if the height of the wrapper is smaller than the modal, and thus the
        // screen is smaller than the modal, force the top to simply be 0
        if(modalHeight > wrapperInnerHeight) {
          absTop = '0px';
        }
        returnpos.top = absTop;
      }

      return returnpos;
    },
    // re-position modal at any point.
    //
    // Uses:
    //  options.margin
    //  options.width
    //  options.height
    //  options.position
    positionModal: function() {
      var self = this;

      // modal isn't initialized
      if(typeof self.$modal === 'function') { return; }

      // clear out any previously set styling
      self.$modal.removeAttr('style');

      // make sure the (inner) wrapper fills it's container
      //self.$wrapperInner.css({height:'100%', width:'100%'});

      // if backdrop wrapper is set on body, then wrapper should have height of
      // the window, so we can do scrolling of inner wrapper
      if(self.$wrapper.parent().is('body')) {
        self.$wrapper.height($(window.parent).height());
      }

      var margin = typeof self.options.margin === 'function' ? self.options.margin() : self.options.margin;
      self.$modal.css({
        'padding': '0',
        'margin': margin,
        'width': self.options.width, // defaults to "", which doesn't override other css
        'height': self.options.height, // defaults to "", which doesn't override other css
        'position': 'absolute'
      });

      var posopt = self.options.position.split(' '),
          horpos = posopt[0],
          vertpos = posopt[1];
      var modalWidth = self.$modal.outerWidth(true);
      var modalHeight = self.$modal.outerHeight(true);
      var wrapperInnerWidth = self.$wrapperInner.width();
      var wrapperInnerHeight = self.$wrapperInner.height();

      var pos = self.findPosition(horpos, vertpos, margin, modalWidth, modalHeight,
                                  wrapperInnerWidth, wrapperInnerHeight);
      for(var key in pos) {
        self.$modal.css(key, pos[key]);
      }
    },
    show: function() {
      var self = this;
      self.createModal();
    },
    _show: function() {
      var self = this;
      if (!self.$el.hasClass(self.options.klassActive)) {
        if (self.options.template) {
          self.options.template.apply(self,
              [self.$modal, self.options.templateOptions]);
        }
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
    },
    hide: function() {
      var self = this;
      if (self.ajaxXHR) {
        self.ajaxXHR.abort();
      }
      self.trigger('hide');
      self.backdrop.hide();
      self.$wrapper.hide();
      self.$loading.hide();
      self.$wrapper.parent().css('overflow', 'visible');
      self.$el.removeClass(self.options.klassActive);
      if (self.$modal !== undefined) {
        self.$modal.remove();
        self.initModal();
      }
      $(window.parent).off('resize.modal.patterns');
      self.trigger('hidden');
    }
  });

  return Modal;

});
