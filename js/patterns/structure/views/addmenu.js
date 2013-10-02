// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//


define([
  'jquery',
  'underscore',
  'backbone',
  'js/ui/views/buttongroup',
  'js/ui/views/button',
  'mockup-patterns-modal',
  'js/utils',
  'boostrap-dropdown'
], function($, _, Backbone, ButtonGroup, ButtonView, Modal, utils) {
  "use strict";

  var AddMenu = ButtonGroup.extend({
    title: 'Add',
    events: {
    },
    modalTemplate: _.template(
      '<div>' +
        '<form>' +
          '<legend>Create <%- title %>' +
          '<label>Title</label>' +
          '<input name="title" />' +
          '<a class="btn btn-success">Add</a>' +
        '</form>' +
      '</div>'),
    initialize: function(){
      var self = this;
      ButtonGroup.prototype.initialize.call(self);
      self.app.on('context-info-loaded', function(data){
        self.$items.empty();
        _.each(data.addButtons, function(item){
          var view = new ButtonView({
            id: item.id,
            title: item.title,
            url: item.action
          });
          view.render();
          var wrap = $('<li/>');
          view.$el.removeClass('btn'); // in this sort of btn group, can not have btn class

          wrap.append(view.el);
          self.$items.append(wrap);
          view.$el.click(function(e){
            self.buttonClicked.apply(self, [e, view]);
            return false;
          });
        });
      });
    },
    buttonClicked: function(e, button){
      var self = this;
      e.preventDefault();

      $.ajax({
        url: button.url,
        type: 'POST',
        data: {
          '_authenticator': $('[name="_authenticator"]').val(),
        },
        success: function(response){
          var modal = new Modal(self.$el, {
            html: utils.parseBodyTag(response),
            content: '#content',
            width: '80%',
            backdropOptions: {
              closeOnClick: false
            },
            automaticallyAddButtonActions: false,
            actionOptions: {
              displayInModal: false,
              reloadWindowOnClose: false
            },
            actions: {
              'input#form-buttons-save, .formControls input[name="form.button.save"]': {
                onSuccess: function(modal, response, state, xhr, form){
                  self.app.collection.pager();
                  if(self.$items.is(':visible')){
                    self.$dropdown.dropdown('toggle');
                  }
                  modal.$loading.hide();
                },
              },
              'input#form-buttons-cancel, .formControls input[name="form.button.cancel"]': {
                modalFunction: 'hide'
              }
            },
          });
          modal.show();
        },
        error: function(){
          // XXX handle error
        }
      });
    },
    render: function(){
      var self = this;
      self.$el.empty();

      self.$el.append(
        '<a class="btn dropdown-toggle btn-success" data-toggle="dropdown" href="#">' +
          self.title +
          '<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
        '</ul>' +
      '</div>');

      self.$items = self.$('.dropdown-menu');
      self.$dropdown = self.$('.dropdown-toggle');
      self.$dropdown.dropdown();
      return this;
    }
  });

  return AddMenu;
});
