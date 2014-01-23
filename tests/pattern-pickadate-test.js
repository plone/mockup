define([
  'expect',
  'jquery',
  'mockup-registry',
  'mockup-patterns-pickadate'
], function(expect, $, registry, PickADate) {
  "use strict";

  window.mocha.setup('bdd');
  $.fx.off = true;

  /* ==========================
   TEST: PickADate
  ========================== */

  describe("PickADate", function() {

    beforeEach(function() {
      this.$el = $('<div><input class="pat-pickadate" /></div>');
    });

    it('date and time element', function() {
      var self = this;

      // pickadate is not initialized
      expect($('.pattern-pickadate-wrapper', self.$el).size()).to.equal(0);

      // scan dom for patterns
      registry.scan(self.$el);

      // pickadate is initialized
      expect($('.pattern-pickadate-wrapper', this.$el).size()).to.equal(1);

      var dateWrapper = $('.pattern-pickadate-date', self.$el).parent(),
          timeWrapper = $('.pattern-pickadate-time', self.$el).parent();

      // main element is hidden
      expect(self.$el.is(':hidden')).to.be.equal(true);

      // date and time inputs are there by default
      expect($('.pattern-pickadate-date', self.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-time', self.$el).size()).to.equal(1);

      // no value on main element
      expect(self.$el.val()).to.be.equal('');

      // no picker is open
      expect(dateWrapper.find('.picker--opened').size()).to.be.equal(0);
      expect(timeWrapper.find('.picker--opened').size()).to.be.equal(0);

      // we open date picker (calendar)
      $('.pattern-pickadate-date', self.$el).click();

      // date picker should be opened but not time picker
      expect(dateWrapper.find('.picker--opened').size()).to.be.equal(1);
      expect(timeWrapper.find('.picker--opened').size()).to.be.equal(0);

      // select some date
      var $selectedDate = dateWrapper.find('td > div').first().click();

      // selected date should be saved on date picker element
      expect($('.pattern-pickadate-date', self.$el).attr('data-value')).to.be.equal($selectedDate.attr('data-pick'));

      // since time is not selected we still dont expect main element to have
      // value
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');

      // we open time picker
      $('.pattern-pickadate-time', self.$el).click();

      // time picker should be opened but not date picker
      expect(dateWrapper.find('.picker--opened').size()).to.be.equal(0);
      expect(timeWrapper.find('.picker--opened').size()).to.be.equal(1);

      // select some time
      var $selectedTime = timeWrapper.find('li').first().next().click();

      // selected time should be saved on time picker element
      expect($('.pattern-pickadate-time', self.$el).attr('data-value')).to.be.equal($selectedTime.attr('data-pick'));

      // main element should now have value
      expect($('.pat-pickadate', self.$el).val()).to.not.equal('');

      // clearing time ...
      $('.picker__button--clear', timeWrapper).click();

      // ... should remove value from main element
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');

      // select time again
      $selectedTime = timeWrapper.find('li').first().next().click();

      // main element should now have again value
      expect($('.pat-pickadate', self.$el).val()).to.not.equal('');

      // clearing date ...
      $('.pattern-pickadate-date', self.$el).click();
      $('.pattern-pickadate-date', self.$el).click();
      $('.picker__button--clear', dateWrapper).click();

      // ... should also remove value from main element
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');

      // selecting time again ...
      $selectedTime = timeWrapper.find('li').first().next().click();

      // ... should still keep main element value empty since date picker is
      // cleared
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');

    });

    it('date and time element have custom separator', function() {
      var self = this;

      $('.pat-pickadate', self.$el).attr('data-pat-pickadate', 'separator:===');

      // scan dom for patterns
      registry.scan(self.$el);

      expect($('.pattern-pickadate-separator', self.$el).text()).to.be.equal('===');
    });

    it('date and time picker except custom setttings', function() {
      var self = this;

      // custom settings for date and time widget
      $('.pat-pickadate', self.$el).attr(
        'data-pat-pickadate',
        JSON.stringify({
          date: {
            selectYears: false,
            selectMonths: false
          },
          time: {
            interval: 60
          }
        })
      );

      // scan dom for patterns
      registry.scan(self.$el);

      // there are not dropdowns to select year or month
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--year').size()).to.be.equal(0);
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--month').size()).to.be.equal(0);

      // there should be 25 items in time picker list. 24 for each hour and one
      // to for clear button
      expect($('.pattern-pickadate-time', self.$el).parent().find('li').size()).to.be.equal(25);
    });

    it('only date element', function() {
      var self = this;

      // add option which disables time picker
      $('.pat-pickadate', self.$el).attr('data-pat-pickadate', 'time:false');

      // pickadate is not initialized
      expect($('.pattern-pickadate-wrapper', self.$el).size()).to.equal(0);

      // scan dom for patterns
      registry.scan(self.$el);

      // pickadate is initialized
      expect($('.pattern-pickadate-wrapper', self.$el).size()).to.equal(1);

      var dateWrapper = $('.pattern-pickadate-date', self.$el).parent();

      // main element is hidden
      expect(self.$el.is(':hidden')).to.be.equal(true);

      // date input is there by default
      expect($('.pattern-pickadate-date', self.$el).size()).to.equal(1);
      expect($('.pattern-pickadate-time', self.$el).size()).to.equal(0);

      // no value on main element
      expect(self.$el.val()).to.be.equal('');

      // date picker is not open
      expect(dateWrapper.find('.picker--opened').size()).to.be.equal(0);

      // we open date picker (calendar)
      $('.pattern-pickadate-date', self.$el).click();

      // date picker should be opened
      expect(dateWrapper.find('.picker--opened').size()).to.be.equal(1);

      // select some date
      var $selectedDate = dateWrapper.find('td > div').first().click();

      // selected date should be saved on date picker element
      expect($('.pattern-pickadate-date', self.$el).attr('data-value')).to.be.equal($selectedDate.attr('data-pick'));

      // and also on main element since time element is disabled
      expect($('.pat-pickadate', self.$el).val()).to.not.equal('');

      // clearing date ...
      $('.pattern-pickadate-date', self.$el).click();
      $('.pattern-pickadate-date', self.$el).click();
      $('.picker__button--clear', dateWrapper).click();

      // ... should also remove value from main element
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');
    });

    it('only time element', function() {
      var self = this;

      // add option which disables date picker
      $('.pat-pickadate', self.$el).attr('data-pat-pickadate', 'date:false');

      // pickadate is not initialized
      expect($('.pattern-pickadate-wrapper', self.$el).size()).to.equal(0);

      // scan dom for patterns
      registry.scan(self.$el);

      // pickadate is initialized
      expect($('.pattern-pickadate-wrapper', self.$el).size()).to.equal(1);

      var timeWrapper = $('.pattern-pickadate-time', self.$el).parent();

      // main element is hidden
      expect(self.$el.is(':hidden')).to.be.equal(true);

      // time input is there by default
      expect($('.pattern-pickadate-date', self.$el).size()).to.equal(0);
      expect($('.pattern-pickadate-time', self.$el).size()).to.equal(1);

      // no value on main element
      expect(self.$el.val()).to.be.equal('');

      // time picker is not open
      expect(timeWrapper.find('.picker--opened').size()).to.be.equal(0);

      // we open time picker (calendar)
      $('.pattern-pickadate-time', self.$el).click();

      // time picker should be opened
      expect(timeWrapper.find('.picker--opened').size()).to.be.equal(1);

      // select some time
      var $selectedTime = timeWrapper.find('li').first().next().click();

      // selected date should be saved on date picker element
      expect($('.pattern-pickadate-time', self.$el).attr('data-value')).to.be.equal($selectedTime.attr('data-pick'));

      // and also on main element since time element is disabled
      expect($('.pat-pickadate', self.$el).val()).to.not.equal('');

      // clearing date ...
      $('.picker__button--clear', timeWrapper).click();

      // ... should also remove value from main element
      expect($('.pat-pickadate', self.$el).val()).to.be.equal('');
    });

    it('populating date and time picker', function() {
      var self = this;

      // custom settings for date and time widget
      $('.pat-pickadate', self.$el).attr('value', '2001-10-10 10:10');

      // scan dom for patterns
      registry.scan(self.$el);

      // date picker value is parsed correctly from main element ...
      expect($('.pattern-pickadate-date', self.$el).attr('data-value')).to.be.equal('2001-10-10');

      // ... and make sure 2001-10-10 is picked in the date picker calendar
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--year > :selected').val()).to.be.equal('2001');
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--month > :selected').val()).to.be.equal('9');
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__day--selected').text()).to.be.equal('10');

      // time picker value is parsed correctly from main element
      expect($('.pattern-pickadate-time', self.$el).attr('data-value')).to.be.equal('10:10');

      // and make sure 10:00 AM is picked in the time picker list
      expect($('.pattern-pickadate-time', self.$el).parent().find('.picker__list-item--selected').attr('data-pick')).to.be.equal('630');

    });

    it('populating only time picker', function() {
      var self = this;

      // custom settings for date and time widget
      $('.pat-pickadate', self.$el)
        .attr('value', '15:10')
        .attr('data-pat-pickadate', 'date:false');

      // scan dom for patterns
      registry.scan(self.$el);

      // time picker value is parsed correctly from main element
      expect($('.pattern-pickadate-time', self.$el).attr('data-value')).to.be.equal('15:10');

      // and make sure 10:00 AM is picked in the time picker list
      expect($('.pattern-pickadate-time', self.$el).parent().find('.picker__list-item--selected').attr('data-pick')).to.be.equal('930');

    });

    it('populating only date picker', function() {
      var self = this;

      // custom settings for date and time widget
      $('.pat-pickadate', self.$el)
        .attr('value', '1801-12-30')
        .attr('data-pat-pickadate', 'time:false');

      // scan dom for patterns
      registry.scan(self.$el);

      // date picker value is parsed correctly from main element ...
      expect($('.pattern-pickadate-date', self.$el).attr('data-value')).to.be.equal('1801-12-30');

      // ... and make sure 1801-12-30 is picked in the date picker calendar
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--year > :selected').val()).to.be.equal('1801');
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__select--month > :selected').val()).to.be.equal('11');
      expect($('.pattern-pickadate-date', self.$el).parent().find('.picker__day--selected').text()).to.be.equal('30');

    });

    it('getting around bug in pickatime when selecting 00:00', function() {
      var self = this;

      // custom settings for time widget
      $('.pat-pickadate', self.$el)
        .attr('value', '00:00')
        .attr('data-pat-pickadate', 'date:false');

      registry.scan(self.$el);

      // time picker value is parsed correctly from main element
      expect($('.pattern-pickadate-time', self.$el).attr('data-value')).to.be.equal('00:00');

      // and make sure 10:00 AM is picked in the time picker list
      expect($('.pattern-pickadate-time', self.$el).parent().find('.picker__list-item--selected').attr('data-pick')).to.be.equal('0');

    });
  });

});
