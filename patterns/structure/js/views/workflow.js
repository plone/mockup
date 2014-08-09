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
  'mockup-ui-url/views/popover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var WorkflowView = PopoverView.extend({
    className: 'popover workflow',
    title: _.template('Modify dates on items'),
    content: _.template(
      '<form>' +
        '<fieldset>' +
          '<div class="form-group">' +
            '<label>Comments</label>' +
            '<textarea class="form-control" rows="4"></textarea>' +
            '<p class="help-block">Select the transition to be used for ' +
              'modifying the items state.</p>' +
          '</div>' +
          '<div class="form-group">' +
            '<label>Change State</label>' +
            '<p class="help-block">Select the transition to be used for ' +
              'modifying the items state.</p>' +
            '<select class="form-control" name="transition">' +
            '</select>' +
          '</div>' +
          '<div class="checkbox">' +
            '<label>' +
              '<input type="checkbox" name="recurse" />' +
              'Include contained items?</label>' +
            '<p class="help-block">' +
              'If checked, this will attempt to modify the status of all ' +
              'content in any selected folders and their subfolders.' +
            '</p>' +
          '</div>' +
        '</fieldset>' +
      '</form>' +
      '<button class="btn btn-block btn-primary">Apply</button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function() {
      PopoverView.prototype.render.call(this);
      this.$comments = this.$('textarea');
      this.$transition = this.$('select');
      return this;
    },
    applyButtonClicked: function(e) {
      var data = {
        comments: this.$comments.val(),
        transition: this.$transition.val()
      };
      if (this.$('[name="recurse"]')[0].checked) {
        data.recurse = 'yes';
      }
      this.app.defaultButtonClickEvent(this.triggerView, data);
      this.hide();
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!self.opened) {
        return;
      }
      self.$comments.val('');
      self.$transition.empty();
      $.ajax({
        url: self.triggerView.url,
        type: 'GET',
        data: {
          selection: JSON.stringify(self.app.getSelectedUids()),
          transitions: true
        },
        success: function(data) {
          _.each(data.transitions, function(transition) {
            self.$transition.append('<option value="' + transition.id + '">' + transition.title + '</option>');
          });
        },
        error: function(data) {
          // XXX error handling...
          window.alert('error getting transition data');
        }
      });
    }
  });

  return WorkflowView;
});




