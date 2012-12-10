requirejs.config({
  paths: {
    'jquery': 'plone.app.toolbar/plone/app/toolbar/resources/lib/jquery-1.8.2.min',
    'jquery-form': 'plone.app.toolbar/plone/app/toolbar/resources/lib/jquery.form',
    'jquery-event-drag': 'plone.app.deco/plone/app/deco/resources/lib/jquery.event.drag-2.1.0',
    'jquery-event-drop': 'plone.app.deco/plone/app/deco/resources/lib/jquery.event.drop-2.1.0',
    'jquery-iframe': 'plone.app.toolbar/plone/app/toolbar/resources/src/jquery.iframe',
    'jquery-mask': 'plone.app.toolbar/plone/app/toolbar/resources/src/jquery.mask',
    'bootstrap-dropdown': 'plone.app.toolbar/plone/app/toolbar/resources/lib/bootstrap/js/bootstrap-dropdown',
    'bootstrap-modal': 'plone.app.toolbar/plone/app/toolbar/resources/lib/bootstrap/js/bootstrap-modal',
    'bootstrap-tabs': 'plone.app.toolbar/plone/app/toolbar/resources/lib/bootstrap/js/bootstrap-tab',
    'deco': 'plone.app.deco/plone/app/deco/resources/src/deco',
    'plone-init': 'plone.app.toolbar/plone/app/toolbar/resources/src/plone.init',
    'plone-overlay': 'plone.app.toolbar/plone/app/toolbar/resources/src/plone.overlay',
    'plone-cmsui': 'plone.app.toolbar/plone/app/toolbar/resources/src/plone.cmsui',
    'plone-tabs': 'plone.app.toolbar/plone/app/toolbar/resources/src/plone.tabs',
    'plone-tile': 'plone.app.tiles/plone/app/tiles/resources/src/plone.tile',
    'plone-tiletype': 'plone.app.tiles/plone/app/tiles/resources/src/plone.tiletype',
    'plone-deco': 'plone.app.deco/plone/app/deco/resources/src/plone.deco',

    'patterns': 'patterns',
    'pattern-classtoggle': 'pattern.classtoggle',

    'plone-toolbar': 'plone.toolbar'
  },
  shim: {
    'jquery-iframe': {
      deps: [ 'jquery' ],
      exports: '$.iframe'
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
  'patterns',
  'plone-toolbar'
], function(patterns) {
  $(document).ready(function() {
    patterns.scan(document);
  });
  console.log('Backend loaded!');
});
