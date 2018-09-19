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
      {UID:  'UID6',   Title:  'Folder    1',  path:  '/folder1',    portal_type:  'Folder',  getIcon:  "folder.png",    is_folderish:  true,   review_state:  'published',  getURL: ''},
      {UID:  'UID7',   Title:  'Folder    2',  path:  '/folder2',    portal_type:  'Folder',  getIcon:  "folder.png",    is_folderish:  true,   review_state:  'published',  getURL: ''},
      {UID:  'UID8',   Title:  'Image     1',  path:  '/image1',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID9',   Title:  'Image     2',  path:  '/image2',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID10',  Title:  'Image     3',  path:  '/image3',     portal_type:  'Image',   getIcon:  "image.png",     is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var folder1 = [
      {UID:  'UID11',   Title:  'Document  11',  path:  '/folder1/document11',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID12',   Title:  'Document  12',  path:  '/folder1/document12',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID13',   Title:  'Document  13',  path:  '/folder1/document13',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var folder2 = [
      {UID:  'UID14',   Title:  'Document  14',  path:  '/folder2/document14',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID15',   Title:  'Document  15',  path:  '/folder2/document15',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID16',   Title:  'Document  16',  path:  '/folder2/document16',  portal_type:  'Page',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID17',   Title:  'Image     17',  path:  '/folder2/image17',     portal_type:  'Image',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
      {UID:  'UID18',   Title:  'Image     18',  path:  '/folder2/image18',     portal_type:  'Image',    getIcon:  "document.png",  is_folderish:  false,  review_state:  'published',  getURL: ''},
    ];
    var $container;

    var search = function (catalog, query) {
      var results_ = [];
      catalog.forEach(function (item) {
        var add = true;
        query.forEach(function (criteria) {
          var val = criteria.v;
          if (criteria.i === 'SearchableText') {
            val = val.split('*')[1];  // searchText is wildcarded with "*text*"
            if (
              item.Title.indexOf(val) === -1 &&
              item.path.indexOf(val) === -1
            ) {
              add = false;
            }
          }
          if (
            criteria.i === 'portal_type' &&
            val.indexOf(item.portal_type) === -1
          ) {
            add = false;
          }
          if (criteria.i === 'path') {
            var parts = val.split('::1');
            var searchpath = parts[0];
            var browsing = parts.length === 2;
            if (item.path.indexOf(searchpath) === -1) {
              // search path not part of item path
              add = false;
            }
            if (browsing) {
              // flat search
              searchpath = searchpath.slice(-1) !== '/' ? searchpath + '/' : searchpath;
              if (item.path.split('/').length !== searchpath.split('/').length) {
                // not same number of path parts, so not same hirarchy
                add = false;
              }
            }
          }
        });
        if (add) {
          results_.push(item);
        }

      });

      return results_;
    };

    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      function getQueryVariable(url, variable) {
        url = decodeURIComponent(url);
        var query = url.split('?')[1];
        if (query === undefined) {
          return null;
        }
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i += 1) {
          var pair = vars[i].split('=');
          if (pair[0] === variable) {
            try {
              return JSON.parse(pair[1]);
            } catch (e) {
              return pair[1];
            }
          }
        }
        return undefined;
      }

      this.server.respondWith(/relateditems-test.json/, function(xhr) {

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

        // grab the page number and number of items per page -- note, page is 1-based from Select2
        var batch = getQueryVariable(xhr.url, 'batch');
        var page = 1;
        var pageSize = 100;
        if (batch) {
          page = batch.page;
          pageSize = batch.size;
        }
        page = page - 1;

        var query = getQueryVariable(xhr.url, 'query');

        var results = search(
            root.concat(folder1).concat(folder2),
            query.criteria
        );

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

    var initializePattern = function (options) {
      options = options || {};
      options.vocabularyUrl = '/relateditems-test.json';
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
      expect($('.pattern-relateditems-container .toolbar .path-wrapper'), $container).to.have.length(1);
    });


    it('auto roundtrip', function () {
      initializePattern({'selectableTypes': ['Image', 'Folder'], 'pageSize': 100});
      var clock = sinon.useFakeTimers();
      var $input;

      // open up result list by clicking into search field
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);

      // Only Images and Folders should be shown.
      expect($('.pattern-relateditems-result-select')).to.have.length(5);

      // Select first folder
      $('a.pattern-relateditems-result-select[data-path="/folder1"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID6');

      // Still, this folder should be shown in the result list - only not selectable.
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      expect($('.pattern-relateditems-result-select')).to.have.length(5);

      // Browse into second folder which contains images
      $('.pattern-relateditems-result-browse[data-path="/folder2"]').click();
      clock.tick(1000);

      // 1 "One level up" and 2 images
      expect($('.pattern-relateditems-result-select')).to.have.length(3);
      expect($('.pattern-relateditems-result-select')[0].text).to.contain('One level up');

      // Select first image
      $('a.pattern-relateditems-result-select[data-path="/folder2/image17"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID6,UID17');

      // Browse one level up
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select')[0].click();
      clock.tick(1000);

      // Again, 5 items on root.
      expect($('.pattern-relateditems-result-select')).to.have.length(5);

      // Input a search term and enter search mode
      $input = $('.select2-search-field input.select2-input');
      $input.click().val('folder2');
      var keyup = $.Event('keyup-change');
      $input.trigger(keyup);
      clock.tick(1000);

      // Searching for folder 2 brings up 2 items: folder2 itself and the not-yet-selected image.
      expect($('.pattern-relateditems-result-select')).to.have.length(2);

      // We can even browse into folders in search mode
      $('.pattern-relateditems-result-browse[data-path="/folder2"]').click();
      clock.tick(1000);

      // Being in folder 2, we see again two items...
      expect($('.pattern-relateditems-result-select')).to.have.length(2);
      expect($('.pattern-relateditems-result-select')[0].text).to.contain('One level up');

      // Selecting the image will add it to the selected items.
      $('a.pattern-relateditems-result-select[data-path="/folder2/image18"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID6,UID17,UID18');

    });


    it('browse roundtrip', function () {
      initializePattern({'mode': 'browse', 'selectableTypes': ['Image'], 'pageSize': 100});
      var clock = sinon.useFakeTimers();
      var $input;


      // open up result list by clicking on "browse"
      $('.mode.browse', $container).click();
      clock.tick(1000);

      // result list must have expected length
      // Only Images and Folders.
      expect($('.pattern-relateditems-result-select')).to.have.length(5);


      // PT 2

      // select one element
      $('a.pattern-relateditems-result-select[data-path="/image1"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID8');


      // PT 3

      // click again on browse, should open up result list again, this time without 'UID1'
      $('.mode.browse', $container).click();
      clock.tick(1000);

      // result list must have expected length
      expect($('.pattern-relateditems-result-select.selectable')).to.have.length(2);

      // add another one
      $('a.pattern-relateditems-result-select[data-path="/image2"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID8,UID9');

      // remove first one
      $($('a.select2-search-choice-close')[0]).click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID9');

      // search for...
      $input = $('.select2-search-field input.select2-input');
      $input.click().val('Ima');
      var keyup = $.Event('keyup-change');
      $input.trigger(keyup);
      clock.tick(1000);
      expect($('.pattern-relateditems-result-select.selectable')).to.have.length(2);

      // add first from result
      $('a.pattern-relateditems-result-select[data-path="/image3"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID9,UID10');

    });


    it('search roundtrip', function () {
      initializePattern({'mode': 'search', 'selectableTypes': ['Page'], 'pageSize': 100});
      var clock = sinon.useFakeTimers();
      var $input;

      // open up result list by clicking on "browse"
      $('.mode.search', $container).click();
      clock.tick(1000);

      // result list must have expected length
      expect($('.pattern-relateditems-result-select')).to.have.length(11);


      //  // PT 2

      //  // select one element
      $('a.pattern-relateditems-result-select[data-path="/document1"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID1');


      //  // PT 3

      //  // click again on browse, should open up result list again, this time without 'UID1'
      $('.mode.search', $container).click();
      clock.tick(1000);

      //  // result list must have expected length
      expect($('.pattern-relateditems-result-select.selectable')).to.have.length(10);

      //  // add another one
      $('a.pattern-relateditems-result-select[data-path="/document2"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID1,UID2');

      //  // remove first one
      $($('a.select2-search-choice-close')[0]).click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID2');

      //  // search for...
      $input = $('.select2-search-field input.select2-input');
      $input.click().val('document15');
      var keyup = $.Event('keyup-change');
      $input.trigger(keyup);
      clock.tick(1000);
      expect($('.pattern-relateditems-result-select.selectable')).to.have.length(1);

      //  // add first from result
      $('a.pattern-relateditems-result-select[data-path="/folder2/document15"]').click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID2,UID15');

    });

    it('empty favorites not shown', function () {
      var pattern = initializePattern();
      expect($('button.favorites', $container).length).to.be.equal(0);
    });

    it('use favorites', function () {
      var pattern = initializePattern({'favorites': [{'title': 'root', 'path': '/'}, {'title': 'folder1', 'path': '/folder1'}]});
      var clock = sinon.useFakeTimers();

      // open up result list by clicking on "browse"
      $('button.favorites', $container).click();
      clock.tick(1000);

      // click "folder1"
      $($('.favorites li a')[1]).click();
      clock.tick(1000);

      expect($('.path-wrapper .pattern-relateditems-path-label', $container).text()).to.be.equal('Current path:');
      expect($($('.path-wrapper .crumb')[1], $container).text()).to.be.equal('folder1');

    });

    it('use recently used', function () {
      // Test if adding items add to the recently used list.

      // Clear local storage at first.
      delete localStorage.relateditems_recentlyused;

      initializePattern({'selectableTypes': ['Folder'], 'recentlyUsed': true});
      var clock = sinon.useFakeTimers();
      var $input;

      // initially - without having previously select something - the recently used button is not shown.
      expect($('button.recentlyUsed', $container).length).to.be.equal(0);

      // Select some items
      // folder 1
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder1"]').click();
      // folder 2
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder2"]').click();

      // check, if items are selected
      expect($('input.pat-relateditems').val()).to.be.equal('UID6,UID7');

      // destroy relateditems widget and reload it
      $('.pattern-relateditems-container').remove();

      initializePattern({'selectableTypes': ['Folder'], 'recentlyUsed': true});

      // after re-initialization (or page reload. no dynamic re-rendering based
      // on the data model yet, sorry), the recently used button should be there.
      expect($('button.recentlyUsed', $container).length).to.be.equal(1);

      // last selected should be first in list.
      expect($($('.pattern-relateditems-recentlyused-select')[0]).data('uid')).to.be.equal('UID7');
      expect($($('.pattern-relateditems-recentlyused-select')[1]).data('uid')).to.be.equal('UID6');

      // Klicking on last used item should add it to the selection.
      $($('.pattern-relateditems-recentlyused-select')[0]).click();
      expect($('input.pat-relateditems').val()).to.be.equal('UID7');

      // done.
    });

    it('recently used deactivated', function () {
      // Test if deactivating recently used really deactivates it.

      // Clear local storage at first.
      delete localStorage.relateditems_recentlyused;

      initializePattern({'selectableTypes': ['Folder']});  // per default recently used isn't activated.
      var clock = sinon.useFakeTimers();
      var $input;

      // initially - without having previously select something - the recently used button is not shown.
      expect($('button.recentlyUsed', $container).length).to.be.equal(0);

      // Select some items
      // folder 1
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder1"]').click();
      // folder 2
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder2"]').click();

      // check, if items are selected
      expect($('input.pat-relateditems').val()).to.be.equal('UID6,UID7');

      // destroy relateditems widget and reload it
      $('.pattern-relateditems-container').remove();

      initializePattern({'selectableTypes': ['Folder']});

      // recently used button should still not be visible
      expect($('button.recentlyUsed', $container).length).to.be.equal(0);

      // done.
    });

    it('limit recently used', function () {
      // Test if limiting recently used items really limits the list.

      // Clear local storage at first.
      delete localStorage.relateditems_recentlyused;

      // initialize without a max items setting - recently items isn't shown yet anyways.
      initializePattern({'selectableTypes': ['Folder', 'Image'], 'recentlyUsed': true});
      var clock = sinon.useFakeTimers();
      var $input;

      // Select some items
      // folder 1
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder1"]').click();
      // folder 2
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder2"]').click();
      // image 1
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/image1"]').click();
      // image 2
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/image2"]').click();

      // check, if items are selected
      expect($('input.pat-relateditems').val()).to.be.equal('UID6,UID7,UID8,UID9');

      // destroy relateditems widget and reload it
      $('.pattern-relateditems-container').remove();

      initializePattern({'selectableTypes': ['Folder', 'Image'], 'recentlyUsed': true, 'recentlyUsedMaxItems': '2'});

      // only two should be visible, last selected should be first in list.
      expect($('.pattern-relateditems-recentlyused-select').length).to.be.equal(2);
      expect($($('.pattern-relateditems-recentlyused-select')[0]).data('uid')).to.be.equal('UID9');
      expect($($('.pattern-relateditems-recentlyused-select')[1]).data('uid')).to.be.equal('UID8');

      // done.
    });

    it('recently used custom key', function () {
      // Test if configuring a custom storage key for recently used has any effect.

      var key = 'recently_used_cusom_key@ümläüte';

      // Clear local storage at first.
      delete localStorage[key];

      // initialize without a max items setting - recently items isn't shown yet anyways.
      initializePattern({'selectableTypes': ['Folder', 'Image'], 'recentlyUsed': true, 'recentlyUsedKey': key});
      var clock = sinon.useFakeTimers();
      var $input;

      // Select some items
      // folder 1
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder1"]').click();
      // folder 2
      $('.select2-search-field input.select2-input').click();
      clock.tick(1000);
      $('a.pattern-relateditems-result-select[data-path="/folder2"]').click();

      var items = JSON.parse(localStorage[key]);
      expect(items.length).to.be.equal(2);

      // done.
    });

  });

});
