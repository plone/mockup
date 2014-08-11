/* Resource Registry pattern.
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
 *    <div class="pat-resourceregistry"
 *        data-pat-resourceregistry='{"bundles":{
 *                                     "plone": {
 *                                       "resource": "plone", "after": null,
 *                                       "expression": "", "enabled": true, "ie_condition": ""
 *                                     },
 *                                     "plone-auth": {
 *                                       "resource": "plone-auth", "after": "plone",
 *                                       "expression": "", "enabled": true, "ie_condition": ""
 *                                     },
 *                                     "barceloneta": {
 *                                       "resource": "plone", "after": "*",
 *                                       "expression": "", "enabled": true, "ie_condition": ""
 *                                     }
 *                                   },
 *                                   "resources": {
 *                                     "plone": {
 *                                       "url": "js/bundles", "js": "plone.js", "css_deps": [],
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "bundle": false
 *                                     },
 *                                     "plone-auth": {
 *                                       "url": "js/bundles", "js": "plone-auth.js", "css_deps": [],
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "bundle": false
 *                                     },
 *                                     "barceloneta": {
 *                                       "url": "js/bundles", "js": "barceloneta.js", "css_deps": [],
 *                                       "css": ["barceloneta.less"], "deps": "", "export": "",
 *                                       "conf": "", "bundle": false
 *                                     },
 *                                     "modal": {
 *                                       "url": "patterns/modal", "js": "pattern.js", "css_deps": [],
 *                                       "css": ["pattern.modal.less"], "deps": "", "export": "",
 *                                       "conf": "", "bundle": false
 *                                     },
 *                                     "autotoc": {
 *                                       "url": "patterns/autotoc", "js": "pattern.js", "css_deps": [],
 *                                       "css": ["pattern.autotoc.less", "pattern.other.less"],
 *                                       "deps": "", "export": "", "conf": "", "enabled": true
 *                                     },
 *                                     "pickadate": {
 *                                       "url": "patterns/pickadate", "js": "pattern.js", "css_deps": [],
 *                                       "css": ["pattern.pickadate.less"], "deps": "", "export": "",
 *                                       "conf": "", "enabled": true
 *                                     }
 *                                   },
 *                                   "overrides": ["patterns/pickadate/pattern.js"],
 *                                   "baseUrl": "/resources-registry",
 *                                   "overrideManageUrl": "/resource-override-manager",
 *                                   "saveUrl": "/save-resource-registry"}'>
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

  var ResourceInputFieldView = BaseView.extend({
    tagName: 'div',
    className: 'form-group',
    events: {
      'change input': 'inputChanged',
      'keyup input': 'textChanged'
    },
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<div class="col-sm-10">' +
        '<input class="form-control input-sm" name="name" value="<%- value %>" />' +
      '</div>'),
    timeout: -1,

    textChanged: function(){
      var self = this;
      if(self.timeout){
        clearTimeout(self.timeout);
      }
      setTimeout(function(){
        self.inputChanged();
      }, 200);
    },

    inputChanged: function(){
      this.options.registryData[this.options.name] = this.$('input').val();
    },

    afterRender: function(){
      this.$el.addClass('field-' + this.options.name);
    }

  });

  var ResourceBoolFieldView = ResourceInputFieldView.extend({
    className: 'col-sm-offset-2 col-sm-10',
    template: _.template(
      '<div class="checkbox">' +
        '<label>' +
          '<input type="checkbox"> <%- title %></label>' +
      '</div>'),
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
      this.$el.addClass('field-' + this.options.name);
    }
  });

  var ResourceListFieldView = ResourceInputFieldView.extend({
    sortable: false,
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<ul class="col-sm-10 fields list-group" />' +
      '<button class="col-sm-offset-2 btn btn-default">Add</button>'),
    events: {
      'click button': 'addRowClicked',
      'change input': 'inputChanged',
      'keyup input': 'textChanged'
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
      self.$el.addClass('field-' + self.options.name);
      var $container = self.$('.fields');
      _.each(self.options.value, function(value){
        $container.append('<li class="list-group-item"><input class="form-control input-sm" value="' + value + '" /></li>');
      });

      if(self.sortable){
        self.dd = new Sortable($container, {
          selector: 'li',
          dragClass: 'dragging',
          drop: function($el, delta) {
            if (delta !== 0){
              // XXX save order
            }
          }
        });
      }
    }
  });

  var ResourceSortableListFieldView = ResourceListFieldView.extend({
    sortable: true
  });

  var ResourceTextAreaFieldView = ResourceInputFieldView.extend({
    inputChanged: function(){
      this.options.registryData[this.options.name] = this.options.value = this.$('textarea').val();
    },
    template: _.template(
      '<label class="col-sm-2 control-label"><%- title %></label>' +
      '<div class="col-sm-10">' +
        '<textarea class="form-control input-sm" name="name"><%- value %></textarea>' +
      '</div>')
  });

  var ResourceNameFieldView = ResourceInputFieldView.extend({
    afterRender: function(){
      ResourceInputFieldView.prototype.afterRender.apply(this);
      this.$el.append('<span class="hidden glyphicon glyphicon-remove form-control-feedback"></span>');
    },

    handleError: function(error){
      if(error){
        this.$el.addClass('has-error').addClass('has-feedback');
        this.$('.form-control-feedback').removeClass('hidden');
      }else{
        this.$el.removeClass('has-error').removeClass('has-feedback');
        this.$('.form-control-feedback').addClass('hidden');
      }
    },

    inputChanged: function(){
      var value = this.$('input').val();
      if(value === this.resourceName){
        return this.handleError(false);
      }
      if(this.options.containerData[value] || !value){
        // already taken
        return this.handleError(true);
      }
      // move data
      var data = this.options.containerData[this.resourceName];
      this.options.containerData[value] = data;
      // and now delete old
      delete this.options.containerData[this.resourceName];
      this.resourceName = value;

      if(this.options.parent){
        this.options.parent.options.name = value;
        this.options.parent.render();
      }
      return this.handleError(false);
    },
    serializedModel: function(){
      return $.extend({}, this.options, {value: this.resourceName});
    }
  });

  var AbstractResourceEntryView = BaseView.extend({
    tagName: 'div',
    className: 'resource-entry',
    template: _.template(
      '<h3><%- name %></h3>' +
      '<div class="panel-body form-horizontal">' +
      '</div>'
    ),

    serializedModel: function(){
      return $.extend({}, {name: this.name}, this.options);
    },

    afterRender: function(){
      var self = this;
      var $body = self.$('.panel-body');
      _.each(self.fields, function(field){
        var options = $.extend({}, field, {
          value: self.options.data[field.name],
          registryData: self.options.data,
          containerData: self.options.containerData,
          resourceName: self.options.name,
          registryView: self.options.registryView,
          parent: self.options.parent
        });
        if(!options.value){
          options.value = '';
        }
        var View = field.view;
        if(!View){
          View = ResourceInputFieldView;
        }
        $body.append((new View(options)).render().el);
      });
    }
  });

  var ResourceEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: 'Name',
      view: ResourceNameFieldView
    }, {
      name: 'url',
      title: 'Resources base url'
    }, {
      name: 'js',
      title: 'Main JavaScript file'
    }, {
      name: 'css',
      title: 'CSS/LESS',
      view: ResourceSortableListFieldView
    }, {
      name: 'css_deps',
      title: 'CSS Dependencies',
      view: ResourceListFieldView
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
      view: ResourceTextAreaFieldView
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: ResourceBoolFieldView
    }]
  });

  var BundleEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: 'Name',
      view: ResourceNameFieldView
    }, {
      name: 'resource',
      title: 'Resource'
    }, {
      name: 'after',
      title: 'After'
    }, {
      name: 'expression',
      title: 'Expression'
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: ResourceBoolFieldView
    }, {
      name: 'ie_condition',
      title: 'IE Condition'
    }]
  });

  var RegistryResourceListItem = BaseView.extend({
    tagName: 'li',
    type: 'resource',
    className: 'list-group-item',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<button class="pull-right btn btn-danger btn-xs">Delete</button>'
    ),
    events: {
      'click a': 'editResource',
      'click button.btn-danger': 'deleteClicked'
    },
    afterRender: function(){
      this.$el.attr('data-name', this.options.name);
      this.$el.addClass(this.type + '-list-item-' + this.options.name);
    },
    serializedModel: function(){
      return $.extend({}, {name: this.options.name}, this.options.data);
    },
    editResource: function(e){
      if(e){
        e.preventDefault();
      }
      var options = $.extend({}, this.options, {
        containerData: this.options.registryView.options.data.resources,
        parent: this
      });
      var resource = new ResourceEntryView(options);
      this.registryView.showResourceEditor(resource);
    },
    deleteClicked: function(e){
      e.preventDefault();
      delete this.options.registryView.options.data.resources[this.options.name];
      this.options.registryView.render();
    }
  });

  var RegistryBundleListItem = RegistryResourceListItem.extend({
    type: 'bundle',
    editResource: function(e){
      if(e){
        e.preventDefault();
      }
      var options = $.extend({}, this.options, {
        containerData: this.options.registryView.options.data.bundles,
        parent: this
      });
      var resource = new BundleEntryView(options);
      this.registryView.showResourceEditor(resource);
    },
    deleteClicked: function(e){
      e.preventDefault();
      delete this.options.registryView.options.data.bundles[this.options.name];
      this.options.registryView.render();
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
          '<button class="btn btn-default cancel">Cancel</button>' +
        '</div>' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-default add-bundle">Add bundle</button>' +
          '<button class="btn btn-default add-resource">Add resource</button>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="items col-md-3">' +
          '<ul class="bundles list-group">' +
            '<li class="list-group-item list-group-item-warning">Bundles</li>' +
          '</ul>' +
          '<ul class="resources list-group">' +
            '<li class="list-group-item list-group-item-warning">Resources</li>' +
          '</ul>' +
        '</div>' +
        '<div class="form col-md-9"></div>'),
    events: {
      'click button.build': 'buildClicked',
      'click button.save': 'saveClicked',
      'click button.add-resource': 'addResourceClicked',
      'click button.add-bundle': 'addBundleClicked',
      'click button.cancel': 'revertChanges'
    },

    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.previousData = $.extend(true, {}, options.data);
    },

    showResourceEditor: function(resource){
      this.$('.form').empty().append(resource.render().el);
    },

    revertChanges: function(e){
      if(e){
        e.preventDefault();
      }
      if(confirm('Are you sure you want to cancel? You will lose all changes.')){
        this.options.data = this.previousData;
        this.render();
      }
    },

    afterRender: function(){
      var self = this;
      self.$bundles = self.$('ul.bundles');
      self.$resources = self.$('ul.resources');
      var data = self.options.data;
      var bundles = _.keys(data.bundles);
      bundles.sort();
      self.items = {
        bundles: {},
        resources: {}
      };
      _.each(bundles, function(resourceName){
        var item = new RegistryBundleListItem({
          data: data.bundles[resourceName],
          name: resourceName,
          registryView: self});
        self.items.bundles[resourceName] = item;
        self.$bundles.append(item.render().el);
      });
      var resources = _.keys(data.resources);
      resources.sort();
      _.each(resources, function(resourceName){
        var item = new RegistryResourceListItem({
          data: data.resources[resourceName],
          name: resourceName,
          registryView: self});
        self.items.resources[resourceName] = item;
        self.$resources.append(item.render().el);
      });
      return self;
    },

    addResourceClicked: function(e){
      e.preventDefault();
      var name = utils.generateId('new-resource-');
      this.options.data.resources[name] = {
        enabled: true
      };
      this.render();
      this.items.resources[name].editResource();
    },

    addBundleClicked: function(e){
      e.preventDefault();
      var name = utils.generateId('new-resource-');
      this.options.data.bundles[name] = {
        enabled: true
      };
      this.render();
      this.items.bundles[name].editResource();
    },

    saveClicked: function(e){
      var self = this;
      e.preventDefault();
      $.ajax({
        url: self.options.data.saveUrl,
        type: 'POST',
        data: {
          _authenticator: utils.getAuthenticator(),
          resources: JSON.stringify(self.options.data.resources),
          bundles: JSON.stringify(self.options.data.bundles)
        },
        success: function(){
          self.previousData = $.extend(true, {}, self.options.data);
        },
        error: function(){
          alert('Error saving data');
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
        },
        error: function(){
          alert('Error building resources');
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

    itemSaved: function(e){
      e.preventDefault();
      var self = this;
      $.ajax({
        url: self.options.data.overrideManageUrl,
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
        this.options.data.overrides.splice(self.options.index, 1);
        this.render();
        $.ajax({
          url: this.options.data.overrideManageUrl,
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
      var data = self.options.data;
      var override = data.overrides[self.options.index];
      var url = data.baseUrl;
      if(url[url.length - 1] !== '/'){
        url += '/';
      }
      $.ajax({
        url: url + override,
        success: function(data){
          var $pre = $('<pre class="pat-texteditor" />');
          $pre.html(data);
          self.options.overridesView.$editorContainer.empty().append($pre);
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
      this.options.data.overrides.push($btn.parent().find('span').html());
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
      var data = self.options.data;
      _.each(data.resources, function(resource){
        if((resource.url + resource.js).toLowerCase().indexOf(q) !== -1){
          matches.push(resource.url + '/' + resource.js);
        }
        for(var i=0; i<resource.css.length; i=i+1){
          if((resource.url + resource.css[i]).toLowerCase().indexOf(q) !== -1){
            matches.push(resource.url + '/' + resource.css[i]);
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

    afterRender: function(){
      var self = this;
      self.$ul = self.$('ul.items');
      _.each(self.options.data.overrides, function(filepath, index){
        var view = new OverrideResource({
          index: index,
          filepath: filepath,
          overridesView: self,
          data: self.options.data
        });
        self.$ul.append(view.render().el);
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
      self.registryView = new RegistryView({
        data: options,
        tabView: self});
      self.overridesView = new OverridesView({
        data: options,
        tabView: self});
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

  var ResourceRegistry = Base.extend({
    name: 'resourceregistry',
    defaults: {
      bundles: [],
      resources: [],
      overrides: [],
      overrideManageUrl: null,
      saveUrl: null,
      buildUrl: null,
      baseUrl: null
    },
    init: function() {
      var self = this;

      self.tabs = new TabView(self.options);
      self.$el.append(self.tabs.render().el);
    }
  });

  return ResourceRegistry;

});
