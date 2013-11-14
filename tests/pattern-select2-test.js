// tests for Base
//
// @author Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

define([
  'chai',
  'jquery',
  'sinon',
  'mockup-registry',
  'mockup-patterns-select2'
], function(chai, $, sinon, registry, Select2) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

   /* ==========================
   TEST: Select2
  ========================== */

  describe("Select2", function() {
    beforeEach(function(){
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;

      this.server.respondWith("GET", /select2-ajax\.json/, function (xhr, id) {
        var items = [
          {id: 'red', text: 'Red'},
          {id: 'blue', text: 'Blue'},
          {id: 'yellow', text: 'Yellow'}
        ];

        xhr.respond(200, {"Content-Type": "application/json"}, JSON.stringify({
          total: items.length,
          results: items
        }));

      });

    });

    afterEach(function() {
      $('body').empty();
      this.server.restore();
    });

    it('tagging', function() {
      var $el = $('' +
        '<div>' +
        ' <input class="pat-select2" data-pat-select2="tags: Red,Yellow,Blue"' +
        '        value="Yellow" />' +
        '</div>');
      expect($('.select2-choices', $el).size()).to.equal(0);
      registry.scan($el);
      expect($('.select2-choices', $el).size()).to.equal(1);
      expect($('.select2-choices li', $el).size()).to.equal(2);
    });

    it('init value map/tags from JSON string', function() {
        var $el = $('<input class="pat-select2" value="Red" />').appendTo('body');
        $el.patternSelect2({tags: '["Red", "Yellow"]',
                            initialValues: '{"Red": "RedTEXT", "Yellow": "YellowTEXT"}'
        });
        var $choices = $('.select2-choices li');
        expect($choices.size()).to.equal(2);
    });

    it('init value map from string', function() {
        var $el = $('<input class="pat-select2" value="Red" />').appendTo('body');
        $el.patternSelect2({tags: '["Red", "Yellow"]',
                            initialValues: 'Yellow: YellowTEXT, Red: RedTEXT'
        });
        var $choices = $('.select2-choices li');
        expect($choices.size()).to.equal(2);
        var $red_choice = $choices.eq(0);
        expect($red_choice.find('div').text()).to.equal('RedTEXT');
    });

    it('init value map', function() {
        var $el = $(
        '<div>' +
        ' <input class="pat-select2"' +
        '        data-pat-select2="{' +
        '          &quot;tags&quot;: &quot;Red,Yellow,Blue&quot;,' +
        '          &quot;initialValues&quot;: {' +
        '            &quot;Yellow&quot;: &quot;YellowTEXT&quot;,' +
        '            &quot;Red&quot;: &quot;RedTEXT&quot;' +
        '          }' +
        '        }"' +
        '        value="Yellow,Red"/>' +
        '</div>');

        registry.scan($el);
        expect($('.select2-choices li', $el).size()).to.equal(3);
    });

    it('ajax vocabulary url configuration', function() {
        var $el = $(
        ' <input class="pat-select2"' +
        '        data-pat-select2="vocabularyUrl: select2-users-vocabulary"' +
        '        />'
        );

        registry.scan($el);
        var select2 = $el.data('pattern-select2');
        expect(select2.options.ajax.url).to.equal("select2-users-vocabulary");
    });

    it('displays the vocabulary when clicking an empty checkbox', function() {
        $('<input type="hidden" class="pat-select2"' +
          '    data-pat-select2="placeholder:Search for a Value;' +
          '                     vocabularyUrl: /select2-ajax.json;' +
          '                     width:20em" />'
        ).appendTo('body');
        var pattern = $('.pat-select2').patternSelect2();

        var $results = $('li.select2-result-selectable');
        expect($results.size()).to.equal(0);

        var clock = sinon.useFakeTimers();
        $('.select2-input').click();
        clock.tick(1000);

        $results = $('li.select2-result-selectable');
        expect($results.size()).to.equal(3);
        expect($results.first().hasClass('select2-highlighted')).to.be.equal(true);
        expect($results.first().text()).to.be.equal('Red');
    });

    it('prepends the query term to the selection', function() {
        $('<input type="hidden" class="pat-select2"' +
          '    data-pat-select2="placeholder:Search for a Value;' +
          '                     vocabularyUrl: /select2-ajax.json;' +
          '                     width:20em" />'
        ).appendTo('body');
        var pattern = $('.pat-select2').patternSelect2();

        var clock = sinon.useFakeTimers();
        var $input = $('.select2-input');
        $input.click().val('AAA');
        var keyup = $.Event('keyup-change');
        $input.trigger(keyup);
        clock.tick(1000);

        var $results = $('li.select2-result-selectable');
        expect($results.size()).to.equal(4);
        expect($results.first().hasClass('select2-highlighted')).to.be.equal(true);
        expect($results.first().text()).to.be.equal('AAA');
    });

    it('sets up orderable tags', function() {
        var $el = $(
        '<div>' +
        ' <input class="pat-select2"' +
        '        data-pat-select2="orderable: true; tags: Red,Yellow,Blue"' +
        '        value="Red"' +
        '        />' +
        '</div>'
        );

        registry.scan($el);
        expect($('.select2-container', $el).hasClass('select2-orderable')).to.be.equal(true);
    });

    it('handles orderable tag drag events', function() {
        var $el = $(
        '<div>' +
        ' <input class="pat-select2"' +
        '        data-pat-select2="orderable: true; tags: Red,Yellow,Blue"' +
        '        value="Yellow,Red"' +
        '        />' +
        '</div>'
        ).appendTo('body');
        var pattern = $('.pat-select2').patternSelect2();

        var $results = $('li.select2-search-choice');
        expect($results.size()).to.equal(2);
        expect($.trim($results.eq(0).text())).to.equal('Yellow');
        expect($.trim($results.eq(1).text())).to.equal('Red');

        var first_elem = $results.eq(0);
        var second_elem = $results.eq(1);
        // css class is set and proxy is created when starting to drag
        expect($('li.dragging').size()).to.equal(0);
        expect(first_elem.hasClass('select2-choice-dragging')).to.equal(false);

        first_elem.trigger($.Event('dragstart'));

        expect(first_elem.hasClass('select2-choice-dragging')).to.equal(true);
        var $proxy = $('li.dragging');
        expect($proxy.size()).to.equal(1);

        // css position is updated while dragging
        first_elem.trigger($.Event('drag'), {proxy: $proxy,
                                             drop: [],
                                             offsetX: 10,
                                             offsetY: 0
                                            });
        expect($proxy.css('top')).to.equal('0px');
        expect($proxy.css('left')).to.equal('10px');

        // css class is removed and proxy is deleted when dragging stops
        first_elem.trigger($.Event('dragend'), {proxy: $proxy});
        expect(first_elem.hasClass('select2-choice-dragging')).to.equal(false);
        expect($('li.dragging').size()).to.equal(0);
    });

    it('does not allow new items to be added', function() {
        $('<input type="hidden" class="pat-select2"' +
          '    data-pat-select2="tags: Red,Yellow,Blue;' +
          '                     allowNewItems: false;' +
          '                     width:20em" />'
        ).appendTo('body');
        var pattern = $('.pat-select2').patternSelect2();
        var clock = sinon.useFakeTimers();
        var $input = $('.select2-input');
        $input.click().val('AAA');
        var keyup = $.Event('keyup-change');
        $input.trigger(keyup);
        clock.tick(1000);

        var $results = $('li.select2-result-selectable');
        expect($results.size()).to.equal(0);

        var $no_results = $('li.select2-no-results');
        expect($no_results.size()).to.equal(1);
    });

    it('does not allow new items to be added when using ajax', function() {
        $('<input type="hidden" class="pat-select2"' +
          '    data-pat-select2="vocabularyUrl: /select2-ajax.json;' +
          '                     allowNewItems: false;' +
          '                     width:20em" />'
        ).appendTo('body');
        var pattern = $('.pat-select2').patternSelect2();
        var clock = sinon.useFakeTimers();
        var $input = $('.select2-input');
        $input.click().val('AAA');
        var keyup = $.Event('keyup-change');
        $input.trigger(keyup);
        clock.tick(1000);

        var $results = $('li.select2-result-selectable');
        expect($results.size()).to.equal(0);

        var $no_results = $('li.select2-no-results');
        expect($no_results.size()).to.equal(1);
    });

  });

});
