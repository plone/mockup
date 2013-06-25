// Pattern which Plone livesearch functionality on an input
//
// Author: Ryan Foster
// Contact: ryan@rynamic.com
// Version: 1.0
//
// Adapted from livesearch.js in Plone.
//
// License:
//
// Copyright (C) 2013 Plone Foundation
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'js/patterns/toggle',
  'underscore',
  'js/patterns/select2',
  'js/patterns/queryhelper'
], function($, Base, Toggle, _, Select2, QueryHelper) {
  "use strict";

  var Livesearch = Base.extend({
    name: "livesearch",
    defaults: {
      multiple: true,
      closeOnSelect: false,
      minimumInputLength: 3,
      tokenSeparators: [",", " "],
      dropdownCssClass: 'pat-livesearch-dropdown',
      linkSelector: 'pat-livesearch-result-title',
      resultTemplate: '' +
        '<div class="pat-livesearch-result pat-livesearch-type-<%= Type %>">' +
          '<a class="pat-livesearch-result-title" href="<%= getURL %>">' +
            '<%= Title %>' +
          '</a>' +
          '<p class="pat-livesearch-result-desc"><%= Description %></p>' +
        '</div>',
      resultTemplateSelector: null,
      isTest: false,
      id: function(object) {
        return object.UID;
      }
    },

    init: function() {
      var self = this;
      self.query = new QueryHelper(self.$el, self.options);
      self.query.init(self);

      if (!self.query.valid) {
        $.error('No url provided for livesearch results ' + self.$el);
      }

      Select2.prototype.initializeValueMap.call(self);
      Select2.prototype.initializeTags.call(self);
      Select2.prototype.initializeOrdering.call(self);

      if(self.query.valid){
        self.options.ajax = self.query.selectAjax();
      }
      else {
        self.options.tags = [];
      }

      self.options.formatResult = function(item) {
        var result = $(self.applyTemplate('result', item));
        return $(result);
      };

      Select2.prototype.initializeSelect2.call(self);

      self.$el.on("select2-selecting", function(event, data) {
        event.preventDefault();
        self.select();
      });
    },

    applyTemplate: function(tpl, item) {
      var self = this;
      var template;
      if (self.options[tpl+'TemplateSelector']) {
        template = $(self.options[tpl+'TemplateSelector']).html();
        if (!template) {
          template = self.options[tpl+'Template'];
        }
      } else {
        template = self.options[tpl+'Template'];
      }
      return _.template(template, item);
    },

    select: function() {
      var self = this;
      var select2 = self.$el.data().select2;
      var dropdown = select2.dropdown;
      var selected = $('.select2-highlighted', dropdown);
      var link = $('.'+self.options.linkSelector, selected);
      var target = link.attr('href');
      if (target) {
        // There may be a better way to do this
        if (self.options.isTest) {
          self.testTarget = target;
        } else {
          window.location = target;
        }
      }
    }

  });

  return Livesearch;

});
