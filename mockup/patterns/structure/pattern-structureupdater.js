/* Structure Updater pattern.
 *
 * Options:
 *    titleSelector(string): CSS selector to match title elements for the current context ('').
 *    descriptionSelector(string): CSS selector to match description elements of the current context to be updated ('').
 *
 * Documentation:
 *    The Structure Updater pattern updates the information of the current context after a user navigated to a new folder.
 *
 */

define([
  'jquery',
  'pat-base'
], function($, Base) {
  'use strict';

  var StructureUpdater = Base.extend({
    name: 'structureupdater',
    trigger: '.template-folder_contents',
    parser: 'mockup',
    defaults: {
      titleSelector: '',
      descriptionSelector: ''
    },

    context_info_loaded_handler: function (e, data) {
      if (this.options.titleSelector) {
        $(this.options.titleSelector, this.$el).html(data.object && data.object.Title || '&nbsp;');
      }
      if (this.options.descriptionSelector) {
        $(this.options.descriptionSelector, this.$el).html(data.object && data.object.Description || '&nbsp;');
      }
    },

    init: function() {
      $('body')
        .off('context-info-loaded', this.context_info_loaded_handler.bind(this))
        .on('context-info-loaded', this.context_info_loaded_handler.bind(this));
    }

  });

  return StructureUpdater;

});
