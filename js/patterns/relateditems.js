// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'js/patterns/select2'
], function($, Base, Select2) {
  "use strict";

  var RelatedItems = Base.extend({
    name: "relateditems",
    defaults: {
      multiple: true,
      tokenSeparators: [",", " "],
      separator: ",",
      orderable: true,
      cache: true,
      closeOnSelect: false,
      base_path: '/',
      browse_text: 'Browse'
    },
    activateBrowsing: function(){
      var self = this;
      self.$browsePath.html(self.options.base_path);
      self.$browseBtn.html('');
      self.$browseBtn.addClass('select2-search-choice-close');
      self.browsing = true;
    },
    deactivateBrowsing: function(){
      var self = this;
      self.$browseBtn.removeClass('select2-search-choice-close').html(self.options.browse_text);
      self.$browsePath.html('');
      self.browsing = false;
    },
    init: function() {
      var self = this;
      self.browsing = false;
      Select2.prototype.initializeValueMap.call(self);
      Select2.prototype.initializeTags.call(self);

      self.options.formatResult = function(item){
        var $resultel = $(  '<div>'
                    +   '<div class="folder">'
                    +     '<a href="#">' + item.title + '</a>'
                    +     '<span class="add"><a href="#">add</a></span>'
                    +   '</div>'
                    +   '<div class="folderpath">'
                    +     item.path
                    +   '</div>'
                    + '</div>');

        self.$el.on('selecting', function(evt) {
          evt.preventDefault();
        });

        return $resultel;
      };
      self.options.formatSelection = function(item){
        return '<span title="' + item.path + '">' + item.title + '</span>';
      };
      self.options.escapeMarkup = function(txt){
        return txt;
      };
      Select2.prototype.initializeOrdering.call(self);

      if(self.options.url !== undefined){
        var query_term = '';
        self.options.ajax = {
          url: self.options.url,
          dataType: 'JSON',
          quietMillis: 100,
          data: function(term, page) { // page is the one-based page number tracked by Select2
            var opts = {
              q: term,
              page: page,
              page_limit: 10 // page size
            };
            if(self.browsing){
              opts.base_path = self.options.base_path;
            }
            return opts;
          },
          results: function (data, page) {
            var more = (page * 10) < data.total; // whether or not there are more results available
            // notice we return the value of more so Select2 knows if more results can be loaded
            return {results: data.results, more: more};
          }
        };
      }
      else {
        self.options.tags = [];
      }

      Select2.prototype.initializeSelect2.call(self);

      // Browsing functionality
      self.$browse = $('<div class="select2-browse"></div>');
      self.$browseBtn = $('<a href="#"></a>');
      self.$browsePath = $('<span />');
      self.$browse.append(self.$browseBtn);
      self.$browse.append(self.$browsePath);
      self.$select2.before(self.$browse);
      self.deactivateBrowsing();
      self.$el.on('loaded', function(data){
      });

      self.$browse.click(function(e){
        e.preventDefault();
        if(self.browsing){
          self.deactivateBrowsing();
          self.$el.select2('close');
        }else{
          self.activateBrowsing();
          self.$el.select2('open');
        }
      });
    }
  });

  return RelatedItems;

});

