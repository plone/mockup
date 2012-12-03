(function(undefined) {

var toolbar_path = '../lib/plone.app.toolbar/plone/app/toolbar/resources/';

requirejs.config({
  paths: {
    'jquery': toolbar_path + 'lib/jquery-1.8.2.min',
    'jquery-iframe': toolbar_path + 'src/jquery.iframe',
    'jquery-mask': toolbar_path + 'src/jquery.mask',
    'bootstrap-download': toolbar_path + 'lib/bootstrap/js/bootstrap-dropdown',
    'plone-init': toolbar_path + 'src/plone.init',
    'plone-toolbar': toolbar_path + 'src/plone.toolbar'
  },
  shim: {
    'jquery-iframe': {
      deps: [ 'jquery' ]
    },
    'jquery-mask': {
      deps: [ 'jquery' ]
    },
    'bootstrap-download': {
      deps: [ 'jquery' ]
    },
    'plone-init': {
      deps: [ 'jquery' ]
    },
    'plone-toolbar': {
      deps: [ 'jquery', 'jquery-iframe', 'bootstrap-download' ]
    }
  }
});

require([
    'jquery-iframe',
    'plone-init',
    'plone-toolbar'
   ], function($, iframe) {

   console.log('WORKS!');

});

}());
