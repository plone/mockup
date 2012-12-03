(function(undefined) {

var toolbar_path = '../lib/plone.app.toolbar/plone/app/toolbar/resources/';

requirejs.config({
  paths: {
    'jquery': toolbar_path + 'lib/jquery-1.8.2.min',
    'jquery.iframe': toolbar_path + 'src/jquery.iframe'
  },
  shim: {
    'jquery.iframe': {
      deps: [ 'jquery' ]
    }
  }
});

require([
    'jquery.iframe'
   ], function($, iframe) {

   console.log('WORKS!');

});

}());
