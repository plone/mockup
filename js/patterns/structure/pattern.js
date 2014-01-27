/* Structure pattern.
 *
 * Options:
 *    vocabularyUrl(string): Url to return query results (null)
 *    tagsVocabularyUrl(string): Url to return tags query results (null)
 *    usersVocabularyUrl(string): Url to query users (null)
 *    indexOptionsUrl(string): Url to configure querystring widget with (null)
 *    uploadUrl(string): For setting up dropzone (null)
 *    moveUrl(string): For supporting drag drop reordering (null)
 *    contextInfoUrl(string): For supporting add menu (null)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-structure"
 *         data-pat-structure="vocabularyUrl:/relateditems-test.json;
 *                             uploadUrl:/upload;
 *                             moveUrl:/moveitem;
 *                             tagsVocabularyUrl:/select2-test.json;
 *                             usersVocabularyUrl:/tests/json/users.json;
 *                             indexOptionsUrl:/tests/json/queryStringCriteria.json;
 *                             contextInfoUrl:/tests/json/contextInfo.json;"></div>
 *
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-patterns-queryhelper',
  'js/patterns/structure/views/app',
  'text!js/patterns/structure/templates/paging.xml',
  'text!js/patterns/structure/templates/selection_button.xml',
  'text!js/patterns/structure/templates/selection_item.xml',
  'text!js/patterns/structure/templates/tablerow.xml',
  'text!js/patterns/structure/templates/table.xml',
  'text!js/ui/templates/popover.xml'
], function($, Base, QueryHelper, AppView) {
  "use strict";

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      vocabularyUrl: null,
      tagsVocabularyUrl: null,
      usersVocabularyUrl: null,
      indexOptionsUrl: null, // for querystring widget
      contextInfoUrl: null, // for add new dropdown and other info
      setDefaultPageUrl: null,
      backdropSelector: '.modal', // Element upon which to apply backdrops used for popovers
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
        'is_folderish': 'Folder',
        'exclude_from_nav': 'Excluded from nav',
        'getObjSize': 'Object Size',
        'last_comment_date': 'Last comment date',
        'total_comments': 'Total comments'
      },
      sort: {
        properties: {
          'id': 'ID',
          'sortable_title': 'Title',
          'modified': 'Last Modified',
          'created': 'Created on',
          'effective': 'Publication Date',
          'Type': 'Type'
        },
        url: '/sort'
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
          context: 'danger',
          icon: 'trash'
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
      },
      useTus: false
    },
    init: function() {
      var self = this;
      self.browsing = true; // so all queries will be correct with QueryHelper
      self.options.collectionUrl = self.options.vocabularyUrl;
      self.options.queryHelper = new QueryHelper(self.$el,
        $.extend(true, {}, self.options, {basePattern: self}));

      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


