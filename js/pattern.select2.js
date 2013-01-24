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
  'jam/Patterns/src/core/logger',
  'jam/Patterns/src/core/parser',
  'jam/Patterns/src/patterns/base.js',
  'jam/select2/select2.js'
], function($, logger, Parser, Base) {
  "use strict";

  var log = logger.getLogger("pat.select2"),
      parser = new Parser("select2");

  parser.add_argument("width");
  parser.add_argument("minimumInputLength");
  parser.add_argument("maximumInputLength");
  parser.add_argument("minimumResultsForSearch");
  parser.add_argument("maximumSelectionSize");
  parser.add_argument("placeholder");
  parser.add_argument("separator");
  parser.add_argument("allowClear");
  parser.add_argument("multiple");
  parser.add_argument("closeOnSelect");
  parser.add_argument("openOnEnter");
  parser.add_argument("tokenSeparators");
  parser.add_argument("ajax");
  parser.add_argument("data");
  parser.add_argument("tags");
  parser.add_argument("containerCss");
  parser.add_argument("containerCssClass");
  parser.add_argument("dropdownCss");
  parser.add_argument("dropdownCssClass");

  var Select2 = Base.extend({
    name: "select2",
    parser: parser,
    init: function($el, options) {
      this.$el = $el;
      this.options = options;
      $el.select2(options);
    }
  });

  return Select2;

});
