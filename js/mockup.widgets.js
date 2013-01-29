require([
  'jquery',
  'sinon',
  'js/widgets',
  'jam/SyntaxHighlighter/scripts/XRegExp.js',
  'jam/SyntaxHighlighter/scripts/shCore.js',
  'jam/SyntaxHighlighter/scripts/shBrushXml.js'
], function($, sinon) {

  // before demo patterns in overlay remove html created by autotoc pattern
  $('#modal1').on('show.modal.patterns', function(e, modal) {
    $('.autotoc-nav', modal.$modal).remove();
  });

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 4000;
  server.respondWith(/something.html/, function (xhr, id) {
    xhr.respond(200, { "Content-Type": "html/html" }, $('#something-html').html());
  });

  SyntaxHighlighter.all();

});
