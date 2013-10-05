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
  'js/ui/views/popover',
  'mockup-patterns-select2'
], function($, _, Backbone, PopoverView, Select2) {
  "use strict";

  var TagsView = PopoverView.extend({
    title: _.template('Add/Remove tags'),
    content: _.template(
      '<label>Tags to remove</label>' +
      '<select multiple class="toremove" style="width: 300px">' +
      '</select>' +
      '<label>Tags to add</label>' +
      '<input class="toadd" style="width:300px" />' +
      '<button class="btn btn-block btn-primary">Apply</button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(){
      this.app = this.options.app;
      this.removeSelect2 = null;
      this.addSelect2 = null;
      PopoverView.prototype.initialize.call(this);
    },
    render: function(){
      PopoverView.prototype.render.call(this);
      this.$remove = this.$('.toremove');
      this.$add = this.$('.toadd');
      this.$remove.select2();
      this.addSelect2 = new Select2(this.$add, {
        multiple: true,
        ajaxVocabulary: this.app.options.tagsAjaxVocabulary
      });
      return this;
    },
    getSelect2Values: function($el){
      var values = [];
      _.each($el.select2('data'), function(item){
        values.push(item.id);
      });
      return values;
    },
    applyButtonClicked: function(e){
      this.app.defaultButtonClickEvent(this.triggerView, {
        remove: JSON.stringify(this.getSelect2Values(this.$remove)),
        add: JSON.stringify(this.getSelect2Values(this.$add))
      });
      this.hide();
    },
    toggle: function(button, e){
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if(!this.opened){
        return;
      }
      // clear out 
      self.$remove.select2('destroy');
      self.$remove.empty();
      self.$add.select2('data', []);

      self.app.selectedCollection.each(function(item){
        if(!item.attributes.Subject){
          return;
        }
        _.each(item.attributes.Subject, function(tag){
          if(self.$remove.find('[value="' + tag + '"]').length === 0){
            self.$remove.append('<option value="' + tag + '">' + tag + '</option>');
          }
        });
      });
      self.$remove.select2();
    }
  });

  return TagsView;
});


