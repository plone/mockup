/* Structure pattern.
 *
 * Options:
 *    vocabularyUrl(string): Url to return query results (null)
 *    tagsVocabularyUrl(string): Url to return tags query results (null)
 *    usersVocabularyUrl(string): Url to query users (null)
 *    indexOptionsUrl(string): Url to configure querystring widget with (null)
 *    upload(string): upload configuration settings(null)
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
 *                             contextInfoUrl:{path}/context-info;"></div>
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
  'mockup-utils',
  'mockup-patterns-structure-url/js/views/app',
  'mockup-i18n',
  'text!mockup-patterns-structure-url/templates/paging.xml',
  'text!mockup-patterns-structure-url/templates/selection_item.xml',
  'text!mockup-patterns-structure-url/templates/tablerow.xml',
  'text!mockup-patterns-structure-url/templates/table.xml',
  'text!mockup-ui-url/templates/popover.xml',
], function($, Base, utils, AppView, i18n) {
  'use strict';

  i18n.loadCatalog('widgets');
  var _ = i18n.MessageFactory('widgets');

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      vocabularyUrl: null,
      tagsVocabularyUrl: null,
      usersVocabularyUrl: null,
      indexOptionsUrl: null, // for querystring widget
      contextInfoUrl: null, // for add new dropdown and other info
      setDefaultPageUrl: null,
      backdropSelector: '.plone-modal', // Element upon which to apply backdrops used for popovers
      attributes: [
        'UID', 'Title', 'Type', 'path', 'review_state',
        'ModificationDate', 'EffectiveDate', 'CreationDate',
        'is_folderish', 'Subject', 'getURL', 'id', 'exclude_from_nav',
        'getObjSize', 'last_comment_date', 'total_comments'
      ],
      activeColumns: [
        'ModificationDate',
        'EffectiveDate',
        'review_state'
      ],
      availableColumns: {
        'ModificationDate': _('Last modified'),
        'EffectiveDate': _('Published'),
        'CreationDate': _('Created'),
        'review_state': _('Review state'),
        'Subject': _('Tags'),
        'Type': _('Type'),
        'is_folderish': _('Folder'),
        'exclude_from_nav': _('Excluded from nav'),
        'getObjSize': _('Object Size'),
        'last_comment_date': _('Last comment date'),
        'total_comments': _('Total comments')
      },
      rearrange: {
        properties: {
          'id': _('ID'),
          'sortable_title': _('Title'),
          'modified': _('Last Modified'),
          'created': _('Created on'),
          'effective': _('Publication Date'),
          'Type': _('Type')
        },
        url: '/rearrange'
      },
      basePath: '/',
      moveUrl: null,
      /*
       * all these base buttons are required
       */
      buttonGroups: {
        primary: [{
          title: _('Cut'),
          url: '/cut'
        },{
          title: _('Copy'),
          url: '/copy'
        },{
          title: _('Paste'),
          url: '/paste'
        },{
          title: _('Delete'),
          url: '/delete',
          context: 'danger',
          icon: 'trash'
        }],
        secondary: [{
          title: _('Workflow'),
          url: '/workflow'
        },{
          title: _('Tags'),
          url: '/tags'
        },{
          title: _('Properties'),
          url: '/properties'
        },{
          title: _('Rename'),
          url: '/rename'
        }]
      },
      upload: {
        uploadMultiple: true,
        showTitle: true
      }
    },
    init: function() {
      var self = this;
      self.browsing = true; // so all queries will be correct with QueryHelper
      self.options.collectionUrl = self.options.vocabularyUrl;
      self.options.queryHelper = new utils.QueryHelper(
        $.extend(true, {}, self.options, {pattern: self}));

      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


