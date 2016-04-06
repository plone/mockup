define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-utils',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-patterns-structure-url/js/actions',
  'mockup-patterns-structure-url/js/actionmenu',
  'text!mockup-patterns-structure-url/templates/actionmenu.xml',
  'pat-registry',
  'translate',
  'mockup-patterns-modal',
  'mockup-patterns-tooltip',
  'bootstrap-dropdown'
], function($, _, BaseView, utils, Result, Actions, ActionMenu, ActionMenuTemplate, registry, _t) {
  'use strict';

  var ActionMenuView = BaseView.extend({
    className: 'btn-group actionmenu',
    template: _.template(ActionMenuTemplate),

    // Static menu options
    menuOptions: null,
    // Dynamic menu options
    menuGenerator: 'mockup-patterns-structure-url/js/actionmenu',
    needsRescan: false,

    eventConstructor: function(definition) {
      var self = this;
      var libName = definition.library,
          method = definition.method;

      if (!((typeof libName === 'string') && (typeof method === 'string'))) {
        return false;
      }

      var doEvent = function(e) {
        var libCls = require(libName);
        var lib = new libCls(self);
        return lib[method] && lib[method](e);
      };
      return doEvent;
    },

    events: function() {
      /* Backbone.view.events
       * Specify a set of DOM events, which will bound to methods on the view.
       */
      var self = this;
      var result = {};
      var menuOptionsCategorized = {};
      _.each(self.menuOptions, function(menuOption, key) {
          // set a unique identifier to uniquely bind the events.
          var idx = utils.generateId();
          menuOption.idx = idx;
          menuOption.name = key;  // we want to add the action's key as class name to the output.

          var category = menuOption.category || 'dropdown';
          if (menuOptionsCategorized[category] === undefined) {
              menuOptionsCategorized[category] = [];
          }
          menuOptionsCategorized[category].push(menuOption);
          if (menuOption.modal || menuOption.category === 'button') {
            self.needsRescan = true;
          }

		      // Create event handler and add it to the results object.
          var e = self.eventConstructor(menuOption);
          if (e) {
            result['click a.' + idx] = e;
          }
      });

      // Abusing the loop above to also initialize menuOptionsCategorized
      self.menuOptionsCategorized = menuOptionsCategorized;
      return result;
    },

    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.options = options;
      self.selectedCollection = self.app.selectedCollection;

      // Then acquire the constructor method if specified, and
      var menuGenerator = self.options.menuGenerator || self.menuGenerator;
      if (menuGenerator) {
        var menuGen = require(menuGenerator);
        // override those options here.  All definition done here so
        // that self.events() will return the right things.
        var menuOptions = menuGen(self);
        if (typeof menuOptions === 'object') {
          // Only assign this if we got the right basic type.
          self.menuOptions = menuOptions;
          // Should warn otherwise.
        }
      }
    },
    render: function() {
      var self = this;
      self.$el.empty();

      var data = this.model.toJSON();
      data.header = self.options.header || null;
      data.menuOptions = self.menuOptionsCategorized;

      self.$el.html(self.template($.extend({
        _t: _t,
        id: utils.generateId()
      }, data)));

      if (data.menuOptions.dropdown) {
        self.$dropdown = self.$('.dropdown-toggle');
        self.$dropdown.dropdown();
      }

      if (self.options.className) {
        self.$el.addClass(self.options.className);
      }

      if (this.needsRescan) {
        registry.scan(this.$el);
      }

      return this;
    }
  });

  return ActionMenuView;
});
