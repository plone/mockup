require([
  'sinon',
  'jquery'
], function(sinon, $) {
  function getQueryVariable(url, variable) {
    var query = url.split('?')[1];
    if(query === undefined){
      return null;
    }
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i += 1) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
  }

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 200;

  server.respondWith("GET", /search.json/, function (xhr, id) {
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

  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var root = [
      {"UID": "jasdlfdlkdkjasdf", "Title": "Some Image", "path": "/test.png", "Type": "Image"},
      {"UID": "asdlfkjasdlfkjasdf", "Title": "News", "path": "/news", "Type": "Folder"},
      {"UID": "124asdfasasdaf34", "Title": "About", "path": "/about", "Type": "Folder"},
      {"UID": "asdf1234", "Title": "Projects", "path": "/projects", "Type": "Folder"},
      {"UID": "asdf1234gsad", "Title": "Contact", "path": "/contact", "Type": "Document"},
      {"UID": "asdv34sdfs", "Title": "Privacy Policy", "path": "/policy", "Type": "Document"},
      {"UID": "asdfasdf234sdf", "Title": "Our Process", "path": "/our-process", "Type": "Folder"},
      {"UID": "asdhsfghyt45", "Title": "Donate", "path": "/donate-now", "Type": "Document"},
    ];
    var about = [
      {"UID": "gfn5634f", "Title": "About Us", "path": "/about/about-us", "Type": "Document"},
      {"UID": "45dsfgsdcd", "Title": "Philosophy", "path": "/about/philosophy", "Type": "Document"},
      {"UID": "dfgsdfgj675", "Title": "Staff", "path": "/about/staff", "Type": "Folder"},
      {"UID": "sdfbsfdh345", "Title": "Board of Directors", "path": "/about/board-of-directors", "Type": "Document"}
    ];

    var staff = [
      {"UID": "asdfasdf9sdf", "Title": "Mike", "path": "/about/staff/mike", "Type": "Document"},
      {"UID": "cvbcvb82345", "Title": "Joe", "path": "/about/staff/joe", "Type": "Document"}
    ];
    var searchables = about.concat(root).concat(staff);

    var addUrls = function(list){
      /* add getURL value */
      for(var i=0; i<list.length; i=i+1){
        var data = list[i];
        data.getURL = window.location.origin + data.path;
      }
    };
    addUrls(searchables);
    addUrls(root);
    root[0].getURL = window.location.origin + '/exampledata/test.png';

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

    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(items, term) {
      results = [];
      if (term === undefined) return searchables;
      _.each(items, function(item) {
        var q;
        var keys = (item.UID + ' ' + item.Title + ' ' + item.path + ' ' + item.Type).toLowerCase();
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

  server.respondWith("GET", /something.html/,
                                [200, { "Content-Type": "text/html" },
                                 ''+
'    <html> '+
'    <head></head>'+
'    <body> '+
'    <div id="content">'+
'    <h1>Content from AJAX</h1>'+
'    <p>Ah, it is a rock, though. Should beat everything.</p>'+
'    </body> '+
'    </html>']);

  server.respondWith("GET", /something-link.html/,
                                [200, { "Content-Type": "text/html" },
                                 ''+
'    <html> '+
'    <head></head>'+
'    <body> '+
'    <div id="content">'+
'    <h1>Content from AJAX with a link</h1>'+
'    <p>Ah, it is a rock, though. Should beat <a href="something-else.html">link</a> everything.</p>'+
'    </body> '+
'    </html>']);

  server.respondWith("GET", /something-else.html/,
                                [200, { "Content-Type": "text/html" },
                                 ''+
'    <html> '+
'    <head></head>'+
'    <body> '+
'    <div id="content">'+
'    <h1>Something else</h1>'+
'    <p>We loaded a link.</p>'+
'    </body> '+
'    </html>']);

  server.respondWith('POST', /upload/, function(xhr, id) {
    xhr.respond(200, {"content-Type": "application/json"},
      JSON.stringify({
        url: 'http://localhost:8000/blah.png',
        uid: 'sldlfkjsldkjlskdjf',
        name: 'blah.png',
        filename: 'blah.png',
        type: 'Image',
        size: 239292
      })
    );
  });

  server.respondWith('GET', /portal_factory\/@@querybuilder_html_results/, function(xhr, id) {
    var content = $('#querystring-example-results').text();
    xhr.respond(200, {"content-Type": "text/html"}, content);
  });
  server.respondWith('GET', /portal_factory\/@@querybuildernumberofresults/, function(xhr, id) {
    var content = $('#querystring-number-results-example-results').text();
    xhr.respond(200, {"content-Type": "text/html"}, content);
  });

  return server;

});
