// pattern router.
//
// Author: Ryan Foster
// Contact: ryan@rynamic.com
// Version: 1.0
// Depends: jquery.js
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
  'underscore',
  'backbone'
], function($, _, Backbone) {
  "use strict";

  var regexEscape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var Router = Backbone.Router.extend({
    isTest: false,
    actions: [],
    addRoute: function(patternName, id, callback, context, pathExp) {
      if (_.findWhere(this.patterns, {patternName: patternName, id: id}) === undefined) {
        this.actions.push({patternName: patternName, id: id, callback: callback, context: context, pathExp: pathExp});
      }
      var regex = new RegExp('(' + regexEscape(patternName) + ':' + regexEscape(id) + ')');
      this.route(regex, 'handleRoute');
    },
    handleRoute: function(pattern) {
      var parts = pattern.split(':');
      var patternName = parts[0];
      var id = parts[1];
      var action = _.findWhere(this.actions, {patternName: patternName, id: id});
      if (action) {
        action.callback.call(action.context);
      }
    },
    redirect: function() {
      var path = window.parent.location.pathname;
      _.each(this.actions, function(action) {
        if (action.pathExp) {
          var regex = new RegExp(action.pathExp);
          if (path.match(regex)) {
            if (this.isTest === false) {
              window.parent.location.hash = '!/' + action.patternName + ':' + action.id;
              window.parent.location.pathname = path.replace(regex, '');
            } else {
              this.testPath = path.replace(regex, '') + '#!/' + action.patternName + ':' + action.id;
            }
          }
        }
      }, this);
    },
    start: function() {
      this.redirect();
    },
    reset: function() {
      this.testPath = undefined;
      this.actions = [];
    }
    
  });

  return new Router();

});
