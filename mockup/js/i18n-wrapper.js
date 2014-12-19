/* i18n integration.
 *
 * This is a singleton.
 * Configuration is done on the body tag data-i18ncatalogurl attribute
 *     <body data-i18ncatalogurl="/jsi18n">
 *
 *  Or, it'll default to "/jsi18n"
 */

define([
  'mockup-i18n'
], function(i18n) {
  'use strict';
  i18n.loadCatalog('widgets');
  return i18n.MessageFactory('widgets');
});
