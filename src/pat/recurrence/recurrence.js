import $ from "jquery";
import _ from "underscore";
import Base from "@patternslib/patternslib/src/core/base";
import DisplayTemplate from "./templates/display.xml";
import FormTemplate from "./templates/form.xml";
import OccurrenceTemplate from "./templates/occurrence.xml";
import Modal from "../modal/modal";
import utils from "../../core/utils";

// Formatting function (mostly) from jQueryTools dateinput
var Re = /d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g;

function zeropad(val, len) {
    val = val.toString();
    len = len || 2;
    while (val.length < len) {
        val = "0" + val;
    }
    return val;
}

function format(date, fmt, conf) {
    var d = date.getDate(),
        D = date.getDay(),
        m = date.getMonth(),
        y = date.getFullYear(),
        flags = {
            d: d,
            dd: zeropad(d),
            ddd: conf.localization.shortWeekdays[D],
            dddd: conf.localization.weekdays[D],
            m: m + 1,
            mm: zeropad(m + 1),
            mmm: conf.localization.shortMonths[m],
            mmmm: conf.localization.months[m],
            yy: String(y).slice(2),
            yyyy: y,
        };

    var result = fmt.replace(Re, function ($0) {
        return Object.prototype.hasOwnProperty.call(flags, $0)
            ? flags[$0]
            : $0.slice(1, $0.length - 1);
    });

    return result;
}

// eslint-disable-next-line no-unused-vars
function widgetSaveToRfc5545(form, RDATE, EXDATE, conf, tz) {
    var value = form.find("select[name=rirtemplate]").val();
    var rtemplate = conf.rtemplate[value];
    var result = "RRULE:" + rtemplate.rrule;
    var human = conf.localization.rtemplate[value];
    var interval, month, year, occurrences, day;
    var weekdays, i18nweekdays, input, monthlyType, index;
    var yearlyType, rangeType;

    for (const field_id of rtemplate.fields) {
        const field = form.find(`#${field_id}`);

        switch (field.attr("id")) {
            case "ridailyinterval":
                interval = field.find("input[name=ridailyinterval]").val();
                if (interval !== "1") {
                    result += `;INTERVAL=${interval}`;
                }
                human = `${interval} ${conf.localization.dailyInterval2}`;
                break;

            case "riweeklyinterval":
                interval = field.find("input[name=riweeklyinterval]").val();
                if (interval !== "1") {
                    result += `;INTERVAL=${interval}`;
                }
                human = `${interval} ${conf.localization.weeklyInterval2}`;
                break;

            case "riweeklyweekdays":
                weekdays = [];
                i18nweekdays = [];
                for (let j = 0; j < conf.weekdays.length; j++) {
                    input = field.find(`input[name=riweeklyweekdays${j}]`);
                    if (input.is(":checked")) {
                        weekdays.push(conf.weekdays[j]);
                        i18nweekdays.push(conf.localization.weekdays[j]);
                    }
                }
                if (weekdays.length > 0) {
                    result += `;BYDAY=${weekdays.join(",")}`;
                    human += ` ${
                        conf.localization.weeklyWeekdaysHuman
                    } ${i18nweekdays.join(",")}`;
                }
                break;

            case "rimonthlyinterval":
                interval = field.find("input[name=rimonthlyinterval]").val();
                if (interval !== "1") {
                    result += `;INTERVAL=${interval}`;
                }
                human = `${interval} ${conf.localization.monthlyInterval2}`;
                break;

            case "rimonthlyoptions":
                monthlyType = $("input[name=rimonthlytype]:checked", form).val();
                if (monthlyType === "DAYOFMONTH") {
                    day = $("select[name=rimonthlydayofmonthday]", form).val();
                    result += `;BYMONTHDAY=${day}`;
                    human += `, ${conf.localization.monthlyDayOfMonth1Human} ${day} ${conf.localization.monthlyDayOfMonth2}`;
                } else if (monthlyType === "WEEKDAYOFMONTH") {
                    index = $("select[name=rimonthlyweekdayofmonthindex]", form).val();
                    day =
                        conf.weekdays[
                            $("select[name=rimonthlyweekdayofmonth]", form).val()
                        ];
                    if (["MO", "TU", "WE", "TH", "FR", "SA", "SU"].includes(day)) {
                        result += `;BYDAY=${index}${day}`;
                        human += `, ${conf.localization.monthlyWeekdayOfMonth1Human} `;
                        human += `${
                            conf.localization.orderIndexes[
                                conf.orderIndexes.indexOf(index)
                            ]
                        } ${conf.localization.monthlyWeekdayOfMonth2} `;
                        human += `${
                            conf.localization.weekdays[conf.weekdays.indexOf(day)]
                        } ${conf.localization.monthlyDayOfMonth2}`;
                    }
                }
                break;

            case "riyearlyinterval":
                interval = field.find("input[name=riyearlyinterval]").val();
                if (interval !== "1") {
                    result += `;INTERVAL=${interval}`;
                }
                human = `${interval} ${conf.localization.yearlyInterval2}`;
                break;

            case "riyearlyoptions":
                yearlyType = $("input[name=riyearlyType]:checked", form).val();
                month = "";

                if (yearlyType === "DAYOFMONTH") {
                    month = $("select[name=riyearlydayofmonthmonth]", form).val();
                    day = $("select[name=riyearlydayofmonthday]", form).val();
                    result += `;BYMONTH=${month};BYMONTHDAY=${day}`;
                    human += `, ${conf.localization.yearlyDayOfMonth1Human} ${
                        conf.localization.months[month - 1]
                    } ${day}`;
                } else if (yearlyType === "WEEKDAYOFMONTH") {
                    index = $("select[name=riyearlyweekdayofmonthindex]", form).val();
                    day =
                        conf.weekdays[
                            $("select[name=riyearlyweekdayofmonthday]", form).val()
                        ];
                    month = $("select[name=riyearlyweekdayofmonthmonth]", form).val();
                    result += `;BYMONTH=${month}`;
                    if (["MO", "TU", "WE", "TH", "FR", "SA", "SU"].includes(day)) {
                        result += `;BYDAY=${index}${day}`;
                        human += ", " + conf.localization.yearlyWeekdayOfMonth1Human;
                        human +=
                            " " +
                            conf.localization.orderIndexes[
                                $.inArray(index, conf.orderIndexes)
                            ];
                        human += " " + conf.localization.yearlyWeekdayOfMonth2;
                        human +=
                            " " +
                            conf.localization.weekdays[$.inArray(day, conf.weekdays)];
                        human += " " + conf.localization.yearlyWeekdayOfMonth3;
                        human += " " + conf.localization.months[month - 1];
                        human += " " + conf.localization.yearlyWeekdayOfMonth4;
                    }
                }
                break;

            case "rirangeoptions":
                rangeType = form.find("input[name=rirangetype]:checked").val();
                if (rangeType === "BYOCCURRENCES") {
                    occurrences = form
                        .find("input[name=rirangebyoccurrencesvalue]")
                        .val();
                    result += `;COUNT=${occurrences}`;
                    human += `, ${conf.localization.rangeByOccurrences1Human} ${occurrences} ${conf.localization.rangeByOccurrences2}`;
                } else if (rangeType === "BYENDDATE") {
                    let date = form.find("input[name=rirangebyenddatecalendar]").val();
                    if (date === "") {
                        const today = new Date();
                        date = `${today.getFullYear()}-${(today.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}-${today.getDate()}`;
                    }
                    result += `;UNTIL=${date.replaceAll("-", "")}T000000${
                        tz === true ? "Z" : ""
                    }`;
                    human += `, ${conf.localization.rangeByEndDateHuman} `;
                    var date_parts = date.split("-");
                    human += format(
                        new Date(date_parts[0], date_parts[1] - 1, date_parts[2]),
                        conf.localization.longDateFormat,
                        conf
                    );
                }
                break;
        }
    }

    if (RDATE.length) {
        RDATE.sort();
        let tmp_dates = [];
        let tmp_human = [];

        // make sure our additional RDATE dates have the same start time
        // XXX: not used, remove if superfluous
        //const rdate_time = start_date
        //    ? `T${start_date.getHours()}:${start_date.getMinutes()}:00`
        //    : "T00:00:00";

        for (let rdate of RDATE) {
            if (rdate !== "") {
                // RDATE values are "YYYY-MM-DD"
                // by adding "T000000" the recurrence sequence generator of
                // plone.event.recurrence adds the current start time correctly
                rdate += rdate.length === 10 ? "T000000" : "";
                rdate += tz ? "Z" : "";
                tmp_dates.push(rdate);

                // human readable RDATE
                year = parseInt(rdate.substring(0, 4), 10);
                month = parseInt(rdate.substring(5, 7), 10) - 1;
                day = parseInt(rdate.substring(8, 10), 10);
                tmp_human.push(
                    format(
                        new Date(year, month, day),
                        conf.localization.longDateFormat,
                        conf
                    )
                );
            }
        }
        if (tmp_dates.length) {
            result += `\nRDATE:${tmp_dates.join(",")}`;
            human += `${conf.localization.including} ${tmp_human.join("; ")}`;
        }
    }

    if (EXDATE.length) {
        EXDATE.sort();
        let tmp_dates = [];
        let tmp_human = [];
        for (let exdate of EXDATE) {
            if (exdate !== "") {
                // EXDATE values are "YYYYMMDDTHHMMZ"
                tmp_dates.push(exdate);

                // human readable EXDATE
                year = parseInt(exdate.substring(0, 4), 10);
                month = parseInt(exdate.substring(4, 6), 10) - 1;
                day = parseInt(exdate.substring(6, 8), 10);
                tmp_human.push(
                    format(
                        new Date(year, month, day),
                        conf.localization.longDateFormat,
                        conf
                    )
                );
            }
        }
        if (tmp_dates.length) {
            result += `\nEXDATE:${tmp_dates.join(",")}`;
            human += `${conf.localization.except} ${tmp_human.join("; ")}`;
        }
    }

    return { result: result, description: human };
}

function parseLine(icalline) {
    var result = {};
    var pos = icalline.indexOf(":");
    var property = icalline.substring(0, pos);
    result.value = icalline.substring(pos + 1);

    if (property.indexOf(";") !== -1) {
        pos = property.indexOf(";");
        result.parameters = property.substring(pos + 1);
        result.property = property.substring(0, pos);
    } else {
        result.parameters = null;
        result.property = property;
    }
    return result;
}

function cleanDates(dates) {
    // Get rid of timezones
    // TODO: We could parse dates and range here, maybe?
    var result = [];

    for (const date of dates.split(",")) {
        if (date.indexOf("Z") !== -1) {
            result.push(date.substring(0, 15));
        } else {
            result.push(date);
        }
    }
    return result;
}

function parseIcal(icaldata) {
    var lines = [];
    var result = {
        RRULE: "",
        RDATE: [],
        EXDATE: [],
    };
    var line = null;
    var nextline;

    lines = icaldata.split("\n");
    lines.reverse();
    while (line !== "") {
        if (lines.length > 0) {
            nextline = lines.pop();
            if (nextline.charAt(0) === " " || nextline.charAt(0) === "\t") {
                // Line continuation:
                line = line + nextline;
                continue;
            }
        } else {
            nextline = "";
        }

        // New line; the current one is finished, add it to the result.
        if (line !== null) {
            line = parseLine(line);
            // We ignore properties for now
            if (line.property === "RDATE" || line.property === "EXDATE") {
                result[line.property] = cleanDates(line.value);
            } else {
                result[line.property] = line.value;
            }
        }

        line = nextline;
    }
    return result;
}

function widgetLoadFromRfc5545(form, conf, icaldata, force) {
    var unsupportedFeatures = [];
    var matches, rtemplate, d, input, index;
    var selectors, field, radiobutton;
    var freq, interval, byday, bymonth, bymonthday, count, until;
    var day, month, year, weekday;

    if (icaldata.RRULE === undefined) {
        unsupportedFeatures.push(conf.localization.noRule);
        if (!force) {
            return -1; // Fail!
        }
    } else {
        matches = /FREQ=([^;]+);?/.exec(icaldata.RRULE);
        if (matches) {
            freq = matches[1];
        } else {
            freq = "DAILY";
        }

        matches = /INTERVAL=([0-9]+);?/.exec(icaldata.RRULE);
        if (matches) {
            interval = matches[1];
        } else {
            interval = "1";
        }

        matches = /BYDAY=([^;]+);?/.exec(icaldata.RRULE);
        if (matches) {
            byday = matches[1];
        } else {
            byday = "";
        }

        matches = /BYMONTHDAY=([^;]+);?/.exec(icaldata.RRULE);
        if (matches) {
            bymonthday = matches[1].split(",");
        } else {
            bymonthday = null;
        }

        matches = /BYMONTH=([^;]+);?/.exec(icaldata.RRULE);
        if (matches) {
            bymonth = matches[1].split(",");
        } else {
            bymonth = null;
        }

        matches = /COUNT=([0-9]+);?/.exec(icaldata.RRULE);
        if (matches) {
            count = matches[1];
        } else {
            count = null;
        }

        matches = /UNTIL=([0-9T]+);?/.exec(icaldata.RRULE);
        if (matches) {
            until = matches[1];
        } else {
            until = null;
        }

        matches = /BYSETPOS=([^;]+);?/.exec(icaldata.RRULE);
        if (matches) {
            unsupportedFeatures.push(conf.localization.bysetpos);
        }

        // Find the best rule:
        if (Object.prototype.hasOwnProperty.call(conf.rtemplate, freq.toLowerCase())) {
            rtemplate = conf.rtemplate[freq.toLowerCase()];
        } else {
            for (freq of conf.rtemplate) {
                /* fallback to first available template if no match above*/
                rtemplate = conf.rtemplate[freq];
                break;
            }
            unsupportedFeatures.push(conf.localization.noTemplateMatch);
        }

        // set rirtemplate selector to computed value
        form.find("select[name='rirtemplate']").val(freq.toLowerCase());

        for (const field_id of rtemplate.fields) {
            field = form.find(`#${field_id}`);
            switch (field.attr("id")) {
                case "ridailyinterval":
                    field.find("input[name=ridailyinterval]").val(interval);
                    break;

                case "riweeklyinterval":
                    field.find("input[name=riweeklyinterval]").val(interval);
                    break;

                case "riweeklyweekdays":
                    if (byday.length === 0) break;
                    byday = byday.split(",");
                    for (d = 0; d < conf.weekdays.length; d++) {
                        input = field.find(`input[name="riweeklyweekdays${d}"]`);
                        if (input.length === 0) continue;
                        day = conf.weekdays[d];
                        input.attr("checked", byday.includes(day));
                    }
                    break;

                case "rimonthlyinterval":
                    field.find("input[name=rimonthlyinterval]").val(interval);
                    break;

                case "rimonthlyoptions":
                    var monthlyType = "DAYOFMONTH"; // Default to using BYMONTHDAY

                    if (bymonthday) {
                        monthlyType = "DAYOFMONTH";
                        if (bymonthday.length > 1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(
                                conf.localization.multipleDayOfMonth
                            );
                            // Just keep the first
                            bymonthday = bymonthday[0];
                        }
                        field
                            .find("select[name=rimonthlydayofmonthday]")
                            .val(bymonthday);
                    }

                    if (byday) {
                        monthlyType = "WEEKDAYOFMONTH";

                        if (byday.indexOf(",") !== -1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(
                                conf.localization.multipleDayOfMonth
                            );
                            byday = byday.split(",")[0];
                        }
                        index = byday.slice(0, -2);
                        if (index.charAt(0) !== "+" && index.charAt(0) !== "-") {
                            index = "+" + index;
                        }
                        weekday = byday.slice(-2);
                        field
                            .find("select[name=rimonthlyweekdayofmonthindex]")
                            .val(index);
                        const day_index = conf.weekdays.indexOf(weekday);
                        field.find("select[name=rimonthlyweekdayofmonth]").val(day_index);
                    }

                    selectors = field.find("input[name=rimonthlytype]");
                    for (index = 0; index < selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr(
                            "checked",
                            radiobutton.value === monthlyType
                        );
                    }
                    break;

                case "riyearlyinterval":
                    field.find("input[name=riyearlyinterval]").val(interval);
                    break;

                case "riyearlyoptions":
                    var yearlyType = "DAYOFMONTH"; // Default to using BYMONTHDAY

                    if (bymonthday) {
                        yearlyType = "DAYOFMONTH";
                        if (bymonthday.length > 1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(
                                conf.localization.multipleDayOfMonth
                            );
                            bymonthday = bymonthday[0];
                        }
                        field.find("select[name=riyearlydayofmonthmonth]").val(bymonth);
                        field.find("select[name=riyearlydayofmonthday]").val(bymonthday);
                    }

                    if (byday) {
                        yearlyType = "WEEKDAYOFMONTH";

                        if (byday.indexOf(",") !== -1) {
                            // No support for multiple days in one month
                            unsupportedFeatures.push(
                                conf.localization.multipleDayOfMonth
                            );
                            byday = byday.split(",")[0];
                        }
                        index = byday.slice(0, -2);
                        if (index.charAt(0) !== "+" && index.charAt(0) !== "-") {
                            index = "+" + index;
                        }
                        weekday = byday.slice(-2);
                        field
                            .find("select[name=riyearlyweekdayofmonthindex]")
                            .val(index);

                        const weekday_index = conf.weekdays.indexOf(weekday);
                        field
                            .find("select[name=riyearlyweekdayofmonthday]")
                            .val(weekday_index);
                        field
                            .find("select[name=riyearlyweekdayofmonthmonth]")
                            .val(bymonth);
                    }

                    selectors = field.find("input[name=riyearlyType]");
                    for (index = 0; index < selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr("checked", radiobutton.value === yearlyType);
                    }
                    break;

                case "rirangeoptions":
                    // default value per configuration
                    var rangeType = conf.hasRepeatForeverButton ? "NOENDDATE" : "BYOCCURRENCES";

                    if (count) {
                        rangeType = "BYOCCURRENCES";
                        field.find("input[name=rirangebyoccurrencesvalue]").val(count);
                    }

                    if (until) {
                        rangeType = "BYENDDATE";
                        input = field.find("input[name=rirangebyenddatecalendar]");
                        year = until.slice(0, 4);
                        month = until.slice(4, 6);
                        day = until.slice(6, 8);
                        input.val(`${year}-${month}-${day}`);
                    }

                    selectors = field.find("input[name=rirangetype]");
                    for (index = 0; index < selectors.length; index++) {
                        radiobutton = selectors[index];
                        $(radiobutton).attr("checked", radiobutton.value === rangeType);
                    }
                    break;
            }
        }
    }

    var messagearea = form.find("#messagearea");
    if (unsupportedFeatures.length !== 0) {
        messagearea.text(
            conf.localization.unsupportedFeatures + " " + unsupportedFeatures.join("; ")
        );
        messagearea.show();
        return 1;
    } else {
        messagearea.text("");
        messagearea.hide();
        return 0;
    }
}

const RecurrenceInput = function (conf, textarea) {
    var self = this;
    var $textarea = $(textarea);

    // initalize parsed icaldata
    if (textarea.innerHTML) {
        textarea["ical"] = parseIcal(textarea.innerHTML);
    } else {
        textarea["ical"] = {
            RRULE: "",
            RDATE: [],
            EXDATE: [],
        };
    }

    // Extend conf with non-configurable data used by templates.
    var orderedWeekdays = [];
    var now_date = new Date().toISOString().substring(0, 10);
    var index;

    for (let i = 0; i < 7; i++) {
        index = i + conf.firstDay;
        if (index > 6) {
            index = index - 7;
        }
        orderedWeekdays.push(index);
    }

    conf = {
        ...conf,
        orderIndexes: ["+1", "+2", "+3", "+4", "-1"],
        weekdays: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
        orderedWeekdays: orderedWeekdays,
    };

    // The recurrence type dropdown should show certain fields depending
    // on selection:
    function displayFields(selector) {
        // First hide all the fields
        self.$modalForm.find(".rifield").hide();
        // Then show the ones that should be shown.
        var value = selector.val();
        if (value) {
            for (const rtField of conf.rtemplate[value].fields) {
                self.$modalForm.find(`#${rtField}`).show();
            }
        }
    }

    function occurrenceExclude(event) {
        event.preventDefault();
        textarea["ical"].EXDATE.push(this.attributes.date.value);
        var $this = $(this);
        $this.addClass("exdate");
        $this.parent().parent().addClass("exdate");
        $this.off("click").on("click", occurrenceInclude);
    }

    function occurrenceInclude(event) {
        event.preventDefault();
        textarea["ical"].EXDATE.splice(
            $.inArray(this.attributes.date.value, textarea["ical"].EXDATE),
            1
        );
        var $this = $(this);
        $this.removeClass("exdate");
        $this.parent().parent().removeClass("exdate");
        $this.off("click").on("click", occurrenceExclude);
    }

    function occurrenceDelete(event) {
        event.preventDefault();
        textarea["ical"].RDATE.splice(
            $.inArray(this.attributes.date.value, textarea["ical"].RDATE),
            1
        );
        $(this)
            .parent()
            .parent()
            .hide("slow", function () {
                $(this).remove();
            });
    }

    function occurrenceAdd(event) {
        event.preventDefault();
        var datevalue = self.$modalForm.find(".riaddoccurrence input#adddate").val();
        var errorarea = self.$modalForm.find(".riaddoccurrence div.alert");
        errorarea.text("");
        errorarea.hide();

        // Add date only if it is not already in RDATE
        if (!textarea["ical"].RDATE.includes(datevalue)) {
            textarea["ical"].RDATE.push(datevalue);
            var date_parts = datevalue.split("-");
            var $newdate =
                $(`<div class="d-flex justify-content-between occurrence rdate">
                <span class="rdate">
                    ${format(
                        new Date(date_parts[0], date_parts[1] - 1, date_parts[2]),
                        conf.localization.longDateFormat,
                        conf
                    )},
                    <span class="rlabel">${conf.localization.additionalDate}</span>
                </span>
                <span class="action">
                    <a date="${datevalue}" href="#" class="btn btn-sm btn-secondary rdate" >
                        ${conf.icons.remove}
                    </a>
                </span>
                </div>`);
            $newdate.hide();
            self.$modalForm.find("div.rioccurrences").prepend($newdate);
            $newdate.slideDown();
            $newdate.find("a.rdate").on("click", occurrenceDelete);
        } else {
            errorarea.text(conf.localization.alreadyAdded).show();
        }
    }

    // element is where to find the tag in question. Can be the form
    // or the display widget. Defaults to the self.$modalForm.
    function loadOccurrences(startdate, rfc5545, start, readonly) {
        var element, occurrenceDiv;

        if (!readonly) {
            element = self.$modalForm;
        } else {
            element = self.display;
        }

        occurrenceDiv = element.find(".rioccurrences");
        occurrenceDiv.hide();

        const year = startdate.getFullYear();
        const month = startdate.getMonth() + 1;
        const day = startdate.getDate();

        var data = {
            year: year,
            month: month, // Sending January as 0? I think not.
            day: day,
            rrule: rfc5545,
            format: conf.localization.longDateFormat,
            start: start,
        };

        $.ajax({
            url: conf.ajaxURL,
            async: false, // Can't be tested if it's asynchronous, annoyingly.
            type: "post",
            dataType: "json",
            contentType: conf.ajaxContentType,
            cache: false,
            data: data,
            success: function (resp) {
                var result;

                resp.readOnly = readonly;
                resp.localization = conf.localization;
                resp.icons = conf.icons;

                // Format dates:
                var date, y, m, d;
                for (let occurrence of resp.occurrences) {
                    date = occurrence.date;
                    y = parseInt(date.substring(0, 4), 10);
                    m = parseInt(date.substring(4, 6), 10) - 1; // jan=0
                    d = parseInt(date.substring(6, 8), 10);
                    occurrence.formattedDate = format(
                        new Date(y, m, d),
                        conf.localization.longDateFormat,
                        conf
                    );
                }

                result = _.template(OccurrenceTemplate)(resp);
                occurrenceDiv.replaceWith(result);

                // Add the batch actions:
                element.find(".rioccurrences .batching a").on("click", function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    loadOccurrences(
                        startdate,
                        rfc5545,
                        this.attributes.start.value,
                        readonly
                    );
                });

                // Add the delete/undelete actions:
                if (!readonly) {
                    element
                        .find(".rioccurrences .action a.rrule")
                        .on("click", occurrenceExclude);
                    element
                        .find(".rioccurrences .action a.exdate")
                        .on("click", occurrenceInclude);
                    element
                        .find(".rioccurrences .action a.rdate")
                        .on("click", occurrenceDelete);
                }
                // Show the new div
                occurrenceDiv.show();
            },
            error: function (jqXHR, textStatus) {
                alert(textStatus);
            },
        });
    }

    function getField(field) {
        // See if it is a field already
        var realField = $(field);
        if (!realField.length) {
            // Otherwise, we assume it's an id:
            realField = $("#" + field);
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
            startdate = startField.val();
            if (startdate === "") {
                // Probably not an input at all. Try to see if it contains a date
                startdate = startField.text();
            }

            if (typeof startdate === "string") {
                // convert human readable, non ISO8601 dates, like
                // '2014-04-24 19:00', where the 'T' separator is missing.
                startdate = startdate.replace(" ", "T");
            }

            startdate = new Date(startdate);
        } else if (conf.startFieldYear && conf.startFieldMonth && conf.startFieldDay) {
            startFieldYear = getField(conf.startFieldYear);
            startFieldMonth = getField(conf.startFieldMonth);
            startFieldDay = getField(conf.startFieldDay);
            if (
                !startFieldYear.length &&
                !startFieldMonth.length &&
                !startFieldDay.length
            ) {
                // Field not found
                return null;
            }
            startdate = new Date(
                startFieldYear.val(),
                startFieldMonth.val() - 1,
                startFieldDay.val()
            );
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
    function findEndDate() {
        var endField, enddate;

        endField = self.$modalForm.find("input[name=rirangebyenddatecalendar]");
        enddate = endField.val();
        enddate = new Date(enddate);

        // if the end date is incorrect or the field is left empty
        if (isNaN(enddate) || endField.val() === "") {
            return null;
        }
        return enddate;
    }
    function findIntField(fieldName) {
        var field, num;

        field = self.$modalForm.find("input[name=" + fieldName + "]");

        num = field.val();

        // if it's not a number or the field is left empty
        if (isNaN(num) || num.toString().indexOf(".") !== -1 || field.val() === "") {
            return null;
        }
        return num;
    }

    // Loading (populating) display and form widget with
    // passed RFC5545 string (data)
    function loadData(form) {
        widgetLoadFromRfc5545(form, conf, textarea["ical"], true);

        const startdate = findStartDate();

        if (startdate !== null) {
            // If the date is a real date, set the defaults in the form
            document.querySelector("select[name=rimonthlydayofmonthday]").value =
                startdate.getDate();
            const dayindex =
                conf.orderIndexes[Math.floor((startdate.getDate() - 1) / 7)];
            const day = conf.weekdays[startdate.getDay()];
            document.querySelector("select[name=rimonthlyweekdayofmonthindex]").value =
                dayindex;
            document.querySelector("select[name=rimonthlyweekdayofmonth]").value = day;

            document.querySelector("select[name=riyearlydayofmonthmonth]").value =
                startdate.getMonth() + 1;
            document.querySelector("select[name=riyearlydayofmonthday]").value =
                startdate.getDate();
            document.querySelector("select[name=riyearlyweekdayofmonthindex]").value =
                dayindex;
            document.querySelector("select[name=riyearlyweekdayofmonthday]").value = day;
            document.querySelector("select[name=riyearlyweekdayofmonthmonth]").value =
                startdate.getMonth() + 1;

            // Now when we have a start date, we can also do an ajax call to calculate occurrences:
            var rfc5545 =
                textarea.innerHTML ||
                widgetSaveToRfc5545(
                    form,
                    textarea["ical"].RDATE,
                    textarea["ical"].EXDATE,
                    conf,
                    false
                ).result;

            loadOccurrences(startdate, rfc5545, 0, false);

            // Show the add and refresh buttons:
            document.querySelector("div.rioccurrencesactions").style.display = "block";
        } else {
            // No EXDATE/RDATE support
            document.querySelector("div.rioccurrencesactions").style.display = "none";
        }

        displayFields(form.find("select[name=rirtemplate]"));
    }

    function recurrenceOn(form) {
        var RFC5545 = widgetSaveToRfc5545(
            form,
            textarea["ical"].RDATE,
            textarea["ical"].EXDATE,
            conf,
            false
        );
        var label = self.display.find("label[class=ridisplay-label]");
        label.text(conf.localization.displayActivate + " " + RFC5545.description);
        textarea["ical"] = parseIcal(RFC5545.result);
        textarea.innerHTML = RFC5545.result;
        $textarea.trigger("change");
        var startdate = findStartDate();
        if (startdate !== null) {
            loadOccurrences(startdate, RFC5545.result, 0, true);
        }
        self.display.find('a[name="riedit"]').text(conf.localization.edit_rules);
        self.display.find('a[name="ridelete"]').show();
    }

    function recurrenceOff() {
        var label = self.display.find("label[class=ridisplay-label]");
        label.text(conf.localization.displayUnactivate);
        // reset ical object
        textarea["ical"] = {
            RRULE: "",
            RDATE: [],
            EXDATE: [],
        };
        textarea.innerHTML = "";
        $textarea.trigger("change"); // Clear the textarea.
        self.display.find(".rioccurrences").hide();
        self.display.find('a[name="riedit"]').text(conf.localization.add_rules);
        self.display.find('a[name="ridelete"]').hide();
    }

    function checkFields(form) {
        var startDate, endDate, num, messagearea;
        startDate = findStartDate();

        // Hide any error message from before
        messagearea = self.$modalForm.find("#messagearea");
        messagearea.text("");
        messagearea.hide();

        // Hide add field errors
        self.$modalForm.find(".riaddoccurrence div.alert").text("").hide();

        // Repeats Daily
        if (self.$modalForm.find("#ridailyinterval").css("display") === "block") {
            // Check repeat every field
            num = findIntField("ridailyinterval", form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }
        }

        // Repeats Weekly
        if (self.$modalForm.find("#riweeklyinterval").css("display") === "block") {
            // Check repeat every field
            num = findIntField("riweeklyinterval", form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }
        }

        // Repeats Monthly
        if (self.$modalForm.find("#rimonthlyinterval").css("display") === "block") {
            // Check repeat every field
            num = findIntField("rimonthlyinterval", form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }

            // Check repeat on
            if (self.$modalForm.find("#rimonthlyoptions input:checked").length === 0) {
                messagearea.text(conf.localization.noRepeatOn).show();
                return false;
            }
        }

        // Repeats Yearly
        if (self.$modalForm.find("#riyearlyinterval").css("display") === "block") {
            // Check repeat every field
            num = findIntField("riyearlyinterval", form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noRepeatEvery).show();
                return false;
            }

            // Check repeat on
            if (self.$modalForm.find("#riyearlyoptions input:checked").length === 0) {
                messagearea.text(conf.localization.noRepeatOn).show();
                return false;
            }
        }

        // End recurrence fields

        // If after N occurences is selected, check its value
        if (
            self.$modalForm.find('input[value="BYOCCURRENCES"]:visible:checked').length >
            0
        ) {
            num = findIntField("rirangebyoccurrencesvalue", form);
            if (!num || num < 1 || num > 1000) {
                messagearea.text(conf.localization.noEndAfterNOccurrences).show();
                return false;
            }
        }

        // If end date is selected, check its value
        if (
            self.$modalForm.find('input[value="BYENDDATE"]:visible:checked').length > 0
        ) {
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
        if (checkFields(self.$modalForm)) {
            // close modal
            self.modal.hide();
            recurrenceOn(self.$modalForm);
            self.$modalForm = null;
        }
    }

    function cancel(event) {
        event.preventDefault();
        // close modal
        self.modal.hide();
        self.$modalForm = null;
    }

    function updateOccurrences() {
        var startDate;
        startDate = findStartDate();

        // if no field errors, process the request
        if (checkFields(form)) {
            loadOccurrences(
                startDate,
                widgetSaveToRfc5545(
                    self.$modalForm,
                    textarea["ical"].RDATE,
                    textarea["ical"].EXDATE,
                    conf,
                    false
                ).result,
                0,
                false
            );
        }
    }

    function initModalForm() {
        var enddate = self.$modalForm.find("input[name=rirangebyenddatecalendar]");
        if (!enddate.val()) {
            var start_date = findStartDate();
            start_date.setDate(start_date.getDate() + 1);
            enddate.val(start_date.toISOString().substring(0, 10));
        }

        self.$modalForm.find("input#addaction").on("click", occurrenceAdd);

        // When selecting template, update what fieldsets are visible and the occurrences.
        self.$modalForm.find('select[name="rirtemplate"]').on("change", function () {
            displayFields($(this));
            updateOccurrences();
        });

        // Update the selected dates section
        self.$modalForm
            .find(
                `
                input:radio,
                input:checkbox,
                .riweeklyweekday > input,
                input[name=ridailyinterval],
                input[name=riweeklyinterval],
                input[name=rimonthlyinterval],
                input[name=riyearlyinterval],
                input[name=rirangebyoccurrencesvalue],
                input[name=rirangebyenddatecalendar],
                #rimonthlyoptions select,
                #riyearlyoptions select,
                #riyearlyinterval select`
            )
            .on("change", function () {
                // Update only if the occurances are shown
                if (self.$modalForm.find(".rioccurrencesactions:visible").length !== 0) {
                    updateOccurrences();
                }
            });

        // initialize occurrence adddate value
        self.$modalForm.find("div.riaddoccurrence input#adddate").val(now_date);

        /*
        Save and cancel methods:
        */
        self.$modalForm.find(".ricancelbutton").on("click", cancel);
        self.$modalForm.find(".risavebutton").on("click", save);
    }

    /*
      Load the templates
    */

    self.display = $(_.template(DisplayTemplate)(conf));
    var form = $(_.template(FormTemplate)(conf));

    form.appendTo("body");
    form.hide();

    // Make an modal and hide it
    self.modal = new Modal(form, {
        content: "div.riform",
        buttons: ".ributtons > button",
        modalSizeClass: "modal-lg",
        backdropOptions: {
            opacity: "0.5",
        },
    });

    if (textarea.innerHTML) {
        var result = widgetLoadFromRfc5545(form, conf, textarea["ical"], false);
        if (result === -1) {
            var label = self.display.find("label[class=ridisplay-label]");
            label.text(conf.localization.noRule);
        } else {
            recurrenceOn(form);
        }
    }

    /*
      Do all the GUI stuff:
    */

    // When you click "Delete...", the recurrence rules should be cleared.
    self.display.find('a[name="ridelete"]').on("click", function (e) {
        e.preventDefault();
        recurrenceOff();
    });

    // Show form modal when you click on the "Edit..." link
    self.display.find('a[name="riedit"]').on("click", function (e) {
        // Load the form to set up the right fields to show, etc.
        e.preventDefault();
        self.modal.show();
        self.$modalForm = $("form", self.modal.$modalContent);
        loadData(self.$modalForm);
        initModalForm();
    });
};

export default Base.extend({
    name: "recurrence",
    trigger: ".pat-recurrence",
    parser: "mockup",
    defaults: {
        localization: {
            displayUnactivate: "Does not repeat",
            displayActivate: "Repeats every",
            add_rules: "Add",
            edit_rules: "Edit",
            delete_rules: "Delete",
            add: "Add",
            refresh: "Refresh",

            title: "Repeat",
            preview: "Selected dates",
            addDate: "Add date",

            recurrenceType: "Repeats:",

            dailyInterval1: "Repeat every:",
            dailyInterval2: "days",

            weeklyInterval1: "Repeat every:",
            weeklyInterval2: "week(s)",
            weeklyWeekdays: "Repeat on:",
            weeklyWeekdaysHuman: "on:",

            monthlyInterval1: "Repeat every:",
            monthlyInterval2: "month(s)",
            monthlyDayOfMonth1: "Day",
            monthlyDayOfMonth1Human: "on day",
            monthlyDayOfMonth2: "of the month",
            monthlyDayOfMonth3: "month(s)",
            monthlyWeekdayOfMonth1: "The",
            monthlyWeekdayOfMonth1Human: "on the",
            monthlyWeekdayOfMonth2: "",
            monthlyWeekdayOfMonth3: "of the month",
            monthlyRepeatOn: "Repeat on:",

            yearlyInterval1: "Repeat every:",
            yearlyInterval2: "year(s)",
            yearlyDayOfMonth1: "Every",
            yearlyDayOfMonth1Human: "on",
            yearlyDayOfMonth2: "",
            yearlyDayOfMonth3: "",
            yearlyWeekdayOfMonth1: "The",
            yearlyWeekdayOfMonth1Human: "on the",
            yearlyWeekdayOfMonth2: "",
            yearlyWeekdayOfMonth3: "of",
            yearlyWeekdayOfMonth4: "",
            yearlyRepeatOn: "Repeat on:",

            range: "End recurrence:",
            rangeNoEnd: "Never",
            rangeByOccurrences1: "After",
            rangeByOccurrences1Human: "ends after",
            rangeByOccurrences2: "occurrence(s)",
            rangeByEndDate: "On",
            rangeByEndDateHuman: "ends on",

            including: ", and also",
            except: ", except for",

            cancel: "Cancel",
            save: "Save",

            recurrenceStart: "Start of the recurrence",
            additionalDate: "Additional date",
            include: "Include",
            exclude: "Exclude",
            remove: "Remove",

            orderIndexes: ["first", "second", "third", "fourth", "last"],
            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            shortMonths: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            weekdays: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
            shortWeekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

            longDateFormat: "mmmm dd, yyyy",
            shortDateFormat: "mm/dd/yyyy",

            unsupportedFeatures:
                "Warning: This event uses recurrence features not " +
                "supported by this widget. Saving the recurrence " +
                "may change the recurrence in unintended ways:",
            noTemplateMatch: "No matching recurrence template",
            multipleDayOfMonth:
                "This widget does not support multiple days in monthly or yearly recurrence",
            bysetpos: "BYSETPOS is not supported",
            noRule: "No RRULE in RRULE data",
            noRepeatEvery: 'Error: The "Repeat every"-field must be between 1 and 1000',
            noEndDate: "Error: End date is not set. Please set a correct value",
            noRepeatOn: 'Error: "Repeat on"-value must be selected',
            pastEndDate: "Error: End date cannot be before start date",
            noEndAfterNOccurrences:
                'Error: The "After N occurrences"-field must be between 1 and 1000',
            alreadyAdded: "This date was already added",

            rtemplate: {
                daily: "Daily",
                mondayfriday: "Monday and Friday",
                weekdays: "Weekday",
                weekly: "Weekly",
                monthly: "Monthly",
                yearly: "Yearly",
            },
        },

        readOnly: false,
        firstDay: 0,

        // "REMOTE" FIELD
        startField: null,
        startFieldYear: null,
        startFieldMonth: null,
        startFieldDay: null,
        ajaxURL: null,
        ajaxContentType: "application/json; charset=utf8",
        ributtonExtraClass: "",

        // INPUT CONFIGURATION
        hasRepeatForeverButton: true,

        // JQUERY TEMPLATE NAMES
        template: {
            form: "#jquery-recurrenceinput-form-tmpl",
            display: "#jquery-recurrenceinput-display-tmpl",
        },

        // RECURRENCE TEMPLATES
        rtemplate: {
            daily: {
                rrule: "FREQ=DAILY",
                fields: ["ridailyinterval", "rirangeoptions"],
            },
            mondayfriday: {
                rrule: "FREQ=WEEKLY;BYDAY=MO,FR",
                fields: ["rirangeoptions"],
            },
            weekdays: {
                rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
                fields: ["rirangeoptions"],
            },
            weekly: {
                rrule: "FREQ=WEEKLY",
                fields: ["riweeklyinterval", "riweeklyweekdays", "rirangeoptions"],
            },
            monthly: {
                rrule: "FREQ=MONTHLY",
                fields: ["rimonthlyinterval", "rimonthlyoptions", "rirangeoptions"],
            },
            yearly: {
                rrule: "FREQ=YEARLY",
                fields: ["riyearlyinterval", "riyearlyoptions", "rirangeoptions"],
            },
        },
    },

    load_icons: async function () {
        return {
            reload: await utils.resolveIcon("arrow-clockwise"),
            remove: await utils.resolveIcon("trash"),
            exclude: await utils.resolveIcon("calendar-x"),
            include: await utils.resolveIcon("plus-circle"),
        };
    },

    init: async function () {
        // tmpl BEFORE recurrenceinput
        import("./recurrence.scss");

        this.el.classList.add("recurrence-widget");
        var icons = await this.load_icons();

        var config = {
            ...this.options,
            ...this.options.configuration,
            icons: icons,
        };

        // our recurrenceinput widget instance
        var recurrenceinput = new RecurrenceInput(config, this.el);
        // hide textarea and place display widget after textarea
        this.$el.after(recurrenceinput.display);

        // hide the textarea
        this.el.style.display = "none";
    },
});
