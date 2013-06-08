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
  'underscore',
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
  'js/patterns/livesearch',
  'jam/SyntaxHighlighter/scripts/XRegExp.js',
  'jam/SyntaxHighlighter/scripts/shCore.js',
  'jam/SyntaxHighlighter/scripts/shBrushXml.js'
], function($, sinon, _, registry, uri) {
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
  server.respondWith(/search.html/, function (xhr, id) {
    xhr.respond(200, { "Content-Type": "html/html" }, $('#search-html').html());
  });
  server.respondWith(/select2-test.json/, function(xhr, id) {
    xhr.respond(200, { "Content-Type": "application/json" }, $('#select2-json').html());
  });
  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var root = [
      {"id": "news", "title": "News", "path": "/news", "type": "folder"},
      {"id": "about", "title": "About", "path": "/about", "type": "page"},
      {"id": "projects", "title": "Projects", "path": "/projects", "type": "folder"},
      {"id": "contact", "title": "Contact", "path": "/contact", "type": "page"},
      {"id": "policy", "title": "Privacy Policy", "path": "/policy", "type": "page"},
      {"id": "our-process", "title": "Our Process", "path": "/our-process", "type": "folder"},
      {"id": "donate-now", "title": "Donate", "path": "/donate-now", "type": "page"}
    ];
    var about = [
      {"id": "about-us", "title": "About Us", "path": "/about/about-us", "type": "page"},
      {"id": "philosophy", "title": "Philosophy", "path": "/about/philosophy", "type": "page"},
      {"id": "staff", "title": "Staff", "path": "/about/staff", "type": "page"},
      {"id": "board-of-directors", "title": "Board of Directors", "path": "/about/board-of-directors", "type": "page"}
    ];

    var searchables = about.concat(root);

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
    var path = getQueryVariable(xhr.url, 'browse');

    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(items, q) {
      results = [];
      if (q === undefined) return searchables;
      _.each(items, function(item) {
        var keys = (item.id + ' ' + item.title + ' ' + item.path).toLowerCase();
        var query = q.toLowerCase();
        if (keys.indexOf(query) > -1) results.push(item);
      });
    }

    function browse(items, q, path) {
      results = [];
      var splitPath = path.split('/');
      var fromPath = [];
      _.each(items, function(item) {
        var itemSplit = item.path.split('/');
        if (itemSplit.slice(0, splitPath.length-1).join('/') === splitPath[splitPath.length-1] &&
            itemSplit.length === splitPath.length) {
          fromPath.push(item);
        }
      });
      if (q === undefined) return fromPath;
      search(fromPath, q);
    }

    if (path) {
      browse(searchables, query, path);
    } else {
      search(searchables, query);
    }

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
