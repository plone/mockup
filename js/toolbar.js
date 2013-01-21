if (jQuery) {
  define( "jquery", [], function () { return jQuery; } );
}
require([
  'js/widgets',
  'js/plone.toolbar',
  'js/plone.cmsui'
]);
