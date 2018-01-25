/* Moment pattern.
 *
 * Options:
 *    selector(string): selector to use to look for dates to format (null)
 *    format(string): Format to use to render date. Also available is "relative" and "calendar" formats. (MMMM Do YYYY, h:mm:ss a)
 *    setTitle(boolean): set the title attribute to display the full date and time on hover (false)
 *
 * Documentation:
 *
 *    # Simple
 *
 *    {{ example-1 }}
 *
 *    # Defaults
 *
 *    {{ example-2 }}
 *
 *    # Relative format
 *
 *    {{ example-3 }}
 *
 *    # Calendar format
 *
 *    {{ example-4 }}
 *
 *    # Custom format
 *
 *    {{ example-5 }}
 *
 *    # Setting date by attribute
 *
 *    {{ example-6 }}
 *
 * Example: example-1
 *    <span class="pat-moment">2014-10-30T15:10:00</span>
 *
 * Example: example-2
 *    <ul class="pat-moment" data-pat-moment="selector:li">
 *      <li>2013-10-01T10:00:00-05:00</li>
 *      <li>2013-01-01T22:10:00-05:00</li>
 *      <li>2013-01-05T04:34:00-05:00</li>
 *      <li>2013-02-14T16:55:00-05:00</li>
 *    </ul>
 *
 * Example: example-3
 *    <ul class="pat-moment"
 *        data-pat-moment="selector:li;format:relative;">
 *      <li>2013-10-01T10:00:00-05:00</li>
 *      <li>2013-01-01T22:10:00-05:00</li>
 *      <li>2013-01-05T04:34:00-05:00</li>
 *      <li>2013-02-14T16:55:00-05:00</li>
 *    </ul>
 *
 * Example: example-4
 *    <ul class="pat-moment"
 *        data-pat-moment="selector:li;format:calendar;">
 *      <li>2013-10-01T10:00:00-05:00</li>
 *      <li>2013-10-02T22:10:00-05:00</li>
 *      <li>2013-10-05T04:34:00-05:00</li>
 *      <li>2013-10-03T16:55:00-05:00</li>
 *    </ul>
 *
 * Example: example-5
 *    <ul class="pat-moment"
 *        data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
 *      <li>2013-10-01T10:00:00-05:00</li>
 *      <li>2013-01-01T22:10:00-05:00</li>
 *      <li>2013-01-05T04:34:00-05:00</li>
 *      <li>2013-02-14T16:55:00-05:00</li>
 *    </ul>
 *
 * Example: example-6
 *    <ul class="pat-moment"
 *        data-pat-moment="selector:li;format:MMM Do, YYYY h:m a;">
 *      <li data-date="2013-10-01T10:00:00-05:00"></li>
 *      <li data-date="2013-01-01T22:10:00-05:00"></li>
 *      <li data-date="2013-01-05T04:34:00-05:00"></li>
 *      <li data-date="2013-02-14T16:55:00-05:00"></li>
 *    </ul>
 *
 */


define([
  'jquery',
  'pat-base',
  'moment',
  'mockup-i18n'
], function($, Base, moment, i18n) {

  var Moment = Base.extend({
    name: 'moment',
    trigger: '.pat-moment',
    parser: 'mockup',
    moment_i18n_map: {'no': 'nb'},  // convert Plone language codes to moment codes.
    defaults: {
      // selector of elements to format dates for
      selector: null,
      // also available options are relative, calendar
      format: 'LLL',
      setTitle: false
    },
    convert: function($el) {
      var self = this;
      var date = $el.attr('data-date');
      if (!date) {
        date = $.trim($el.html());
      }
      if (!date || date === 'None') {
        return;
      }
      var currentLanguage = (new i18n()).currentLanguage;
      if (currentLanguage in self.moment_i18n_map) {
        currentLanguage = self.moment_i18n_map[currentLanguage];
      }
      moment.locale([currentLanguage, 'en']);
      date = moment(date);
      if (!date.isValid()) {
        return;
      }
      if (self.options.setTitle) {
        $el.attr('title', date.format('LLLL'));

      }
      if (self.options.format === 'relative') {
        date = date.fromNow();
      }else if (self.options.format === 'calendar') {
        date = date.calendar();
      } else {
        date = date.format(self.options.format);
      }
      if (date) {
        $el.html(date);
      }
    },
    init: function() {
      var self = this;
      if (self.options.selector) {
        self.$el.find(self.options.selector).each(function() {
          self.convert($(this));
        });
      } else {
        self.convert(self.$el);
      }
    }
  });

  return Moment;

});
