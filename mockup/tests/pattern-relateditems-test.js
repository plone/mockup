define([
  'expect',
  'jquery',
  'underscore',
  'sinon',
  'pat-registry',
  'mockup-patterns-relateditems'
], function(expect, $, _, sinon, registry, RelatedItems) {
  'use strict';

  window.mocha.setup('bdd').globals(['jQuery*']);
  $.fx.off = true;

  var $container;

  /* ==========================
   TEST: Related Items
  ========================== */

  describe('Related Items', function() {

    var root = [
      {UID:  'UID1',   Title:  'Document  1',  path:  '/document1',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID2',   Title:  'Document  2',  path:  '/document2',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID3',   Title:  'Document  3',  path:  '/document3',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID4',   Title:  'Document  4',  path:  '/document4',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID5',   Title:  'Document  5',  path:  '/document5',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID6',   Title:  'Folder    1',  path:  '/folder1',    portal_type:  'Folder',  getIcon:  "folder.png",    is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID7',   Title:  'Folder    2',  path:  '/folder2',    portal_type:  'Folder',  getIcon:  "folder.png",    is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID8',   Title:  'Image     1',  path:  '/image1',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID9',   Title:  'Image     2',  path:  '/image2',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID10',  Title:  'Image     3',  path:  '/image3',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var folder1 = [
      {UID:  'UID11',   Title:  'Document  11',  path:  '/document11',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID12',   Title:  'Document  12',  path:  '/document12',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID13',   Title:  'Document  13',  path:  '/document13',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var folder2 = [
      {UID:  'UID14',   Title:  'Document  14',  path:  '/document14',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID15',   Title:  'Document  15',  path:  '/document15',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID16',   Title:  'Document  16',  path:  '/document16',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var searchables;

    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      function getQueryVariable(url, variable) {
        var query = url.split('?')[1];
        if (query === undefined) {
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
      this.server.respondWith(/relateditems-test.json/, function(xhr, id) {


        var addUrls = function(list) {
          /* add getURL value */
          for (var i = 0; i < list.length; i = i + 1) {
            var item = list[i];
            item.getURL = window.location.origin + item.path;
          }
        };

        addUrls(root);
        addUrls(folder1);
        addUrls(folder2);

        searchables = root.concat(folder1).concat(folder2);

        // grab the page number and number of items per page -- note, page is 1-based from Select2
        var batch = getQueryVariable(xhr.url, 'batch');
        var page = 1;
        var pageSize = 10;
        if (batch) {
          batch = $.parseJSON(batch);
          page = batch.page;
          pageSize = batch.size;
        }
        page = page - 1;

        var query = getQueryVariable(xhr.url, 'query');
        var path = null;
        var term = '';
        if (query) {
          query = $.parseJSON(query);
          for (var i = 0; i < query.criteria.length; i = i + 1) {
            var criteria = query.criteria[i];
            if (criteria.i === 'path') {
              path = criteria.v.split('::')[0];
            } else if (criteria.i === 'is_folderish') {
              term = criteria;
            } else {
              term = criteria.v;
            }
          }
        }

        var results = [];

        function search(items, term) {
          results = [];
          if (term === undefined) {
            return searchables;
          }
          _.each(items, function(item) {
            var q;
            var keys = (item.UID + ' ' + item.Title + ' ' + item.path + ' ' + item.portal_type).toLowerCase();
            if (typeof(term) === 'object') {
              if (term.i === 'is_folderish') {
                if (item.is_folderish) {
                  results.push(item);
                }
              } else {
                for (var i = 0; i < term.length; i = i + 1) {
                  q = term[i].toLowerCase();
                  if (keys.indexOf(q) > -1) {
                    results.push(item);
                    break;
                  }
                }
              }
            } else {
              q = term.toLowerCase();
              if (keys.indexOf(q) > -1) {
                results.push(item);
              }
            }
          });
        }

        function browse(items, q, p) {
          results = [];
          var path = p.substring(0, p.length - 1);
          var splitPath = path.split('/');
          var fromPath = [];
          _.each(items, function(item) {
            var itemSplit = item.path.split('/');
            if (item.path.indexOf(path) === 0 && itemSplit.length - 1 === splitPath.length) {
              fromPath.push(item);
            }
          });
          if (q === undefined) {
            return fromPath;
          }
          search(fromPath, q);
        }
        if (path) {
          browse(searchables, term, path);
        } else {
          search(searchables, term);
        }

        xhr.respond(200, { 'Content-Type': 'application/json' },
          JSON.stringify({
            total: results.length,
            results: results.slice(page * pageSize, (page * pageSize) + pageSize)
          })
        );
      });
    });

    afterEach(function() {
      this.server.restore();
      $container.remove();
      $('.select2-sizer, .select2-drop').remove();
    });

    // test cases
    // 1) initialize pattern
    // click on browse opens result list
    // click on search opens result list
    // click on browse with already selected result items opens result list
    // click on search with already selected result items opens result list
    // 4) browse to item and select it
    // - selected item is removed from result list
    // - don't allow to select items which are not selectable
    // - don't show non-selectable and non folderish items
    // - only search in current path
    // 5) search item and select it
    // 3) deselect an item from result list
    // selection from favorites opens path

    var initializePattern = function (options) {
      options = options || {'vocabularyUrl': '/relateditems-test.json'};
      options = JSON.stringify(options);
      $container = $('<div><input class="pat-relateditems" /></div>');
      $container.appendTo('body');
      var pattern = $('.pat-relateditems', $container)
        .attr('data-pat-relateditems', options)
        .patternRelateditems()
        .data('patternRelateditems');
      return pattern;
    };

    it('test initialize', function() {

      initializePattern();

      expect($('.select2-container-multi'), $container).to.have.length(1);
      expect($('.pattern-relateditems-container'), $container).to.have.length(1);
      expect($('.pattern-relateditems-path'), $container).to.have.length(1);
    });

    it('test browse roundtrip', function () {
      var pattern = initializePattern();
      var clock = sinon.useFakeTimers();

      // open up result list by clicking on "browse"
      $('.mode.browse', $container).click();
      clock.tick(1000);

      expect($('.pattern-relateditems-result-select')).to.have.length(16);

      var stringtext = $('a.pattern-relateditems-result-select').map(function (index, el) {
        return $(el).text().trim();
      });
      stringtext = _.sortBy(stringtext);

      debugger;
      expect(stringtext.length).to.be.equal(searchables.length);

      console.log(searchables);
      _.sortBy(searchables, 'Title').map(function (el, index) {
        console.log(stringtext[index]);
        console.log(el.Title);
        expect(stringtext[index].indexOf(el.Title)).not.equal(-1);

      });


    });



  });

});
