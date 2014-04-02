/* Search pattern.
 *
 * Options:
 *    name(type): Description (defaultvalue)
 *
 * Documentation:
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-search"></div>
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
  'react',
  'js/patterns/search/view'
], function($, Base, React, SearchView) {
  "use strict";

  var Search = Base.extend({
    name: 'search',
    defaults: {
      isLive: false,
      labelSearch: 'Search'
    },

    init: function() {
      var self = this;

      React.initializeTouchEvents(true);

      self.view = SearchView({
        isLive: this.options.isLive,
        ajaxSearch: this.getAjaxSearch(),
        labelSearch: this.options.labelSearch
      });

      React.renderComponent(self.view, self.$el[0]);
    },

    getAjaxSearch: function() {
      var self = this;
      return function(query) {
        self.view.setState({
          results: [
            {title: 'item-one', url: 'item-one', html: '<p>This is item one</p>'},
            {title: 'item-two', url: 'item-two', html: '<p>This is item two</p>'},
            {title: 'item-three', url: 'item-three', html: '<p>This is item three</p>'}
          ]
        });
      };
    }

  });

  return Search;
});