/* Theme Mapper pattern.
 *
 * Options:
 *    filemanagerConfig(object): The file manager pattern config ({})
 *    mockupUrl(string): Mockup url (null)
 *    unthemedUrl(string): unthemed site url (null)
 *    helpUrl(string): Helper docs url (null)
 *    previewUrl(string): url to preview theme (null)
 *
 *
 * Documentation:
 *
 *    # Basic example
 *
 *    {{ example-1 }}
 *
 *
 * Example: example-1
 *
 *    <div class="pat-thememapper"
 *         data-pat-thememapper='filemanagerConfig:{"actionUrl":"/filemanager-actions"};
 *                               mockupUrl:/tests/files/mapper.html;
 *                               unthemedUrl:/tests/files/mapper.html;
 *                               previewUrl:http://www.google.com;
 *                               helpUrl:http://docs.diazo.org/en/latest'></div>
 *
 */


define([
  'jquery',
  'mockup-patterns-base',
  'underscore',
  'text!mockup-patterns-thememapper-url/templates/inspector.xml',
  'mockup-patterns-filemanager',
  'mockup-ui-url/views/button',
  'mockup-ui-url/views/buttongroup'
], function($, Base, _, InspectorTemplate, FileManager, ButtonView, ButtonGroup) {
  'use strict';

  var inspectorTemplate = _.template(InspectorTemplate);


  var RuleBuilder = function(callback){
    /**
      * Rule builder
      *
      * Contains functions to build CSS and XPath selectors as well as a Diazo rule
      * from a given node, and acts as a state machine for the rules wizard.
      *
      * The callback is called whenever the state machine progresses.
      */

    var self = this;
    self.callback = callback;

    self.active = false;
    self.currentScope = null;

    self.ruleType = null;
    self.subtype = null;

    self._contentElement = null;
    self._themeElement = null;

    self.end = function() {
      self._contentElement = null;
      self._themeElement = null;
      self.currentScope = null;
      self.active = false;
      self.ruleType = null;
      self.subtype = null;

      self.callback(this);
    };

    /**
    * Build a diazo rule. 'themeChildren' and 'contentChildren' should be true or
    * false to indicate whether a -children selector is to be used.
    */
    self.buildRule = function(themeChildren, contentChildren) {
      if (self.ruleType === null) {
        return '';
      }

      if (self.subtype !== null) {
        if (self.subtype === 'content') {
          return '<' + self.ruleType + '\n    ' +
            self.calculateDiazoSelector(self._contentElement, 'content', contentChildren) +
            '\n    />';
        } else if (self.subtype === 'theme') {
          return '<' + self.ruleType + '\n    ' +
            self.calculateDiazoSelector(self._themeElement, 'theme', themeChildren) +
            '\n    />';
        }

      } else {
        return '<' + self.ruleType + '\n    ' +
          self.calculateDiazoSelector(self._themeElement, 'theme', themeChildren) + '\n    ' +
          self.calculateDiazoSelector(self._contentElement, 'content', contentChildren) +
          '\n    />';
      }

      // Should never happen
      return 'Error';
    };

    /**
    * Return a valid (but not necessarily unique) CSS selector for the given
    * element.
    */
    self.calculateCSSSelector = function(element) {
      var selector = element.tagName.toLowerCase();

      if (element.id) {
        selector += '#' + element.id;
      } else {
        var classes = $(element).attr('class');
        if(classes !== undefined) {
          var splitClasses = classes.split(/\s+/);
          for(var i = 0; i < splitClasses.length; i=i+1) {
            if(splitClasses[i] !== '' && splitClasses[i].indexOf('_theming') === -1) {
              selector += '.' + splitClasses[i];
              break;
            }
          }
        }
      }

      return selector;
    };

    /**
    * Return a valid, unqiue CSS selector for the given element. Returns null if
    * no reasoanble unique selector can be built.
    */
    self.calculateUniqueCSSSelector = function(element) {
      var paths = [];
      var path = null;

      var parents = $(element).parents();
      var ultimateParent = parents[parents.length - 1];

      while (element && element.nodeType === 1) {
        var selector = this.calculateCSSSelector(element);
            paths.splice(0, 0, selector);
            path = paths.join(' ');

        // The ultimateParent constraint is necessary since
        // this may be inside an iframe
        if($(path, ultimateParent).length === 1) {
          return path;
        }

        element = element.parentNode;
      }

      return null;
    };

    /**
    * Return a valid, unique XPath selector for the given element.
    */
    self.calculateUniqueXPathExpression = function(element) {
      var parents = $(element).parents();

      function elementIndex(e) {
        var siblings = $(e).siblings(e.tagName.toLowerCase());
        if(siblings.length > 0) {
          return '[' + ($(e).index() + 1) + ']';
        } else {
          return '';
        }
      }

      var xpathString = '/' + element.tagName.toLowerCase();
      if(element.id) {
        return '/' + xpathString + '[@id="' + element.id + '"]';
      } else {
        xpathString += elementIndex(element);
      }

      for(var i = 0; i < parents.length; i=i+1) {
        var p = parents[i];
        var pString = '/' + p.tagName.toLowerCase();

        if(p.id) {
          return '/' + pString + '[@id="' + p.id + '"]' + xpathString;
        } else {
          xpathString = pString + elementIndex(p) + xpathString;
        }
      }

      return xpathString;
    };

    /**
    * Return a unique CSS or XPath selector, preferring a CSS one.
    */
    self.bestSelector = function(element) {
      return self.calculateUniqueCSSSelector(element) ||
             self.calculateUniqueXPathExpression(element);
    };

    /**
    * Build a Diazo selector element with the appropriate namespace.
    */
    self.calculateDiazoSelector = function(element, scope, children) {
      var selectorType = scope;
      if(children) {
        selectorType += '-children';
      }

      var cssSelector = self.calculateUniqueCSSSelector(element);
      if(cssSelector) {
        return 'css:' + selectorType + '="' + cssSelector + '"';
      } else {
        var xpathSelector = self.calculateUniqueXPathExpression(element);
        return selectorType + '="' + xpathSelector + '"';
      }

    };
  };

  var Inspector = Base.extend({
    defaults: {
      name: 'name',
      ruleBuilder: null,
      onsave: function() {},
      onselect: function() {},
      showReload: false
    },
    init: function() {
      var self = this;
      self.enabled = true;
      self.currentOutline = null;
      self.activeClass = '_theming-highlighted';
      self.saved = null;
      self.ruleBuilder = self.options.ruleBuilder;

      self.$el.html(inspectorTemplate(self.options));
      self.$on = $('.turnon', self.$el);
      self.$off = $('.turnoff', self.$el);
      self.$frame = $('iframe', self.$el);
      self.$frameInfo = $('.frame-info', self.$el);
      self.$frameShelfContainer = $('.frame-shelf-container', self.$el);
      self.$selectorInfo = $('.selector-info', self.$frameShelfContainer);
      self.$currentSelector = $('.current-selector', self.$frameInfo);

      self.$reloadBtn = $('a.refresh', self.$el);

      $('a.clear', self.$frameShelfContainer).click(function(e) {
        e.preventDefault();
        self.save(null);
      });
      self.$reloadBtn.click(function(e) {
        e.preventDefault();
        self.$frame.attr('src', self.$frame.attr('src'));
        self.setupFrame();
      });
      $('a.fullscreen', self.$el).click(function(e){
        e.preventDefault();
        if (self.$el.hasClass('show-fullscreen')){
          self.$el.removeClass('show-fullscreen');
        } else {
          self.$el.addClass('show-fullscreen');
        }
      });

      if (!self.options.showReload){
        self.$reloadBtn.hide();
      }

      self.$on.click(function() {
        self.on();
      });
      self.$off.click(function() {
        self.off();
      });

      self.setupFrame();
    },
    on: function() {
      var self = this;
      self.$off.prop('disabled', false);
      self.$on.prop('disabled', true);
      self.enabled = true;
    },
    off: function() {
      var self = this;
      self.$on.prop('disabled', false);
      self.$off.prop('disabled', true);
      self.enabled = false;
    },
    setupFrame: function() {
      var self = this;
      /* messy way to check if iframe is loaded */
      var checkit = function() {
        if (self.$frame.contents().find('body').find('*').length > 0){
          self._setupFrame();
        } else {
          setTimeout(checkit, 100);
        }
      };
      setTimeout(checkit, 200);
    },
    _setupFrame: function() {
      var self = this;

      self.$frame.contents().find('*').hover(function(e) {
        if(self.enabled) {
          e.stopPropagation();
          self.$frame.focus();
          self.setOutline(this);
        }
      }, function() {
        if($(this).hasClass(self.activeClass)) {
          self.clearOutline(this);
        }
      }).click(function (e) {
        if(self.enabled) {
          e.stopPropagation();
          e.preventDefault();

          self.setOutline(this);
          self.save(this);
          return false;
        }
        return true;
      });

      self.$frame.contents().keyup(function(e) {
        if (!self.enabled){
          return true;
        }

        // ESC -> Move selection to parent node
        if(e.keyCode === 27 && self.currentOutline !== null) {
          e.stopPropagation();
          e.preventDefault();

          var parent = self.currentOutline.parentNode;
          if(parent !== null && parent.tagName !== undefined) {
            self.setOutline(parent);
          }
        }

        // Enter -> Equivalent to clicking on selected node
        if(e.keyCode === 13 && self.currentOutline !== null) {
          e.stopPropagation();
          e.preventDefault();

          self.save(self.currentOutline);

          return false;
        }
      });
    },
    save: function(element) {
      var self = this;
      this.saved = element;
      if(element === null) {
        self.$frameShelfContainer.hide();
      } else {
        self.$frameShelfContainer.show();
      }

      self.animateSelector();
      self.$selectorInfo.text(element === null ? '' : self.ruleBuilder.bestSelector(element));

      this.options.onsave(this, element);
    },
    clearOutline: function(element){
      var self = this;
      $(element).css('outline', '');
      $(element).css('cursor', '');

      $(element).removeClass(self.activeClass);

      self.currentOutline = null;
      self.$currentSelector.text('');
      self.options.onselect(self, null);
    },
    setOutline: function(element) {
      var self = this;
      var $el = $(element);

      $el.css('outline', 'solid red 1px');
      $el.css('cursor', 'crosshair');

      $el.addClass(self.activeClass);

      if(self.currentOutline !== null) {
        self.clearOutline(self.currentOutline);
      }

      self.currentOutline = element;
      self.$currentSelector.text(self.ruleBuilder.bestSelector(element));

      self.options.onselect(self, element);
    },
    animateSelector: function(highlightColor, duration) {
      var self = this;
      var highlightBg = highlightColor || '#FFFFE3';
      var animateMs = duration || 750;
      var originalBg = self.$frameInfo.css('background-color');

      if (!originalBg || originalBg === highlightBg){
          originalBg = '#FFFFFF'; // default to white
      }

      self.$frameInfo
        .css('backgroundColor', highlightBg)
        .animate({ backgroundColor: originalBg }, animateMs, null, function () {
          self.$frameInfo.css('backgroundColor', originalBg);
        });
    }
  });


  var ThemeMapper = Base.extend({
    name: 'thememapper',
    trigger: '.pat-thememapper',
    defaults: {
      filemanagerConfig: {},
      mockupUrl: null,
      unthemedUrl: null,
      helpUrl: null,
      previewUrl: null
    },
    buttonGroup: null,
    showInspectorsButton: null,
    buildRuleButton: null,
    previewThemeButton: null,
    helpButton: null,
    hidden: true,
    fileManager: null,
    mockupInspector: null,
    unthemedInspector: null,
    $fileManager: null,
    $container: null,
    $mockupInspector: null,
    $unthemedInspector: null,
    init: function() {
      var self = this;
      if(typeof(self.options.filemanagerConfig) === 'string'){
        self.options.filemanagerConfig = $.parseJSON(self.options.filemanagerConfig);
      }
      self.$fileManager = $('<div class="pat-filemanager"/>').appendTo(self.$el);
      self.$container = $('<div class="row"></div>').appendTo(self.$el);
      self.$mockupInspector = $('<div class="mockup-inspector"/>').appendTo(self.$container);
      self.$unthemedInspector = $('<div class="unthemed-inspector"/>').appendTo(self.$container);

      // initialize patterns now
      self.ruleBuilder = new RuleBuilder(function(){
        debugger; //callback
      });
      self.fileManager = new FileManager(self.$fileManager, self.options.filemanagerConfig);
      self.mockupInspector = new Inspector(self.$mockupInspector, {
        name: 'HTML mockup',
        ruleBuilder: self.ruleBuilder,
        url: self.options.mockupUrl,
        showReload: true
      });
      self.unthemedInspector = new Inspector(self.$unthemedInspector, {
        name: 'Unthemed content',
        ruleBuilder: self.ruleBuilder,
        url: self.options.unthemedUrl
      });
      self.setupButtons();

      // initially, let's hide the panels
      self.hideInspectors();
    },
    showInspectors: function(){
      var self = this;
      var $parent = self.$mockupInspector.parent();
      $parent.slideDown();
      self.hidden = false;
      self.showInspectorsButton.options.title = 'Hide inspectors';
      self.showInspectorsButton.applyTemplate();
      $('html, body').animate({
        scrollTop: $parent.offset().top - 50
      }, 1000);
    },
    hideInspectors: function(){
      var self = this;
      var $parent = self.$mockupInspector.parent();
      $parent.slideUp();
      self.hidden = true;
      self.showInspectorsButton.options.title = 'Show inspectors';
      self.showInspectorsButton.applyTemplate();
    },
    setupButtons: function(){
      var self = this;
      self.showInspectorsButton = new ButtonView({
        id: 'showinspectors',
        title: 'Show inspectors',
        tooltip: 'Show inspector panels',
        context: 'default'
      });
      self.showInspectorsButton.on('button:click', function(){
        if (self.hidden) {
          self.showInspectors();
        } else {
          self.hideInspectors();
        }
      });

      self.buildRuleButton = new ButtonView({
        id: 'buildrule',
        title: 'Build rule',
        tooltip: 'rule building wizard',
        context: 'default'
      });

      self.previewThemeButton = new ButtonView({
        id: 'previewtheme',
        title: 'Preview theme',
        tooltip: 'preview theme in a new window',
        context: 'default'
      });
      self.previewThemeButton.on('button:click', function(){
        window.open(self.options.previewUrl);
      });

      self.helpButton = new ButtonView({
        id: 'helpbutton',
        title: 'Help',
        tooltip: 'Show help',
        context: 'default'
      });
      self.helpButton.on('button:click', function(){
        window.open(self.options.helpUrl);
      });

      self.buttonGroup = new ButtonGroup({
        items: [
          self.showInspectorsButton,
          self.buildRuleButton,
          self.previewThemeButton,
          self.helpButton
        ],
        id: 'mapper'
      });
      $('#toolbar .navbar', self.$el).append(self.buttonGroup.render().el);
    }
  });

  return ThemeMapper;

});
