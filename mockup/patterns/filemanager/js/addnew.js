define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var AddNewView = PopoverView.extend({
    className: 'popover addnew',
    title: _.template('<%= translations.add_new_file %>'),
    content: _.template(
      '<span class="current-path"></span>' +
      '<div class="form-group">' +
        '<label for="filename-field"><%= translations.filename %></label>' +
        '<input type="text" class="form-control" ' +
                'id="filename-field" placeholder="<%= translations.enter_filename %>">' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%= translations.add %></button>'
    ),
    events: {
      'click button': 'addButtonClicked'
    },
    addButtonClicked: function(e) {
      var self = this;
      var $input = self.$('input');
      var filename = $input.val();
      if (filename){
        self.app.doAction('addFile', {
          type: 'POST',
          data: {
            filename: filename,
            path: self.app.getFolderPath()
          },
          success: function(data) {
            self.hide();
            self.app.$tree.tree('reload');
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
