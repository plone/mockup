// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
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
  'mockup-patterns-base',
  'mockup-patterns-queryhelper',
  'structure/views/AppView',

  'text!structure/templates/paging.html' // for some reason we need to load this early
], function($, Base, QueryHelper, AppView) {
  "use strict";

  var Structure = Base.extend({
    name: 'structure',
    defaults: {
      ajaxvocabulary: null,
      attributes: ['UID', 'Title', 'Type', 'path', 'review_state',
                   'ModificationDate', 'EffectiveDate', 'CreationDate',
                   'is_folderish'],
      basePath: '/'
    },
    init: function() {
      var self = this;
      self.browsing = true; // so all queries will be correct with QueryHelper

      self.view = new AppView({
        collection_url: self.options.ajaxvocabulary,
        queryHelper: new QueryHelper(self.$el,
          $.extend(true, {}, self.options, {basePattern: self}))
      });
      self.$el.append(self.view.render().$el);
    }
  });

  return Structure;

});


