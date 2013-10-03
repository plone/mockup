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
  'js/patterns/structure/views/app',
  'text!js/patterns/structure/templates/paging.tmpl',
  'text!js/patterns/structure/templates/selection_button.tmpl',
  'text!js/patterns/structure/templates/selection_item.tmpl',
  'text!js/patterns/structure/templates/tablerow.tmpl',
  'text!js/patterns/structure/templates/table.tmpl',
  'text!js/ui/templates/popover.tmpl'
], function($, Base, QueryHelper, AppView) {
  "use strict";

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      ajaxVocabulary: null,
      tagsAjaxVocabulary: null,
      usersAjaxVocabulary: null,
      indexOptionsUrl: null, // for querystring widget
      contextInfoUrl: null, // for add new dropdown and other info
      setDefaultPageUrl: null,
      attributes: ['UID', 'Title', 'Type', 'path', 'review_state',
                   'ModificationDate', 'EffectiveDate', 'CreationDate',
                   'is_folderish', 'Subject', 'getURL', 'id', 'exclude_from_nav',
                   'getObjSize', 'last_comment_date', 'total_comments'],
      activeColumns: [
        'ModificationDate',
        'EffectiveDate',
        'review_state'
      ],
      availableColumns: {
        'ModificationDate': 'Last modified',
        'EffectiveDate': 'Published',
        'CreationDate': 'Created',
        'review_state': 'Review state',
        'Subject': 'Tags',
        'Type': 'Type',
        'is_folder': 'Folder',
        'exclude_from_nav': 'Excluded from nav',
        'getObjSize': 'Object Size',
        'last_comment_date': 'Last comment date',
        'total_comments': 'Total comments'
      },
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
          title: 'Properties',
          url: '/properties'
        },{
          title: 'Rename',
          url: '/rename'
        }]
      }
    },
    init: function() {
      var self = this;
      self.browsing = true; // so all queries will be correct with QueryHelper

      self.options.collectionUrl = self.options.ajaxVocabulary;
      self.options.queryHelper = new QueryHelper(self.$el,
        $.extend(true, {}, self.options, {basePattern: self}));

      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


