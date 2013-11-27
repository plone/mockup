// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
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
  'mockup-registry',
  'mockup-patterns-base',
  'mockup-patterns-select2',
  'mockup-patterns-pickadate',
  'mockup-patterns-relateditems',
  'mockup-patterns-querystring',
  'mockup-patterns-tinymce'
], function($, Registry, Base, Select2, PickADate, RelatedItems, QueryString) {
  "use strict";

  var PloneWidgets = Base.extend({
    name: "plone-widgets",
    init: function() {
      var self = this;
    }
  });

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      $('body').addClass('pat-plone-widgets');
      Registry.scan($('body'));
    });
  }

  return PloneWidgets;
});
