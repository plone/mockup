define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/base',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-utils',
  'mockup-patterns-structure-url/js/actions',
  'mockup-patterns-structure-url/js/actionmenu',
  'text!mockup-patterns-structure-url/templates/actionmenu.xml',
  'translate',
  'bootstrap-dropdown'
], function($, _, Backbone, BaseView, Result, utils, Actions, ActionMenu,
            ActionMenuTemplate, _t) {
  'use strict';

  var ActionMenuView = BaseView.extend({
    className: 'btn-group actionmenu',
    template: _.template(ActionMenuTemplate),

    // Static menu options
    menuOptions: null,
    // Dynamic menu options
    menuGenerator: 'mockup-patterns-structure-url/js/actionmenu',

    eventConstructor: function(definition) {
      var self = this;
      var libName = definition[0],
          method = definition[1];

      if (!((typeof libName === 'string') && (typeof method === 'string'))) {
        return false;
      }

      var doEvent = function(e) {
        var libCls = require(libName);
        var lib = new libCls(self)
        return lib[method] && lib[method](e);
      };
      return doEvent;
    },

    events: function() {
      var self = this;
      var result = {};
      _.each(self.menuOptions, function(menuOption, idx) {
        var e = self.eventConstructor(menuOption);
        if (e) {
          result['click .' + idx + ' a'] = e;
        }
      });
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
      data.menuOptions = self.menuOptions;

      self.$el.html(self.template($.extend({
        _t: _t,
        id: utils.generateId()
      }, data)));

      self.$dropdown = self.$('.dropdown-toggle');
      self.$dropdown.dropdown();

      if (self.options.className){
        self.$el.addClass(self.options.className);
      }
      return this;
    }
  });

  return ActionMenuView;
});
