define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var RenameView = PopoverView.extend({
    className: 'popover addnew',
    title: _.template('<%= _t("Rename") %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<div class="form-group">' +
        '<label for="filename-field"><%= _t("Filename") %></label>' +
        '<input type="text" class="form-control" ' +
                'id="filename-field">' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%= _t("Rename") %></button>'
    ),
    events: {
      'click button': 'renameButtonClicked'
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      var node = self.app.getSelectedNode();
      self.$('input').val(node.name);
      self.$('.current-path').html(self.app.getNodePath(node));
    },
    renameButtonClicked: function(e) {
      var self = this;
      var $input = self.$('input');
      var filename = $input.val();
      if (filename){
        self.app.doAction('renameFile', {
          type: 'POST',
          data: {
            path: self.app.getNodePath(),
            filename: filename
          },
          success: function(data) {
            self.hide();
            self.app.$tree.tree(
              'loadDataFromUrl',
              self.app.options.actionUrl + '?action=dataTree'
            );
            // ugly, $tabs should have an API
            $('.nav .active .remove').click();
          }
        });
        // XXX show loading
      } else {
        self.$('.form-group').addClass('has-error');
      }
    }
  });

  return RenameView;
});
