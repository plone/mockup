define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var AddNewView = PopoverView.extend({
    className: 'popover addfolder',
    title: _.template('<%= translations.new_folder %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<div class="form-group">' +
        '<label for="filename-field"><%= translations.folder_name %></label>' +
        '<input type="email" class="form-control" ' +
                'id="filename-field" placeholder="<%= translations.enter_folder_name %>">' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%= translations.add %></button>'
    ),
    events: {
      'click button': 'addButtonClicked'
    },
    addButtonClicked: function(e) {
      var self = this;
      var $input = self.$('input');
      var name = $input.val();
      if (name){
        self.app.doAction('addFolder', {
          type: 'POST',
          data: {
            name: name,
            path: self.app.getFolderPath()
          },
          success: function(data) {
            self.hide();
            self.app.$tree.tree(
              'loadDataFromUrl',
              self.app.options.actionUrl + '?action=dataTree'
            );
          }
        });
        // XXX show loading
      } else {
        self.$('.form-group').addClass('has-error');
      }
    }
  });

  return AddNewView;
});
