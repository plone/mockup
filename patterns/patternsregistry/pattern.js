/* Moment pattern.
 *
 * Options:
 *    registry(array): List of registry entries ([])
 *    bundleOrder(array): List of bundle names for their order ([])
 *    overrides(array): List of current overrides ([])
 *    saveUrl(string): url to save registry to (null)
 *    buildUrl(string): url to save build current bundles (null)
 *    overrideManageUrl(string): url to save/delete overridden resource with(null)
 *    baseUrl(string): to render resources from(null)
 *
 * Documentation:
 *    # Defaults
 *
 *    {{ example-1 }}
 *
 *
 * Example: example-1
 *    <div class="pat-patternsregistry"
 *        data-pat-patternsregistry='{"registry":[{
 *                                      "name": "plone",
 *                                      "url": "js/bundles",
 *                                      "js": "plone.js",
 *                                      "css": [],
 *                                      "css_deps": [],
 *                                      "deps": "",
 *                                      "export": "",
 *                                      "conf": "",
 *                                      "bundle": true,
 *                                      "condition": "",
 *                                      "enabled": true,
 *                                      "skinnames": []
 *                                    }, {
 *                                      "name": "plone-auth",
 *                                      "url": "js/bundles",
 *                                      "js": "plone-auth.js",
 *                                      "css_deps": [],
 *                                      "css": [],
 *                                      "deps": "",
 *                                      "export": "",
 *                                      "conf": "",
 *                                      "bundle": true,
 *                                      "condition": "",
 *                                      "enabled": true,
 *                                      "skinnames": []
 *                                    }, {
 *                                      "name": "modal",
 *                                      "url": "patterns/modal",
 *                                      "js": "pattern.js",
 *                                      "css_deps": [],
 *                                      "css": [
 *                                        "pattern.modal.less"
 *                                      ],
 *                                      "deps": "",
 *                                      "export": "",
 *                                      "conf": "",
 *                                      "bundle": false,
 *                                      "condition": "",
 *                                      "enabled": true,
 *                                      "skinnames": []
 *                                    }, {
 *                                      "name": "autotoc",
 *                                      "url": "patterns/autotoc",
 *                                      "js": "pattern.js",
 *                                      "css_deps": [],
 *                                      "css": [
 *                                        "pattern.autotoc.less",
 *                                        "pattern.other.less" 
 *                                      ],
 *                                      "deps": "",
 *                                      "export": "",
 *                                      "conf": "",
 *                                      "bundle": false,
 *                                      "condition": "",
 *                                      "enabled": true,
 *                                      "skinnames": []
 *                                    }, {
 *                                      "name": "pickadate",
 *                                      "url": "patterns/pickadate",
 *                                      "js": "pattern.js",
 *                                      "css_deps": [],
 *                                      "css": [
 *                                        "pattern.pickadate.less"
 *                                      ],
 *                                      "deps": "",
 *                                      "export": "",
 *                                      "conf": "",
 *                                      "bundle": false,
 *                                      "condition": "",
 *                                      "enabled": true,
 *                                      "skinnames": []
 *                                    }],
 *                                    "bundleOrder": ["plone", "plone-auth"],
 *                                    "overrides": ["patterns/pickadate/pattern.js"],
 *                                    "baseUrl": "/patterns-resources",
 *                                    "overrideManageUrl": "/pattern-override-manager",
 *                                    "saveUrl": "/"}'>
 *    </div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/* global alert, confirm */

define([
  'jquery',
  'mockup-patterns-base',
  'underscore',
  'backbone',
  'mockup-ui-url/views/base',
  'mockup-patterns-sortable',
  'mockup-patterns-texteditor',
  'mockup-utils'
], function($, Base, _, Backbone, BaseView, Sortable, TextEditor, utils) {
  'use strict';

  Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
      var k = new_index - this.length;
      while ((k--) + 1) {
        this.push(undefined);
      }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
  };

  var PatternBoolFieldView = BaseView.extend({
    tagName: 'div',
    className: 'col-sm-offset-2 col-sm-10',
    template: _.template(
      '<div class="checkbox">' +
        '<label>' +
          '<input type="checkbox"> <%- title %></label>' +
      '</div>'),
    events: {
      'change input': 'inputChanged'
    },
    inputChanged: function(){
      if(this.$('input')[0].checked){
        this.options.registryData[this.options.name] = true;
      }else{
        this.options.registryData[this.options.name] = false;
      }
    },
    afterRender: function(){
      if(this.options.value){
        this.$('input')[0].checked = true;
      }
    }
  });

  var PatternListFieldView = BaseView.extend({
    tagName: 'div',
    className: 'form-group',
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<div class="col-sm-10 fields" />' +
      '<button class="col-sm-offset-2 btn btn-default">Add</button>'),
    events: {
      'click button': 'addRowClicked',
      'change input': 'inputChanged'
    },
    inputChanged: function(){
      var self = this;
      var data = [];
      self.$('input').each(function(){
        data.push($(this).val());
      });
      self.options.registryData[self.options.name] = self.options.value = data;
    },
    addRowClicked: function(e){
      var self = this;
      e.preventDefault();
      self.options.value.push('');
      self.render();
    },
    afterRender: function(){
      var self = this;
      var $container = self.$('.fields');
      _.each(self.options.value, function(value){
        $container.append('<input class="form-control input-sm" value="' + value + '" />');
      });
    }
  });

  var PatternTextAreaFieldView = BaseView.extend({
    tagName: 'div',
    className: 'form-group',
    events: {
      'change input': 'inputChanged'
    },
    inputChanged: function(){
      this.options.registryData[this.options.name] = this.$('textarea').val();
    },
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<div class="col-sm-10">' +
        '<textarea class="form-control input-sm" name="name"><%- value %></textarea>' +
      '</div>')
  });

  var PatternInputFieldView = BaseView.extend({
    tagName: 'div',
    className: 'form-group',
    events: {
      'change input': 'inputChanged'
    },
    inputChanged: function(){
      this.options.registryData[this.options.name] = this.$('input').val();
    },
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<div class="col-sm-10">' +
        '<input class="form-control input-sm" name="name" value="<%- value %>" />' +
      '</div>')
  });

  var PatternEntryView = BaseView.extend({
    tagName: 'div',
    className: 'pattern-entry',
    fields: [{
      name: 'name',
      title: 'Name'
    }, {
      name: 'url',
      title: 'Resources base url'
    }, {
      name: 'js',
      title: 'Main JavaScript file'
    }, {
      name: 'css',
      title: 'CSS/LESS',
      view: PatternListFieldView
    }, {
      name: 'css_deps',
      title: 'CSS Dependencies',
      view: PatternListFieldView
    },{
      name: 'init',
      title: 'Init instruction for requirejs shim(if used)'
    }, {
      name: 'deps',
      title: 'Dependencies'
    }, {
      name: 'export',
      title: 'Export vars for shim(if used)'
    }, {
      name: 'conf',
      title: 'Configuration',
      view: PatternTextAreaFieldView
    }, {
      name: 'bundle',
      title: 'Is it a bundle?',
      view: PatternBoolFieldView
    }, {
      name: 'condition',
      title: 'Conditionally render this bundle'
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: PatternBoolFieldView
    }, {
      name: 'skinnames',
      title: 'Skin Names',
      view: PatternListFieldView
    }],
    template: _.template(
      '<h3><%- name %></h3>' +
      '<div class="panel-body form-horizontal">' +
      '</div>'
    ),
    afterRender: function(){
      var self = this;
      var $body = self.$('.panel-body');
      _.each(self.fields, function(field){
        var data = $.extend({registryData: self.options}, field, { value: self.options[field.name] });
        if(!data.value){
          data.value = '';
        }
        var View = field.view;
        if(!View){
          View = PatternInputFieldView;
        }
        $body.append((new View(data)).render().el);
      });
    }
  });

  var RegistryPatternListItem = BaseView.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<button class="pull-right btn btn-danger btn-xs">Delete</button>'
    ),
    events: {
      'click a': 'patternClicked',
      'click btn.btn-danger': 'deleteClicked'
    },
    afterRender: function(){
      this.$el.attr('data-name', this.options.name);
    },
    initialize: function(options, registryView, index) {
      var self = this;
      self.index = index;
      self.registryView = registryView;
      BaseView.prototype.initialize.apply(self, [options]);
    },
    patternClicked: function(e){
      e.preventDefault();
      this.registryView.showPatternEditor(this.options);
    },
    deleteClicked: function(e){
      e.preventDefault();
    }
  });

  var RegistryView = BaseView.extend({
    tagName: 'div',
    className: 'tab-pane',
    template: _.template(
      '<div class="clearfix">' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-warning build">Build</button>' +
          '<button class="btn btn-success save">Save</button>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="items col-md-3">' +
          '<ul class="bundles list-group">' +
            '<li class="list-group-item list-group-item-warning">Bundles</li>' +
          '</ul>' +
          '<ul class="patterns list-group">' +
            '<li class="list-group-item list-group-item-warning">Patterns</li>' +
          '</ul>' +
        '</div>' +
        '<div class="form col-md-9"></div>'),
    events: {
      'click button.build': 'buildClicked',
      'click button.save': 'saveClicked'
    },
    selectedPattern: null,
    initialize: function(options, tabView) {
      var self = this;
      self.tabView = tabView;
      BaseView.prototype.initialize.apply(self, [options]);
    },
    showPatternEditor: function(pattern){
      this.$('.form').empty().append((new PatternEntryView(pattern)).render().el);
      this.selectedPattern = pattern;
    },

    getOrderedBundles: function(){
      var self = this;
      var bundles = [];
      _.each(self.options.bundleOrder, function(name){
        var pattern = _.find(self.options.registry, function(pat){
          return pat.bundle && pat.name === name;
        });
        if(pattern){
          bundles.push(pattern);
        }
      });
      return bundles.concat(_.filter(self.options.registry, function(pattern){
        return pattern.bundle && _.indexOf(self.options.bundleOrder, pattern.name) === -1;
      }));
    },

    afterRender: function(){
      var self = this;
      self.$bundles = self.$('ul.bundles');
      self.$patterns = self.$('ul.patterns');
      _.each(self.getOrderedBundles(), function(pattern){
        self.$bundles.append((new RegistryPatternListItem(pattern, self)).render().el);
      });
      var patterns = _.filter(self.options.registry, function(pattern){
        return !pattern.bundle;
      });
      patterns = _.sortBy(patterns, function(pat){ return pat.name; });
      _.each(patterns, function(pattern){
        self.$patterns.append((new RegistryPatternListItem(pattern, self)).render().el);
      });
      self.dd = new Sortable(self.$bundles, {
        selector: 'li',
        dragClass: 'dragging',
        drop: function($el, delta) {
          if (delta !== 0){
            var order = [];
            self.$bundles.find('li').each(function(){
              order.push($(this).attr('data-name'));
            });
            self.options.bundleOrder = order;
            self.render();
          }
        }
      });
      if(self.selectedPattern !== null){
        self.showPatternEditor(self.selectedPattern);
      }
      return self;
    },
    saveClicked: function(e){
      var self = this;
      e.preventDefault();
      $.ajax({
        url: self.options.saveUrl,
        type: 'POST',
        data: {
          _authenticator: utils.getAuthenticator(),
          registry: JSON.stringify(self.options.registry),
          bundleOrder: JSON.stringify(self.options.bundleOrder)
        },
        success: function(){
          self.render();
        }
      });
    },
    buildClicked: function(e){
      e.preventDefault();
      $.ajax({
        url: this.options.buildUrl,
        type: 'POST',
        data: {
          _authenticator: utils.getAuthenticator()
        }
      });
    }
  });

  var OverrideResource = BaseView.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: _.template('<a href="#"><%- filepath %></a> ' +
      '<div class="btn-group pull-right">' +
        '<button class="btn btn-danger btn-xs">Delete</button>' +
        '<% if(view.canSave) { %> ' +
          '<button class="btn btn-primary btn-xs">Save</button> ' +
          '<button class="btn btn-default btn-xs">Cancel</button> ' +
        ' <% } %>' +
      '</div>'),

    events: {
      'click a': 'itemClicked',
      'click button.btn-danger': 'itemDeleted',
      'click button.btn-primary': 'itemSaved',
      'click button.btn-default': 'itemCancel'
    },

    canSave: false,

    serializedModel: function(){
      return $.extend({}, { view: this }, this.options);
    },

    initialize: function(options, overridesView) {
      var self = this;
      self.overridesView = overridesView;
      BaseView.prototype.initialize.apply(self, [options]);
    },

    itemSaved: function(e){
      e.preventDefault();
      var self = this;
      $.ajax({
        url: self.overridesView.options.overrideManageUrl,
        type: 'POST',
        data: {
          _authenticator: utils.getAuthenticator(),
          action: 'save',
          filepath: self.options.filepath,
          data: self.editor.editor.getValue()
        },
        success: function(){
          self.canSave = false;
          self.render();
        },
        error: function(){
          alert('Error saving override');
        }
      });
    },

    itemDeleted: function(e){
      e.preventDefault();
      var self = this;
      if(confirm('Are you sure you want to delete this override?')){
        this.overridesView.options.overrides.splice(self.options.index, 1);
        this.render();
        $.ajax({
          url: this.overridesView.options.overrideManageUrl,
          type: 'POST',
          data: {
            _authenticator: utils.getAuthenticator(),
            action: 'delete',
            filepath: self.options.filepath
          },
          success: function(){
            self.canSave = false;
            self.render();
          },
          error: function(){
            alert('Error deleting override');
          }
        });
      }
    },

    itemCancel: function(e){
      e.preventDefault();
      this.editor.$el.remove();
      this.canSave = false;
      this.render();
    },

    itemClicked: function(e){
      var self = this;
      e.preventDefault();
      var options = self.overridesView.options;
      var override = options.overrides[self.options.index];
      var url = options.baseUrl;
      if(url[url.length - 1] !== '/'){
        url += '/';
      }
      $.ajax({
        url: url + override,
        success: function(data){
          var $pre = $('<pre class="pat-texteditor" />');
          $pre.html(data);
          self.overridesView.$editorContainer.empty().append($pre);
          self.editor = new TextEditor($pre, {
            width: 500
          });
          self.editor.setSyntax(override);
          self.editor.editor.on('change', function(){
            if(!self.canSave){
              self.canSave = true;
              self.render();
            }
          });
          self.render();
        },
        error: function(){
          alert('error loading resource for editing');
        }
      });
    }
  });

  var OverridesView = BaseView.extend({
    tagName: 'div',
    className: 'tab-pane',
    template: _.template(
      '<form class="row">' +
        '<div class="col-md-6 col-md-offset-6">' +
          '<div class="input-group">' +
            '<input type="text" class="form-control search-field" />' +
            '<span class="input-group-btn">' +
              '<button class="btn btn-default" type="button">Search</button>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</form>' +
      '<div class="row">' +
        '<ul class="items list-group col-md-5"></ul>' +
        '<div class="col-md-7">' +
          '<ul class="hidden list-group search-results" />' +
          '<div class="editor" />' +
        '</div>' +
      '</div>'),
    events: {
      'submit form': 'noSubmit',
      'keyup form input': 'textChange',
      'click button.clear': 'clearSearchResults',
      'click button.customize': 'customizeResource'
    },

    noSubmit: function(e){
      e.preventDefault();
    },

    clearSearchResults: function(e){
      e.preventDefault();
      this.$searchResults.addClass('hidden');
      this.$searchInput.attr('value', '');
    },

    customizeResource: function(e){
      e.preventDefault();
      var $btn = $(e.target);
      this.options.overrides.push($btn.parent().find('span').html());
      this.render();
    },

    textChange: function(){
      var self = this;
      var q = self.$searchInput.val();
      if(q.length < 4){
        self.$searchResults.addClass('hidden');
        return;
      }
      q = q.toLowerCase();
      self.$searchResults.empty().removeClass('hidden');
      self.$searchResults.append('<li class="list-group-item list-group-item-warning">' +
        'Results<button class="btn btn-default pull-right btn-xs clear">Clear</button></li>');
      var matches = [];
      _.each(self.options.registry, function(pattern){
        if((pattern.url + pattern.js).toLowerCase().indexOf(q) !== -1){
          matches.push(pattern.url + '/' + pattern.js);
        }
        for(var i=0; i<pattern.css.length; i++){
          if((pattern.url + pattern.css[i]).toLowerCase().indexOf(q) !== -1){
            matches.push(pattern.url + '/' + pattern.css[i]);
            break;
          }
        }
      });
      _.each(matches, function(filepath){
        self.$searchResults.append(
          '<li class="list-group-item"><span>' + filepath + '</span> ' +
          '<button class="btn btn-danger pull-right btn-xs customize">Customize</button></li>'
        );
      });
    },

    initialize: function(options, tabView) {
      var self = this;
      self.tabView = tabView;
      BaseView.prototype.initialize.apply(self, [options]);
    },

    afterRender: function(){
      var self = this;
      self.$ul = self.$('ul.items');
      _.each(self.options.overrides, function(filepath, index){
        self.$ul.append((new OverrideResource({ index: index, filepath: filepath }, self)).render().el);
      });
      self.$editorContainer = self.$('.editor');
      self.$searchInput = self.$('form input');
      self.$searchResults = self.$('.search-results');
    }
  });

  var TabView = BaseView.extend({
    tagName: 'div',
    showOverrides: false,
    template: _.template('' +
      '<ul class="nav nav-tabs" role="tablist" />' +
      '<div class="tab-content" />'
    ),
    events: {
      'click .registry-btn a': 'hideShow',
      'click .overrides-btn a': 'hideShow'
    },
    hideShow: function(e){
      var self = this;
      if(e !== undefined){
        e.preventDefault();
        if($(e.target).parent().hasClass('registry-btn')){
          self.showOverrides = false;
        }else{
          self.showOverrides = true;
        }
      }
      if(self.showOverrides){
        self.$overridesBtn.addClass('active');
        self.overridesView.$el.addClass('active');
        self.$registryBtn.removeClass('active');
        self.registryView.$el.removeClass('active');
      }else{
        self.$registryBtn.addClass('active');
        self.registryView.$el.addClass('active');
        self.$overridesBtn.removeClass('active');
        self.overridesView.$el.removeClass('active');
      }
    },
    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.registryView = new RegistryView(options, self);
      self.overridesView = new OverridesView(options, self);
    },
    render: function(){
      var self = this;
      self.$el.append(self.template());
      self.$tabs = self.$('ul.nav-tabs');
      self.$content = self.$('.tab-content');
      self.$registryBtn = $('<li class="registry-btn"><a href="#">Registry</a></li>');
      self.$overridesBtn = $('<li class="overrides-btn"><a href="#">Overrides</a></li>');
      self.$tabs.append(self.$registryBtn).append(self.$overridesBtn);
      self.$content.append(self.registryView.render().el);
      self.$content.append(self.overridesView.render().el);
      self.hideShow();
      return self;
    }
  });

  var PatternsRegistry = Base.extend({
    name: 'patternsregistry',
    defaults: {
      registry: [],
      bundleOrder: [],  
      overrides: [],
      overrideUrl: null,
      saveUrl: null,
      baseUrl: null
    },
    init: function() {
      var self = this;

      self.tabs = new TabView(self.options);
      self.$el.append(self.tabs.render().el);
    }
  });

  return PatternsRegistry;

});
