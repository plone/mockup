require([
  'require',
  'jquery',
  'sinon'
], function(require, $, sinon) {

  $.ploneCMSUIOptions = {
    ajaxUrlPrefix: ''
  };

  $('body', window.parent.document).attr('data-portal-navigation-url',
      window.location.href.split('/').slice(0, -1).join('/'));

  require([ 'js/toolbar' ], function() {

    // trigger resize on window to resize toolbar
    $(window).trigger('resize');

    $(document).ready(function() {

      //$('#plone-addcontent > ul > li > a').on('click', function(
      //var server = sinon.fakeServer.create();
      //server.autoRespond = true;
      //server.respondWith("file:///home/rok/dev/plone/mockup/index.html#!/front-page/edit", function(xhr) {
      //  xhr.respond(200, { "Content-Type": "text/html" }, '' +
      //    '<html>' +
      //    '<head></head>' +
      //    '<body>' +
      //    '<h1 class="documentFirstHeading">XXX</h1>' +
      //    '<div id="content">' +
      //    '</div>' +
      //    '</body>' +
      //    '</html>');
      //});

    });

  });

});
