define([
  'jquery',
  'mockup-registry',
  'mockup-patterns-base',

  'mockup-patterns-select2',
  'mockup-patterns-pickadate',
  'mockup-patterns-relateditems',
  'mockup-patterns-querystring',
  'mockup-patterns-tinymce',

  'mockup-patterns-accessibility',
  'mockup-patterns-autotoc',
  'mockup-patterns-formunloadalert',
  'mockup-patterns-preventdoublesubmit',
  'mockup-patterns-formautofocus',
  'mockup-patterns-modal',
  'mockup-patterns-sticky-kit',
  'mockup-patterns-structure',
  'mockup-patterns-textareamimetypeselector',
  'bootstrap-dropdown',
  'bootstrap-collapse',
  'bootstrap-tooltip'
], function($, Registry, Base) {
  'use strict';

  // BBB: we need to hook pattern to classes which plone was using until now
  var Plone = Base.extend({
    name: 'plone',
    init: function() {
      var self = this;

    }

  });

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      $('body').addClass('pat-plone');
      Registry.scan($('body'));
    });
  }

  return Plone;
});
