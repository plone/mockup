define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-structure',
  'sinon',
], function(expect, $, registry, Structure, sinon) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;

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


   /* ==========================
   TEST: Structure
  ========================== */
  describe("Structure", function() {
    beforeEach(function(){
      this.$el = $('' +
        '<div class="pat-structure" ' +
             'data-pat-structure="vocabularyUrl:/data.json;' +
                                 'uploadUrl:/upload;' +
                                 'moveUrl:/moveitem;' +
                                 'tagsVocabularyUrl:/select2-test.json;' +
                                 'usersVocabularyUrl:/tests/json/users.json;' +
                                 'indexOptionsUrl:/tests/json/queryStringCriteria.json;' +
                                 'contextInfoUrl:/tests/json/contextInfo.json;' +
                                 ' ">' +
        '</div>');

      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith("GET", /data.json/, function (xhr, id) {
        var batch = JSON.parse(getQueryVariable(xhr.url, 'batch'));
        var start = 0;
        var end = 15;
        if(batch){
          start = (batch.page-1) * batch.size;
          end = start + batch.size;
        }
        var items = [];
        for(var i=start; i<end; i++){
          items.push({
            "UID": "123sdfasdf" + i,
            "getURL": "http://localhost:8081/item" + i,
            "path": '/item' + i,
            "Type": "Page " + i, "Description": "page",
            "Title": "Page " + i,
            'review_state': 'published',
            'is_folderish': false,
            'Subject': [],
            'id': 'item' + i
          });
        }

        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
          total: 100,
          results: items
        }));
      });
      this.server.respondWith("POST", '/sort', function (xhr, id) {
        xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
          status: "success",
          msg: 'sorted'
        }));
      });
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function(){
      this.server.restore();
      this.clock.restore();
    });

    it('initialize', function() {
      registry.scan(this.$el);
      expect(this.$el.find('.order-support > table').size()).to.equal(1);
    });

    it('select item populates selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(500);
      var cb = this.$el.find('.itemRow td.selection input').eq(0);
      cb.trigger('click').trigger('change');
      expect(this.$el.find("#selected").html()).to.contain('1');
    });

    it('remove item from selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      this.$el.find('.itemRow td.selection input').eq(0).trigger('click').trigger('change');
      this.$el.find('.items.popover-content a.remove').trigger('click').trigger('change');
      expect(this.$el.find("#selected").html()).to.contain('0');
    });

    it('remove all from selection well', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      this.$el.find('.itemRow td.selection input').eq(0).trigger('click').trigger('change');
      this.$el.find('.itemRow td.selection input').eq(1).trigger('click').trigger('change');
      expect(this.$el.find("#selected").html()).to.contain('2');
      this.$el.find('.popover.selected a.remove-all').trigger('click');
      expect(this.$el.find("#selected").html()).to.contain('0');
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
      expect(this.$el.find('.itemRow').length).to.equal(15);
      this.$el.find('.serverhowmany30 a').trigger('click');
      this.clock.tick(1000);
      expect(this.$el.find('.itemRow').length).to.equal(30);
    });

    it('test sort button', function() {
      registry.scan(this.$el);
      this.clock.tick(1000);
      var $popover = this.$el.find('.popover.sort');
      this.$el.find('#sort').trigger('click');
      expect($popover.hasClass('active')).to.equal(true);
      $popover.find('button').trigger('click');
      this.clock.tick(1000);
      expect($popover.hasClass('active')).to.equal(false);
      expect(this.$el.find('.order-support .status').html()).to.contain('sorted');
    });

  });
});
