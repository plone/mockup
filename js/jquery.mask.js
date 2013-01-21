// Creates mask.
//
// Author (of few little changes): Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//
// Description: 
//
//   Stripped down version of jquerytools $.mask which creates mask in top
//   frame.
//
// License:
//
//   I guess same license as jquerytools $.mask code.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global jQuery:false */


(function($, undefined) {
"use strict";

/* one of the greatest headaches in the tool. finally made it */
function viewport(window, document) {

  // the horror case
  if ($.browser.msie) {

    // if there are no scrollbars then use window.height
    var d = $(document).height(), w = $(window).height();

    return [
      window.innerWidth || // ie7+
      document.documentElement.clientWidth || // ie6
      document.body.clientWidth, // ie6 quirks mode
      d - w < 20 ? w : d
    ];
  }

  // other well behaving browsers
  return [$(document).width(), $(document).height()];
}

function call(fn) {
  if (fn) { return fn.call($.iframeMask); }
}


$.Mask = function(config) { this._init(config); };
$.Mask.prototype = {

  _init: function(config) {
    var self = this;
    self._loaded = false;
    self.config = $.extend({
      maskId: 'exposeMask',
      loadSpeed: 'slow',
      closeSpeed: 'fast',
      closeOnClick: false,
      closeOnEsc: false,
      window: window.parent,
      document: window.parent.document,

      // css settings
      zIndex: 400,
      opacity: 0.8,
      startOpacity: 0,
      color: '#000',

      // callbacks
      onLoad: null,
      onClose: null
    }, config || {});
  },

  getMask: function() {
    var self = this,
        el = $("#" + self.config.maskId, self.config.document);

    // create if it doesnt exists
    if (!el.length) {
      el = $('<div/>').attr("id", self.config.maskId);
      $("body", self.config.document).append(el);
    }

    return el;
  },

  isLoaded: function(fully) {
    return fully ? this._loaded === 'full' : this._loaded;
  },

  getConf: function() {
    return this.config;
  },

  load: function(config) {
    var self = this;

    // already loaded ?
    if (self.loaded) { return self; }

    // configuration
    if (typeof config === 'string') {
        config = { color: config };
    }

    // use latest config
    $.extend(self.config, config);

    // set position and dimensions
    var mask = self.getMask(),
        size = viewport(self.config.window, self.config.document);

    mask.css({
      position:'absolute',
      top: 0,
      left: 0,
      width: size[0],
      height: size[1],
      display: 'none',
      opacity: self.config.startOpacity,
      zIndex: self.config.zIndex
    });

    if (self.config.color) {
      mask.css("background-color", self.config.color);
    }

    // onBeforeLoad
    if (call(self.config.onBeforeLoad) === false) {
      return self;
    }

    // esc button
    if (self.config.closeOnEsc) {
      $(self.config.document).on("keydown.mask", function(e) {
        if (e.keyCode === 27) {
          self.close();
        }
      });
    }

    // mask click closes
    if (self.config.closeOnClick) {
      mask.on("click.mask", function(e) {
        self.close();
      });
    }

    // resize mask when window is resized
    $(self.config.window).on("resize.mask", function() {
      self.fit();
    });

    // reveal mask
    self._loaded = true;
    mask
      .css({display: 'block'})
      .fadeTo(self.config.loadSpeed, self.config.opacity, function() {
        self.fit();
        self._loaded = "full";
        call(self.config.onLoad);
    });

    return this;
  },

  close: function() {
    var self = this;

    if (self.isLoaded()) {

      // onBeforeClose
      if (call(self.config.onBeforeClose) === false) { return self; }

      var mask = self.getMask();
      mask.fadeOut(self.config.closeSpeed, function() {
        call(self.config.onClose);
        self._loaded = false;
      });

      // unbind various event listeners
      $(self.config.document).off("keydown.mask");
      mask.off("click.mask");
      $(self.config.window).off("resize.mask");

    }

    return self;
  },

  fit: function() {
    var self = this;
    if (self.isLoaded()) {
      var mask = self.getMask(),
          size = viewport(self.config.window, self.config.document);
      mask.css({ width: size[0], height: size[1] });
    }
  }

};

// create global instance of mask
$.mask = new $.Mask();

}(window.jQuery));
