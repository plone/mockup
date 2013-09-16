define([
  'sinon',
  'jquery',
  'underscore'
], function(sinon, $, _) {
  "use strict";

  function getQueryVariable(url, variable) {
    var query = url.split('?')[1];
    if(query === undefined){
      return null;
    }
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i += 1) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
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

  // define here so it's the same for the entire page load.
  // these are all random items on the root of the site
  var randomItems = [];
  var basePaths = ['/', '/news/', '/projects/', '/about/'];
  var possibleNames = ['Page', 'News Item', 'Info', 'Blog Item'];

  function generateUID(size){
    if(!size){
      size = 30;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i<size; i=i+1){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  for(var pathi=0; pathi<basePaths.length; pathi=pathi+1){
    var basePath = basePaths[pathi];
    for(var i=0; i<1000; i=i+1){
      randomItems.push({
        UID: generateUID(),
        Title: possibleNames[Math.floor(Math.random()*possibleNames.length)] + ' ' + i,
        path: basePath + generateUID(8),
        Type: "Document"
      });
    }
  }

  server.respondWith(/relateditems-test.json/, function(xhr, id) {
    var searchables = [
      {"UID": "jasdlfdlkdkjasdf", "Title": "Some Image", "path": "/test.png", "Type": "Image"},
      {"UID": "asdlfkjasdlfkjasdf", "Title": "News", "path": "/news", "Type": "Folder"},
      {"UID": "124asdfasasdaf34", "Title": "About", "path": "/about", "Type": "Folder"},
      {"UID": "asdf1234", "Title": "Projects", "path": "/projects", "Type": "Folder"},
      {"UID": "asdf1234gsad", "Title": "Contact", "path": "/contact", "Type": "Document"},
      {"UID": "asdv34sdfs", "Title": "Privacy Policy", "path": "/policy", "Type": "Document"},
      {"UID": "asdfasdf234sdf", "Title": "Our Process", "path": "/our-process", "Type": "Folder"},
      {"UID": "asdhsfghyt45", "Title": "Donate", "path": "/donate-now", "Type": "Document"},
      // about
      {"UID": "gfn5634f", "Title": "About Us", "path": "/about/about-us", "Type": "Document"},
      {"UID": "45dsfgsdcd", "Title": "Philosophy", "path": "/about/philosophy", "Type": "Document"},
      {"UID": "dfgsdfgj675", "Title": "Staff", "path": "/about/staff", "Type": "Folder"},
      {"UID": "sdfbsfdh345", "Title": "Board of Directors", "path": "/about/board-of-directors", "Type": "Document"},
      // staff
      {"UID": "asdfasdf9sdf", "Title": "Mike", "path": "/about/staff/mike", "Type": "Document"},
      {"UID": "cvbcvb82345", "Title": "Joe", "path": "/about/staff/joe", "Type": "Document"}
    ];
    searchables = searchables.concat(randomItems);

    var addSomeData = function(list){
      /* add getURL value, review_state, modification, creation */
      var dates = [
        'January 1, 2011',
        'February 10, 2012',
        'March 12, 2013',
        'April 1, 2012',
        'May 20, 2013'
      ];
      for(var i=0; i<list.length; i=i+1){
        var data = list[i];
        data.getURL = window.location.origin + data.path;
        data.review_state = ['published', 'private', 'review'][Math.floor(Math.random()*3)];
        data.CreationDate = dates[Math.floor(Math.random()*dates.length)];
        data.ModificationDate = dates[Math.floor(Math.random()*dates.length)];
        data.EffectiveDate = dates[Math.floor(Math.random()*dates.length)];
        if(data.Type === 'Folder'){
          data.is_folderish = true;
        }else{
          data.is_folderish = false;
        }
      }
    };
    addSomeData(searchables);
    searchables[0].getURL = window.location.origin + '/exampledata/test.png';

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
      for(var i=0; i<query.criteria.length; i=i+1){
        var criteria = query.criteria[i];
        if(criteria.i === 'path'){
          path = criteria.v;
        }else{
          term = criteria.v;
        }
      }
    }

    // this seach is for basically searching the entire hierarchy -- this IS NOT the browse "search"
    function search(items, term) {
      results = [];
      if (term === undefined){
        return searchables;
      }
      _.each(items, function(item) {
        var q;
        var keys = (item.UID + ' ' + item.Title + ' ' + item.path + ' ' + item.Type).toLowerCase();
        if(typeof(term) === 'object'){
          for(var i=0; i<term.length; i=i+1){
            q = term[i].toLowerCase();
            if (keys.indexOf(q) > -1){
              results.push(item);
              break;
            }
          }
        }else{
          q = term.toLowerCase();
          if (keys.indexOf(q) > -1){
            results.push(item);
          }
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
        if (item.path.indexOf(path) === 0 && itemSplit.length-1 === splitPath.length) {
          fromPath.push(item);
        }
      });
      if (q === undefined){
        return fromPath;
      }
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

  server.respondWith("GET", /modal-form.html/,
                                [200, { "Content-Type": "text/html" },
                                 ''+
'    <html> '+
'    <head></head>'+
'    <body> '+
'    <div id="content">'+
'    <h1>Modal with Form</h1>'+
'    <p>This modal contains a form.</p>'+
'    <form method="POST" action="/modal-submit.html">' +
'      <label for="name">Name:</label><input type="text" name="name" />' +
'      <div class="formControls"> ' +
'        <input type="submit" class="btn btn-primary" value="Submit" name="submit" />' +
'      </div> '+
'    </form>' +
'    </body> '+
'    </html>']);

  server.respondWith('POST', /modal-submit.html/, function(xhr, id) {
    var name = getQueryVariable('?'+xhr.requestBody, 'name');
    xhr.respond(200, {"content-Type": "text/html"},
      '<html> '+
      '  <head></head>'+
      '  <body> '+
      '    <div id="content">'+
      '      <h1>Hello, '+_.escape(name)+'</h1>'+
      '      <p>Thanks!</p>'+
      '  </body> '+
      '</html>'
    );
  });

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

  var basicActions = [
    /moveitem/,
    /copy/,
    /cut/,
    /delete/,
    /workflow/,
    /tags/,
    /dates/,
    /paste/,
    /order/
  ];

  _.each(basicActions, function(action){
    server.respondWith('POST', action, function(xhr, id) {
      server.autoRespondAfter = 200;
      xhr.respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "status": "success"
      }));
    });
  });

  return server;

});
