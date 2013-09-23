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
  'ui/views/popover'
], function($, _, Backbone, PopoverView) {
  "use strict";

  var PropertiesView = PopoverView.extend({
    className: 'popoverview rename',
    title: _.template('Rename items'),
    content: _.template(
      '<div class="itemstoremove"></div>' +
      '<button class="btn btn-block btn-primary">Apply</button>'
    ),
    itemTemplate: _.template(
      '<div class="item">' +
        '<label>Title</label>' +
        '<input name="newtitle" value="<%= Title %>" />' +
        '<label>Short name</label>' +
        '<input name="newid" value="<%= id %>" />' +
      '</div>'),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(){
      this.app = this.options.app;
      PopoverView.prototype.initialize.call(this);
    },
    render: function(){
      PopoverView.prototype.render.call(this);
      this.$items = this.$('.itemstoremove');
      return this;
    },
    applyButtonClicked: function(e){
      var torename = [];
      this.$items.find('.item').each(function(){
        var $item = $(this);
        torename.push({
          UID: $item.find('[name="UID"]').val(),
          newid: $item.find('[name="newid"]').val(),
          newtitle: $item.find('[name="newtitle"]').val()
        });
      });
      var self = this;
      this.app.defaultButtonClickEvent(this.button, {
        torename: JSON.stringify(torename)
      });
      this.hide();
    },
    showItemsClicked: function(button, e){
      PopoverView.prototype.showItemsClicked.apply(this, [button, e]);
      var self = this;
      if(!self.opened){
        return;
      }
      self.$items.empty();
      self.app.selectedCollection.each(function(item){
        self.$items.append(self.itemTemplate(item.toJSON()));
      });
    }
  });

  return PropertiesView;
});





