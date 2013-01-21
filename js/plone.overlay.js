// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
//
// Description: 
//    This script is used to provide glue code between iframe and twitter
//    bootstrap modal. And also providing some convinience method for usage in
//    Plone.
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
  undef:true, strict:true, trailing:true, browser:true */


(function ($, Patterns, iframe, undefined) {
"use strict";

// Constructor
var PloneOverlay = Patterns.Base.extend({
  name: 'plone-overlay',
  jqueryPlugin: 'ploneOverlay',
  defaults: {
    loadingText: 'Loading ...',
    events: {},
    ajaxSubmitOptions: {
      error: '.portalMessage.error',
      modalButtons: '.modal-footer',
      contentButtons: '.formControls > input[type="submit"]'
    },
    modalOptions: {
      contentTitle: 'h1.documentFirstHeading',
      contentBody: '#content',
      template: '' +
          '<div class="modal fade"' +
          '     data-pattern="plone-tabs"' +
          '     data-plone-tabs-tabs-klass="nav nav-tabs"' +
          '     data-plone-tabs-tab-klass=""' +
          '     data-plone-tabs-panel-klass="">' +
          '  <div class="modal-header">' +
          '    <h3></h3>' +
          '  </div>' +
          '  <div class="modal-body"></div>' +
          '  <div class="modal-footer"></div>' +
          '</div>',
      templateClose: '<a class="close" data-dismiss="modal">&times;</a>',
      templateTitle: '.modal-header > h3',
      templateBody: '.modal-body',
      templateFooter: '.modal-footer'
    }
  },
  init: function() {
    var self = this;

    // we don't have to initialize modal if already initialized
    if ( self.$modal ) { return self; }

    // no jquery element passed as first argument this means first arguments
    // are options. also this means that showing/hiding of overlay will be
    // handled manually
    if (!self.$el.jquery) { self.options = self.$el; self.$el = undefined; }

    // merge options with defaults
    self.options = $.extend(true, {}, self.defaults, self.options);

    // if our element we passed is link then we setup click event which shows
    // overlay
    if (self.$el && $.nodeName(self.$el[0], 'a')) {
      // element "a" can also give us info where to load modal content from
      if (!self.options.ajaxUrl) {
        self.options.ajaxUrl = self.$el.attr('href');
      }
      // element "a" will also trigger showing of modal when clicked
      self.$el.on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.show();
      });
    }

    // if modal already passed via options
    if (self.options.modal) {
      self.$modal = $(self.options.modal).hide();
      self.initModalEvents(self.$modal);

      // patterns integration
      if (Patterns) {
        Patterns.initialize(self.$modal);
        $('[data-pattern~="tabs"] > li > a', self.$modal).on('shown', function() {
          self.resizeModal(self.$modal);
        });
      }

    // else options.ajaxUrl is used to load modal
    } else if (self.options.ajaxUrl) {
      self.$modal = self.prepareAjaxLoad(self.options.ajaxUrl);

    // report error since we cant detect what to use for modal
    } else {
      $.error('ploneOverlay can not recognize any content to use as $modal');
    }

    // stretch iframe when showing overlay
    if (iframe) {
      // close overlay if we click on backdrop
      iframe.$el.on('iframe.click', function(e, original) {
        if (original.which === 1 && (
            $(original.target).hasClass('modal-backdrop') ||
            $(original.target).hasClass('modal-wrapper'))) {
          self.hide();
        }
      });
      // sync scrolling of top frame and current frame
      $(iframe.document).scroll(function () {
        if (self.$modal && self.$modal.jquery) {
          var backdrop = self.$modal.parents('.modal-backdrop');
          if (backdrop.size() !== 0) {
            backdrop.css({
              'top': -1 * $(iframe.document).scrollTop(),
              'height': $(iframe.document).scrollTop() + backdrop.height()
            });
          }
        }
      });
      self.initialTopFrameHeight = $(iframe.document).height() +
          $('body', iframe.document).offset().top;
    }
  },
  initModalEvents: function($modal) {
    var self = this;
    // handle custom events of overlay
    if (self.options.events) {
      $.each(self.options.events, function(item) {
        var handleEvent,
            tmp = item.split(' '),
            eventName = tmp[0],
            $el = $(tmp.splice(1).join(' '), $modal);

        // custom defined function
        if (typeof self.options.events[item] === 'function') {
          handleEvent = self.options.events[item];

        } else if ($el.size() !== 0) {

          // if inside form we expect this to be handled via ajaxSubmit
          if ($el.parents('form').size() !== 0) {
            handleEvent = self.prepareAjaxSubmit($el, $modal, self.options.events[item]);

          // if link points to url starting with self.options.overlayUrl
          } else if (self.startsWithOverlayUrl($el)) {
            handleEvent = self.prepareNewModal($el, $modal, self.options.events[item]);
          }

        }

        $el.on(eventName, function(e) {
          if (handleEvent) {
            e.stopPropagation();
            e.preventDefault();
            handleEvent(self, $el, $modal);
          }
        });
      });
    }
  },
  initModal: function($modal) {
    var self = this;

    // append element to body
    if ($modal.parents('body').size() === 0) {
      $modal.appendTo('body');
    }

    // initialize modal
    $modal.modal({
        backdrop: 'static',
        dynamic: true,
        keyboard: false,
        show: false
      });

    // stop propagating clicks on modal so that iframe doesn't shrinks
    $modal.on('click', function(e) {
      e.stopPropagation();
    });

    self.initModalEvents($modal);

    // initialize hook
    if (self.options.onInitModal) {
      self.options.onModalIniu.call(self);
    }
  },
  resizeModal: function($modal) {
    var self = this,
        modalHeight = self.$modal.height() + self.$modal.offset().top;
    if (iframe && modalHeight > self.initialTopFrameHeight) {
      $('body', iframe.document).height(modalHeight);
      self.$modal.parents('.modal-backdrop').height($(iframe.window).height());
    }
  },
  prepareAjaxLoad: function(ajaxUrl) {
    var self = this;
    return function(callback) {

      // show that overlay is loading content
      self.$modal = self.modalTemplate(self.options.loadingTemplate || $('' +
        '<div>' +
        '  <div id="content">' +
        '    <h1 class="documentFirstHeading">' + self.options.loadingText + '</h1>' +
        '    <div class="progress progress-striped active">' +
        '      <div class="bar" style="width: 100%;"></div>' +
        '    </div>' +
        '  </div>' +
        '</div>'));
      self.initModal(self.$modal.hide());
      self.show();
      self.resizeModal(self.$modal);

      // before ajax request hook
      if (self.options.onBeforeLoad) {
        self.options.onBeforeLoad.call(self);
      }
      if (self.$el) {
        self.$el.trigger('plone.overlay.beforeLoad', [ self ]);
      }

      // remove hash part of url and append prefix to url, eg.
      //   convert -> http://example.com/test/something
      //   into    -> http://example.com/test/++toolbar++/something
      //   if options.baseUrl === 'http://example.com/test
      var ajaxUrl = self.changeAjaxURL(ajaxUrl || self.options.ajaxUrl);

      // do ajax request with prefixed url
      $.get(ajaxUrl, {}, function(response) {

        var responseBody = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
            .replace('<body', '<div').replace('</body>', '</div>'));

        // from response get content of body
        self.$modal.html('');
        self.$modal.append($('> *', self.modalTemplate(responseBody)));
        self.initModalEvents(self.$modal);

        // patterns integration
        if (Patterns) {
          Patterns.initialize(self.$modal);
          $('[data-pattern~="tabs"] > li > a', self.$modal).on('shown', function() {
            self.resizeModal(self.$modal);
          });
        }

        self.resizeModal(self.$modal);

        // after ajax request hook
        if (self.options.onLoaded) {
          self.options.onLoaded.call(self);
        }
        if (self.$el) {
          self.$el.trigger('plone.overlay.loaded', [ self ]);
        }

        // after content is loaded call callback
        if (callback) {
          callback.call(self);
        }
      }, 'html');
    };
  },
  modalTemplate: function($content, options) {
    var self = this;

    options = $.extend(self.options.modalOptions, options || {});

    var $modal = $(options.template),
        $title = $(options.templateTitle, $modal),
        $body = $(options.templateBody, $modal),
        $footer = $(options.templateFooter, $modal);

    // Body
    if (options.contentBody) {
      $body.html($(options.contentBody, $content).html());
    }

    // Title
    if (options.contentTitle) {
      $title.html($(options.contentTitle, $content).html());
      $(options.contentTitle, $body).remove();
    }

    // Footer
    if (options.contentFooter) {
      $body.html($(options.contentFooter, $content).html());
      $(options.contentFooter, $body).remove();
    }

    // Close
    if (options.templateClose && options.templateClose.length !== 0) {
      $(options.templateClose)
        .off('click')
        .on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          self.hide();
        })
        .insertBefore($title);
    }

    // custom
    if (self.options.modalTemplate) {
      $modal = self.options.modalTemplate($modal);
    }

    return $modal;
  },
  prepareNewModal: function($el, $modal, defaults) {
    console.log('TODO: prepareNewModal');
  },
  prepareAjaxSubmit: function($el, $modal, defaults) {
    var self = this;
    defaults = $.extend({}, self.options.ajaxSubmitOptions, defaults);

    // hide and copy same button to .modal-footer, clicking on button in
    // footer should actually click on button inside form
    $(defaults.contentButtons, $modal).each(function() {
      var $button = $(this);
      $button.clone()
        .appendTo($(defaults.modalButtons, $modal))
        .off('click').on('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $button.trigger('click');
        });
      $button.hide();
    });

    return function(self, $button, $modal) {

      var options = $.extend({}, defaults, options);

      if (typeof options.contentFilters === 'string') {
        options.contentFilters = [ options.contentFilters ];
      }

      // pass button that was clicked when submiting form
      var extraData = {};
      extraData[$button.attr('name')] = $button.attr('value');

      // loading "spinner"
      $modal
        .append($('<div/>')
          .css({
            position: 'absolute',
            top: $($('> *', $modal)[0]).outerHeight(),
            left: 0,
            width: $modal.width(),
            height: $($('> *', $modal)[1]).outerHeight() +
                    $($('> *', $modal)[2]).outerHeight(),
            background: 'white',
            opacity: '0.6'
          }))
        .append($('' +
            '<div class="progress progress-striped active">' +
            '  <div class="bar" style="width: 100%;"></div>' +
            '</div>')
          .css({
            position: 'absolute',
            left: $modal.width() * 0.1,
            top: ($($('> *', $modal)[1]).outerHeight() +
                  $($('> *', $modal)[2]).outerHeight()) * 0.45,
            width: $modal.width() * 0.8
          }));

      // we return array of options which will be passed to ajaxSubmit
      $el.parents('form').ajaxSubmit($.extend(true, {
        dataType: 'html',
        url: self.changeAjaxURL($el.parents('form').attr('action')),
        success: function(response, state, xhr, form) {
          var _document = iframe ? iframe.document : document,
              responseBody = $((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[0]
                  .replace('<body', '<div').replace('</body>', '</div>'));

          // if error is found
          if ($(options.error, responseBody).size() !== 0) {
            self.$modal.html('');
            self.$modal.append($('> *', self.modalTemplate(responseBody)));
            self.initModalEvents(self.$modal);

            // patterns integration
            if (Patterns) {
              Patterns.initialize(self.$modal);
              $('[data-pattern~="tabs"] > li > a', self.$modal).on('shown', function() {
                self.resizeModal(self.$modal);
              });
            }

            if (options.onError) {
              options.onError.apply(self, [ responseBody, state, xhr, form ]);
            }

          // custom success function
          } else if (options.onSuccess) {
            options.onSuccess.apply(self, [ responseBody, state, xhr, form ]);

          // common save function, we replace what we filtered from response
          } else if (options.contentFilters) {
            $.each(options.contentFilters, function(i, selector) {
              $(selector, _document).html($(selector, responseBody).html());
            });
            self.hide();
          }
        }
      }, { data: extraData }));
    };
  },
  changeAjaxURL: function(ajaxUrl) {

    // strip everything after ? or #
    //ajaxUrl = ajaxUrl.match(/^([^#?]+)/)[1];

    var self = this,
        ajaxUrlPrefix = self.options.ajaxUrlPrefix || '/++toolbar++',
        portalUrl = self.options.portalUrl ||
          $('body', iframe ? iframe.document : document).data('portal-navigation-url');

    if (ajaxUrl.indexOf('http') === 0) {
      return portalUrl + ajaxUrlPrefix + ajaxUrl.substr(portalUrl.length);
    } else {
      if (ajaxUrl.substr(0, 1) === '/') {
        return portalUrl + ajaxUrlPrefix + ajaxUrl;
      } else {
        return portalUrl + ajaxUrlPrefix +
            (window.location.href + '/' + ajaxUrl).substr(portalUrl.length);
      }
    }
  },
  show: function() {
    var self = this;

    // close any opened toolbar dropdown
    $('.toolbar-dropdown-open > a').patternToggle('remove');

    // if self.$modal is function then call it and pass this function as parameter
    // which needs to be called once loading of modal's html has been done
    if (typeof(self.$modal) === 'function') {
      self.$modal(self.show);

    } else {

      if (iframe) {
        iframe.stretch();
      }

      // show hook
      if (self.options.onShow) {
        self.options.onShow.call(self);
      }
      if (self.$el) {
        self.$el.trigger('plone.overlay.show', [ self ]);
      }

      // showing bootstrap's modal
      self.$modal.modal('show');

      // show hook
      if (self.options.onShown) {
        self.options.onShown.call(self);
      }
      if (self.$el) {
        self.$el.trigger('plone.overlay.shown', [ self ]);
      }
    }
  },
  hide: function() {
    var self = this;

    // hiding of modal is not possible if its not even loaded
    if (typeof(self.$modal) === 'function') {
      return;
    }

    // hide hook
    if (self.options.onHide) {
      self.options.onHide.call(self);
    }
    if (self.$el) {
      self.$el.trigger('plone.overlay.hide', [ self ]);
    }

    // calling hide on bootstrap's modal
    self.$modal.modal('hide');

    // remove modal's DOM element
    self.$modal.parents('body > *').detach();
    iframe.shrink();

    // set content frame to initial height
    if (iframe) {
      $('body', iframe.document).height(self.initialTopFrameHeight);
    }

    // reinitialize overlay
    if (self.$el) {
      self.$el.data('plone-overlay', new PloneOverlay(self.$el, self.options));
    }

    // shrink iframe when showing overlay
    if (iframe) {
      iframe.shrink();
    }

    // hidden hook
    if (self.options.onHidden) {
      self.options.onHidden.call(self);
    }
    if (self.$el) {
      self.$el.trigger('plone.overlay.hidden');
    }
  },
  getBaseURL: function(text){
    return $((/<base[^>]*>((.|[\n\r])*)<\/base>/im).exec(text)[0]).attr('href');
  }
});


Patterns.register(PloneOverlay);


}(window.jQuery, window.Patterns, window.jQuery.iframe));
