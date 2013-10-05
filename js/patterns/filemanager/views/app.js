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
  'underscore',
  'backbone',
  'js/ui/views/base',
  'mockup-patterns-dropzone',
  'text!js/patterns/filemanager/templates/app.tmpl'
], function($, _, Backbone, BaseView, DropZone, AppTemplate) {
  "use strict";

  var AppView = BaseView.extend({
    tagName: 'div',
    className: 'filemanager',
    template: AppTemplate,
    afterRender: function(){

    }
  });

  return AppView;
});
