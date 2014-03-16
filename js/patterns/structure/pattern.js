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
 *    # Site Structure Example
 *
 *    {{ example-1 }}
 *
 *    # Users and Groups Example
 *
 *    {{ example-2 }}
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
 * Example: example-2
 *    <div class="pat-structure"
 *         data-pat-structure="{&quot;vocabularyUrl&quot;: &quot;/users-test.json&quot;,
 *                             &quot;tagsVocabularyUrl&quot;: &quot;/select2-test.json&quot;,
 *                             &quot;usersVocabularyUrl&quot;: &quot;/tests/json/users.json&quot;,
 *                             &quot;contextInfoUrl&quot;: &quot;/users-context-info&quot;,
 *                             &quot;rearrange&quot;: null,
 *                             &quot;buttonGroups&quot;: {
 *                               &quot;primary&quot;: [
 *                                 {&quot;title&quot;: &quot;Delete&quot;,
 *                                  &quot;url&quot;: &quot;/delete&quot;,
 *                                  &quot;context&quot;: &quot;danger&quot;,
 *                                  &quot;icon&quot;: &quot;trash&quot;},
 *                                 {&quot;title&quot;: &quot;Reset Password&quot;,
 *                                  &quot;url&quot;: &quot;/reset-password&quot;},
 *                                 {&quot;title&quot;: &quot;Deactivate&quot;,
 *                                  &quot;url&quot;: &quot;/deactivate&quot;},
 *                                 {&quot;title&quot;: &quot;Activate&quot;,
 *                                  &quot;context&quot;: &quot;default&quot;,
 *                                  &quot;url&quot;: &quot;/activate&quot;,
 *                                  &quot;icon&quot;: &quot;&quot;}
 *                               ],
 *                               &quot;secondary&quot;: [
 *                                 {&quot;title&quot;: &quot;Add To Group&quot;,
 *                                  &quot;url&quot;: &quot;/add-to-group&quot;},
 *                                 {&quot;title&quot;: &quot;Add Roles&quot;,
 *                                  &quot;url&quot;: &quot;/add-roles&quot;}
 *                               ]},
 *                             &quot;activeColumns&quot;: [
 *                                 &quot;fullName&quot;,
 *                                 &quot;email&quot;,
 *                                 &quot;dateJoined&quot;,
 *                                 &quot;userRoles&quot;
 *                             ],
 *                             &quot;availableColumns&quot;: {
 *                                 &quot;fullName&quot;: &quot;Full Name&quot;,
 *                                 &quot;email&quot;: &quot;Email&quot;,
 *                                 &quot;dateJoined&quot;: &quot;Date Joined&quot;,
 *                                 &quot;dateLastActivity&quot;: &quot;Date of Last Activity&quot;,
 *                                 &quot;dateLastLogin&quot;: &quot;Date of Last Login&quot;,
 *                                 &quot;userRoles&quot;: &quot;Roles&quot;,
 *                                 &quot;hasConfirmed&quot;: &quot;Confirmed&quot;,
 *                                 &quot;profileComplete&quot;: &quot;Profile Complete&quot;
 *                             },
 *                             &quot;iconMapping&quot;: {
 *                                 &quot;User&quot;: &quot;user&quot;
 *                                }
 *                             }">
 *    </div>
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
  'js/patterns/structure/views/app',
  'text!js/patterns/structure/templates/paging.xml',
  'text!js/patterns/structure/templates/selection_button.xml',
  'text!js/patterns/structure/templates/selection_item.xml',
  'text!js/patterns/structure/templates/tablerow.xml',
  'text!js/patterns/structure/templates/table.xml',
  'text!js/ui/templates/popover.xml'
], function($, Base, utils, AppView) {
  'use strict';

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
      attributes: [
        'UID', 'Title', 'Type', 'path', 'review_state',
        'ModificationDate', 'EffectiveDate', 'CreationDate',
        'is_folderish', 'Subject', 'getURL', 'id', 'exclude_from_nav',
        'getObjSize', 'last_comment_date', 'total_comments'
      ],
      activeColumns: [
        'Title',
        'ModificationDate',
        'EffectiveDate',
        'review_state'
      ],
      availableColumns: {
        'Title': 'Title',
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
      iconMapping: {
        'File': 'file',
        'Image': 'picture',
      },
      rearrange: {
        properties: {
          'id': 'ID',
          'sortable_title': 'Title',
          'modified': 'Last Modified',
          'created': 'Created on',
          'effective': 'Publication Date',
          'Type': 'Type'
        },
        url: '/rearrange'
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
      self.options.queryHelper = new utils.QueryHelper(
        $.extend(true, {}, self.options, {pattern: self}));

      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


