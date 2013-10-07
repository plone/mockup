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
  'mockup-patterns-modal'
], function(chai, $, sinon, registry, Modal) {
  "use strict";

  var expect = chai.expect,
      mocha = window.mocha;

  mocha.setup('bdd');
  $.fx.off = true;

  var server = sinon.fakeServer.create();
  server.autoRespond = true;
  server.autoRespondAfter = 1;
  server.respondWith("patterns-modal-load-via-ajax", function (xhr, id) {
    xhr.respond(200, { "Content-Type": "text/html" }, '' +
      '<html><body>' +
      '<div id="content">Exampel</div>' +
      '</body></html>');
  });

  /* ==========================
   TEST: Modal
  ========================== */

  describe("Modal", function() {
    beforeEach(function(){
      this.server = sinon.fakeServer.create();
      this.server.autoRespond = true;
      this.server.respondWith(/patterns-modal-load-via-ajax/, function (xhr, id) {
        xhr.respond(200, { "Content-Type": "text/html" }, '' +
          '<html><body>' +
          '<div id="content">Exampel</div>' +
          '</body></html>');
      });
    });
    afterEach(function() {
      $('body').empty();
      this.server.restore();
    });

    it("default behaviour", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-pat-modal="backdrop: #body">Open</a>' +
        ' <div id="target" style="display:none;">Target</div>' +
        '</div>').appendTo('body');

      registry.scan($el);

      expect($('.backdrop', $el).is(':hidden')).to.be.equal(true);
      expect($el.hasClass('backdrop-active')).to.be.equal(false);
      expect($('.modal-wrapper', $el).is(':hidden')).to.be.equal(true);
      expect($('.modal', $el).size()).to.equal(0);

      $('a.pat-modal', $el).click();

      expect($('.backdrop', $el).is(':visible')).to.be.equal(true);
      expect($el.hasClass('backdrop-active')).to.be.equal(true);
      expect($('.modal-wrapper', $el).is(':visible')).to.be.equal(true);
      expect($('.modal', $el).size()).to.equal(1);
      expect($('.modal .modal-header', $el).size()).to.equal(1);
      expect($('.modal .modal-body', $el).size()).to.equal(1);
      expect($('.modal .modal-footer', $el).size()).to.equal(1);

      var keydown = $.Event("keydown");
      keydown.keyCode = 27;
      $(document).trigger(keydown);
      expect($el.hasClass('backdrop-active')).to.be.equal(false);
      expect($('.modal', $el).size()).to.equal(0);

      $el.remove();
    });
    it("customize modal on show event", function() {
      var $el = $('' +
        '<div id="body">' +
        ' <a class="pat-modal" href="#target"' +
        '    data-pat-modal="backdrop: #body">Open</a>' +
        ' <div id="target">Target</div>' +
        '</div>').appendTo('body');

      $('a', $el)
        .patternModal()
        .on('show.modal.patterns', function(e, target_modal) {
            $('.modal-header', target_modal.$modal).prepend($('<h3>New Title</h3>'));
          })
        .click();
      expect($('.modal .modal-header h3', $el).text()).to.equal('New Title');

      $el.remove();
    });
    it("load modal content via ajax", function(done) {
      $('<a class="pat-modal" />')
        .patternModal()
        .on('show.modal.patterns', function(e, modal){
          expect(true).to.be.equal(true);
          done();
      }).click();
    });
    it("redirects to base urls", function(done){
      $('<a class="pat-modal" />')
        .patternModal()
        .on('show.modal.patterns', function(e, modal){
          expect(modal.defaults.actionOptions.redirectToUrl('ignore',
              '<html><head><base href="testurl"></base></head></html>')).to.equal('testurl');
          expect(modal.defaults.actionOptions.redirectToUrl('ignore',
              '<html><head><base href="testurl" /></head></html>')).to.equal('testurl');
          done();
      }).click();
    });

    describe("modal positioning (findPosition) ", function() {
      //
      // -- CHANGE POSITION ONLY ----------------------------------------------
      //
      it('position: center middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos.top).to.equal('10px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos.left).to.equal('30px');
        }).click();
      });
      it('position: left middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos.top).to.equal('10px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: right middle, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 0 = 150 - 140 = 10
          expect(pos.top).to.equal('10px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos.left).to.equal('30px');
        }).click();
      });
      it('position: center bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 0 = 200 - 170 = 30
          expect(pos.left).to.equal('30px');
        }).click();
      });
      it('position: left top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: left bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: right top, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 0, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 0, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 0, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });

      //
      // -- NON-ZERO MARGIN ---------------------------------------------------
      //
      it('position: center middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
          expect(pos.top).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos.left).to.equal('25px');
        }).click();
      });
      it('position: left middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 = 5
          expect(pos.top).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('5px');
        }).click();
      });
      it('position: right middle, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          // half wrapper height - half modal height - margin
          // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
          expect(pos.top).to.equal('5px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('5px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos.left).to.equal('25px');
        }).click();
      });
      it('position: center bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('5px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          // half wrapper width - half modal width - margin
          // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
          expect(pos.left).to.equal('25px');
        }).click();
      });
      it('position: left top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('5px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('5px');
        }).click();
      });
      it('position: left bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('5px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('5px');
        }).click();
      });
      it('position: right top, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal =  target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 5, 340, 280, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('5px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('5px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 5, modal: 340x280, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 5, 340, 280, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('5px');
          expect(pos.top).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('5px');
          expect(pos.left).to.equal('auto');
        }).click();
      });

      //
      // -- WRAPPER SMALLER THAN MODAL ----------------------------------------
      //
      it('position: center middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: left middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: right middle, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'middle', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: center top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: center bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('center', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: left top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: left bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('left', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).not.to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.left).to.equal('0px');
        }).click();
      });
      it('position: right top, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'top', 0, 450, 350, 400, 300);
          expect(pos).not.to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.top).to.equal('0px');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
      it('position: right bottom, margin: 0, modal: 450x350, wrapper: 400x300', function() {
        $('a', this.$el).patternModal().on('show.modal.patterns', function(e, target_modal) {
          var modal = target_modal.$modal.data('patternModal');
          var pos = modal.findPosition('right', 'bottom', 0, 450, 350, 400, 300);
          expect(pos).to.have.property('bottom');
          expect(pos).to.have.property('top');
          expect(pos.bottom).to.equal('0px');
          expect(pos.top).to.equal('auto');

          expect(pos).to.have.property('right');
          expect(pos).to.have.property('left');
          expect(pos.right).to.equal('0px');
          expect(pos.left).to.equal('auto');
        }).click();
      });
    });
  });

});
