/* Filemanager pattern.
 *
 * Options:
 *    aceConfig(object): ace configuration ({})
 *    actionUrl(string): base url to get/put data. Action is passed is an a parameters, ?action=(dataTree, newFile, deleteFile, getFile, saveFile)
 *    uploadUrl(string): url to upload files to
 *    resourceSearchUrl(string): url to search for resources to customize
 *
 * Documentation:
 *
 *
 *   {{ example-1 }}
 *
 *   Example with upload
 *
 *   {{ example-2 }}
 *
 * Example: example-1
 *    <div class="pat-filemanager"
 *         data-pat-filemanager="actionUrl:/filemanager-actions;
 *                               resourceSearchUrl:/search-resources;">
 *    </div>
 *
 * Example: example-2
 *    <div class="pat-filemanager"
 *         data-pat-filemanager="actionUrl:/filemanager-actions;
 *                               uploadUrl:/upload;
 *                               resourceSearchUrl:/search-resources;">
 *    </div>
 *
 */


define([
  'jquery',
  'mockup-patterns-base',
  'underscore',
  'backbone',
  'mockup-ui-url/views/base',
  'mockup-patterns-tree',
  'mockup-patterns-texteditor',
  'text!mockup-patterns-filemanager-url/templates/app.xml',
  'mockup-ui-url/views/toolbar',
  'mockup-ui-url/views/button',
  'mockup-ui-url/views/buttongroup',
  'mockup-patterns-filemanager-url/js/addnew',
  'mockup-patterns-filemanager-url/js/newfolder',
  'mockup-patterns-filemanager-url/js/delete',
  'mockup-patterns-filemanager-url/js/customize',
  'mockup-patterns-filemanager-url/js/rename',
  'mockup-patterns-filemanager-url/js/upload',
  'translate',
  'mockup-utils',
  'text!mockup-ui-url/templates/popover.xml'
], function($, Base, _, Backbone, BaseView, Tree, TextEditor, AppTemplate, Toolbar,
            ButtonView, ButtonGroup, AddNewView, NewFolderView, DeleteView,
            CustomizeView, RenameView, UploadView, _t, utils) {
  'use strict';

  var FileManager = Base.extend({
    name: 'filemanager',
    trigger: '.pat-filemanager',
    template: _.template(AppTemplate),
    tabItemTemplate: _.template(
      '<li class="active" data-path="<%= path %>">' +
        '<a href="#" class="select"><%= path %></a>' +
        '<a href="#" class="remove">' +
          '<span class="glyphicon glyphicon-remove-circle"></span>' +
        '</a>' +
      '</li>'),
    saveBtn: null,
    fileData: {},  /* mapping of files to data that it describes */
    defaults: {
      aceConfig: {},
      actionUrl: null,
      uploadUrl: null,
      resourceSearchUrl: null,
      treeConfig: {
        autoOpen: true
      }
    },
    init: function() {
      var self = this;

      if (self.options.actionUrl === null) {
        self.$el.html('Must specify actionUrl setting for pattern');
        return;
      }
      self.options.treeConfig = $.extend(true, {}, self.treeConfig, {
        dataUrl: self.options.actionUrl + '?action=dataTree'
      });

      self.fileData = {};

      self.saveBtn = new ButtonView({
        id: 'save',
        title: _t('Save'),
        context: 'success'
      });

      var newFolderView = new NewFolderView({
        triggerView: new ButtonView({
          id: 'newfolder',
          title: _t('New folder'),
          tooltip: _t('Add new folder to current directory'),
          context: 'default'
        }),
        app: self
      });
      var addNewView = new AddNewView({
        triggerView: new ButtonView({
          id: 'addnew',
          title: _t('Add new file'),
          tooltip: _t('Add new file to current folder'),
          context: 'default'
        }),
        app: self
      });
      var renameView = new RenameView({
        triggerView: new ButtonView({
          id: 'rename',
          title: _t('Rename'),
          tooltip: _t('Rename currently selected resource'),
          context: 'default'
        }),
        app: self
      });
      var deleteView = new DeleteView({
        triggerView: new ButtonView({
          id: 'delete',
          title: _t('Delete'),
          tooltip: _('Delete currently selected resource'),
          context: 'danger'
        }),
        app: self
      });

      self.views = [
        newFolderView,
        addNewView,
        renameView,
        deleteView
      ];
      var mainButtons = [
        newFolderView.triggerView,
        addNewView.triggerView
      ];

      if (self.options.uploadUrl){
        var uploadView = new UploadView({
          triggerView: new ButtonView({
            id: 'upload',
            title: _t('Upload'),
            tooltip: _t('Upload file to current directory'),
            context: 'default'
          }),
          app: self
        });
        self.views.push(uploadView);
        mainButtons.push(uploadView.triggerView);
      }
      if (self.options.resourceSearchUrl){
        var customizeView = new CustomizeView({
          triggerView: new ButtonView({
            id: 'customize',
            title: _t('Add new override'),
            tooltip: _t('Find resource in plone to override'),
            context: 'default'
          }),
          app: self
        });
        self.views.push(customizeView);
        mainButtons.push(customizeView.triggerView);
      }

      self.toolbar = new Toolbar({
        items: [
          new ButtonGroup({
            items: mainButtons,
            id: 'main',
            app: self
          }),
          new ButtonGroup({
            items: [
              renameView.triggerView,
              deleteView.triggerView
            ],
            id: 'secondary',
            app: self
          }),
          self.saveBtn
        ]
      });

      self._save = function() {
        self.doAction('saveFile', {
          type: 'POST',
          data: {
            path: self.getNodePath(),
            data: self.ace.editor.getValue(),
            _authenticator: utils.getAuthenticator()
          },
          success: function(data) {
            $('[data-path="' + self.getNodePath() + '"]').removeClass("modified");
          }
        });
      };

      self.saveBtn.on('button:click', function() {
        self._save();
      });
      self.render();
    },
    $: function(selector){
      return this.$el.find(selector);
    },
    render: function(){
      var self = this;
      self.$el.html(self.template(self.options));
      self.$('#toolbar').append(self.toolbar.render().el);
      _.each(self.views, function(view) {
        self.$('#toolbar').append(view.render().el);
      });
      self.$tree = self.$('.tree');
      self.$nav = self.$('nav');
      self.$tabs = $('ul.nav', self.$nav);
      self.options.treeConfig.onLoad = function() {
        // on loading initial data, activate first node if available
        var node = self.$tree.tree('getNodeById', 1);
        if (node){
          self.$tree.tree('selectNode', node);
          self.openFile({node: node});
        }
      };
      self.tree = new Tree(self.$tree, self.options.treeConfig);
      self.$tree.bind('tree.click', function(e) {
        self.openFile(e);
      });
      self.$editor = self.$('.editor');
    },
    openFile: function(event) {
      var self = this;
      var doc = event.node.path;
      if (event.node.folder){
        return true;
      }
      if(self.fileData[doc]) {
        $('li', self.$tabs).removeClass('active');
        var $existing = $('[data-path="' + doc + '"]');
        if ($existing.length === 0){
          var $item = $(self.tabItemTemplate({path: doc}));
          self.$tabs.append($item);
          $('.remove', $item).click(function(e){
            e.preventDefault();
            if ($(this).parent().hasClass('active'))
            {
              var $siblings = $(this).parent().siblings();
              if ($siblings.length > 0){
                var $item;
                if ($(this).parent().prev().length > 0){
                  $item = $(this).parent().prev();
                } else {
                  $item = $(this).parent().next();
                }
                $item.addClass('active');
                self.openEditor($item.attr('data-path'));
              } else {
                self.ace.setText('');
              }
            }
            $(this).parent().remove();
          });
          $('.select', $item).click(function(e){
            e.preventDefault();
            $('li', self.$tabs).removeClass('active');
            var $li = $(this).parent();
            $li.addClass('active');
            self.$tree.tree('selectNode', event.node);
            self.openFile({node: event.node});
          });
        }else{
          $existing.addClass('active');
        }
        self.openEditor(doc);
      } else {
        self.doAction('getFile', {
          data: { path: doc },
          dataType: 'json',
          success: function(data) {
            self.fileData[doc] = data;
            self.openFile(event);
          }
        });
      }
    },
    doAction: function(action, options) {
      var self = this;
      if (!options){
        options = {};
      }
      $.ajax({
        url: self.options.actionUrl,
        type: options.type || 'GET',
        data: $.extend({}, {
          _authenticator: utils.getAuthenticator(),
          action: action
        }, options.data || {}),
        success: options.success,
        failure: options.failure || function() {}
      });
    },
    openEditor: function(path) {
      var self = this;
      // first we need to save the current editor content
      if(self.currentPath) {
        self.fileData[self.currentPath].contents = self.ace.editor.getValue();
      }
      self.currentPath = path;
      if (self.ace !== undefined){
        self.ace.editor.destroy();
      }
      self.ace = new TextEditor(self.$editor);

      self.resizeEditor();

      if( typeof self.fileData[path].info !== 'undefined' )
      {
          var preview = self.fileData[path].info;
          self.ace.editor.off();
          $('.ace_editor').empty().append(preview);
      }
      else
      {
          self.ace.setText(self.fileData[path].contents);
          self.ace.setSyntax(path);
          self.ace.editor.clearSelection();
      }

      self.ace.editor.on('change', function() {
        if (self.ace.editor.curOp && self.ace.editor.curOp.command.name) {
          $('[data-path="' + path + '"]').addClass("modified");
        }
      });
      self.ace.editor.commands.addCommand({
        name: 'saveFile',
        bindKey: {
          win: 'Ctrl-S', mac: 'Command-S',
          sender: 'editor|cli'
        },
        exec: function (env, args, request) {
          self._save();
        }
      });
    },
    getSelectedNode: function() {
      return this.$tree.tree('getSelectedNode');
    },
    getNodePath: function(node) {
      var self = this;
      if(node === undefined){
        node = self.getSelectedNode();
      }
      var path = self.getFolderPath(node.parent);
      if (path !== '/'){
        path += '/';
      }
      return path + node.name;
    },
    getFolderPath: function(node){
      var self = this;
      if(node === undefined){
        node = self.getSelectedNode();
      }
      var parts = [];
      if (!node.folder && node.name){
        node = node.parent;
      }
      while (node.name){
        parts.push(node.name);
        node = node.parent;
      }
      parts.reverse();
      return '/' + parts.join('/');
    },

    resizeEditor: function() {
        var self = this;
        var tabBox = self.$tabs.parent();

        //Contains both the tabs, and editor window
        var container = tabBox.parent().parent();
        var h = container.innerHeight();
        h -= tabBox.outerHeight();

        //accounts for the borders/margin
        self.$editor.height(h);

        var w = container.innerWidth();
        w -= (container.outerWidth(true) - container.innerWidth());

        self.$editor.width(w);
    }
  });

  return FileManager;

});
