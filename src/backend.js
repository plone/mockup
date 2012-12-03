(function(undefined) {

var toolbar_path = '../lib/plone.app.toolbar/plone/app/toolbar/resources/';

requirejs.config({
  paths: {
    'jquery': toolbar_path + 'lib/jquery-1.8.2.min',
    'jquery-form': toolbar_path + 'lib/jquery.form',
    'jquery-iframe': toolbar_path + 'src/jquery.iframe',
    'jquery-mask': toolbar_path + 'src/jquery.mask',
    'bootstrap-dropdown': toolbar_path + 'lib/bootstrap/js/bootstrap-dropdown',
    'bootstrap-modal': toolbar_path + 'lib/bootstrap/js/bootstrap-modal',
    'plone-init': toolbar_path + 'src/plone.init',
    'plone-toolbar': toolbar_path + 'src/plone.toolbar',
    'plone-overlay': toolbar_path + 'src/plone.overlay',
    'plone-cmsui': toolbar_path + 'src/plone.cmsui'
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
      deps: [ 'jquery', 'jquery-iframe', 'bootstrap-dropdown' ]
    },
    'plone-overlay': {
      deps: [ 'jquery', 'jquery-form', 'jquery-iframe', 'jquery-mask',
              'bootstrap-modal' ]
    },
    'plone-cmsui': {
      deps: [ 'jquery', 'plone-overlay' ]
    }
  }
});

require([
    'plone-init',     // to be replaced by patternslib i guess
    'plone-toolbar',  // this is basically only dropdown for toolbar
    'plone-cmsui'     // overlays for toolbar actions
   ]);

}());
