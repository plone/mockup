/* Querystring pattern.
*
* Options:
*   criteria(object): options to pass into criteria ({})
*   indexOptionsUrl(string): URL to grab index option data from. Must contain "sortable_indexes" and "indexes" data in JSON object. (null)
*   previewURL(string): URL used to pass in a plone.app.querystring-formatted HTTP querystring and get an HTML list of results ('portal_factory/@@querybuilder_html_results')
*   previewCountURL(string): URL used to pass in a plone.app.querystring-formatted HTTP querystring and get an HTML string of the total number of records found with the query ('portal_factory/@@querybuildernumberofresults')
*   sorttxt(string): Text to use to label the sort dropdown ('Sort On')
*   reversetxt(string): Text to use to label the sort order checkbox ('Reversed Order')
*   previewTitle(string): Title for the preview area ('Preview')
*   previewDescription(string): Description for the preview area ('Preview of at most 10 items')
*   classWrapperName(string): CSS class to apply to the wrapper element ('querystring-wrapper')
*   classSortLabelName(string): CSS class to apply to the sort on label ('querystring-sort-label')
*   classSortReverseName(string): CSS class to apply to the sort order label and checkbox container ('querystring-sortreverse')
*   classSortReverseLabelName(string): CSS class to apply to the sort order label ('querystring-sortreverse-label')
*   classPreviewCountWrapperName(string): TODO ('querystring-previewcount-wrapper')
*   classPreviewResultsWrapperName(string): CSS class to apply to the results wrapper ('querystring-previewresults-wrapper')
*   classPreviewWrapperName(string): CSS class to apply to the preview wrapper ('querystring-preview-wrapper')
*   classPreviewName(string): CSS class to apply to the preview pane ('querystring-preview')
*   classPreviewTitleName(string): CSS class to apply to the preview title ('querystring-preview-title')
*   classPreviewDescriptionName(string): CSS class to apply to the preview description ('querystring-preview-description')
*   classSortWrapperName(string): CSS class to apply to the sort order and sort on wrapper ('querystring-sort-wrapper')
*   showPreviews(boolean): Should previews be shown? (true)
*
* Documentation:
*   # Default
*
*   {{ example-1 }}
*
*   # Without Previews
*
*   {{ example-2 }}
*
* Example: example-1
*   <input class="pat-querystring"
*          data-pat-querystring="indexOptionsUrl: /tests/json/queryStringCriteria.json" />
*
* Example: example-2
*   <input class="pat-querystring"
*          data-pat-querystring="indexOptionsUrl: /tests/json/queryStringCriteria.json;
*                                showPreviews: false;" />
*
* License:
*   Copyright (C) 2010 Plone Foundation
*
*   This program is free software; you can redistribute it and/or modify it
*   under the terms of the GNU General Public License as published by the
*   Free Software Foundation; either version 2 of the License.
*
*   This program is distributed in the hope that it will be useful, but
*   WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
*   Public License for more details.
*
*   You should have received a copy of the GNU General Public License along
*   with this program; if not, write to the Free Software Foundation, Inc.,
*   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/


define([
  'jquery',
  'mockup-patterns-base',
  'react',
  'js/patterns/querystring/view'
], function($, Base, React, QuerystringView) {
  "use strict";

  var Querystring = Base.extend({

    name: 'querystring',

    defaults: {
      criteria: [],
      i18n: {
        criteria: 'Filter by',
        sort: 'Sort on',
        reverse: 'Reversed Order',
        preview: 'Preview',
        previewQuick: 'Preview of at most 10 items'
      }
    },

    init: function() {
      var self = this;

      // hide input element
      self.$el.hide();

      // create wrapper for out criteria
      self.$wrapper = $('<div/>');
      self.$el.after(self.$wrapper);

      // react query string view
      self.view = QuerystringView(self.options);
      React.renderComponent(self.view, self.$wrapper[0]);
    }

  });

  return Querystring;
});
