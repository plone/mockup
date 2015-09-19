/* PickADate pattern.
 *
 * Options:
 *    date(object): Date widget options described here. If false is selected date picker wont be shown. ({{selectYears: true, selectMonths: true })
 *    time(object): Time widget options described here. If false is selected time picker wont be shown. ({})
 *    separator(string): Separator between date and time if both are enabled.
 *    (' ')
 *    classClearName(string): Class name of element that is generated by pattern. ('pattern-pickadate-clear')
 *    classDateName(string): Class applied to date input. ('pattern-pickadate-date')
 *    classDateWrapperName(string): Class applied to extra wrapper div around date input. ('pattern-pickadate-date-wrapper')
 *    classSeparatorName(string): Class applied to separator. ('pattern-pickadate-separator')
 *    classTimeName(string): Class applied to time input. ('pattern-pickadate-time')
 *    classTimeWrapperName(string): Class applied to wrapper div around time input. ('pattern-pickadate-time-wrapper')
 *    classTimezoneName(string): Class applied to timezone input. ('pattern-pickadate-timezone')
 *    classTimezoneWrapperName(string): Class applied to wrapper div around timezone input. ('pattern-pickadate-timezone-wrapper')
 *    classWrapperName(string): Class name of element that is generated by pattern. ('pattern-pickadate-wrapper')
 *
 * Documentation:
 *    # Date and Time
 *
 *    {{ example-1 }}
 *
 *    # Date and Time with initial data
 *
 *    {{ example-2 }}
 *
 *    # Date
 *
 *    {{ example-3 }}
 *
 *    # Date with initial date
 *
 *    {{ example-4 }}
 *
 *    # Time
 *
 *    {{ example-5 }}
 *
 *    # Time with initial time
 *
 *    {{ example-6 }}
 *
 *    # Date and time with timezone
 *
 *    {{ example-7 }}
 *
 *    # Date and time with timezone and default value
 *
 *    {{ example-8 }}
 *
 *    # Date and time with one timezone
 *
 *    {{ example-9 }}
 *
 * Example: example-1
 *    <input class="pat-pickadate"/>
 *
 * Example: example-2
 *    <input class="pat-pickadate" value="2010-12-31 00:45" />
 *
 * Example: example-3
 *    <input class="pat-pickadate" data-pat-pickadate="time:false"/>
 *
 * Example: example-4
 *    <input class="pat-pickadate" value="2010-12-31" data-pat-pickadate="time:false"/>
 *
 * Example: example-5
 *    <input class="pat-pickadate" data-pat-pickadate="date:false"/>
 *
 * Example: example-6
 *    <input class="pat-pickadate" value="00:00" data-pat-pickadate="date:false"/>
 *
 * Example: example-7
 *    <input class="pat-pickadate" data-pat-pickadate='{"timezone": {"data": [{"id":"Europe/Berlin","text":"Europe/Berlin"},{"id":"Europe/Vienna","text":"Europe/Vienna"}]}}'/>
 *
 * Example: example-8
 *    <input class="pat-pickadate" data-pat-pickadate='{"timezone": {"default": "Europe/Vienna", "data": [{"id":"Europe/Berlin","text":"Europe/Berlin"},{"id":"Europe/Vienna","text":"Europe/Vienna"}]}}'/>
 *
 * Example: example-9
 *    <input class="pat-pickadate" data-pat-pickadate='{"timezone": {"data": [{"id":"Europe/Berlin","text":"Europe/Berlin"}]}}'/>
 *
 */


define([
  'jquery',
  'pat-base',
  'picker',
  'picker.date',
  'picker.time',
  'mockup-patterns-select2',
  'translate'
], function($, Base, Picker, PickerDate, PickerTime, Select2, _t) {
  'use strict';

  var PickADate = Base.extend({
    name: 'pickadate',
    trigger: '.pat-pickadate',
    parser: 'mockup',
    defaults: {
      separator: ' ',
      date: {
        selectYears: true,
        selectMonths: true,
        formatSubmit: 'yyyy-mm-dd',
        format: 'yyyy-mm-dd',
        clear: _t('Clear'),
        close: _t('Close'),
        today: _t('Today'),
        labelMonthNext: _t('Next month'),
        labelMonthPrev: _t('Previous month'),
        labelMonthSelect: _t('Select a month'),
        labelYearSelect: _t('Select a year')
      },
      time: {
      },
      timezone: null,
      classWrapperName: 'pattern-pickadate-wrapper',
      classSeparatorName: 'pattern-pickadate-separator',
      classDateName: 'pattern-pickadate-date',
      classDateWrapperName: 'pattern-pickadate-date-wrapper',
      classTimeName: 'pattern-pickadate-time',
      classTimeWrapperName: 'pattern-pickadate-time-wrapper',
      classTimezoneName: 'pattern-pickadate-timezone',
      classTimezoneWrapperName: 'pattern-pickadate-timezone-wrapper',
      classClearName: 'pattern-pickadate-clear',
      placeholderDate: _t('Enter date...'),
      placeholderTime: _t('Enter time...'),
      placeholderTimezone: _t('Enter timezone...')
    },
    isFalse: function(value) {
      if (typeof(value) === 'string' && value === 'false') {
        return false;
      }
      return value;
    },
    init: function() {
      var self = this,
          value = self.$el.val().split(' '),
          dateValue = value[0] || '',
          timeValue = value[1] || '';

      self.options.date = self.isFalse(self.options.date);
      self.options.time = self.isFalse(self.options.time);

      if (self.options.date === false) {
        timeValue = value[0];
      }

      self.$el.hide();

      self.$wrapper = $('<div/>')
            .addClass(self.options.classWrapperName)
            .insertAfter(self.$el);

      if (self.options.date !== false) {
        self.$date = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderDate)
              .attr('data-value', dateValue)
              .addClass(self.options.classDateName)
              .appendTo($('<div/>')
                  .addClass(self.options.classDateWrapperName)
                  .appendTo(self.$wrapper))
              .pickadate($.extend(true, {}, self.options.date, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$date.attr('data-value', e.select);
                    if (self.options.time === false ||
                        self.$time.attr('data-value') !== '') {
                      self.updateValue.call(self);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.val('');
                    self.$date.attr('data-value', '');
                  }
                }
              }));
      }

      if (self.options.date !== false && self.options.time !== false) {
        self.$separator = $('<span/>')
              .addClass(self.options.classSeparatorName)
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.time !== false) {
        self.options.time.formatSubmit = 'HH:i';
        self.$time = $('<input type="text"/>')
              .attr('placeholder', self.options.placeholderTime)
              .attr('data-value', timeValue)
              .addClass(self.options.classTimeName)
              .appendTo($('<div/>')
                  .addClass(self.options.classTimeWrapperName)
                  .appendTo(self.$wrapper))
              .pickatime($.extend(true, {}, self.options.time, {
                onSet: function(e) {
                  if (e.select !== undefined) {
                    self.$time.attr('data-value', e.select);
                    if (self.options.date === false ||
                        self.$date.attr('data-value') !== '') {
                      self.updateValue.call(self);
                    }
                  }
                  if (e.hasOwnProperty('clear')) {
                    self.$el.val('');
                    self.$time.attr('data-value', '');
                  }
                }
              }));

        // XXX: bug in pickatime
        // work around pickadate bug loading 00:xx as value
        if (typeof(timeValue) === 'string' && timeValue.substring(0,2) === '00') {
          self.$time.pickatime('picker').set('select', timeValue.split(':'));
          self.$time.attr('data-value', timeValue);
        }
      }

      if (self.options.date !== false && self.options.time !== false && self.options.timezone) {
        self.$separator = $('<span/>')
              .addClass(self.options.classSeparatorName)
              .html(self.options.separator === ' ' ? '&nbsp;'
                                                   : self.options.separator)
              .appendTo(self.$wrapper);
      }

      if (self.options.timezone !== null) {
        self.$timezone = $('<input type="text"/>')
            .addClass(self.options.classTimezoneName)
            .appendTo($('<div/>')
              .addClass(self.options.classTimezoneWrapperName)
              .appendTo(self.$wrapper))
          .patternSelect2($.extend(true,
          {
            'placeholder': self.options.placeholderTimezone,
            'width': '10em',
          },
          self.options.timezone,
          { 'multiple': false }))
          .on('change', function(e) {
            if (e.val !== undefined){
              self.$timezone.attr('data-value', e.val);
              if ((self.options.date === false || self.$date.attr('data-value') !== '') &&
                  (self.options.time === false || self.$time.attr('data-value') !== '')) {
                self.updateValue.call(self);
              }
            }
          });
        var defaultTimezone = self.options.timezone.default;
        // if timezone has a default value included
        if (defaultTimezone) {
          var isInList;
          // the timezone list contains the default value
          self.options.timezone.data.some(function(obj) {
            isInList = (obj.text === self.options.timezone.default) ? true : false;
            return isInList;
          });
          if (isInList) {
            self.$timezone.attr('data-value', defaultTimezone);
            self.$timezone.parent().find('.select2-chosen').text(defaultTimezone);
          }
        }
        // if data contains only one timezone this value will be chosen
        // and the timezone dropdown list will be disabled and
        if (self.options.timezone.data.length === 1) {
          self.$timezone.attr('data-value', self.options.timezone.data[0].text);
          self.$timezone.parent().find('.select2-chosen').text(self.options.timezone.data[0].text);
          self.$timezone.select2('enable', false);
        }
      }

      self.$clear = $('<div/>')
        .addClass(self.options.classClearName)
        .appendTo(self.$wrapper);

    },
    updateValue: function() {
      var self = this,
          value = '';

      if (self.options.date !== false) {
        var date = self.$date.data('pickadate').component,
            dateValue = self.$date.data('pickadate').get('select'),
            formatDate = date.formats.toString;
        if (dateValue) {
          value += formatDate.apply(date, [self.options.date.formatSubmit, dateValue]);
        }
      }

      if (self.options.date !== false && self.options.time !== false) {
        value += ' ';
      }

      if (self.options.time !== false) {
        var time = self.$time.data('pickatime').component,
            timeValue = self.$time.data('pickatime').get('select'),
            formatTime = time.formats.toString;
        if (timeValue) {
          value += formatTime.apply(time, ['HH:i', timeValue]);
        }
      }

      if (self.options.timezone !== null) {
        var timezone = ' ' + self.$timezone.attr('data-value');
        if (timezone) {
          value += timezone;
        }
      }

      self.$el.val(value);

      self.emit('updated');
    }
  });

  return PickADate;

});
