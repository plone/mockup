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
 */


define([
  'jquery',
  'mockup-patterns-base',
  'mockup-utils',
  'mockup-patterns-structure-url/js/views/app',
  'translate',
  'text!mockup-patterns-structure-url/templates/paging.xml',
  'text!mockup-patterns-structure-url/templates/selection_item.xml',
  'text!mockup-patterns-structure-url/templates/tablerow.xml',
  'text!mockup-patterns-structure-url/templates/table.xml',
  'text!mockup-ui-url/templates/popover.xml',
], function($, Base, utils, AppView, _t) {
  'use strict';

  var Structure = Base.extend({
    name: 'structure',
    trigger: '.pat-structure',
    defaults: {
      // for implementing history changes
      // Example: {base: 'http://mysite.com', appended: '/folder_contents'}
      urlStructure: null,
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
        'id': _t('ID'),
        'Title': _t('Title'),
        'ModificationDate': _t('Last modified'),
        'EffectiveDate': _t('Published'),
        'ExpirationDate': _t('Expiration'),
        'CreationDate': _t('Created'),
        'review_state': _t('Review state'),
        'Subject': _t('Tags'),
        'Type': _t('Type'),
        'is_folderish': _t('Folder'),
        'exclude_from_nav': _t('Excluded from nav'),
        'getObjSize': _t('Object Size'),
        'last_comment_date': _t('Last comment date'),
        'total_comments': _t('Total comments')
      },
      rearrange: {
        properties: {
          'id': _t('ID'),
          'sortable_title': _t('Title'),
          'modified': _t('Last Modified'),
          'created': _t('Created on'),
          'effective': _t('Publication Date'),
          'Type': _t('Type')
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
          title: _t('Cut'),
          url: '/cut'
        },{
          title: _t('Copy'),
          url: '/copy'
        },{
          title: _t('Paste'),
          url: '/paste'
        },{
          title: _t('Delete'),
          url: '/delete',
          context: 'danger',
          icon: 'trash'
        }],
        secondary: [{
          title: _t('Workflow'),
          url: '/workflow'
        },{
          title: _t('Tags'),
          url: '/tags'
        },{
          title: _t('Properties'),
          url: '/properties'
        },{
          title: _t('Rename'),
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

      // check and see if a hash is provided for initial path
      if(window.location.hash.substring(0, 2) === '#/'){
        self.options.queryHelper.currentPath = window.location.hash.substring(1);
      }
      delete self.options.attributes; // not compatible with backbone

      self.view = new AppView(self.options);
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


