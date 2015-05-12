/* Moment pattern.
 *
 * Options:
 *    selector(string): selector to use to look for dates to format (null)
 *    format(string): Format to use to render date. Also available is "relative" and "calendar" formats. (MMMM Do YYYY, h:mm:ss a)
 *
 * Documentation:
 *
 *    # Simple
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <div class="pat-portletmanager"></div>
 *
 */


define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  'use strict';

  var PortletManagerPattern = Base.extend({
    name: 'portletmanager',
    trigger: '.pat-portletmanager',
    defaults: {
      managers: [

      ]
    },
    init: function() {
      var self = this;
    }
  });

  return PortletManagerPattern;

});
