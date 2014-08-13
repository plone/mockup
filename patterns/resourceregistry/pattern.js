/* Resource Registry pattern.
 *
 * Options:
 *    bundles(object): object with all bundles ({})
 *    resources(object): object with all resources ({})
 *    javascripts(object): object with all legacy type javascripts ({})
 *    css(object): object with all legacy type css ({}) 
 *    overrides(array): List of current overrides ([])
 *    managerUrl(string): url to handle manage actions(null)
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
 *                                       "resource": "plone", "depends": "",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     },
 *                                     "plone-auth": {
 *                                       "resource": "plone-auth", "depends": "plone",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     },
 *                                     "barceloneta": {
 *                                       "resource": "barceloneta", "depends": "*",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     }
 *                                   },
 *                                   "resources": {
 *                                     "plone": {
 *                                       "url": "js/bundles", "js": "plone.js",
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "plone-auth": {
 *                                       "url": "js/bundles", "js": "plone-auth.js",
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "barceloneta": {
 *                                       "url": "js/bundles", "js": "barceloneta.js",
 *                                       "css": ["barceloneta.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "modal": {
 *                                       "url": "patterns/modal", "js": "pattern.js",
 *                                       "css": ["pattern.modal.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "autotoc": {
 *                                       "url": "patterns/autotoc", "js": "pattern.js",
 *                                       "css": ["pattern.autotoc.less", "pattern.other.less"],
 *                                       "deps": "", "export": "", "conf": ""
 *                                     },
 *                                     "pickadate": {
 *                                       "url": "patterns/pickadate", "js": "pattern.js",
 *                                       "css": ["pattern.pickadate.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": true
 *                                     }
 *                                   },
 *                                   "javascripts": {
 *                                     "jquery-plugin-other": {
 *                                       "url": "jquery-plugin-2.js", "conditionalcomment": "",
 *                                       "enabled": true, "expression": "", "depends": "jquery-plugin"},
 *                                     "jquery-plugin": {
 *                                       "url": "jquery-plugin.js", "conditionalcomment": "",
 *                                       "enabled": true, "expression": "", "depends": ""}},
 *                                   "overrides": ["patterns/pickadate/pattern.js"],
 *                                   "baseUrl": "/resources-registry",
 *                                   "manageUrl": "/resource-manager"}'>
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

  var ResourceInputFieldView = BaseView.extend({
    tagName: 'div',
    className: 'form-group',
    events: {
      'change input': 'inputChanged',
      'keyup input': 'textChanged'
    },
    template: _.template(
      '<label class="col-sm-3 control-label"><%- title %></label>' +
      '<div class="col-sm-9">' +
        '<input class="form-control input-sm" name="name" value="<%- value %>" />' +
        '<%= description %>' +
      '</div>'),
    timeout: -1,

    serializedModel: function(){
      return $.extend({}, {description: ''}, this.options);
    },

    textChanged: function(){
      var self = this;
      if(self.timeout){
        clearTimeout(self.timeout);
      }
      self.timeout = setTimeout(function(){
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
    className: 'col-sm-offset-3 col-sm-9',
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
      ResourceInputFieldView.prototype.afterRender.apply(this);
      if(this.options.value){
        this.$('input')[0].checked = true;
      }
    }
  });

  var ResourceListFieldView = ResourceInputFieldView.extend({
    sortable: false,
    template: _.template(
      '<label class="col-sm-3 control-label"><%- title %></label>' +
      '<ul class="col-sm-9 fields list-group" />' +
      '<button class="btn btn-default add pull-right">Add</button>'),
    events: {
      'click button.add': 'addRowClicked',
      'change input': 'inputChanged',
      'keyup input': 'textChanged',
      'click button.remove': 'removeItem'
    },

    initialize: function(options){
      ResourceInputFieldView.prototype.initialize.apply(this, [options]);
      if(!this.options.value){
        this.options.value = [];
      }
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

    removeItem: function(e){
      e.preventDefault();
      var $el = $(e.target).parents('li');
      var index = $el.index();
      this.options.value.splice(index, 1);
      $el.remove();
    },

    afterRender: function(){
      ResourceInputFieldView.prototype.afterRender.apply(this);
      var self = this;
      var $container = self.$('.fields');
      _.each(self.options.value, function(value){
        $container.append('<li class="list-group-item"><div class="input-group">' +
          '<input class="form-control input-sm" value="' + value + '" />' +
          '<span class="input-group-btn">' +
            '<button class="btn btn-default remove btn-sm">Remove</button></div></li>');
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
      '<label class="col-sm-3 control-label"><%- title %></label>' +
      '<div class="col-sm-9">' +
        '<textarea class="form-control input-sm" name="name"><%- value %></textarea>' +
      '</div>')
  });

  var ResourceSelectFieldView = ResourceInputFieldView.extend({
    events: {
      'change select': 'inputChanged'
    },
    inputChanged: function(){
      this.options.registryData[this.options.name] = this.options.value = this.$('select').val();
    },

    getSelectOptions: function(){
      return [];
    },

    serializedModel: function(){
      var self = this;
      return $.extend({}, {
        'options': self.getSelectOptions(),
        'description': ''
      }, self.options);
    },

    afterRender: function(){
      ResourceInputFieldView.prototype.afterRender.apply(this);
      var $el = this.$('option[value="' + this.options.value + '"]');
      if($el.length > 0){
        $el[0].selected = true;
      }
    },

    template: _.template(
      '<label class="col-sm-3 control-label"><%- title %></label>' +
      '<div class="col-sm-9">' +
        '<select class="form-control select-sm" name="name">' +
          '<% _.each(options, function(option) { %>' +
            '<option value="<%- option %>"><%- option %></option>' +
          '<% }); %>' +
        '</select>' +
        '<%= description %>' +
      '</div>')
  });

  var BundleDependsFieldView = ResourceSelectFieldView.extend({
    getSelectOptions: function(){
      var self = this;
      return ['', '*'].concat(_.filter(_.keys(self.options.containerData), function(name){
        return name !== self.options.name;
      }));
    }
      });

  var BundleResourceFieldView = ResourceSelectFieldView.extend({
    getSelectOptions: function(){
      var self = this;
      return [''].concat(_.filter(_.keys(self.options.registryView.options.data.resources), function(name){
        return name !== self.options.name;
      }));
    }
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
      var data = $.extend({}, {
        description: ''
      }, this.options);
      data.value = this.options.resourceName;
      return data;
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
      title: 'URL',
      description: 'Resources base URL'
    }, {
      name: 'js',
      title: 'JS',
      description: 'Main JavaScript file'
    }, {
      name: 'css',
      title: 'CSS/LESS',
      description: 'List of CSS/LESS files to use for resource',
      view: ResourceSortableListFieldView
    },{
      name: 'init',
      title: 'Init', 
      description: 'Init instruction for requirejs shim'
    }, {
      name: 'deps',
      title: 'Dependencies',
      description: 'Coma separated values of resources for requirejs shim'
    }, {
      name: 'export',
      title: 'Export',
      description: 'Export vars for requirejs shim'
    }, {
      name: 'conf',
      title: 'Configuration',
      description: 'Configuration in JSON for the widget',
      view: ResourceTextAreaFieldView
    }]
  });

  var BundleEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: 'Name',
      view: ResourceNameFieldView
    }, {
      name: 'resource',
      title: 'Resource',
      description: 'Main resource file to bootstrap bundle',
      view: BundleResourceFieldView
    }, {
      name: 'depends',
      title: 'Depends',
      description: 'Bundle this depends on',
      view: BundleDependsFieldView
    }, {
      name: 'expression',
      title: 'Expression',
      description: 'Conditional expression to decide if this resource will run'
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: ResourceBoolFieldView
    }, {
      name: 'conditionalcomment',
      title: 'Conditional comment',
      description: 'For Internet Exploder hacks...'
    }]
  });

  var RegistryResourceListItem = BaseView.extend({
    tagName: 'li',
    type: 'resource',
    className: 'list-group-item',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<button class="pull-right btn btn-danger delete btn-xs">Delete</button>'
    ),
    events: {
      'click a': 'editResource',
      'click button.delete': 'deleteClicked'
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
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<div class="btn-group pull-right">' +
        '<button class="btn btn-default build btn-xs">Build</button>' +
        '<button class="btn btn-danger delete btn-xs">Delete</button>' +
      '</div>'
    ),
    events: $.extend({}, RegistryResourceListItem.events, {
      'click button.build': 'buildClicked'
    }),
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
    },
    buildClicked: function(e){
      e.preventDefault();
      var self = this;
      var rview = self.options.registryView;
      rview.loading.show();
      $.ajax({
        url: rview.options.data.manageUrl,
        type: 'POST',
        data: {
          action: 'build',
          _authenticator: utils.getAuthenticator()
        },
        success: function(){
          rview.loading.hide();
        },
        error: function(){
          rview.loading.hide();
          alert('Error building resources');
        }
      });
    }
  });

  var BaseResourcesPane = BaseView.extend({
    tagName: 'div',
    className: 'tab-pane',
    $form: null,

    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.previousData = self._copyData();
      /* setup scroll spy to move form into view if necessary */
      /* disabled, at least for now, forms too bad to do this with...
      $(window).scroll(function(){
        if(self.$form){
          var offset = self.$el.parent().offset();
          var top = $(document).scrollTop();
          if(top > offset.top){
            self.$form.css({marginTop: top - offset.top});
          }else{
            self.$form.css({marginTop: null});
          }
        }
      });
      */
    },

    showResourceEditor: function(resource){
      this.$form.empty().append(resource.render().el);
    },

    _copyData: function(){
      return $.extend(true, {}, this.options.data);
    },

    _revertData: function(data){
      this.options.data = $.extend(true, {}, data);
    },

    revertChanges: function(e){
      if(e){
        e.preventDefault();
      }
      if(confirm('Are you sure you want to cancel? You will lose all changes.')){
        this._revertData(this.previousData);
        this.render();
      }
    },
    afterRender: function(){
      this.$form = this.$('.form');
      this.loading = this.options.tabView.loading;
    }
  });

  var RegistryView = BaseResourcesPane.extend({
    template: _.template(
      '<div class="clearfix">' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-success save">Save</button>' +
          '<button class="btn btn-default cancel">Cancel</button>' +
        '</div>' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-default add-bundle">Add bundle</button>' +
          '<button class="btn btn-default add-resource">Add resource</button>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="items col-md-4">' +
          '<ul class="bundles list-group">' +
            '<li class="list-group-item list-group-item-warning">Bundles</li>' +
          '</ul>' +
          '<ul class="resources list-group">' +
            '<li class="list-group-item list-group-item-warning">Resources ' +
              '<input class="float-right form-control input-xs" ' +
                      'placeholder="Filter..." />' +
            '</li>' +
          '</ul>' +
        '</div>' +
        '<div class="form col-md-8"></div>'),
    events: {
      'click button.save': 'saveClicked',
      'click button.add-resource': 'addResourceClicked',
      'click button.add-bundle': 'addBundleClicked',
      'click button.cancel': 'revertChanges',
      'keyup .resources input': 'filterResources'
    },
    filterTimeout: 0,

    filterResources: function(){
      var self = this;
      if(self.filterTimeout){
        clearTimeout(self.filterTimeout);
      }
      self.filterTimeout = setTimeout(function(){
        var filterText = self.$('.resources input').val().toLowerCase();
        var $els = self.$('.resources .list-group-item:not(.list-group-item-warning)');
        if(!filterText || filterText.length < 3){
          $els.removeClass('hidden');
        }else{
          $els.each(function(){
            var $el = $(this);
            if($el.find('a').html().toLowerCase().indexOf(filterText) !== -1){
              $el.removeClass('hidden');
            }else{
              $el.addClass('hidden');
            }
          });
        }
      }, 200);
    },

    _copyData: function(){
      return $.extend(true, {}, {
        bundles: this.options.data.bundles,
        resources: this.options.data.resources
      });
    },

    _revertData: function(data){
      this.options.data.bundles = $.extend(true, {}, data.bundles);
      this.options.data.resources = $.extend(true, {}, data.resources);
    },

    afterRender: function(){
      var self = this;
      self.$bundles = self.$('ul.bundles');
      self.$resources = self.$('ul.resources');
      var data = self.options.data;
      var bundles = _.sortBy(_.keys(data.bundles), function(v){ return v.toLowerCase(); });
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
      var resources = _.sortBy(_.keys(data.resources), function(v){ return v.toLowerCase(); });
      _.each(resources, function(resourceName){
        var item = new RegistryResourceListItem({
          data: data.resources[resourceName],
          name: resourceName,
          registryView: self});
        self.items.resources[resourceName] = item;
        self.$resources.append(item.render().el);
      });
      BaseResourcesPane.prototype.afterRender.apply(self);
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
      self.loading.show();
      $.ajax({
        url: self.options.data.manageUrl,
        type: 'POST',
        data: {
          action: 'save-registry',
          _authenticator: utils.getAuthenticator(),
          resources: JSON.stringify(self.options.data.resources),
          bundles: JSON.stringify(self.options.data.bundles)
        },
        success: function(){
          self.loading.hide();
          self.previousData = self._copyData();
        },
        error: function(){
          self.loading.hide();
          alert('Error saving data');
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

    initialize: function(options){
      BaseView.prototype.initialize.apply(this, [options]);
      this.loading = this.options.overridesView.tabView.loading;
    },

    serializedModel: function(){
      return $.extend({}, { view: this }, this.options);
    },

    itemSaved: function(e){
      e.preventDefault();
      var self = this;
      self.loading.show();
      $.ajax({
        url: self.options.data.manageUrl,
        type: 'POST',
        data: {
          _authenticator: utils.getAuthenticator(),
          action: 'save-file',
          filepath: self.options.filepath,
          data: self.editor.editor.getValue()
        },
        success: function(){
          self.canSave = false;
          self.render();
          self.loading.hide();
        },
        error: function(){
          alert('Error saving override');
          self.loading.hide();
        }
      });
    },

    itemDeleted: function(e){
      e.preventDefault();
      var self = this;
      if(confirm('Are you sure you want to delete this override?')){
        this.options.data.overrides.splice(self.options.index, 1);
        this.render();
        this.loading.show();
        $.ajax({
          url: this.options.data.manageUrl,
          type: 'POST',
          data: {
            _authenticator: utils.getAuthenticator(),
            action: 'delete-file',
            filepath: self.options.filepath
          },
          success: function(){
            var index = _.indexOf(self.options.overridesView.data.overrides, self.options.filepath);
            if(index !== -1){
              self.options.overridesView.data.overrides.splice(index, 1);
            }
            self.options.overridesView.render();
            self.loading.hide();
          },
          error: function(){
            self.loading.show();
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
      self.loading.show();
      $.ajax({
        // cache busting url
        url: url + override + '?' + utils.generateId(),
        dataType: 'text',
        success: function(data){
          var $pre = $('<pre class="pat-texteditor" />');
          $pre.html(data);
          self.options.overridesView.$editorContainer.empty().append($pre);
          self.editor = new TextEditor($pre, {
            width: 600,
            height: 500
          });
          self.editor.setSyntax(override);
          self.editor.editor.on('change', function(){
            if(!self.canSave){
              self.canSave = true;
              self.render();
            }
          });
          self.render();
          self.loading.hide();
        },
        error: function(){
          alert('error loading resource for editing');
          self.loading.hide();
        }
      });
    }
  });

  var OverridesView = BaseView.extend({
    tagName: 'div',
    className: 'tab-pane overrides',
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
      var urlMatches = function(base, path){
        var filepath = (base + (path || '')).toLowerCase();
        if(filepath.indexOf('++plone++') === -1){
          return false;
        }
        return filepath.indexOf(q) !== -1;
      };
      _.each(data.resources, function(resource){
        var base = resource.url || '';
        if(base){
          base += '/';
        }
        if(urlMatches(base, resource.js)){
          matches.push(base + resource.js);
        }
        for(var i=0; i<resource.css.length; i=i+1){
          if(urlMatches(base, resource.css[i])){
            matches.push(base + resource.css[i]);
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

  var ManualEntryView = ResourceEntryView.extend({
   fields: [{
      name: 'name',
      title: 'Name',
      view: ResourceNameFieldView
    }, {
      name: 'url',
      title: 'Resources base URL'
    }, { 
      name: 'expression',
      title: 'Expression to decide if this should render'
    }, { 
      name: 'conditionalcomment',
      title: 'Conditional Comment'
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: ResourceBoolFieldView
    }]
  });

  var ManualListItem = RegistryResourceListItem.extend({
    type: 'manual',
    editResource: function(e){
      if(e){
        e.preventDefault();
      }
      var options = $.extend({}, this.options, {
        containerData: this.options.container,
        parent: this
      });
      var resource = new ManualEntryView(options);
      this.manualView.showResourceEditor(resource);
    },
    deleteClicked: function(e){
      e.preventDefault();
      delete this.options.container[this.options.name];
      this.$el.remove();
      this.options.manualView.updateOrder();
      this.options.manualView.render();
    }
  });

  var ManualView = BaseResourcesPane.extend({
    template: _.template(
      '<div class="clearfix">' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-success save">Save</button>' +
          '<button class="btn btn-default cancel">Cancel</button>' +
        '</div>' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-default add-javascript">Add JavaScript</button>' +
          '<button class="btn btn-default add-css">Add CSS</button>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="col-md-5 lists">' +
          '<ul class="js list-group">' +
            '<li class="list-group-item list-group-item-warning">JavaScripts</li>' +
          '</ul>' +
          '<ul class="css list-group">' +
            '<li class="list-group-item list-group-item-warning">CSS</li>' +
          '</ul>' +
        '</div>' +
        '<div class="col-md-7">' +
          '<div class="form" />' +
        '</div>' +
      '</div>'),
    events: {
      'click .btn.add-javascript': 'addJavascript',
      'click .btn.add-css': 'addCSS',
      'click .btn.cancel': 'revertChanges',
      'click .btn.save': 'saveChanges'
    },

    _copyData: function(){
      return $.extend(true, {}, {
        javascripts: $.extend(true, {}, this.options.data.javascripts),
        css: $.extend(true, {}, this.options.data.css)
      });
    },

    _revertData: function(data){
      this.options.data.css = $.extend(true, {}, data.css);
      this.options.data.javascripts = $.extend(true, {}, data.javascripts);
    },

    addJavascript: function(e){
      e.preventDefault();
      var name = utils.generateId('new-file-');
      this.options.data.javascripts[name] = {
        enabled: true,
        depends: _.last(_.keys(this.options.data.javascripts))
      };
      this.render();
      this.items[name].editResource();
    },

    addCSS: function(e){
      e.preventDefault();
      var name = utils.generateId('new-file-');
      this.options.data.css[name] = {
        enabled: true,
        depends: _.last(_.keys(this.options.data.css))
      };
      this.render();
      this.items[name].editResource();
    },

    _updateOrder: function(container, order){
      order = _.filter(order, function(v){ return container[v]; });
      if(order.length > 0){
        var prev = _.first(order);
        container[prev].depends = '';
        _.each(_.rest(order), function(item){
          container[item].depends = prev;
          prev = item;
        });
      }
    },

    updateOrder: function(){
      /* read through orders and update */
      var self = this;
      var data = self.options.data;
      var css = [];
      self.$css.find('li:not(.list-group-item-warning)').each(function(){
        css.push($(this).attr('data-name'));
      });
      self._updateOrder(data.css, css);
      var js = [];
      self.$javascripts.find('li:not(.list-group-item-warning)').each(function(){
        js.push($(this).attr('data-name'));
      });
      self._updateOrder(data.javascripts, js);
    },

    showResourceEditor: function(resource){
      this.$('.form').empty().append(resource.render().el);
    },

    addListItem: function(container, name, $el){
      var self = this;
      if(container[name]){
        var item = new ManualListItem({
          container: container,
          data: container[name],
          name: name,
          manualView: self});
        $el.append(item.render().el);
        self.items[name] = item;
      }
    },

    getOrder: function(data){
      var order = [];  // list of names
      var noDepends = []; // add these do the end
      _.each(_.keys(data), function(name){
        /* cases:
         *  - no depends
         *  - depends already added
         *  - already added(from a depends), need to check depends
         */
        var item = data[name];
        var dependsOn =  item.depends;
        var pos = _.indexOf(order, name);
        if(pos !== -1){
          // already added from depends
          if(data[dependsOn] && _.indexOf(order, dependsOn) === -1){
            // need to insert BEFORE current
            order.splice(pos, 0, dependsOn);
          }
          return;
        }
        if(!dependsOn || !data[dependsOn]){
          return noDepends.push(name);
        }
        if(_.indexOf(order, dependsOn) === -1){
          order.push(dependsOn);
        }
        order.push(name);
      });
      // append everything left
      return order.concat(_.difference(noDepends, order));
    },

    afterRender: function(){
      var self = this;
      self.$css = self.$('ul.css');
      self.$javascripts = self.$('ul.js');
      var data = self.options.data;
      self.items = {};
      _.each(self.getOrder(data.css), function(cssName){
        self.addListItem(data.css, cssName, self.$css);
      });

      _.each(self.getOrder(data.javascripts), function(jsName){
        self.addListItem(data.javascripts, jsName, self.$javascripts);
      });

      self.ddCSS = new Sortable(self.$css, {
        selector: 'li:not(.list-group-item-warning)',
        dragClass: 'dragging',
        drop: function($el, delta) {
          if (delta !== 0){
            self.updateOrder();
          }
        }
      });
      self.ddJS = new Sortable(self.$javascripts, {
        selector: 'li:not(.list-group-item-warning)',
        dragClass: 'dragging',
        drop: function($el, delta) {
          if (delta !== 0){
            self.updateOrder();
          }
        }
      });
      BaseResourcesPane.prototype.afterRender.apply(self); 
      return self;
    },

    saveChanges: function(e){
      e.preventDefault();
      var self = this;
      self.loading.show();
      $.ajax({
        url: self.options.data.manageUrl,
        type: 'POST',
        data: {
          action: 'save-manual',
          _authenticator: utils.getAuthenticator(),
          css: JSON.stringify(self.options.data.css),
          javascripts: JSON.stringify(self.options.data.javascripts),
        },
        success: function(){
          self.loading.hide();
          self.previousData = self._copyData();
        },
        error: function(){
          self.loading.hide();
          alert('Error saving data');
        }
      });
    }
  });

  var TabView = BaseView.extend({
    tagName: 'div',
    activeTab: 'registry',
    template: _.template('' +
      '<ul class="main-tabs nav nav-tabs" role="tablist">' +
        '<li class="registry-btn"><a href="#">Registry</a></li>' +
        '<li class="manual-btn"><a href="#">Manual</a></li>' +
        '<li class="overrides-btn"><a href="#">Overrides</a></li>' +
      '</div>' +
      '<div class="tab-content" />'
    ),
    events: {
      'click .registry-btn a': 'hideShow',
      'click .overrides-btn a': 'hideShow',
      'click .manual-btn a': 'hideShow'
    },
    hideShow: function(e){
      var self = this;
      if(e !== undefined){
        e.preventDefault();
        self.activeTab = $(e.target).parent()[0].className.replace('-btn', '');
      }
      self.$('.main-tabs > li').removeClass('active');
      self.$content.find('.tab-pane').removeClass('active');
      self.tabs[self.activeTab].btn.addClass('active');
      self.tabs[self.activeTab].content.addClass('active');
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
      self.manualView = new ManualView({
        data: options,
        tabView: self});
      self.tabs = {};
    },

    render: function(){
      var self = this;
      self.$el.append(self.template());
      self.loading = new utils.Loading();
      self.$tabs = self.$('ul.main-tabs');
      self.$content = self.$('.tab-content');
      self.$content.append(self.registryView.render().el);
      self.$content.append(self.overridesView.render().el);
      self.$content.append(self.manualView.render().el);
      self.tabs = {
        registry: {
          btn: self.$('.registry-btn'),
          content: self.registryView.$el
        },
        manual: {
          btn: self.$('.manual-btn'),
          content: self.manualView.$el
        },
        overrides: {
          btn: self.$('.overrides-btn'),
          content: self.overridesView.$el
        }
      };
      self.hideShow();
      return self;
    }
  });

  var ResourceRegistry = Base.extend({
    name: 'resourceregistry',
    defaults: {
      bundles: {},
      resources: {},
      javascripts: {},
      css: {},
      overrides: [],
      manageUrl: null,
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
