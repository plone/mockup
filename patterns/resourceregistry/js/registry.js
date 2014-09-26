/* global alert, confirm */

define([
  'jquery',
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-utils',
  'mockup-patterns-modal',
  'mockup-patterns-resourceregistry-url/js/fields',
], function($, _, BaseView, utils, Modal, fields) {
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
      title: 'Name',
      view: fields.ResourceNameFieldView
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
      view: fields.ResourceSortableListFieldView
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
      view: fields.ResourceTextAreaFieldView
    }]
  });


  var BundleEntryView = AbstractResourceEntryView.extend({
    fields: [{
      name: 'name',
      title: 'Name',
      view: fields.ResourceNameFieldView
    }, {
      name: 'resources',
      title: 'Resources',
      description: 'A main resource file to bootstrap bundle or a list of resources to load.',
      view: fields.BundleResourcesFieldView
    }, {
      name: 'depends',
      title: 'Depends',
      description: 'Bundle this depends on',
      view: fields.BundleDependsFieldView
    }, {
      name: 'expression',
      title: 'Expression',
      description: 'Conditional expression to decide if this resource will run'
    }, {
      name: 'enabled',
      title: 'Enabled',
      view: fields.ResourceBoolFieldView
    }, {
      name: 'conditionalcomment',
      title: 'Conditional comment',
      description: 'For Internet Exploder hacks...'
    }, {
      name: 'compile',
      title: 'Does your bundle contain any RequireJS or LESS files?',
      view: fields.ResourceBoolFieldView
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
        '<div class="start-info">You are about to build the <span class="label label-primary">' +
          '<%= name %></span> pattern. This may take some a bit of time so ' +
          'we will try to keep you updated on the progress. Press the "Build it" ' +
          'button to proceed.</div>' +
        '<ul class="list-group hidden"></ul>' +
        '<button class="btn btn-default cancel hidden">Close</button>' +
        '<button class="btn btn-primary build">Build it</button>' +
      '</div>', bundleListItem.options),
      content: null,
      width: 500,
      buttons: '.btn'
    });
    self.modal.on('shown', function() {
      var $el = self.modal.$modal;
      var $info = $el.find('.start-info');
      self.$btnClose = $el.find('button.cancel');
      var $btn = $el.find('button.build');
      $btn.off('click').on('click', function(e){
        e.preventDefault();
        $info.addClass('hidden');
        $btn.attr('disabled', 'true');
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
      var msg = 'Finished!';
      if(error){
        msg = 'Error in build process';
      }
      self.addResult(msg, 'list-group-item-warning');
      self.$btnClose.removeClass('hidden');
      self.rview.loading.hide();
    };

    self.buildJS = function(){
      self.addResult('building javascripts');
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
          self.addResult('Error building resources');
          self.finished(true);
        }
      });
    };

    self._buildCSSBundle = function(config){
      var $iframe = $('<iframe><html><head></head><body></body></html></iframe').
          appendTo('body').on('load', function(){
      });
      var iframe = $iframe[0];
      var win = iframe.contentWindow || iframe;
      win.lessErrorReporting = function(what, error, href){
        self.addResult('less compilation error on file ' + href + ': ' + error);
      };
      var head = $iframe.contents().find('head')[0];
      _.each(config.less, function(less){
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet/less');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', less);
        head.appendChild(link); 
      });
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', self.rview.options.data.lessConfigUrl);
      script.onload = function(){
        script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', self.rview.options.data.lessUrl);
        head.appendChild(script);
      };
      head.appendChild(script);

      /* XXX okay, wish there were a better way,
         but we need to pool to find the */
      self.addResult(config.less.length + ' css files to build');
      var checkFinished = function(){
        var $styles =  $('style[type="text/css"][id]', head);
        for(var i=0; i<$styles.length; i=i+1){
          var $style = $styles.eq(i); 
          if($style.attr('id') === 'less:error-message'){
            self.addResult('Error compiling less');
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
              self.addResult('finished saving css bundles');
              self.finished();
            },
            error: function(){
              self.addResult('Error saving css bundle');
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
      self.addResult('building CSS bundle');
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
          self.addResult('Error building css bundle');
          self.finished(true);
        }
      });
    };

    self._buildJSBundle = function(config){
      if(config.include.length === 0){
        self.addResult('No javascripts to build, skipping');
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
            self.addResult('Error building bundle');
            self.finished(true);
          }
        });
      };
      var $iframe = $('<iframe><html><head></head><body></body></html></iframe').appendTo('body');
      var iframe = $iframe[0];
      var win = iframe.contentWindow || iframe;
      var head = $iframe.contents().find('head')[0];
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', self.rview.options.data.rjsUrl);
      script.onload = function(){
        win.requirejs.optimize(config, function(combined_files){
          self.addResult('Saved javascript bundle, Build results: <pre>' + combined_files + '</pre>');
          self.buildCSSBundle();
        });
      };
      head.appendChild(script);
    };

    return self;
  };


  var RegistryBundleListItem = RegistryResourceListItem.extend({
    type: 'bundle',
    template: _.template(
      '<a href="#"><%- name %></a> ' +
      '<div class="btn-group pull-right">' +
        '<button class="btn btn-default build btn-xs">Build</button>' +
        '<button class="btn btn-danger delete btn-xs">Delete</button>' +
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
      var builder = new Builder(self.options.name, self);
      builder.run(); 
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
        '<div class="checkbox development-mode">' +
          '<label>' +
            '<input type="checkbox" ' +
              '<% if(data.development){ %> checked="checked" <% } %>' +
              ' > Development Mode' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="items col-md-5">' +
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
        '<div class="form col-md-7"></div>' +
      '</div>'),
    events: {
      'click button.save': 'saveClicked',
      'click button.add-resource': 'addResourceClicked',
      'click button.add-bundle': 'addBundleClicked',
      'click button.cancel': 'revertChanges',
      'keyup .resources input': 'filterResources',
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
      var val = 'disabled';
      if(this.dirty){
        val = null;
      }
      this.$('button.save').attr('disabled', val);
      this.$('button.cancel').attr('disabled', val);
    },

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
