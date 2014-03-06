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
  'use strict';

  var regexEscape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var Router = Backbone.Router.extend({
    actions: [],
    redirects: {},
    addRoute: function(patternName, id, callback, context, pathExp, expReplace) {
      if (_.findWhere(this.patterns, {patternName: patternName, id: id}) === undefined) {
        this.actions.push({patternName: patternName, id: id, callback: callback, context: context, pathExp: pathExp, expReplace: expReplace});
      }
      var regex = new RegExp('(' + regexEscape(patternName) + ':' + regexEscape(id) + ')');
      this.route(regex, 'handleRoute');
    },
    addRedirect: function(pathExp, destination) {
      this.redirects[pathExp] = destination;
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
      var path = window.parent.location.pathname,
          newPath,
          regex,
          hash;

      _.some(this.actions, function(action) {
        if (action.pathExp) {
          regex = new RegExp(action.pathExp);
          if (path.match(regex)) {
            hash = '!/' + action.patternName + ':' + action.id;
            var replaceWith = '';
            if (action.expReplace) {
              replaceWith = action.expReplace;
            }
            newPath = path.replace(regex, replaceWith);
            return true;
          }
        }
      }, this);

      if (hash === undefined) {
        for (var pathExp in this.redirects) {
          regex = new RegExp(pathExp);
          if (path.match(regex)) {
            hash = '!/' + this.redirects[pathExp];
            newPath = path.replace(regex, '');
            break;
          }
        }
      }

      if (hash !== undefined) {
        this._changeLocation.apply(this, [newPath, hash]);
      }
    },
    _changeLocation: function(path, hash) {
      window.parent.location.hash = hash;
      window.parent.location.pathname = path;
    },
    start: function() {
      Backbone.history.start();
    },
    reset: function() {
      this.actions = [];
    }

  });

  return new Router();

});
