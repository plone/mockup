require([
  'jquery',
  'sinon',
  'js/toolbar',

  // widgets styles
  'css!jam/pickadate/themes/pickadate.02.classic.css',
	'css!jam/jquery-textext/src/css/textext.core.css',
	'css!jam/jquery-textext/src/css/textext.plugin.arrow.css',
	'css!jam/jquery-textext/src/css/textext.plugin.autocomplete.css',
	'css!jam/jquery-textext/src/css/textext.plugin.clear.css',
	'css!jam/jquery-textext/src/css/textext.plugin.focus.css',
	'css!jam/jquery-textext/src/css/textext.plugin.prompt.css',
	'css!jam/jquery-textext/src/css/textext.plugin.tags.css',

  // toolbar styles
  'lessc!less/toolbar.less'

], function($, sinon) {

  // trigger resize on window to resize toolbar
  $(window).trigger('resize');
  console.log('WORKS');

  $(document).ready(function() {

    // not yet implemented
    $('#plone-changestate > ul > li > a,' +
      '#plone-personalactions > ul > li > a,' +
      '#plone-editcontent > a,' +
      '#plone-browsecontent > a').on('click', function(e) {
      alert('Not yet implemented!');
      return false;
    });

    //$('#plone-addcontent > ul > li > a').on('click', function(
    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.respondWith(/\\*\/\+\+add\+\+/, function(xhr) {
      xhr.respond(200, { "Content-Type": "text/html" }, '' +
        '<html>' +
        '<head></head>' +
        '<body>' +
        '<h1 class="documentFirstHeading">XXX</h1>' +
        '<div id="content">' +
        ' asdasdasdasdasd ' +
        '</div>' +
        '</body>' +
        '</html>');
    });

  });
});
