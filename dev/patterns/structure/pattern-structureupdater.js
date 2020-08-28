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

    init: function() {

      $('body').on('context-info-loaded', function (e, data) {
        if (this.options.titleSelector) {
            $(this.options.titleSelector, this.$el).html(data.object && data.object.Title || '&nbsp;');
        }
        if (this.options.descriptionSelector) {
            $(this.options.descriptionSelector, this.$el).html(data.object && data.object.Description || '&nbsp;');
        }
      }.bind(this));

    }

  });

  return StructureUpdater;

});
