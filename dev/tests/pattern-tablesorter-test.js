define([
  'expect',
  'jquery',
  'pat-registry',
  'mockup-patterns-tablesorter'
], function(expect, $, registry, Tablesorter) {
  'use strict';

  window.mocha.setup('bdd');
  $.fx.off = true;

/* ==========================
   TEST: TableSorter
  ========================== */

  describe('TableSorter', function () {
    beforeEach(function() {
      this.$el = $ ('' +
        '<table class="pat-tablesorter">' +
        '   <thead>' +
        '     <tr>' +
        '       <th>First Name</th>' +
        '       <th>Last Name</th>' +
        '       <th>Number</th>' +
        '     </tr>' +
        '   </thead>' +
        '   <tbody>' +
        '     <tr>' +
        '       <td>AAA</td>' +
        '       <td>ZZZ</td>' +
        '       <td>3</td>' +
        '     </tr>' +
        '     <tr>' +
        '       <td>BBB</td>' +
        '       <td>YYY</td>' +
        '       <td>1</td>' +
        '     </tr>' +
        '     <tr>' +
        '       <td>CCC</td>' +
        '       <td>XXX</td>' +
        '       <td>2</td>' +
        '     </tr>' +
        '   </tbody>' +
        ' </table>');
    });
    it('test headers have the sort arrow', function() {
      registry.scan(this.$el);
      expect(this.$el.find('.sortdirection').size()).to.equal(3);
    });
    it('test sort by second column', function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(1).trigger('click');

      var shouldBe = ['CCC', 'BBB', 'AAA'];
      var elem;
      for (var i = 0; i < shouldBe.length; i += 1) {
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i * 3);
        expect(elem.text()).to.equal(shouldBe[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(1).hasClass('odd')).to.be.equal(false);
      expect(trs.eq(2).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(0).hasClass('even')).to.be.equal(false);
      expect(trs.eq(1).hasClass('even')).to.be.equal(true);
      expect(trs.eq(2).hasClass('even')).to.be.equal(false);

    });
    it('test sort by third column', function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger('click');

      var shouldBe = ['BBB', 'CCC', 'AAA'];
      var elem;
      for (var i = 0; i < shouldBe.length; i += 1) {
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i * 3);
        expect(elem.text()).to.equal(shouldBe[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(1).hasClass('odd')).to.be.equal(false);
      expect(trs.eq(2).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(0).hasClass('even')).to.be.equal(false);
      expect(trs.eq(1).hasClass('even')).to.be.equal(true);
      expect(trs.eq(2).hasClass('even')).to.be.equal(false);

    });
    it('test several sorts and finally back to first column', function() {
      registry.scan(this.$el);
      this.$el.find('thead th').eq(2).trigger('click');
      this.$el.find('thead th').eq(3).trigger('click');
      this.$el.find('thead th').eq(2).trigger('click');
      this.$el.find('thead th').eq(1).trigger('click');
      this.$el.find('thead th').eq(3).trigger('click');
      this.$el.find('thead th').eq(1).trigger('click');

      var shouldBe = ['AAA', 'BBB', 'CCC'];
      var elem;
      for (var i = 0; i < shouldBe.length; i += 1) {
        // We are checking first td of each tr of tbody, just to see the
        // order
        elem = this.$el.find('tbody tr td').eq(i * 3);
        expect(elem.text()).to.equal(shouldBe[i]);
      }

      var trs = this.$el.find('tbody tr');
      expect(trs.eq(0).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(1).hasClass('odd')).to.be.equal(false);
      expect(trs.eq(2).hasClass('odd')).to.be.equal(true);
      expect(trs.eq(0).hasClass('even')).to.be.equal(false);
      expect(trs.eq(1).hasClass('even')).to.be.equal(true);
      expect(trs.eq(2).hasClass('even')).to.be.equal(false);

    });
  });
});
