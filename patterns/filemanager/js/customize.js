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
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var CustomizeView = PopoverView.extend({
    className: 'popover customize',
    title: _.template('<%= translations.add_override %>'),
    content: _.template(
      '<form>' +
        '<div class="input-group">' +
          '<input type="text" class="search form-control" ' +
                  'id="search-field" placeholder="<%= translations.search_resources %>">' +
          '<span class="input-group-btn">' +
            '<input type="submit" class="plone-btn plone-btn-primary" value="<%= translations.search %>"/>' +
          '</span>' +
        '</div>' +
      '</form>' +
      '<ul class="results list-group">' +
      '</ul>'
    ),
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      self.$form = self.$('form');
      self.$results = self.$('.results');
      self.$form.submit(function(e){
        e.preventDefault();
        $.ajax({
          url: self.app.options.resourceSearchUrl,
          dataType: 'json',
          success: function(data){
            self.$results.empty();
            _.each(data, function(item){
              var $item = $(
                '<li class="list-group-item" data-id="' + item.id + '">' +
                  '<span class="badge"><a href=#">' + self.options.transitions.customize + '</a></span>' +
                  item.id +
                '</li>');
              $('a', $item).click(function(e){
                e.preventDefault();
                self.customize($(this).parents('li').eq(0).attr('data-id'));
              });
              self.$results.append($item);
            });
          }
        });
      });
      return self;
    },
    customize: function(resource) {
      var self = this;
      self.app.doAction('customize', {
        type: 'POST',
        data: {
          resource: resource
        },
        success: function(data) {
          self.hide();
          // clear out
          self.$('input.search').attr('value', '');
          self.$results.empty();
          self.app.$tree.tree('reload');
        }
      });
    }
  });

  return CustomizeView;
});