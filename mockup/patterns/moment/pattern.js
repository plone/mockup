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
  'pat-registry',
  'mockup-i18n',
  'moment'
], function($, Base, Registry, i18n, moment) {
  var currentLanguage = (new i18n()).currentLanguage;
  var localeLoaded = false;
  var patMomentInstances = [];

  // From https://github.com/moment/moment/blob/3147fbc/src/test/moment/format.js#L463-L468
  var MOMENT_LOCALES =
    'ar-sa ar-tn ar az be bg bn bo br bs ca cs cv cy da de-at de dv el ' +
    'en-au en-ca en-gb en-ie en-nz eo es et eu fa fi fo fr-ca fr-ch fr fy ' +
    'gd gl he hi hr hu hy-am id is it ja jv ka kk km ko lb lo lt lv me mk ml ' +
    'mr ms-my ms my nb ne nl nn pl pt-br pt ro ru se si sk sl sq sr-cyrl ' +
    'sr sv sw ta te th tl-ph tlh tr tzl tzm-latn tzm uk uz vi zh-cn zh-tw';

  function isLangSupported(lang) {
    return MOMENT_LOCALES.split(' ').indexOf(lang) !== -1;
  }

  function lazyLoadMomentLocale() {
    var LANG_FALLBACK = 'en';

    if (currentLanguage === LANG_FALLBACK) {
      // English locale is built-in, no need to load, so let's exit early
      // to avoid computing fallback, which happens at every loaded page
      localeLoaded = true;
      return;
    }

    // Format language as expect by Moment.js, neither POSIX (like TinyMCE) nor IETF
    var lang = currentLanguage.replace('_', '-').toLowerCase();

    // Use language code as fallback, otherwise built-in English locale
    lang = isLangSupported(lang) ? lang : lang.split('-')[0];
    lang = isLangSupported(lang) ? lang : LANG_FALLBACK;
    if (lang === LANG_FALLBACK) {
      localeLoaded = true;
      return;
    }

    require(['moment-url/' + lang], function() {
      localeLoaded = true;
      for (var i = 0; i < patMomentInstances.length; i++) {
        var patMoment = patMomentInstances[i];
        patMoment.init();
      }
      patMomentInstances = [];
    });
  }

  lazyLoadMomentLocale();

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
        if (date && date !== 'None') {
          $el.attr('data-date', date);
        }
      }
      if (!date || date === 'None') {
        return;
      }
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
      if (!localeLoaded) {
        // The locale has not finished to load yet, we will execute the init
        // again once the locale is loaded.
        patMomentInstances.push(self);
        return;
      }
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
