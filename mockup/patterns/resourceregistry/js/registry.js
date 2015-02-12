/* global alert:true, confirm:true */

define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-utils',
  'mockup-patterns-modal',
  'mockup-patterns-resourceregistry-url/js/fields',
  'mockup-patterns-resourceregistry-url/js/iframe',
  'translate'
], function($, _, BaseView, utils, Modal, fields, IFrame, _t) {
  'use strict';


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
          View = fields.ResourceInputFieldView;
        }
        $body.append((new View(options)).render().el);
      });
    }
  });


  var ResourceEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: _t('Name'),
      view: fields.ResourceNameFieldView
    }, {
      name: 'url',
      title: _t('URL'),
      description: _t('Resources base URL')
    }, {
      name: 'js',
      title: _t('JS'),
      description: _t('Main JavaScript file')
    }, {
      name: 'css',
      title: _t('CSS/LESS'),
      description: _t('List of CSS/LESS files to use for resource'),
      view: fields.ResourceSortableListFieldView
    },{
      name: 'init',
      title: _t('Init'), 
      description: _t('Init instruction for requirejs shim')
    }, {
      name: 'deps',
      title: _t('Dependencies'),
      description: _t('Coma separated values of resources for requirejs shim')
    }, {
      name: 'export',
      title: _t('Export'),
      description: _t('Export vars for requirejs shim')
    }, {
      name: 'conf',
      title: _t('Configuration'),
      description: _t('Configuration in JSON for the widget'),
      view: fields.ResourceTextAreaFieldView
    }]
  });


  var BundleEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: _t('Name'),
      view: fields.ResourceNameFieldView
    }, {
      name: 'resources',
      title: _t('Resources'),
      description: _t('A main resource file to bootstrap bundle or a list of resources to load.'),
      view: fields.BundleResourcesFieldView
    }, {
      name: 'depends',
      title: _t('Depends'),
      description: _t('Bundle this depends on'),
      view: fields.BundleDependsFieldView
    }, {
      name: 'expression',
      title: _t('Expression'),
      description: _t('Conditional expression to decide if this resource will run')
    }, {
      name: 'enabled',
      title: _t('Enabled'),
      view: fields.ResourceBoolFieldView
    }, {
      name: 'conditionalcomment',
      title: _t('Conditional comment'),
      description: _t('For Internet Exploder hacks...')
    }, {
      name: 'compile',
      title: _t('Does your bundle contain any RequireJS or LESS files?'),
      view: fields.ResourceBoolFieldView
    }, {
      name: 'last_compilation',
      title: _t('Last compilation'),
      description: _t('Date/Time when your bundle was last compiled. Empty, if it was never compiled.'),
      view: fields.ResourceDisplayFieldView
    }, {
      name: 'jscompilation',
      title: _t('Compiled JavaScript'),
      description: _t('Automatically generated path to the compiled JavaScript.'),
      view: fields.ResourceDisplayFieldView
    }, {
      name: 'csscompilation',
      title: _t('Compiled CSS'),
      description: _t('Automatically generated path to the compiled CSS.'),
      view: fields.ResourceDisplayFieldView
    }]
  });


  var RegistryResourceListItem = BaseView.extend({
    tagName: 'li',
    type: 'resource',
    className: 'list-group-item',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<button class="pull-right plone-btn plone-btn-danger delete plone-btn-xs"><%- _t("Delete") %></button>'
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
      return $.extend({}, {
        name: this.options.name,
        view: this.options.registryView
      }, this.options.data);
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

      // and scroll to resource since huge list makes this hard to notice
      $('html, body').animate({
        scrollTop: resource.$el.offset().top
      }, 1000);
    },
    deleteClicked: function(e){
      e.preventDefault();
      delete this.options.registryView.options.data.resources[this.options.name];
      this.options.registryView.dirty = true;
      this.options.registryView.render();
    }
  });


  var Builder = function(bundleName, bundleListItem){
    var self = this;
    self.bundleName = bundleName;
    self.bundleListItem = bundleListItem;
    self.rview = bundleListItem.options.registryView;
    self.$results = null;
    self.$btnClose = null;

    self.rview.loading.show();
    self.modal = new Modal($('<div/>').appendTo(self.rview.$el), {
      html: _.template('<div id="content">' +
        '<h1>Bundle Builder</h1>' +
        '<div class="start-info"><p>You are about to build the <span class="label label-primary">' +
          '<%= name %></span> pattern. </p><p>This may take some a bit of time so ' +
          'we will try to keep you updated on the progress.</p><p> Press the "Build it" ' +
          'button to proceed.</p></div>' +
        '<ul class="list-group hidden"></ul>' +
        '<button class="plone-btn plone-btn-default cancel hidden cancel-build"><%- _t("Close") %></button>' +
        '<button class="plone-btn plone-btn-primary build"><%- _t("Build it") %></button>' +
      '</div>', $.extend({ _t: _t }, bundleListItem.options)),
      content: null,
      width: 500,
      buttons: '.plone-btn'
    });
    self.modal.on('shown', function() {
      var $el = self.modal.$modal;
      var $info = $el.find('.start-info');
      self.$btnClose = $el.find('button.cancel-build');
      var $btn = $el.find('button.build');
      $btn.off('click').on('click', function(e){
        e.preventDefault();
        $info.addClass('hidden');
        $btn.prop('disabled', true);
        self.$results = $el.find('.list-group').removeClass('hidden');
        self.buildJS();
        self.rview.loading.show();
      });

      self.$btnClose.off('click').on('click', function(){
        self.modal.hide();
      });
    });

    self.addResult = function(txt, klass){
      if(!klass){
        klass = '';
      }
      self.$results.append('<li class="list-group-item ' + klass + '">' + txt + '</li>');
    };

    self.run = function(){
      self.modal.show();
    };

    self.finished = function(error){
      var msg = _t('Finished!');
      if(error){
        msg = _t('Error in build process');
      }
      self.addResult(msg, 'list-group-item-warning');
      self.$btnClose.removeClass('hidden');
      self.rview.loading.hide();
    };

    self.buildJS = function(){
      self.addResult(_t('building javascripts'));
      $.ajax({
        url: self.rview.options.data.manageUrl,
        type: 'POST',
        dataType: 'json',
        data: {
          action: 'js-build-config',
          bundle: self.bundleName,
          _authenticator: utils.getAuthenticator()
        },
        success: function(data){
          /* sort of weird here, follow along. We'll build CSS after JS */
          self._buildJSBundle(data);
        },
        error: function(){
          self.addResult(_t('Error building resources'));
          self.finished(true);
        }
      });
    };

    self._buildCSSBundle = function(config){
      var iframe = new IFrame({
        name: 'lessc',
        resources: config.less.concat([
          self.rview.options.data.lessConfigUrl,
          self.rview.options.data.lessUrl]),
        configure: function(iframe){
          iframe.window.lessErrorReporting = function(what, error, href){
            if(what !== 'remove'){
              self.addResult(_t('less compilation error on file ') + href + ': ' + error);
            }
          };
        }
      });

      /* XXX okay, wish there were a better way,
         but we need to pool to find the out if it's down loading less */
      self.addResult(config.less.length + _t(' css files to build'));
      var checkFinished = function(){
        var $styles =  $('style[type="text/css"][id]', iframe.document);
        for(var i=0; i<$styles.length; i=i+1){
          var $style = $styles.eq(i); 
          if($style.attr('id') === 'less:error-message'){
            self.addResult(_t('Error compiling less'));
            return self.finished(true);
          }
        }
        if($styles.length === config.less.length){
          // we're finished, save it
          var data = {};
          $styles.each(function(){
            var $el = $(this);
            data['data-' + $el.attr('id')] = $el.html();
          });
          iframe.destroy();
          $.ajax({
            url: self.rview.options.data.manageUrl,
            type: 'POST',
            dataType: 'json',
            data: $.extend(data, {
              action: 'save-less-build',
              bundle: self.bundleName,
              _authenticator: utils.getAuthenticator()
            }),
            success: function(data){
              self.rview.options.data.overrides.push(data.filepath);
              self.rview.tabView.overridesView.render();
              self.addResult(_t('finished saving css bundles'));
              self.finished();
            },
            error: function(){
              self.addResult(_t('Error saving css bundle'));
              self.finished(true);
            }
          });
        }else{
          setTimeout(checkFinished, 300);
        }
      };
      checkFinished();
    };

    self.buildCSSBundle = function(){
      self.addResult(_t('building CSS bundle'));
      $.ajax({
        url: self.rview.options.data.manageUrl,
        type: 'POST',
        dataType: 'json',
        data: {
          action: 'less-build-config',
          bundle: self.bundleName,
          _authenticator: utils.getAuthenticator()
        },
        success: function(data){
          /* sort of weird here, follow along. We'll build CSS after JS */
          self._buildCSSBundle(data);
        },
        error: function(){
          self.addResult(_t('Error building css bundle'));
          self.finished(true);
        }
      });
    };

    self._buildJSBundle = function(config){
      if(config.include.length === 0){
        self.addResult(_t('No javascripts to build, skipping'));
        return self.buildCSSBundle();
      }

      config.out = function(results){
        $.ajax({
          url: self.rview.options.data.manageUrl,
          type: 'POST',
          dataType: 'json',
          data: {
            action: 'save-js-build',
            bundle: self.bundleName,
            data: results,
            _authenticator: utils.getAuthenticator()
          },
          success: function(data){
            self.rview.options.data.overrides.push(data.filepath);
            self.rview.tabView.overridesView.render();
          },
          error: function(){
            self.addResult(_t('Error building bundle'));
            self.finished(true);
          }
        });
      };
      new IFrame({
        name: 'rjs',
        resources: [self.rview.options.data.rjsUrl],
        onLoad: function(iframe){
          iframe.window.requirejs.optimize(config, function(combined_files){
            self.addResult(_t('Saved javascript bundle, Build results') + ': <pre>' + combined_files + '</pre>');
            self.buildCSSBundle();
            iframe.destroy();
          });
        }
      });
    };

    return self;
  };


  var RegistryBundleListItem = RegistryResourceListItem.extend({
    type: 'bundle',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<div class="plone-btn-group pull-right">' +
        '<% if(view.options.data.nonBuildableBundles.indexOf(name) === -1){ %>' +
          '<button class="plone-btn plone-btn-default build plone-btn-xs"><%- _t("Build") %></button>' +
          '<button class="plone-btn plone-btn-danger delete plone-btn-xs"><%- _t("Delete") %></button>' +
        '<% } %>' +
      '</div>'
    ),
    events: $.extend({}, RegistryResourceListItem.prototype.events, {
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
      this.options.registryView.dirty = true;
      this.options.registryView.render();
    },
    
    buildClicked: function(e){
      e.preventDefault();
      var self = this;
      if(this.options.registryView.dirty){
        alert(_t('You have unsaved changes. Save or discard before building.'));
      }else{
        var builder = new Builder(self.options.name, self);
        builder.run();
      }
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
      if(confirm(_t('Are you sure you want to cancel? You will lose all changes.'))){
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
        '<div class="plone-btn-group pull-right">' +
          '<button class="plone-btn plone-btn-success save"><%- _t("Save") %></button>' +
          '<button class="plone-btn plone-btn-default cancel"><%- _t("Cancel") %></button>' +
        '</div>' +
        '<div class="plone-btn-group pull-right">' +
          '<button class="plone-btn plone-btn-default add-bundle"><%- _t("Add bundle") %></button>' +
          '<button class="plone-btn plone-btn-default add-resource"><%- _t("Add resource") %></button>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="checkbox development-mode">' +
          '<label>' +
            '<input type="checkbox" ' +
              '<% if(data.development){ %> checked="checked" <% } %>' +
              ' > <%- _t("Development Mode(only logged in users)") %>' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="items col-md-5">' +
          '<ul class="bundles list-group">' +
            '<li class="list-group-item list-group-item-warning"><%- _t("Bundles") %></li>' +
          '</ul>' +
          '<ul class="resources-header list-group">' +
            '<li class="list-group-item list-group-item-warning"><%- _t("Resources") %> ' +
              '<input class="float-right form-control input-xs" ' +
                      'placeholder="<%- _t("Filter...") %>" />' +
            '</li>' +
          '</ul>' +
          '<ul class="resources list-group">' +
          '</ul>' +
        '</div>' +
        '<div class="form col-md-7"></div>' +
      '</div>'),
    events: {
      'click button.save': 'saveClicked',
      'click button.add-resource': 'addResourceClicked',
      'click button.add-bundle': 'addBundleClicked',
      'click button.cancel': 'revertChanges',
      'keyup .resources-header input': 'filterResources',
      'change .development-mode input': 'developmentModeChanged'
    },
    filterTimeout: 0,
    dirty: false,

    initialize: function(options){
      var self = this;
      BaseResourcesPane.prototype.initialize.apply(self, [options]);
      $(document).on('resource-data-changed', function(){
        self.dirty = true;
        self.showHideButtons();
      });
    },

    showHideButtons: function(){
      var val = true;
      if(this.dirty){
        val = false;
      }
      this.$('button.save').prop('disabled', val);
      this.$('button.cancel').prop('disabled', val);
    },

    filterResources: function(){
      var self = this;
      if(self.filterTimeout){
        clearTimeout(self.filterTimeout);
      }
      self.filterTimeout = setTimeout(function(){
        var filterText = self.$('.resources-header input').val().toLowerCase();
        var $els = self.$('.resources .list-group-item');
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
      this.dirty = false;
    },

    afterRender: function(){
      var self = this;
      self.showHideButtons();
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
      this.dirty = true;
      this.render();
      this.items.resources[name].editResource();
    },

    addBundleClicked: function(e){
      e.preventDefault();
      var name = utils.generateId('new-resource-');
      this.options.data.bundles[name] = {
        enabled: true
      };
      this.dirty = true;
      this.render();
      this.items.bundles[name].editResource();
    },

    saveClicked: function(e){
      var self = this;
      e.preventDefault();
      self.options.tabView.saveData('save-registry', {
        resources: JSON.stringify(self.options.data.resources),
        bundles: JSON.stringify(self.options.data.bundles)
      }, function(){
        self.dirty = false;
        self.previousData = self._copyData();
      });
    },

    developmentModeChanged: function(){
      var self = this;
      var value = 'false';
      if(self.$('.development-mode input')[0].checked){
        value = 'true';
      }
      self.options.tabView.saveData('save-development-mode', {
        value: value
      });
    }
  });

  return RegistryView;

});
