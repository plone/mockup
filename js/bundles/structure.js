// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
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


if (window.jQuery) {
  define( "jquery", [], function () {
    "use strict";
    return window.jQuery;
  } );
}

define([
  'jquery',
  'mockup-registry',
  'mockup-patterns-base',
  'mockup-patterns-modal',
  'mockup-patterns-structure'
], function($, registry, Base, Modal, Structure) {
  "use strict";

  $(document).ready(function(){
    var $structure = $('.pat-structure');
    if($structure.length === 1){
      var $container = $structure.parents('#content');
      if($container.length === 0){
        // uh oh, no content id, let's go up a few levels and use that as parent
        $container = $structure.parent().parent();
      }
      var $modal = $container.patternModal({
        position: 'middle top',
        width: '95%',
        title: 'Folder Contents',
        backdropOptions: {
          closeOnEsc: false,
          closeOnClick: false
        }
      });
      var modal = $modal.data('pattern-modal');
      modal.show();
      modal.$modal.find('a.close').on('destroy.modal.patterns', function(){
        var $base = $('base');
        var url;
        if($base.length === 0){
          url = window.location.href.replace('@@folder_contents', '').replace('folder_contents', '');
        }else{
          url = $base.attr('href');
        }
        window.location = url;
      });
    }
  });

  return {};
});
