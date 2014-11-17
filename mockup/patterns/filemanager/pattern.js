/* Filemanager pattern.
 *
 * Options:
 *    aceConfig(object): ace configuration ({})
 *    actionUrl(string): base url to get/put data. Action is passed is an a parameters, ?action=(dataTree, newFile, deleteFile, getFile, saveFile)
 *    uploadUrl(string): url to upload files to
 *    resourceSearchUrl(string): url to search for resources to customize
 *    translations(object): mapping of translation strings
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
  'mockup-utils',
  'text!mockup-ui-url/templates/popover.xml'
], function($, Base, _, Backbone, BaseView, Tree, TextEditor, AppTemplate, Toolbar,
            ButtonView, ButtonGroup, AddNewView, NewFolderView, DeleteView,
            CustomizeView, RenameView, UploadView, utils) {
  'use strict';

  var FileManager = Base.extend({
    name: 'filemanager',
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
      translations: {
        add_new_file: 'New file',
        add_new_file_tooltip: 'Add new file to current folder',
        add_override: 'Add new override',
        add_override_tooltip: 'Find resource in plone to override',
        delete: 'Delete',
        delete_tooltip: 'Delete currently selected file',
        new_folder: 'New folder',
        new_folder_tooltip: 'Add new folder to current directory',
        rename: 'Rename',
        rename_tooltip: 'Rename currently selected resource',
        upload: 'Upload',
        upload_tooltip: 'Upload file to current directory',
        filename: 'Filename',
        enter_filename: 'Enter filename',
        add: 'Add',
        search: 'Search',
        search_resources: 'Search resources',
        customize: 'Customize',
        yes_delete: 'Yes, delete',
        delete_question: 'Are you sure you want to delete this resource?',
        folder_name: 'Folder name',
        enter_folder_name: 'Enter folder name',
        save: 'Save'
      },
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

      var translations = self.options.translations;

      self.fileData = {};
      self.currentPath;

      self.saveBtn = new ButtonView({
        id: 'save',
        title: translations.save,
        context: 'success'
      });

      var newFolderView = new NewFolderView({
        triggerView: new ButtonView({
          id: 'newfolder',
          title: translations.new_folder,
          tooltip: translations.new_folder_tooltip,
          context: 'default'
        }),
        app: self
      });
      var addNewView = new AddNewView({
        triggerView: new ButtonView({
          id: 'addnew',
          title: translations.add_new_file,
          tooltip: translations.add_new_file_tooltip,
          context: 'default'
        }),
        app: self
      });
      var renameView = new RenameView({
        triggerView: new ButtonView({
          id: 'rename',
          title: translations.rename,
          tooltip: translations.rename_tooltip,
          context: 'default'
        }),
        app: self
      });
      var deleteView = new DeleteView({
        triggerView: new ButtonView({
          id: 'delete',
          title: translations.delete,
          tooltip: translations.delete_tooltip,
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
            title: translations.upload,
            tooltip: translations.upload_tooltip,
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
            title: translations.add_override,
            tooltip: translations.add_override_tooltip,
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

      self.saveBtn.on('button:click', function(e) {
        self.doAction('saveFile', {
          type: 'POST',
          data: {
            path: self.getNodePath(),
            data: self.ace.editor.getValue(),
            _authenticator: utils.getAuthenticator()
          },
          success: function(data) {
            /* XXX unhighlight save button */
          }
        });
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
      self.options.treeConfig.onLoad = function(tree) {
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
      var doc = event.node.name;
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
      self.ace = new TextEditor(self.$editor, {
        width: self.$editor.width()
      });
      self.ace.setSyntax(path);
      self.ace.setText(self.fileData[path].contents);
      self.ace.editor.clearSelection();
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
      return '/' + parts.join('/');
    }

  });

  return FileManager;

});
