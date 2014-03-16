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
 *         data-pat-structure="{&quot;vocabularyUrl&quot;: &quot;/relateditems-test.json&quot;,
 *                              &quot;uploadUrl&quot;: &quot;/upload&quot;,
 *                              &quot;moveUrl&quot;: &quot;/moveitem&quot;,
 *                              &quot;tagsVocabularyUrl&quot;: &quot;/select2-test.json&quot;,
 *                              &quot;usersVocabularyUrl&quot;: &quot;/tests/json/users.json&quot;,
 *                              &quot;indexOptionsUrl&quot;: &quot;/tests/json/queryStringCriteria.json&quot;,
 *                              &quot;contextInfoUrl&quot;: &quot;{path}/context-info&quot;,
 *                              &quot;availableColumns&quot;: {
 *                                &quot;Title&quot;: &quot;Title&quot;,
 *                                &quot;ModificationDate&quot;: &quot;Last modified&quot;,
 *                                &quot;EffectiveDate&quot;: &quot;Published&quot;,
 *                                &quot;CreationDate&quot;: &quot;Created&quot;,
 *                                &quot;review_state&quot;: &quot;Review state&quot;,
 *                                &quot;Subject&quot;: &quot;Tags&quot;,
 *                                &quot;Type&quot;: &quot;Type&quot;,
 *                                &quot;is_folderish&quot;: &quot;Folder&quot;,
 *                                &quot;exclude_from_nav&quot;: &quot;Excluded from nav&quot;,
 *                                &quot;getObjSize&quot;: &quot;Object Size&quot;,
 *                                &quot;last_comment_date&quot;: &quot;Last comment date&quot;,
 *                                &quot;total_comments&quot;: &quot;Total comments&quot;
 *                              },
 *                              &quot;rearrange&quot;: {
 *                               &quot;properties&quot;: {
 *                                 &quot;id&quot;: &quot;ID&quot;,
 *                                 &quot;sortable_title&quot;: &quot;Title&quot;,
 *                                 &quot;modified&quot;: &quot;Last Modified&quot;,
 *                                 &quot;created&quot;: &quot;Created on&quot;,
 *                                 &quot;effective&quot;: &quot;Publication Date&quot;,
 *                                 &quot;Type&quot;: &quot;Type&quot;
 *                               },
 *                               &quot;url&quot;: &quot;/rearrange&quot;
 *                             }
 *                            }"></div>
 *
 * Example: example-2
 *    <div class="pat-structure"
 *         data-pat-structure="{&quot;vocabularyUrl&quot;: &quot;/users-test.json&quot;,
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
 *                               ],
 *                             &quot;availableColumns&quot;: {
 *                                 &quot;fullName&quot;: &quot;Full Name&quot;,
 *                                 &quot;email&quot;: &quot;Email&quot;,
 *                                 &quot;dateJoined&quot;: &quot;Date Joined&quot;,
 *                                 &quot;dateLastActivity&quot;: &quot;Date of Last Activity&quot;,
 *                                 &quot;dateLastLogin&quot;: &quot;Date of Last Login&quot;,
 *                                 &quot;userRoles&quot;: &quot;Roles&quot;,
 *                                 &quot;hasConfirmed&quot;: &quot;Confirmed&quot;,
 *                                 &quot;profileComplete&quot;: &quot;Profile Complete&quot;
 *                               },
 *                             &quot;cookieSettingPrefix&quot;: &quot;_u_&quot;
 *                             }"></div>
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
  'js/patterns/structure/views/tags',
  'js/patterns/structure/views/properties',
  'js/patterns/structure/views/workflow',
  'js/patterns/structure/views/delete',
  'js/patterns/structure/views/rename',
  'text!js/patterns/structure/templates/paging.xml',
  'text!js/patterns/structure/templates/selection_button.xml',
  'text!js/patterns/structure/templates/selection_item.xml',
  'text!js/patterns/structure/templates/tablerow.xml',
  'text!js/patterns/structure/templates/table.xml',
  'text!js/ui/templates/popover.xml'
], function($, Base, utils, AppView, TagsView, PropertiesView, WorkflowView,
            DeleteView, RenameView) {
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
        'getObjSize', 'last_comment_date', 'total_comments'],
      activeColumns: [
        'Title',
        'ModificationDate',
        'EffectiveDate',
        'review_state'
      ],
      availableColumns: {}, // Object mapping field name to column label
      iconMapping: { // Object mapping type name to icon name
        'File': 'file',
        'Image': 'picture',
        'User': 'user',
        'Group': 'group'
      },
      buttonViewMapping: {  // deprecated - should now be specified in buttonGroups
        'tags': TagsView,
        'properties': PropertiesView,
        'workflow': WorkflowView,
        'delete': DeleteView,
        'rename': RenameView
      },
      basePath: '/',
      uploadUrl: null,
      moveUrl: null,
      /*
       * all these base buttons are required
       */
      buttonGroups: [
        [{
          title: 'Cut',
          url: '/cut'
        },{
          title: 'Copy',
          url: '/copy'
        },{
          title: 'Paste',
          url: '/paste',
          isEnabled: function(view, selected) {
            return view.pasteAllowed;
          }
        },{
          title: 'Delete',
          url: '/delete',
          context: 'danger',
          icon: 'trash',
          view: DeleteView
        }],
        [{
          title: 'Workflow',
          url: '/workflow',
          view: WorkflowView
        },{
          title: 'Tags',
          url: '/tags',
          view: TagsView
        },{
          title: 'Properties',
          url: '/properties',
          view: PropertiesView
        },{
          title: 'Rename',
          url: '/rename',
          view: RenameView
        }]
      ],
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


