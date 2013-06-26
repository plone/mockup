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
  server.respondWith(/search.json/, function (xhr, id) {
    var items = [
      {
        "UID": "123sdfasdf",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooasdfasdf1123asZ",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      },
      {
        "UID": "fooasdfasdf1231as",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooasdfasdf12231451",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      },
      {
        "UID": "fooasdfasdf1235dsd",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooasdfasd345345f",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      },
      {
        "UID": "fooasdfasdf465",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooaewrwsdfasdf",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      },
      {
        "UID": "fooasdfasd123f",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooasdfasdas123f",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      },
      { 
        "UID": "fooasdfasdfsdf",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "News"
      },
      {
        "UID": "fooasdfasdf",
        "getURL": "http://localhost:8081/news/aggregator",
        "Type": "Collection", "Description": "Site News",
        "Title": "Another Item"
      }
    ];

    var results = [];
    var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));

    var query = JSON.parse(getQueryVariable(xhr.url, 'query'));

    if (query.criteria[0].v === 'none*') {
      results = [];
    } else {
      if (batch) {
        var start, end;
        start = (batch.page-1) * batch.size;
        end = start + batch.size;
        results = items.slice(start, end);
      }
    }

    xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
      total: results.length,
      results: results
    }));
  });
  server.respondWith(/select2-test.json/, function(xhr, id) {
    xhr.respond(200, { "Content-Type": "application/json" }, $('#select2-json').html());
  });
  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var root = [
      {"id": "asdlfkjasdlfkjasdf", "title": "News", "path": "/news", "Type": "Folder"},
      {"id": "124asdf", "title": "About", "path": "/about", "Type": "Folder"},
      {"id": "asdf1234", "title": "Projects", "path": "/projects", "Type": "Folder"},
      {"id": "asdf1234gsad", "title": "Contact", "path": "/contact", "Type": "page"},
      {"id": "asdv34sdfs", "title": "Privacy Policy", "path": "/policy", "Type": "page"},
      {"id": "asdfasdf234sdf", "title": "Our Process", "path": "/our-process", "Type": "folder"},
      {"id": "asdhsfghyt45", "title": "Donate", "path": "/donate-now", "Type": "page"}
    ];
    var about = [
      {"id": "gfn5634f", "title": "About Us", "path": "/about/about-us", "Type": "page"},
      {"id": "45dsfgsdcd", "title": "Philosophy", "path": "/about/philosophy", "Type": "page"},
      {"id": "dfgsdfgj675", "title": "Staff", "path": "/about/staff", "Type": "Folder"},
      {"id": "sdfbsfdh345", "title": "Board of Directors", "path": "/about/board-of-directors", "Type": "page"}
    ];

    var staff = [
      {"id": "asdfasdf9sdf", "title": "Mike", "path": "/about/staff/mike", "Type": "page"},
      {"id": "cvbcvb82345", "title": "Joe", "path": "/about/staff/joe", "Type": "page"}
    ];
    var searchables = about.concat(root).concat(staff);

    var results = [];

    // grab the page number and number of items per page -- note, page is 1-based from Select2
    var batch = getQueryVariable(xhr.url, 'batch');
    var page = 1;
    var page_size = 10;
    if(batch){
      batch = $.parseJSON(batch);
      page = batch.page;
      page_size = batch.size;
    }
    page = page - 1;

    var query = getQueryVariable(xhr.url, 'query');
    var path = null;
    var term = '';
    if(query){
      query = $.parseJSON(query);
      term = query.criteria[0].v;
      if(query.criteria.length > 1){
        path = query.criteria[1].v;
      }
    }
    //var query = getQueryVariable(xhr.url, 'q');
    //var path = getQueryVariable(xhr.url, 'browse');

    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(items, term) {
      results = [];
      if (term === undefined) return searchables;
      _.each(items, function(item) {
        var q;
        var keys = (item.id + ' ' + item.title + ' ' + item.path).toLowerCase();
        if(typeof(term) === 'object'){
          for(var i=0; i<term.length; i++){
            q = term[i].toLowerCase();
            if (keys.indexOf(q) > -1){
              results.push(item);
              break;
            }
          }
        }else{
          q = term.toLowerCase();
          if (keys.indexOf(q) > -1) results.push(item);
        }
      });
    }

    function browse(items, q, p) {
      results = [];
      var path = p.substring(0, p.length-1);
      var splitPath = path.split('/');
      var fromPath = [];
      _.each(items, function(item) {
        var itemSplit = item.path.split('/');
        if (item.path.indexOf(path) === 0 && itemSplit.length-1 == splitPath.length) {
          fromPath.push(item);
        }
      });
      if (q === undefined) return fromPath;
      search(fromPath, q);
    }

    if (path) {
      browse(searchables, term, path);
    } else {
      search(searchables, term);
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
