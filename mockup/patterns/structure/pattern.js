/* Structure pattern.
 *
 * Options:
 *    vocabularyUrl(string): Url to return query results (null)
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
 *                             indexOptionsUrl:/tests/json/queryStringCriteria.json;
 *                             contextInfoUrl:{path}/context-info;"></div>
 * 
 */


define([
  'jquery',
  'pat-base',
  'mockup-utils',
  'mockup-patterns-structure-url/js/views/app',
  'text!mockup-patterns-structure-url/templates/paging.xml',
  'text!mockup-patterns-structure-url/templates/selection_item.xml',
  'text!mockup-patterns-structure-url/templates/tablerow.xml',
  'text!mockup-patterns-structure-url/templates/table.xml',
  'text!mockup-ui-url/templates/popover.xml',
], function($, Base, utils, AppView) {
  'use strict';

  var Structure = Base.extend({
    name: 'structure',
    trigger: '.pat-structure',
    parser: 'mockup',
    defaults: {
      // for implementing history changes
      // Example: {base: 'http://mysite.com', appended: '/folder_contents'}
      urlStructure: null,
      vocabularyUrl: null,
      indexOptionsUrl: null, // for querystring widget
      contextInfoUrl: null, // for add new dropdown and other info
      setDefaultPageUrl: null,
      backdropSelector: '.plone-modal', // Element upon which to apply backdrops used for popovers

      activeColumnsCookie: 'activeColumns',

      /*
        As the options operate on a merging basis per new attribute
        (key/value pairs) on the option Object in a recursive fashion,
        array items are also treated as Objects so that custom options
        are replaced starting from index 0 up to the length of the
        array.  In the case of buttons, custom buttons are simply
        replaced starting from the first one.  The following defines the
        customized attributes that should be replaced wholesale, with
        the default version prefixed with `_default_`.
      */

      attributes: null,
      _default_attributes: [
        'UID', 'Title', 'portal_type', 'path', 'review_state',
        'ModificationDate', 'EffectiveDate', 'CreationDate',
        'is_folderish', 'Subject', 'getURL', 'id', 'exclude_from_nav',
        'getObjSize', 'last_comment_date', 'total_comments','getIcon'
      ],

      activeColumns: null,
      _default_activeColumns: [
        'ModificationDate',
        'EffectiveDate',
        'review_state'
      ],

      availableColumns: null,
      _default_availableColumns: {
        'id': 'ID',
        'ModificationDate': 'Last modified',
        'EffectiveDate': 'Published',
        'ExpirationDate': 'Expiration',
        'CreationDate': 'Created',
        'review_state': 'Review state',
        'Subject': 'Tags',
        'portal_type': 'Type',
        'is_folderish': 'Folder',
        'exclude_from_nav': 'Excluded from navigation',
        'getObjSize': 'Object Size',
        'last_comment_date': 'Last comment date',
        'total_comments': 'Total comments'
      },
      momentFormat: 'relative',
      rearrange: {
        properties: {
          'id': 'ID',
          'sortable_title': 'Title'
        },
        url: '/rearrange'
      },
      basePath: '/',
      moveUrl: null,

      buttons: null,
      _default_buttons: [{
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
      },{
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
      }],

      upload: {
        uploadMultiple: true,
        showTitle: true
      }

    },
    init: function() {
      var self = this;

      /*
        This part replaces the undefined (null) values in the user
        modifiable attributes with the default values.

        May want to consider moving the _default_* values out of the
        options object.
      */
      var checkDefaults = [
          'attributes', 'activeColumns', 'availableColumns', 'buttons'];
      _.each(checkDefaults, function(idx) {
        if (self.options[idx] === null) {
          self.options[idx] = self.options['_default_' + idx];
        }
      });

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


