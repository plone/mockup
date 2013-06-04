function getQueryVariable(url, variable) {
    var query = url.split('?')[1];
    if(query === undefined){
      return null;
    }
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

require([
  'jquery',
  'sinon',
  'jam/Patterns/src/registry',
  'js/bundles/widgets',
  'js/patterns/expose',
  'js/patterns/modal',
  'js/patterns/accessibility',
  'js/patterns/cookiedirective',
  'js/patterns/preventdoublesubmit',
  'js/patterns/formUnloadAlert',
  'js/patterns/tooltip',
  'js/patterns/tablesorter',
  'jam/SyntaxHighlighter/scripts/XRegExp.js',
  'jam/SyntaxHighlighter/scripts/shCore.js',
  'jam/SyntaxHighlighter/scripts/shBrushXml.js',
], function($, sinon, registry, uri) {
  var URI = uri;
  // before demo patterns in overlay remove html created by autotoc pattern
  $('#modal1').on('show.modal.patterns', function(e, modal) {
    $('.autotoc-nav', modal.$modal).remove();
  });
  var fakeItems = ['one', 'two', 'three', 'four', 'five', 'six', 'seven',
                   'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
                   'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
                   'nineteen', 'twenty', 'twentyone'];

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 500;
  server.respondWith(/something.html/, function (xhr, id) {
    xhr.respond(200, { "Content-Type": "html/html" }, $('#something-html').html());
  });
  server.respondWith(/select2-test.json/, function(xhr, id) {
    xhr.respond(200, { "Content-Type": "application/json" }, $('#select2-json').html());
  });
  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var data = [];
    var page = 0;
    var reqpage = getQueryVariable(xhr.url, 'page');
    if(reqpage === "2"){
      page = 1;
    }else if(reqpage === "3"){
      page = 2;
    }
    var base = getQueryVariable(xhr.url, 'base_path');
    if(base === null || base === "/"){
      base = "";
    }
    for(var i=page * 10; i<(page + 1) * 10; i++){
      var number = fakeItems[i];
      if(number === undefined){
        continue;
      }
      data.push({
        "id": number,
        "title": number.charAt(0).toUpperCase() + number.slice(1),
        "path": base + "/" + number,
        "folder": true
      });
    }
    xhr.respond(200, { "Content-Type": "application/json" },
      JSON.stringify({
        "total": fakeItems.length,
        "results": data
    }));
  });

  SyntaxHighlighter.all();

  // Initialize patterns
  $(document).ready(function() {
    registry.scan($('body'));

    // This is used for the cookiedirective pattern
    function getCookieValue (){
      var cookie = $.cookie("Allow_Cookies_For_Site");
      var value;
      if (cookie === undefined){
        value = "undefined";
      }
      else{
        if (cookie == "1"){
          value = "Allow";
        }
        else{
          value = "Deny";
        }
      }
      return value;
    }
    $('.cookieallowbutton').live("click", function() {
      var value = getCookieValue();
      $('#cookievalue').text(value);
    });
    $('.cookiedenybutton').live("click", function() {
      var value = getCookieValue();
      $('#cookievalue').text(value);
    });

    $('#removedemocookie').on("click", function() {
      $.removeCookie('Allow_Cookies_For_Site');
      location.reload();
    });

    var value = getCookieValue();
    $('#cookievalue').text(value);
  });

});
