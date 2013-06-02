// plone integration for textext.
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.widgets/textext.js
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true, evil:true */
/*global define:false */


define([
  'jquery',
  'js/patterns/base',
  'js/patterns/select2'
], function($, Base, Select2) {
  "use strict";

  var RelatedItems = Select2.extend({
    name: "relateditems",
    defaults: {
      multiple: true,
      tokenSeparators: [",", " "]
    },
    init: function() {
      var self = this;
      self.initializeValueMap();
      self.initializeTags();
      self.initializeOrdering();

      self.options.tags = []; // for now...
      self.$el.select2(self.options);
      self.$el.parent().off('close.modal.patterns');
    }
  });

  return RelatedItems;

});

