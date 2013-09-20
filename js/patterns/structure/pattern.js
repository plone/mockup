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
  'mockup-patterns-base',
  'mockup-patterns-queryhelper',
  'structure/views/AppView',

  // for some reason we need to load this early
  'text!structure/templates/paging.html',
  'text!structure/templates/selection_button.html',
  'text!structure/templates/selection_item.html',
  'text!structure/templates/tablerow.html',
  'text!structure/templates/table.html',
  'text!templates/popover.html',
], function($, Base, QueryHelper, AppView) {
  "use strict";

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      ajaxvocabulary: null,
      attributes: ['UID', 'Title', 'Type', 'path', 'review_state',
                   'ModificationDate', 'EffectiveDate', 'CreationDate',
                   'is_folderish', 'Subject'],
      basePath: '/',
      uploadUrl: null,
      moveUrl: null,
      /*
       * all these base buttons are required
       */
      buttonGroups: {
        primary: [{
          title: 'Cut',
          url: '/cut'
        },{
          title: 'Copy',
          url: '/copy'
        },{
          title: 'Paste',
          url: '/paste'
        },{
          title: 'Delete',
          url: '/delete',
          context: 'danger'
        }],
        secondary: [{
          title: 'Workflow',
          url: '/workflow'
        },{
          title: 'Tags',
          url: '/tags'
        },{
          title: 'Dates',
          url: '/dates'
        }],
        folder: [{
          title: 'Order',
          url: '/order'
        }]
      },
      folderOrderModes: [{
        id: '',
        title: 'Manual'
      },{
        id: 'effectiveDate',
        title: 'Publication Date'
      },{
        id: 'creationDate',
        title: 'Creation Date'
      }],
      folderOrder: ''
    },
    init: function() {
      var self = this;
      self.browsing = true; // so all queries will be correct with QueryHelper

      self.options.collectionUrl = self.options.ajaxvocabulary;
      self.options.queryHelper = new QueryHelper(self.$el,
        $.extend(true, {}, self.options, {basePattern: self}));

      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


