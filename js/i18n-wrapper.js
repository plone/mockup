/* i18n integration.
 *
 * This is a singleton.
 * Configuration is done on the body tag data-i18ncatalogurl attribute
 *     <body data-i18ncatalogurl="/plonejsi18n">
 *
 *  Or, it'll default to "/plonejsi18n"
 */

define([
  'mockup-i18n'
], function(i18n) {
  'use strict';
  i18n.loadCatalog('widgets');
  return i18n.MessageFactory('widgets');
});
