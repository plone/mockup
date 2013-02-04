require([
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/bundles/toolbar'
], function($, sinon, registry) {

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 4000;

  $('script[type="text/x-ajax-respond"]', window.parent.document).each(function() {
    var $el = $(this);
    server.respondWith($el.data('url'), function (xhr, id) {
      xhr.respond(200, { "Content-Type": "html/html" }, $el.html());
    });
  });

  // Initialize patterns
  $(document).ready(function() {
    registry.scan($('body'));
  });

});
