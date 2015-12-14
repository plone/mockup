define([
  'expect',
  'jquery',
  'pat-registry',
  'mockup-patterns-structure',
  'sinon',
], function(expect, $, registry, Structure, sinon) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

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

  var extraDataJsonItem = null;


  /* ==========================
   TEST: Structure
  ========================== */
  describe('Structure', function() {
    beforeEach(function() {
      // clear cookie setting
      $.removeCookie('_fc_perPage');
      $.removeCookie('_fc_activeColumns');
      $.removeCookie('_fc_activeColumnsCustom');

      var structure = {
        "vocabularyUrl": "/data.json",
        "uploadUrl": "/upload",
        "moveUrl": "/moveitem",
        "indexOptionsUrl": "/tests/json/queryStringCriteria.json",
        "contextInfoUrl": "{path}/contextInfo",
      };

      this.$el = $('<div class="pat-structure"></div>').attr(
        'data-pat-structure', JSON.stringify(structure)).appendTo('body');

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith('GET', /data.json/, function (xhr, id) {
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var start = 0;
        var end = 15;
        if (batch) {
          start = (batch.page - 1) * batch.size;
          end = start + batch.size;
        }
        var items = [];
        items.push({
          UID: '123sdfasdfFolder',
          getURL: 'http://localhost:8081/folder',
          path: '/folder',
          portal_type: 'Folder',
          Description: 'folder',
          Title: 'Folder',
          'review_state': 'published',
          'is_folderish': true,
          Subject: [],
          id: 'folder'
        });
        for (var i = start; i < end; i = i + 1) {
          items.push({
            UID: '123sdfasdf' + i,
            getURL: 'http://localhost:8081/item' + i,
            path: '/item' + i,
            portal_type: 'Document ' + i,
            Description: 'document',
            Title: 'Document ' + i,
            'review_state': 'published',
            'is_folderish': false,
            Subject: [],
            id: 'item' + i
          });
        }

        if (extraDataJsonItem) {
          items.push(extraDataJsonItem);
        }

        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          total: 100,
          results: items
        }));
      });
      this.server.respondWith('POST', '/rearrange', function (xhr, id) {
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          status: 'success',
          msg: 'rearranged'
        }));
      });
      this.server.respondWith('POST', '/paste', function (xhr, id) {
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          status: 'success',
          msg: 'pasted'
        }));
      });
      this.server.respondWith('GET', /contextInfo/, function (xhr, id) {
        var data = {
          addButtons: [{
            id: 'document',
            title: 'Document',
            url: '/adddocument'
          },{
            id: 'folder',
            title: 'Folder'
          }],
        };
        if (xhr.url.indexOf('folder') !== -1){
          data.object = {
            UID: '123sdfasdfFolder',
            getURL: 'http://localhost:8081/folder',
            path: '/folder',
            portal_type: 'Folder',
            Description: 'folder',
            Title: 'Folder',
            'review_state': 'published',
            'is_folderish': true,
            Subject: [],
            id: 'folder'
          };
        }
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
      });

      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      extraDataJsonItem = null;
      this.server.restore();
      this.clock.restore();
      $('body').html('');
    });

    it('initialize', function() {
      registry.scan(this.$el);
      expect(this.$el.find('.order-support > table').size()).to.equal(1);
    });

    it('select item populates selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(500);
      var cb = this.$el.find('.itemRow td.selection input').eq(0);
      cb[0].checked = true;
      cb.trigger('change');
      this.clock.tick(500);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('1');
      var selectedItems = $('.popover-content .selected-item', this.$el);
      expect($(selectedItems[0]).text()).to.contain('Folder');
    });

    it('test selection well label', function() {
      extraDataJsonItem = {
        UID: 'XSS" data-xss="bobby',
        getURL: 'http://localhost:8081/xss',
        path: '/xss',
        portal_type: 'Folder',
        Description: 'XSS test item',
        Title: "<script>alert('XSS');window.foo=1;</script>",
        'review_state': 'published',
        'is_folderish': true,
        Subject: [],
        id: 'xss'
      };
      registry.scan(this.$el);
      this.clock.tick(500);
      // it's overloaded, pattern doesn't actually enforce batch limits.
      var cb = this.$el.find('.itemRow td.selection input').eq(16);
      cb[0].checked = true;
      cb.trigger('change');
      this.clock.tick(500);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('1');

      // XSS happened.
      expect(window.foo).not.equal(1);
      expect($('.popover-content .selected-item a', this.$el).eq(0).data().xss
        ).not.equal('bobby');
      var selectedItems = $('.popover-content .selected-item', this.$el);
      expect($(selectedItems[0]).text()).to.contain(
        "<script>alert('XSS');window.foo=1;</script>");
    });

    it('remove item from selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item1 = this.$el.find('.itemRow td.selection input').eq(0);
      $item1[0].checked = true;
      $item1.trigger('change');
      this.$el.find('.items.popover-content a.remove').trigger('click').trigger('change');
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');
    });

    it('remove all from selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item1 = this.$el.find('.itemRow td.selection input').eq(0);
      $item1[0].checked = true;
      $item1.trigger('change');
      this.clock.tick(1000);
      var $item2 = this.$el.find('.itemRow td.selection input').eq(1);
      $item2[0].checked = true;
      $item2.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('2');
      this.$el.find('.popover.selected-items a.remove-all').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');
    });

    it('paging', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      // click next page
      var page1Btn = this.$el.find('.pagination li.active a');
      page1Btn.parent().next().find('a').trigger('click');
      this.clock.tick(1000);
      expect(page1Btn.html()).not.to.contain(this.$el.find('.pagination li.active a').eq('0').html());
      expect(this.$el.find('.pagination li.active a').eq('0').html()).to.contain('2');
    });

    it('per page', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      this.$el.find('.serverhowmany15 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(16);
      this.$el.find('.serverhowmany30 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(31);
    });

    it('test paging does not apply overflow hidden to parent', function() {
      /*
       * very odd here, overflow hidden is getting applied by something after
       * the table of results is re-rendered with new data
       */
      registry.scan(this.$el);
      this.clock.tick(1000);
      // click next page
      var page1Btn = this.$el.find('.pagination li.active a');
      page1Btn.parent().next().find('a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.css('overflow')).to.not.equal('hidden');
    });

    it.skip('test rearrange button', function() {
      /* test not working in firefox */
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $popover = this.$el.find('.popover.rearrange');
      this.$el.find('#btn-rearrange').trigger('click');
      expect($popover.hasClass('active')).to.equal(true);
      $popover.find('button').trigger('click');
      this.clock.tick(1000);
      expect($popover.hasClass('active')).to.equal(false);
      expect(this.$el.find('.order-support .status').html()).to.contain('rearrange');
    });

    it('test select all', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item = this.$el.find('table th .select-all');
      $item[0].checked = true;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('16');

    });

    it('test unselect all', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item = this.$el.find('table th .select-all');
      $item[0].checked = true;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('16');
      $item[0].checked = false;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');
    });

    it('test current folder buttons do not show on root', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      expect(this.$el.find('.context-buttons').length).to.equal(0);
    });

    it('test current folder buttons do show on subfolder', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item = this.$el.find('.itemRow').eq(0);
      $('.title a', $item).trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.context-buttons').length).to.equal(1);
    });

    it('test select current folder', function() {
      registry.scan(this.$el);
      var pattern = this.$el.data('patternStructure');
      this.clock.tick(1000);
      var $item = this.$el.find('.itemRow').eq(0);
      $('.title a', $item).trigger('click');
      this.clock.tick(1000);
      var $checkbox = $('.fc-breadcrumbs-container input[type="checkbox"]', this.$el);
      $checkbox[0].checked = true;
      $checkbox.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('1');
    });

    it('test select displayed columns', function() {
      registry.scan(this.$el);
      this.clock.tick(500);
      var $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(6);
      expect($row.find('th').eq(1).text()).to.equal('Title');
      expect($row.find('th').eq(2).text()).to.equal('Last modified');
      expect($row.find('th').eq(3).text()).to.equal('Published');
      expect($row.find('th').eq(4).text()).to.equal('Review state');
      expect($row.find('th').eq(5).text()).to.equal('Actions');

      expect($.cookie('_fc_activeColumns')).to.be(undefined);

      this.$el.find('#btn-attribute-columns').trigger('click');
      this.clock.tick(500);

      var $checkbox = this.$el.find(
          '.attribute-columns input[value="getObjSize"]');
      $checkbox[0].checked = true;
      $checkbox.trigger('change');
      this.clock.tick(500);

      var $popover = this.$el.find('.popover.attribute-columns');
      expect($popover.find('button').text()).to.equal('Save');
      $popover.find('button').trigger('click');
      this.clock.tick(500);

      $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(7);
      expect($row.find('th').eq(5).text()).to.equal('Object Size');
      expect($row.find('th').eq(6).text()).to.equal('Actions');
      expect($.parseJSON($.cookie('_fc_activeColumns')).value).to.eql(
          ["ModificationDate", "EffectiveDate", "review_state", "getObjSize"]);

      $checkbox[0].checked = false;
      $checkbox.trigger('change');
      $popover.find('button').trigger('click');
      this.clock.tick(500);

      $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(6);
      expect($.parseJSON($.cookie('_fc_activeColumns')).value).to.eql(
          ["ModificationDate", "EffectiveDate", "review_state"]);

    });

    it('test main buttons count', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var buttons = this.$el.find('#btngroup-mainbuttons a');
      expect(buttons.length).to.equal(8);
    });

  });

  /* ==========================
   TEST: Structure Customized
  ========================== */
  describe('Structure Customized', function() {
    beforeEach(function() {
      // clear cookie setting
      $.removeCookie('_fc_perPage');

      var structure = {
        "vocabularyUrl": "/data.json",
        "indexOptionsUrl": "/tests/json/queryStringCriteria.json",
        "contextInfoUrl": "{path}/contextInfo",
        "activeColumnsCookie": "activeColumnsCustom",
        "buttons": [{
          "url": "foo",
          "title": "Foo",
          "id": "foo",
          "icon": ""
        }]
      };

      this.$el = $('<div class="pat-structure"></div>').attr(
        'data-pat-structure', JSON.stringify(structure)).appendTo('body');

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith('GET', /data.json/, function (xhr, id) {
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var start = 0;
        var end = 15;
        if (batch) {
          start = (batch.page - 1) * batch.size;
          end = start + batch.size;
        }
        var items = [];

        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          total: 0,
          results: items
        }));
      });
      this.server.respondWith('GET', /contextInfo/, function (xhr, id) {
        var data = {
          addButtons: []
        };
        if (xhr.url.indexOf('folder') !== -1){
          data.object = {
            UID: '123sdfasdfFolder',
            getURL: 'http://localhost:8081/folder',
            path: '/folder',
            portal_type: 'Folder',
            Description: 'folder',
            Title: 'Folder',
            'review_state': 'published',
            'is_folderish': true,
            Subject: [],
            id: 'folder'
          };
        }
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
      });

      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.server.restore();
      this.clock.restore();
      $('body').html('');
    });

    it('initialize', function() {
      registry.scan(this.$el);
      expect(this.$el.find('.order-support > table').size()).to.equal(1);
    });

    it('per page', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      this.$el.find('.serverhowmany15 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(0);
      this.$el.find('.serverhowmany30 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(0);
    });

    it('test select all', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item = this.$el.find('table th .select-all');
      $item[0].checked = true;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');

    });

    it('test unselect all', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $item = this.$el.find('table th .select-all');
      $item[0].checked = true;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');
      $item[0].checked = false;
      $item.trigger('change');
      this.clock.tick(1000);
      expect(this.$el.find('#btn-selected-items').html()).to.contain('0');
    });

    it('test select displayed columns', function() {
      registry.scan(this.$el);
      // manually setting a borrowed cookie from the previous test.
      $.cookie('_fc_activeColumns',
               '{"value":["ModificationDate","EffectiveDate","review_state",' +
               '"getObjSize"]}');
      this.clock.tick(500);
      var $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(6);
      expect($row.find('th').eq(5).text()).to.equal('Actions');

      expect($.cookie('_fc_activeColumnsCustom')).to.be(undefined);

      this.$el.find('#btn-attribute-columns').trigger('click');
      this.clock.tick(500);

      var $checkbox = this.$el.find(
          '.attribute-columns input[value="portal_type"]');
      $checkbox[0].checked = true;
      $checkbox.trigger('change');
      this.clock.tick(500);

      var $popover = this.$el.find('.popover.attribute-columns');
      expect($popover.find('button').text()).to.equal('Save');
      $popover.find('button').trigger('click');
      this.clock.tick(500);

      $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(7);
      expect($row.find('th').eq(5).text()).to.equal('Type');
      expect($row.find('th').eq(6).text()).to.equal('Actions');
      expect($.parseJSON($.cookie('_fc_activeColumnsCustom')).value).to.eql(
          ["ModificationDate", "EffectiveDate", "review_state", "portal_type"]);
      // standard cookie unchanged.
      expect($.parseJSON($.cookie('_fc_activeColumns')).value).to.eql(
          ["ModificationDate", "EffectiveDate", "review_state", "getObjSize"]);

      $checkbox[0].checked = false;
      $checkbox.trigger('change');
      $popover.find('button').trigger('click');
      this.clock.tick(500);

      $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(6);
      expect($.parseJSON($.cookie('_fc_activeColumnsCustom')).value).to.eql(
          ["ModificationDate", "EffectiveDate", "review_state"]);

    });

    it('test main buttons count', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var buttons = this.$el.find('#btngroup-mainbuttons a');
      expect(buttons.length).to.equal(1);
    });

  });


  /* ==========================
   TEST: Structure no buttons
  ========================== */
  describe('Structure no buttons', function() {
    beforeEach(function() {
      // clear cookie setting
      $.removeCookie('_fc_perPage');
      $.removeCookie('_fc_activeColumnsCustom');

      var structure = {
        "vocabularyUrl": "/data.json",
        "indexOptionsUrl": "/tests/json/queryStringCriteria.json",
        "contextInfoUrl": "{path}/contextInfo",
        "activeColumnsCookie": "activeColumnsCustom",
        "activeColumns": ["getObjSize"],
        "availableColumns": {
          "id": "ID",
          "CreationDate": "Created",
          "getObjSize": "Object Size"
        },
        "buttons": []
      };

      this.$el = $('<div class="pat-structure"></div>').attr(
        'data-pat-structure', JSON.stringify(structure)).appendTo('body');

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith('GET', /data.json/, function (xhr, id) {
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var start = 0;
        var end = 15;
        if (batch) {
          start = (batch.page - 1) * batch.size;
          end = start + batch.size;
        }
        var items = [];

        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          total: 0,
          results: items
        }));
      });
      this.server.respondWith('GET', /contextInfo/, function (xhr, id) {
        var data = {
          addButtons: []
        };
        if (xhr.url.indexOf('folder') !== -1){
          data.object = {
            UID: '123sdfasdfFolder',
            getURL: 'http://localhost:8081/folder',
            path: '/folder',
            portal_type: 'Folder',
            Description: 'folder',
            Title: 'Folder',
            'review_state': 'published',
            'is_folderish': true,
            Subject: [],
            id: 'folder'
          };
        }
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
      });

      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.server.restore();
      this.clock.restore();
      $('body').html('');
    });

    it('test main buttons count', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var buttons = this.$el.find('#btngroup-mainbuttons a');
      expect(buttons.length).to.equal(0);
    });

    it('test select displayed columns', function() {
      registry.scan(this.$el);
      this.clock.tick(500);
      var $row = this.$el.find('table thead tr').eq(1);
      expect($row.find('th').length).to.equal(4);
      expect($row.find('th').eq(1).text()).to.equal('Title');
      expect($row.find('th').eq(2).text()).to.equal('Object Size');
      expect($row.find('th').eq(3).text()).to.equal('Actions');
    });

  });


  /* ==========================
   TEST: Structure barebone columns
  ========================== */
  describe('Structure barebone columns', function() {
    beforeEach(function() {
      // clear cookie setting
      $.removeCookie('_fc_perPage');
      $.removeCookie('_fc_activeColumnsCustom');

      var structure = {
        "vocabularyUrl": "/data.json",
        "indexOptionsUrl": "/tests/json/queryStringCriteria.json",
        "contextInfoUrl": "{path}/contextInfo",
        "activeColumnsCookie": "activeColumnsCustom",
        "activeColumns": [],
        "availableColumns": {
          "getURL": "URL",
        },
        "buttons": [],
        "attributes": [
          'Title', 'getURL'
        ]
      };

      this.$el = $('<div class="pat-structure"></div>').attr(
        'data-pat-structure', JSON.stringify(structure)).appendTo('body');

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith('GET', /data.json/, function (xhr, id) {
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var start = 0;
        var end = 15;
        if (batch) {
          start = (batch.page - 1) * batch.size;
          end = start + batch.size;
        }
        var items = [];
        items.push({
          /*
          getURL: 'http://localhost:8081/folder',
          Title: 'Folder',
          id: 'folder'
          */
          // 'portal_type', 'review_state', 'getURL'

          getURL: 'http://localhost:8081/folder',
          Title: 'Folder',
        });
        for (var i = start; i < end; i = i + 1) {
          items.push({
            /*
            getURL: 'http://localhost:8081/item' + i,
            Title: 'Document ' + i,
            id: 'item' + i
            */

            getURL: 'http://localhost:8081/item' + i,
            Title: 'Document ' + i,
          });
        }

        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
          total: 100,
          results: items
        }));
      });
      this.server.respondWith('GET', /contextInfo/, function (xhr, id) {
        var data = {
          addButtons: []
        };
        if (xhr.url.indexOf('folder') !== -1){
          data.object = {
            UID: '123sdfasdfFolder',
            getURL: 'http://localhost:8081/folder',
            path: '/folder',
            portal_type: 'Folder',
            Description: 'folder',
            Title: 'Folder',
            'review_state': 'published',
            'is_folderish': true,
            Subject: [],
            id: 'folder'
          };
        }
        xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(data));
      });

      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.server.restore();
      this.clock.restore();
      $('body').html('');
    });

    it('per page', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      this.$el.find('.serverhowmany15 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(16);
      this.$el.find('.serverhowmany30 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(31);
    });

  });


});
