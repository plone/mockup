/* Tooltip pattern.
 *
 * Options:
 *    enterEvent(string): Event used to trigger tooltip. ('mouseenter')
 *    exitEvent(string): Event used to dismiss tooltip. ('mouseleave')
 *
 * data-pat-tooltip Configuration
 *    ajaxUrl(string): the ajax source of tooltip content (null). if null, tooltip displays content of title
 *    contentSelector(string): selects a subset of content (null)
 *    class(string): add one or several (white space separated) class to tooltip, at the .tooltip.mockup-tooltip level
 *    style(object): add css styles to tooltip, at the .tooltip.mockup-tooltip level
 *    innerStyle(object): add css styles to tooltip, at the .tooltip-inner level
 *
 * Documentation:
 *    # Directions
 *
 *    You can use this inside Plone or on any static page. Please check below
 *    for additional directions for non-Plone sites as there are some lines
 *    of code you need to add to the header of your webpage.
 *
 *    # Adding tooltip using Plone
 *
 *    - Make sure your viewing the page you want to add the tool tip too.
 *    - Log in
 *    - Create some text that you want to be the link that will reveal the
 *      tooltip.
 *    - Select the view html button
 *    - Find your text, and surround it with an HTML tag. Any normal tag works fine.
 *    - It should look like:
 *      <span class="pat-tooltip" data-toggle="tooltip" title="Tooltip text">My link text</span>
 *    - Choose Save
 *
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *      <a href="#" data-toggle="tooltip" class="pat-tooltip"
 *            title="Setting the data-toggle and title makes this show up">
 *            Hover over this line to see a tooltip
 *      </a>
 *
 */

define([
  'jquery',
  'pat-base'
], function($, Base, undefined) {
  'use strict';

  //This is pulled almost directly from the Bootstrap Tooltip
  //extension. We rename it just to differentiate from the pattern.
  var bootstrapTooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  bootstrapTooltip.VERSION  = '3.2.0'

  bootstrapTooltip.DEFAULTS = {
    animation: true,
    placement: 'auto',
    selector: false,
    template: '<div class="tooltip mockup-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: true,  // TODO: fix bug, where this setting overwrites whatever is set in options
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  bootstrapTooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  bootstrapTooltip.prototype.getDefaults = function () {
    return bootstrapTooltip.DEFAULTS
  }

  bootstrapTooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  bootstrapTooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  bootstrapTooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    self.leaving = false;

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  bootstrapTooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)
    self.leaving = true;

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  bootstrapTooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)
      var inDom = $.contains(document.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return

      var $tip = this.tip()

      var tipId = this.getUID(this.type)
      var self = this;
      this.setContent().then(function() {
      $tip.attr('id', tipId)
      self.$element.attr('aria-describedby', tipId)

      if (self.options.animation) $tip.addClass('fade')

      var placement = typeof self.options.placement == 'function' ?
        self.options.placement.call(self, $tip[0], self.$element[0]) :
        self.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + self.type, self)

      self.options.container ? $tip.appendTo(self.options.container) : $tip.insertAfter(self.$element)

      var pos          = self.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = self.$element.parent()
        var parentDim    = self.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = self.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      self.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        self.$element.trigger('shown.bs.' + self.type);
        self.hoverState = null;
        if (self.leaving) {  // prevent a race condition bug when user has leaved before complete
          self.leave(self);
        }
      }

      $.support.transition && self.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()
      })
    }
  };

  bootstrapTooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  bootstrapTooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  bootstrapTooltip.prototype.setContent = function () {
    var $tip  = this.tip();
    var type = this.options.html ? 'html' : 'text';
    var selector = this.options.patTooltip ? this.options.patTooltip.contentSelector : null;

    function setContent(content) {
      if (type === 'html' && !!selector) {
        content = $(content).find(selector).html();
      }
      $tip.find('.tooltip-inner')[type](content);
    }
    function removeClasses() {
      $tip.removeClass('fade in top bottom left right')
    }
    var title = this.getTitle();
    var url = this.getUrl();
      if (!!url) {
        removeClasses();
        return $.get(url).then(function(content) {
          setContent(content);
        });
      } else {
        removeClasses();
        setContent(title);
        return new Promise(function(resolve, reject) {
          resolve(title)
        });
      }

  };

  bootstrapTooltip.prototype.getUrl = function () {
    return this.options.patTooltip ? this.options.patTooltip.ajaxUrl : null;
  };

  bootstrapTooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    this.$element.removeAttr('aria-describedby')

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  bootstrapTooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  bootstrapTooltip.prototype.hasContent = function () {
    return this.getTitle() || this.getUrl();
  };

  bootstrapTooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? { top: 0, left: 0 } : $element.offset())
  }

  bootstrapTooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  bootstrapTooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  bootstrapTooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options
    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  bootstrapTooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  bootstrapTooltip.prototype.tip = function () {
    if (!!this.$tip) {
      return this.$tip;
    }
    var $tip = this.$tip || $(this.options.template);
    if (this.options.patTooltip) {

    if (this.options.patTooltip.style) {
      $tip.css(this.options.patTooltip.style)
    }
    if (this.options.patTooltip['class']) {
      $tip.addClass(this.options.patTooltip['class'])
    }
    if (this.options.patTooltip.innerStyle) {
      $tip.find('.tooltip-inner').css(this.options.patTooltip.innerStyle)
    }
    }
    this.$tip = $tip;
    return $tip;
  }

  bootstrapTooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  bootstrapTooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  bootstrapTooltip.prototype.enable = function () {
    this.enabled = true
  }

  bootstrapTooltip.prototype.disable = function () {
    this.enabled = false
  }

  bootstrapTooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  bootstrapTooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  bootstrapTooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }

  var Tooltip = Base.extend({
    name: 'tooltip',
    trigger: '.pat-tooltip',
    parser: 'mockup',
    defaults: {
      html: false,
      placement: 'top'
    },
    init: function() {
        if (this.options.html === 'true' || this.options.html === true) {
          // TODO: fix the parser!
          this.options.html = true;
        } else {
          this.options.html = false;
        }
        this.data = new bootstrapTooltip(this.$el[0], this.options);
      },
  });

  return Tooltip;

});
