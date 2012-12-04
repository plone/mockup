(function(undefined) {

var toolbar_path = 'plone.app.toolbar/plone/app/toolbar/resources/',
    tiles_path = 'plone.app.tiles/plone/app/tiles/resources/',
    deco_path = 'plone.app.deco/plone/app/deco/resources/';

requirejs.config({
  paths: {
    'jquery': toolbar_path + 'lib/jquery-1.8.2.min',
    'jquery-form': toolbar_path + 'lib/jquery.form',
    'jquery-event-drag': deco_path + 'lib/jquery.event.drag-2.1.0',
    'jquery-event-drop': deco_path + 'lib/jquery.event.drop-2.1.0',
    'jquery-iframe': toolbar_path + 'src/jquery.iframe',
    'jquery-mask': toolbar_path + 'src/jquery.mask',
    'bootstrap-dropdown': toolbar_path + 'lib/bootstrap/js/bootstrap-dropdown',
    'bootstrap-modal': toolbar_path + 'lib/bootstrap/js/bootstrap-modal',
    'bootstrap-tabs': toolbar_path + 'lib/bootstrap/js/bootstrap-tab',
    'deco': deco_path + 'src/deco',
    'plone-init': toolbar_path + 'src/plone.init',
    'plone-toolbar': toolbar_path + 'src/plone.toolbar',
    'plone-overlay': toolbar_path + 'src/plone.overlay',
    'plone-cmsui': toolbar_path + 'src/plone.cmsui',
    'plone-tabs': toolbar_path + 'src/plone.tabs',
    'plone-tile': tiles_path + 'src/plone.tile',
    'plone-tiletype': tiles_path + 'src/plone.tiletype',
    'plone-deco': deco_path + 'src/plone.deco'
  },
  shim: {
    'jquery-iframe': {
      deps: [ 'jquery' ]
    },
    'jquery-mask': {
      deps: [ 'jquery' ]
    },
    'jquery-event-drag': {
      deps: [ 'jquery' ]
    },
    'jquery-event-drop': {
      deps: [ 'jquery' ]
    },
    'bootstrap-dropdown': {
      deps: [ 'jquery' ]
    },
    'bootstrap-tabs': {
      deps: [ 'jquery' ]
    },
    'plone-init': {
      deps: [ 'jquery' ]
    },
    'plone-tabs': {
      deps: [ 'jquery', 'bootstrap-tabs' ]
    },
    'plone-toolbar': {
      deps: [ 'jquery', 'jquery-iframe', 'bootstrap-dropdown' ]
    },
    'plone-overlay': {
      deps: [ 'jquery', 'jquery-form', 'jquery-iframe', 'jquery-mask',
              'bootstrap-modal' ]
    },
    'plone-cmsui': {
      deps: [ 'jquery', 'plone-overlay', 'plone-tabs' ]
    },
    'deco': {
      deps: [ 'jquery', 'jquery-event-drag', 'jquery-event-drop',
              'plone-tiletype' ]
    },
    'plone-deco': {
      deps: [ 'jquery', 'jquery-form', 'jquery-mask', 'deco' ]
    }
  }
});

require([
    'plone-init',     // to be replaced by patternslib i guess
    'plone-toolbar',  // this is basically only dropdown for toolbar
    'plone-cmsui',    // overlays for toolbar actions
    'plone-deco'      // deco
   ]);

}());
