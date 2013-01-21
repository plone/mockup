if (jQuery) {
  define( "jquery", [], function () { return jQuery; } );
}
require([
    'js/pattern.autocomplete',
    'js/pattern.calendar',
    'js/pattern.tabs',
    'js/pattern.toggle',
    'js/plone.tabs'
    ]);
