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
  'backbone',
  'underscore',
  'ui/views/base'
  ],
  function($, Backbone, _, BaseView) {
  "use strict";

  var ButtonView = BaseView.extend({
    tagName: 'button',
    className: 'btn',
    events: {
      'click': 'handleClick'
    },
    initialize: function() {
      if (!this.options.classNames) {
        this.options.classNames = [];
      }
      if (this.options.context) { this.options.classNames.push('btn-'+this.options.context); }
      if (!this.options.id) {
        var title = this.options.title || '';
        this.options.id = title !== '' ? title.toLowerCase().replace(' ', '-') : this.cid;
      }
      BaseView.prototype.initialize.call(this);

      this.on('disable', function() {
        this.disable();
      }, this);

      this.on('enable', function() {
        this.enable();
      }, this);
    },
    handleClick: function(e){
      e.preventDefault();
      if (!this.$el.is('.disabled')) {
        var eventName = this.options.id + '.click';
        this.trigger(eventName, [this]);
      }
      if(this.url){
        // handle ajax now
        var self = this;
        var uids = [];
        self.collection.each(function(item){
          uids.push(item.uid());
        });
        var url = this.url.replace('{path}', self.app.options.queryHelper.getCurrentPath());
        $.ajax({
          url: url,
          type: 'POST',
          data: {
            '_authenticator': $('input[name="_authenticator"]').val(),
            'selection': JSON.stringify(uids)
          },
          success: function(data){
            if(data.status === 'success'){
              self.collection.reset();
            }
            if(data.msg){
              alert(data.msg);
            }
          },
          error: function(data){
            if(data.status === 404){
              alert('operation url "' + url + '" is not valid');
            }
          }
        });
      }
    },
    render: function(){
      this.$el.text(this.options.title);
      if (this.options.icon) {
        this.$el.prepend('<i class="icon-'+this.options.icon+'"</i>');
      }
      this.$el.addClass(this.options.classNames.join(' '));

      if (this.options.disabled) {
        this.disable();
      }
      return this;
    },
    disable: function() {
      this.options.disabled = true;
      this.$el.addClass('disabled');
    },
    enable: function() {
      this.options.disabled = false;
      this.$el.removeClass('disabled');
    }
  });

  return ButtonView;
});
