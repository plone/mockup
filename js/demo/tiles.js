require([
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/patterns/tiletype',
  'js/patterns/texttile',
  'js/bundles/tiles'
], function($, sinon, registry, TileTypes) {

  // -----------------
  // fake server setup for ajax requests
  //
  var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.autoRespondAfter = 2000;

  function deserialize(text) {
    response = {};
    if (text) {
      $.each(text.split('&'), function(i, item) {
        item = item.split('=');
        response[item[0]] = item[1];
      });
    }
    return response;
  }
  $('script[type="text/x-ajax-respond"]', window.parent.document).each(function() {
    var $el = $(this);
    server.respondWith($el.data('url'), function (xhr) {
      var $body = $('<div/>').append($($el.html()).filter('#portal-columns')),
          request = deserialize(xhr.requestBody);
      xhr.respond(200, { "Content-Type": "html/html" }, '' +
        '<html><body>' + $body.html() + '</body></html>');
    });
    server.respond();
  });


  // -----------------
  // register some default tile types
  //TileTypes.register('text');
  //TileTypes.register('image');


  // -----------------
  // Initialize patterns
  $(document).ready(function() {
    registry.scan($('body'));
  });

});
