import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import Base from "@patternslib/patternslib/src/core/base";
import DisplayTemplate from "./templates/display.xml";
import FormTemplate from "./templates/form.xml";
import OccurrenceTemplate from "./templates/occurrence.xml";
import Modal from "../modal/modal";


const RecurrenceInput = function(conf, textarea) {

    var self = this;
    var form, display;

    // Extend conf with non-configurable data used by templates.
    var orderedWeekdays = [];
    var index, i;
    for (i = 0; i < 7; i++) {
        index = i + conf.firstDay;
        if (index > 6) {
            index = index - 7;
        }
        orderedWeekdays.push(index);
    }

    $.extend(conf, {
        orderIndexes: ['+1', '+2', '+3', '+4', '-1'],
        weekdays: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        orderedWeekdays: orderedWeekdays
    });

    // The recurrence type dropdown should show certain fields depending
    // on selection:
    function displayFields(selector) {
        var i;
        // First hide all the fields
        form.find('.rifield').hide();
        // Then show the ones that should be shown.
        var value = selector.val();
        if (value) {
            var rtemplate = conf.rtemplate[value];
            for (i = 0; i < rtemplate.fields.length; i++) {
                form.find('#' + rtemplate.fields[i]).show();
            }
        }
    }

    function occurrenceExclude(event) {
        event.preventDefault();
        if (form.ical.EXDATE === undefined) {
            form.ical.EXDATE = [];
        }
        form.ical.EXDATE.push(this.attributes.date.value);
        var $this = $(this);
        $this.attr('class', 'exdate');
        $this.parent().parent().addClass('exdate');
        $this.unbind(event);
        $this.on("click", occurrenceInclude);
    }

    function occurrenceInclude(event) {
        event.preventDefault();
        form.ical.EXDATE.splice($.inArray(this.attributes.date.value, form.ical.EXDATE), 1);
        var $this = $(this);
        $this.attr('class', 'rrule');
        $this.parent().parent().removeClass('exdate');
        $this.unbind(event);
        $this.on("click", occurrenceExclude);
    }

    function occurrenceDelete(event) {
        event.preventDefault();
        form.ical.RDATE.splice($.inArray(this.attributes.date.value, form.ical.RDATE), 1);
        $(this).parent().parent().hide('slow', function () {
            $(this).remove();
        });
    }

    function occurrenceAdd(event) {
        event.preventDefault();
        var datevalue = form
            .find('.riaddoccurrence input#adddate')
            .val();
        if (form.ical.RDATE === undefined) {
            form.ical.RDATE = [];
        }
        var errorarea = form.find('.riaddoccurrence div.errorarea');
        errorarea.text('');
        errorarea.hide();

        // Add date only if it is not already in RDATE
        if ($.inArray(datevalue, form.ical.RDATE) === -1) {
            form.ical.RDATE.push(datevalue);
            var html = ['<div class="occurrence rdate" style="display: none;">',
                    '<span class="rdate">',
                        dateinput.getValue(conf.localization.longDateFormat),
                        '<span class="rlabel">' + conf.localization.additionalDate + '</span>',
                    '</span>',
                    '<span class="action">',
                        '<a date="' + datevalue + '" href="#" class="rdate" >',
                            'Include',
                        '</a>',
                    '</span>',
                    '</div>'].join('\n');
            form.find('div.rioccurrences').prepend(html);
            $(form.find('div.rioccurrences div')[0]).slideDown();
            $(form.find('div.rioccurrences .action a.rdate')[0]).click(occurrenceDelete);
        } else {
            errorarea.text(conf.localization.alreadyAdded).show();
        }
    }

    // element is where to find the tag in question. Can be the form
    // or the display widget. Defaults to the form.
    function loadOccurrences(startdate, rfc5545, start, readonly) {
        var element, occurrenceDiv;

        if (!readonly) {
            element = form;
        } else {
            element = display;
        }

        occurrenceDiv = element.find('.rioccurrences');
        occurrenceDiv.hide();

        var year, month, day;
        year = startdate.getFullYear();
        month = startdate.getMonth() + 1;
        day = startdate.getDate();

        var data = {year: year,
                   month: month, // Sending January as 0? I think not.
                   day: day,
                   rrule: rfc5545,
                   format: conf.localization.longDateFormat,
                   start: start};

        var dict = {
            url: conf.ajaxURL,
            async: false, // Can't be tested if it's asynchronous, annoyingly.
            type: 'post',
            dataType: 'json',
            contentType: conf.ajaxContentType,
            cache: false,
            data: data,
            success: function (data, status, jqXHR) {
                var result, element;

                if (!readonly) {
                    element = form;
                } else {
                    element = display;
                }
                data.readOnly = readonly;
                data.localization = conf.localization;

                // Format dates:
                var occurrence, date, y, m, d, each;
                for (each in data.occurrences) {
                    if (data.occurrences.hasOwnProperty(each)) {
                        occurrence = data.occurrences[each];
                        date = occurrence.date;
                        y = parseInt(date.substring(0, 4), 10);
                        m = parseInt(date.substring(4, 6), 10) - 1; // jan=0
                        d = parseInt(date.substring(6, 8), 10);
                        occurrence.formattedDate = format(new Date(y, m, d), conf.localization.longDateFormat, conf);
                    }
                }

                result = _.template(OccurrenceTemplate)(data);
                occurrenceDiv = element.find('.rioccurrences');
                occurrenceDiv.replaceWith(result);

                // Add the batch actions:
                element.find('.rioccurrences .batching a').click(
                    function (event) {
                        event.preventDefault();
                        loadOccurrences(startdate, rfc5545, this.attributes.start.value, readonly);
                    }
                );

                // Add the delete/undelete actions:
                if (!readonly) {
                    element.find('.rioccurrences .action a.rrule').click(occurrenceExclude);
                    element.find('.rioccurrences .action a.exdate').click(occurrenceInclude);
                    element.find('.rioccurrences .action a.rdate').click(occurrenceDelete);
                }
                // Show the new div
                element.find('.rioccurrences').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        };

        $.ajax(dict);
    }

    function getField(field) {
        // See if it is a field already
        var realField = $(field);
        if (!realField.length) {
            // Otherwise, we assume it's an id:
            realField = $('#' + field);
        }
        if (!realField.length) {
            // Still not? Then it's a name.
            realField = $("input[name='" + field + "']");
        }
        return realField;
    }
    function findStartDate() {
        var startdate = null;
        var startField, startFieldYear, startFieldMonth, startFieldDay;

        // Find the default byday and bymonthday from the start date, if any:
        if (conf.startField) {
            startField = getField(conf.startField);
            if (!startField.length) {
                // Field not found
                return null;
            }
            // Now we have a field, see if it is a dateinput field:
            startdate = startField.data('dateinput');
            if (!startdate) {
                //No, it wasn't, just try to interpret it with Date()
                startdate = startField.val();
                if (startdate === "") {
                    // Probably not an input at all. Try to see if it contains a date
                    startdate = startField.text();
                }
            } else {
                // Yes it was, get the date:
                startdate = startdate.getValue();
            }

            if (typeof startdate === 'string') {
                // convert human readable, non ISO8601 dates, like
                // '2014-04-24 19:00', where the 'T' separator is missing.
                startdate = startdate.replace(' ', 'T');
            }

            startdate = new Date(startdate);
        } else if (conf.startFieldYear &&
                   conf.startFieldMonth &&
                   conf.startFieldDay) {
            startFieldYear = getField(conf.startFieldYear);
            startFieldMonth = getField(conf.startFieldMonth);
            startFieldDay = getField(conf.startFieldDay);
            if (!startFieldYear.length &&
                !startFieldMonth.length &&
                !startFieldDay.length) {
                // Field not found
                return null;
            }
            startdate = new Date(startFieldYear.val(),
                                 startFieldMonth.val() - 1,
                                 startFieldDay.val());
        }
        if (startdate === null) {
            return null;
        }
        // We have some sort of startdate:
        if (isNaN(startdate)) {
            return null;
        }
        return startdate;
    }
    function findEndDate(form) {
        var endField, enddate;

        endField = form.find('input[name=rirangebyenddatecalendar]');

        // Now we have a field, see if it is a dateinput field:
        enddate = endField.data('dateinput');
        if (!enddate) {
            //No, it wasn't, just try to interpret it with Date()
            enddate = endField.val();
        } else {
            // Yes it was, get the date:
            enddate = enddate.getValue();
        }
        enddate = new Date(enddate);

        // if the end date is incorrect or the field is left empty
        if (isNaN(enddate) || endField.val() === "") {
            return null;
        }
        return enddate;
    }
    function findIntField(fieldName, form) {
        var field, num, isInt;

        field = form.find('input[name=' + fieldName + ']');

        num = field.val();

        // if it's not a number or the field is left empty
        if (isNaN(num) || (num.toString().indexOf('.') !== -1) || field.val() === "") {
            return null;
        }
        return num;
    }

    // Loading (populating) display and form widget with
    // passed RFC5545 string (data)
    function loadData(rfc5545) {
        var selector, format, startdate, dayindex, day;

        if (rfc5545) {
            widgetLoadFromRfc5545(form, conf, rfc5545, true);
        }

        startdate = findStartDate();

        if (startdate !== null) {
            // If the date is a real date, set the defaults in the form
            form.find('select[name=rimonthlydayofmonthday]').val(startdate.getDate());
            dayindex = conf.orderIndexes[Math.floor((startdate.getDate() - 1) / 7)];
            day = conf.weekdays[startdate.getDay()];
            form.find('select[name=rimonthlyweekdayofmonthindex]').val(dayindex);
            form.find('select[name=rimonthlyweekdayofmonth]').val(day);

            form.find('select[name=riyearlydayofmonthmonth]').val(startdate.getMonth() + 1);
            form.find('select[name=riyearlydayofmonthday]').val(startdate.getDate());
            form.find('select[name=riyearlyweekdayofmonthindex]').val(dayindex);
            form.find('select[name=riyearlyweekdayofmonthday]').val(day);
            form.find('select[name=riyearlyweekdayofmonthmonth]').val(startdate.getMonth() + 1);

            // Now when we have a start date, we can also do an ajax call to calculate occurrences:
            loadOccurrences(startdate, widgetSaveToRfc5545(form, conf, false).result, 0, false);

            // Show the add and refresh buttons:
            form.find('div.rioccurrencesactions').show();

        } else {
            // No EXDATE/RDATE support
            form.find('div.rioccurrencesactions').hide();
        }


        selector = form.find('select[name=rirtemplate]');
        displayFields(selector);
    }

    function recurrenceOn() {
        var RFC5545 = widgetSaveToRfc5545(form, conf, false);
        var label = display.find('label[class=ridisplay]');
        label.text(conf.localization.displayActivate + ' ' + RFC5545.description);
        textarea.val(RFC5545.result).change();
        var startdate = findStartDate();
        if (startdate !== null) {
            loadOccurrences(startdate, widgetSaveToRfc5545(form, conf, false).result, 0, true);
        }
        display.find('button[name="riedit"]').text(conf.localization.edit_rules);
        display.find('button[name="ridelete"]').show();
    }

    function recurrenceOff() {
        var label = display.find('label[class=ridisplay]');
        label.text(conf.localization.displayUnactivate);
        textarea.val('').change();  // Clear the textarea.
        display.find('.rioccurrences').hide();
        display.find('button[name="riedit"]').text(conf.localization.add_rules);
        display.find('button[name="ridelete"]').hide();
    }

    function checkFields(form) {
        var startDate, endDate, num, messagearea;
        startDate = findStartDate();

        // Hide any error message from before
        messagearea = form.find('#messagearea');
        messagearea.text('');
        messagearea.hide();

        // Hide add field errors
        form.find('.riaddoccurrence div.errorarea').text('').hide();

        // Repeats Daily
        if (form.find('#ridailyinterval').css('display') === 'block') {
            // Check repeat every field
            num = findIntField('ridailyinterval', form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }
        }

        // Repeats Weekly
        if (form.find('#riweeklyinterval').css('display') === 'block') {
            // Check repeat every field
            num = findIntField('riweeklyinterval', form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }
        }

        // Repeats Monthly
        if (form.find('#rimonthlyinterval').css('display') === 'block') {
            // Check repeat every field
            num = findIntField('rimonthlyinterval', form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }

            // Check repeat on
            if (form.find('#rimonthlyoptions input:checked').length === 0) {
                messagearea.text(conf.localization.noRepeatOn).show();
                return false;
            }
        }

        // Repeats Yearly
        if (form.find('#riyearlyinterval').css('display') === 'block') {
            // Check repeat every field
            num = findIntField('riyearlyinterval', form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }

            // Check repeat on
            if (form.find('#riyearlyoptions input:checked').length === 0) {
                messagearea.text(conf.localization.noRepeatOn).show();
                return false;
            }
        }

        // End recurrence fields

        // If after N occurences is selected, check its value
        if (form.find('input[value="BYOCCURRENCES"]:visible:checked').length > 0) {
            num = findIntField('rirangebyoccurrencesvalue', form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noEndAfterNOccurrences).show();
                return false;
            }
        }

        // If end date is selected, check its value
        if (form.find('input[value="BYENDDATE"]:visible:checked').length > 0) {
            endDate = findEndDate(form);
            if (!endDate) {
                // if endDate is null that means the field is empty
                messagearea.text(conf.localization.noEndDate).show();
                return false;
            } else if (endDate < startDate) {
                // the end date cannot be before start date
                messagearea.text(conf.localization.pastEndDate).show();
                return false;
            }
        }

        return true;
    }

    function save(event) {
        event.preventDefault();
        // if no field errors, process the request
        if (checkFields(form)) {
            // close overlay
            form.overlay().close();
            recurrenceOn();
        }
    }

    function cancel(event) {
        event.preventDefault();
        // close overlay
        form.overlay().close();
    }

    function updateOccurances() {
        var startDate;
        startDate = findStartDate();

        // if no field errors, process the request
        if (checkFields(form)) {
            loadOccurrences(startDate,
                widgetSaveToRfc5545(form, conf, false).result,
                0,
                false);
        }
    }

    /*
      Load the templates
    */

    var now_date = (new Date()).toISOString().substring(0, 10);
    display = $(_.template(DisplayTemplate)(conf));
    form = $(_.template(FormTemplate)(conf));

    // Make an overlay and hide it
    this.modal = new Modal(form);

    form.ical = {RDATE: [], EXDATE: []};

    // Make the date input into a calendar dateinput()
    form.find('input[name=rirangebyenddatecalendar]').val(now_date);

    if (textarea.val()) {
        var result = widgetLoadFromRfc5545(form, conf, textarea.val(), false);
        if (result === -1) {
            var label = display.find('label[class=ridisplay]');
            label.text(conf.localization.noRule);
        } else {
            recurrenceOn();
        }
    }

    /*
      Do all the GUI stuff:
    */

    // When you click "Delete...", the recurrence rules should be cleared.
    display.find('button[name=ridelete]').click(function (e) {
        e.preventDefault();
        recurrenceOff();
    });

    // Show form overlay when you click on the "Edit..." link
    display.find('button[name=riedit]').on(
        "click",
        function (e) {
            // Load the form to set up the right fields to show, etc.
            loadData(textarea.val());
            e.preventDefault();
            form.overlay().load();
        }
    );

    // Pop up the little add form when clicking "Add"
    form.find('div.riaddoccurrence input#adddate').val(now_date);
    form.find('input#addaction').on("click", occurrenceAdd);

    // When the reload button is clicked, reload
    form.find('a.rirefreshbutton').on(
        "click",
        function (event) {
            event.preventDefault();
            updateOccurances();
        }
    );

    // When selecting template, update what fieldsets are visible.
    form.find('select[name=rirtemplate]').change(
        function (e) {
            displayFields($(this));
        }
    );

    // When focus goes to a drop-down, select the relevant radiobutton.
    form.find('select').change(
        function (e) {
            $(this).parent().find('> input').click().change();
        }
    );
    form.find('input[name=rirangebyoccurrencesvalue]').change(
        function (e) {
            $(this).parent().find('input[name=rirangetype]').click().change();
        }
    );
    form.find('input[name=rirangebyenddatecalendar]').change(function () {
        // Update only if the occurances are shown
        $(this).parent().find('input[name=rirangetype]').click();
        if (form.find('.rioccurrencesactions:visible').length !== 0) {
            updateOccurances();
        }
    });
    // Update the selected dates section
    form.find('input:radio, .riweeklyweekday > input, input[name=ridailyinterval], input[name=riweeklyinterval], input[name=rimonthlyinterval], input[name=riyearlyinterval]').change(
        function (e) {
            // Update only if the occurances are shown
            if (form.find('.rioccurrencesactions:visible').length !== 0) {
                updateOccurances();
            }
        }
    );

    /*
      Save and cancel methods:
    */
    form.find('.ricancelbutton').click(cancel);
    form.find('.risavebutton').click(save);

    /*
     * Public API of RecurrenceInput
     */

    $.extend(self, {
        display: display,
        form: form,
        loadData: loadData, //Used by tests.
        save: save //Used by tests.
    });

}

export default Base.extend({
    name: "recurrence",
    trigger: ".pat-recurrence",
    parser: "mockup",
    defaults: {
        localization: {
            displayUnactivate: 'Does not repeat',
            displayActivate: 'Repeats every',
            add_rules: 'Add',
            edit_rules: 'Edit',
            delete_rules: 'Delete',
            add:  'Add',
            refresh: 'Refresh',

            title: 'Repeat',
            preview: 'Selected dates',
            addDate: 'Add date',

            recurrenceType: 'Repeats:',

            dailyInterval1: 'Repeat every:',
            dailyInterval2: 'days',

            weeklyInterval1: 'Repeat every:',
            weeklyInterval2: 'week(s)',
            weeklyWeekdays: 'Repeat on:',
            weeklyWeekdaysHuman: 'on:',

            monthlyInterval1: 'Repeat every:',
            monthlyInterval2: 'month(s)',
            monthlyDayOfMonth1: 'Day',
            monthlyDayOfMonth1Human: 'on day',
            monthlyDayOfMonth2: 'of the month',
            monthlyDayOfMonth3: 'month(s)',
            monthlyWeekdayOfMonth1: 'The',
            monthlyWeekdayOfMonth1Human: 'on the',
            monthlyWeekdayOfMonth2: '',
            monthlyWeekdayOfMonth3: 'of the month',
            monthlyRepeatOn: 'Repeat on:',

            yearlyInterval1: 'Repeat every:',
            yearlyInterval2: 'year(s)',
            yearlyDayOfMonth1: 'Every',
            yearlyDayOfMonth1Human: 'on',
            yearlyDayOfMonth2: '',
            yearlyDayOfMonth3: '',
            yearlyWeekdayOfMonth1: 'The',
            yearlyWeekdayOfMonth1Human: 'on the',
            yearlyWeekdayOfMonth2: '',
            yearlyWeekdayOfMonth3: 'of',
            yearlyWeekdayOfMonth4: '',
            yearlyRepeatOn: 'Repeat on:',

            range: 'End recurrence:',
            rangeNoEnd: 'Never',
            rangeByOccurrences1: 'After',
            rangeByOccurrences1Human: 'ends after',
            rangeByOccurrences2: 'occurrence(s)',
            rangeByEndDate: 'On',
            rangeByEndDateHuman: 'ends on',

            including: ', and also',
            except: ', except for',

            cancel: 'Cancel',
            save: 'Save',

            recurrenceStart: 'Start of the recurrence',
            additionalDate: 'Additional date',
            include: 'Include',
            exclude: 'Exclude',
            remove: 'Remove',

            orderIndexes: ['first', 'second', 'third', 'fourth', 'last'],
            months: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'],
            shortMonths: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weekdays: [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday'],
            shortWeekdays: [
                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

            longDateFormat: 'mmmm dd, yyyy',
            shortDateFormat: 'mm/dd/yyyy',

            unsupportedFeatures: 'Warning: This event uses recurrence features not ' +
                                  'supported by this widget. Saving the recurrence ' +
                                  'may change the recurrence in unintended ways:',
            noTemplateMatch: 'No matching recurrence template',
            multipleDayOfMonth: 'This widget does not support multiple days in monthly or yearly recurrence',
            bysetpos: 'BYSETPOS is not supported',
            noRule: 'No RRULE in RRULE data',
            noRepeatEvery: 'Error: The "Repeat every"-field must be between 1 and 1000',
            noEndDate: 'Error: End date is not set. Please set a correct value',
            noRepeatOn: 'Error: "Repeat on"-value must be selected',
            pastEndDate: 'Error: End date cannot be before start date',
            noEndAfterNOccurrences: 'Error: The "After N occurrences"-field must be between 1 and 1000',
            alreadyAdded: 'This date was already added',

            rtemplate: {
                daily: 'Daily',
                mondayfriday: 'Monday and Friday',
                weekdays: 'Weekday',
                weekly: 'Weekly',
                monthly: 'Monthly',
                yearly: 'Yearly'
            }
        },

        readOnly: false,
        firstDay: 0,

        // "REMOTE" FIELD
        startField: null,
        startFieldYear: null,
        startFieldMonth: null,
        startFieldDay: null,
        ajaxURL: null,
        ajaxContentType: 'application/json; charset=utf8',
        ributtonExtraClass: '',

        // INPUT CONFIGURATION
        hasRepeatForeverButton: true,

        // JQUERY TEMPLATE NAMES
        template: {
            form: '#jquery-recurrenceinput-form-tmpl',
            display: '#jquery-recurrenceinput-display-tmpl'
        },

        // RECURRENCE TEMPLATES
        rtemplate: {
            daily: {
                rrule: 'FREQ=DAILY',
                fields: [
                    'ridailyinterval',
                    'rirangeoptions'
                ]
            },
            mondayfriday: {
                rrule: 'FREQ=WEEKLY;BYDAY=MO,FR',
                fields: [
                    'rirangeoptions'
                ]
            },
            weekdays: {
                rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
                fields: [
                    'rirangeoptions'
                ]
            },
            weekly: {
                rrule: 'FREQ=WEEKLY',
                fields: [
                    'riweeklyinterval',
                    'riweeklyweekdays',
                    'rirangeoptions'
                ]
            },
            monthly: {
                rrule: 'FREQ=MONTHLY',
                fields: [
                    'rimonthlyinterval',
                    'rimonthlyoptions',
                    'rirangeoptions'
                ]
            },
            yearly: {
                rrule: 'FREQ=YEARLY',
                fields: [
                    'riyearlyinterval',
                    'riyearlyoptions',
                    'rirangeoptions'
                ]
            }
        }
    },

    init: async function () {
        // tmpl BEFORE recurrenceinput
        import("./recurrence.scss");

        this.$el.addClass("recurrence-widget");

        // "compile" configuration for widget

        // our recurrenceinput widget instance
        var recurrenceinput = new RecurrenceInput(this.options, this.$el);
        // hide textarea and place display widget after textarea
        recurrenceinput.form.appendTo('body');
        this.$el.after(recurrenceinput.display);

        // hide the textarea
        this.$el.hide();
    },
});
