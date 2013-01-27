require([
  'jquery',
  'sinon',
  'js/toolbar'
], function($, sinon) {

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 4000;

  $('script[type="text/x-ajax-respond"]', window.parent.document).each(function() {
    $el = $(this);
    server.respondWith(new RegExp($el.data('regexp')), function (xhr, id) {
      xhr.respond(200, { "Content-Type": "html/html" }, $el.html());
    });
  });

});
