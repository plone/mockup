requirejs.config({
  paths: {
    'iframe': 'plone.app.toolbar/plone/app/toolbar/resources/src/iframe'
  }
});

require([
    'iframe'
   ], function($, iframe) {

   console.log('WORKS!');

});
