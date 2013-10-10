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
  'mockup-patterns-select2',
  'mockup-patterns-pickadate',
  'mockup-patterns-relateditems',
  'mockup-patterns-tinymce',
  'mockup-patterns-querystring'

], function($, Registry, Base, Select2, PickADate, RelatedItems, TinyMCE,
            QueryString) {
  "use strict";

  // BBB: we need to hook pattern to classes which plone was using until now
  var PloneWidgets = Base.extend({
    name: "plone-widgets",
    init: function() {
      var self = this;

      // add tinymce pattern
      //self.$el.find('.mce_editable').addClass('pat-tinymce').each(function(){
      //  var $tiny = $(this);
      //  var config = $.parseJSON($tiny.attr('data-mce-config'));
      //  config.content_css = config.portal_url + '/base.css';
      //  delete config.customplugins;
      //  delete config.plugins;
      //  delete config.theme;
      //  $tiny.attr({
      //    'data-pat-tinymce': JSON.stringify({
      //      relatedItems: {
      //        ajaxVocabulary: config.portal_url + '/@@getVocabulary?name=plone.app.vocabularies.Catalog'
      //      },
      //      rel_upload_path: '@@fileUpload',
      //      folder_url: config.document_base_url,
      //      tiny: config,
      //      prependToUrl: 'resolveuid/',
      //      linkAttribute: 'UID',
      //      prependToScalePart: '/@@images/image/'
      //    })
      //  });
      //});

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
