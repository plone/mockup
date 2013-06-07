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
    var fakeItems = ['one', 'two', 'three', 'four', 'five', 'six', 'seven',
                     'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
                     'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
                     'nineteen', 'twenty', 'twentyone'];
    var directoryToSearch = {
      'one': {
        'one.one': {'one.one.itemone': 'One', 'one.one.itemtwo': 'Two'},
        'one.two': {'one.two.itemone': 'One', 'one.two.itemtwo': 'Two'}
      },
      'two': {'two.itemone': 'One'},
      'three': 'Three',
      'five': 'Five',
      'six': 'Six',
      'seven': 'Seven',
      'eight': 'Eight',
      'nine': 'Nine',
      'ten': 'Ten',
      'eleven': 'Eleven',
      'twelve': 'Twelve',
      'thirteen': 'Thirteen',
      'fourteen': 'Fourteen',
      'fifteen': 'Fifteen',
      'sixteen': 'Sixteen',
      'seventeen': 'Seventeen',
      'eighteen': 'Eighteen',
      'nineteen': 'Nineteen',
      'twenty': 'Twenty',
      'twentyone': 'Twenty One'
    };
    var results = [];

    // grab the page number and number of items per page -- note, page is 1-based from Select2
    var page = Number(getQueryVariable(xhr.url, 'page')) - 1;
    var page_size = Number(getQueryVariable(xhr.url, 'page_limit'));

    // just return an empty result set if no page is found
    if(page < 0) {
      xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify({"total": 0, "results": []}));
      return;
    }

    var query = getQueryVariable(xhr.url, 'q');
    var results = [];
    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(idprefix, pathprefix, sobj) {
      var cnt = 0;
      for(var key in sobj) {
        if(key.toLowerCase().indexOf(query.toLowerCase()) >= 0 || (typeof sobj[key] === "string" && sobj[key].toLowerCase().indexOf(query.toLowerCase()) >= 0)) {
          results.push({
            'id': idprefix+''+cnt,
            'title': typeof sobj[key] === "string" ? sobj[key] : key,
            'path': pathprefix + '/' + key,
            'folder': typeof sobj[key] !== "string"
          });
        }
        if(typeof sobj[key] !== "string") {
          search(idprefix+''+cnt,
                              pathprefix+'/'+key,
                              sobj[key]);
        }
      }
    }

    search('', '', directoryToSearch);

    xhr.respond(200, { "Content-Type": "application/json" },
      JSON.stringify({
        "total": results.length,
        "results": results.slice(page*page_size, (page*page_size)+(page_size-1))
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
