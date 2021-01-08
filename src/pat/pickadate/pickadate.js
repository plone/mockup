import "pickadate/lib/picker";
import "pickadate/lib/picker.date";
import "pickadate/lib/picker.time";
import $ from "jquery";
import _t from "../../core/i18n-wrapper";
import Base from "patternslib/src/core/base";
import dom from "patternslib/src/core/dom";
import utils from "../../core/utils";

import PatternSelect2 from "../select2/select2";

import "pickadate/lib/themes/classic.css";
import "pickadate/lib/themes/classic.date.css";
import "pickadate/lib/themes/classic.time.css";

export default Base.extend({
    name: "pickadate",
    trigger: ".pat-pickadate",
    parser: "mockup",
    defaults: {
        separator: " ",
        date: {
            selectYears: true,
            selectMonths: true,
            formatSubmit: "yyyy-mm-dd",
            format: "yyyy-mm-dd",
            labelMonthNext: _t("Next month"),
            labelMonthPrev: _t("Previous month"),
            labelMonthSelect: _t("Select a month"),
            labelYearSelect: _t("Select a year"),
            // hide buttons
            clear: false,
            close: false,
            today: false,
        },
        time: {
            clear: false, // hide button
        },
        today: _t("Today"),
        clear: _t("Clear"),
        timezone: null,
        autoSetTimeOnDateChange: "+[0,0]",
        classWrapperName: "pattern-pickadate-wrapper",
        classSeparatorName: "pattern-pickadate-separator",
        classDateName: "pattern-pickadate-date",
        classDateWrapperName: "pattern-pickadate-date-wrapper",
        classTimeName: "pattern-pickadate-time",
        classTimeWrapperName: "pattern-pickadate-time-wrapper",
        classTimezoneName: "pattern-pickadate-timezone",
        classTimezoneWrapperName: "pattern-pickadate-timezone-wrapper",
        classClearName: "pattern-pickadate-clear",
        classNowName: "pattern-pickadate-now",
        placeholderDate: _t("Enter date..."),
        placeholderTime: _t("Enter time..."),
        placeholderTimezone: _t("Enter timezone..."),
    },
    parseTimeOffset: function (timeOffset) {
        var op = undefined;
        if (timeOffset.indexOf("+") === 0) {
            op = "+";
            timeOffset = timeOffset.split("+")[1];
        } else if (timeOffset.indexOf("-") === 0) {
            op = "-";
            timeOffset = timeOffset.split("-")[1];
        }
        try {
            timeOffset = JSON.parse(timeOffset);
        } catch (e) {
            timeOffset = undefined;
        }
        if (timeOffset === false) {
            return false;
        } else if (timeOffset === true || Array.isArray(timeOffset) !== true) {
            return [0, 0];
        }

        var hours = parseInt(timeOffset[0], 10) || 0,
            mins = parseInt(timeOffset[1], 10) || 0;

        if (op === "+" || op === "-") {
            var offset = new Date(),
                curHours = offset.getHours(),
                curMins = offset.getMinutes();

            if (op === "+") {
                hours = curHours + hours;
                if (hours > 23) {
                    hours = 23;
                }
                mins = curMins + mins;
                if (mins > 59) {
                    mins = 59;
                }
            } else if (op === "-") {
                hours = curHours - hours;
                if (hours < 0) {
                    hours = 0;
                }
                mins = curMins - mins;
                if (mins < 0) {
                    mins = 0;
                }
            }
        }
        return [hours, mins];
    },
    init: function () {
        var self = this,
            value = self.$el.val().split(" "),
            dateValue = value[0] || "",
            timeValue = value[1] || "";

        if (utils.bool(self.options.date) === false) {
            self.options.date = false;
        }
        if (utils.bool(self.options.time) === false) {
            self.options.time = false;
        }
        self.options.autoSetTimeOnDateChange = self.parseTimeOffset(
            self.options.autoSetTimeOnDateChange
        );

        if (self.options.date === false) {
            timeValue = value[0];
        }

        dom.hide(self.$el[0]);

        self.$wrapper = $("<div/>")
            .addClass(self.options.classWrapperName)
            .insertAfter(self.$el);

        if (self.options.date !== false) {
            self.$date = $('<input type="text"/>')
                .attr("placeholder", self.options.placeholderDate)
                .attr("data-value", dateValue)
                .addClass(self.options.classDateName)
                .appendTo(
                    $("<div/>")
                        .addClass(self.options.classDateWrapperName)
                        .appendTo(self.$wrapper)
                )
                .pickadate(
                    $.extend(true, {}, self.options.date, {
                        onSet: function (e) {
                            if (e.select !== undefined) {
                                self.$date.attr("data-value", e.select);
                                if (
                                    self.options.autoSetTimeOnDateChange !==
                                        false &&
                                    self.$time
                                ) {
                                    if (
                                        !self.$time
                                            .pickatime("picker")
                                            .get("select")
                                    ) {
                                        self.$time
                                            .pickatime("picker")
                                            .set(
                                                "select",
                                                self.options
                                                    .autoSetTimeOnDateChange
                                            );
                                    }
                                }
                                if (
                                    self.options.time === false ||
                                    self.$time.attr("data-value") !== ""
                                ) {
                                    self.updateValue.call(self);
                                }
                            }
                            if (e.hasOwnProperty("clear")) {
                                self.$el.val("");
                                self.$date.attr("data-value", "");
                            }
                        },
                    })
                );
        }

        if (self.options.time !== false) {
            self.options.time.formatSubmit = "HH:i";
            self.$time = $('<input type="text"/>')
                .attr("placeholder", self.options.placeholderTime)
                .attr("data-value", timeValue)
                .addClass(self.options.classTimeName)
                .appendTo(
                    $("<div/>")
                        .addClass(self.options.classTimeWrapperName)
                        .appendTo(self.$wrapper)
                )
                .pickatime(
                    $.extend(true, {}, self.options.time, {
                        onSet: function (e) {
                            if (e.select !== undefined) {
                                self.$time.attr("data-value", e.select);
                                if (
                                    self.options.date === false ||
                                    self.$date.attr("data-value") !== ""
                                ) {
                                    self.updateValue.call(self);
                                }
                            }
                            if (e.hasOwnProperty("clear")) {
                                self.$el.val("");
                                self.$time.attr("data-value", "");
                            }
                        },
                    })
                );

            // XXX: bug in pickatime
            // work around pickadate bug loading 00:xx as value
            if (
                typeof timeValue === "string" &&
                timeValue.substring(0, 2) === "00"
            ) {
                self.$time
                    .pickatime("picker")
                    .set("select", timeValue.split(":"));
                self.$time.attr("data-value", timeValue);
            }
        }

        if (
            self.options.date !== false &&
            self.options.time !== false &&
            self.options.timezone
        ) {
            self.$separator = $("<span/>")
                .addClass(self.options.classSeparatorName)
                .html(
                    self.options.separator === " "
                        ? "&nbsp;"
                        : self.options.separator
                )
                .appendTo(self.$wrapper);
        }

        if (self.options.timezone !== null) {
            self.$timezone = $('<input type="text"/>')
                .addClass(self.options.classTimezoneName)
                .appendTo(
                    $("<div/>")
                        .addClass(self.options.classTimezoneWrapperName)
                        .appendTo(self.$wrapper)
                );

            new PatternSelect2(
                self.$timezone,
                $.extend(
                    true,
                    {
                        placeholder: self.options.placeholderTimezone,
                        width: "10em",
                    },
                    self.options.timezone,
                    { multiple: false }
                )
            );

            self.$timezone.on("change", function (e) {
                if (e.val !== undefined) {
                    self.$timezone.attr("data-value", e.val);
                    if (
                        (self.options.date === false ||
                            self.$date.attr("data-value") !== "") &&
                        (self.options.time === false ||
                            self.$time.attr("data-value") !== "")
                    ) {
                        self.updateValue.call(self);
                    }
                }
            });

            var defaultTimezone = self.options.timezone.default;
            // if timezone has a default value included
            if (defaultTimezone) {
                var isInList;
                // the timezone list contains the default value
                self.options.timezone.data.some(function (obj) {
                    isInList =
                        obj.text === self.options.timezone.default
                            ? true
                            : false;
                    return isInList;
                });
                if (isInList) {
                    self.$timezone.attr("data-value", defaultTimezone);
                    self.$timezone
                        .parent()
                        .find(".select2-chosen")
                        .text(defaultTimezone);
                }
            }
            // if data contains only one timezone this value will be chosen
            // and the timezone dropdown list will be disabled and
            if (self.options.timezone.data.length === 1) {
                self.$timezone.attr(
                    "data-value",
                    self.options.timezone.data[0].text
                );
                self.$timezone
                    .parent()
                    .find(".select2-chosen")
                    .text(self.options.timezone.data[0].text);
                self.$timezone.select2("enable", false);
            }
        }

        if (utils.bool(self.options.today)) {
            self.$now = $(
                '<button type="button" class="btn btn-xs btn-info" title="' +
                    self.options.today +
                    '"><span class="glyphicon glyphicon-time"></span></button>'
            )
                .addClass(self.options.classNowName)
                .on("click", function (e) {
                    e.preventDefault();
                    var now = new Date();
                    if (self.$date) {
                        self.$date.data("pickadate").set("select", now);
                    }
                    if (self.$time) {
                        self.$time.data("pickatime").set("select", now);
                    }
                    self.emit("updated");
                })
                .appendTo(self.$wrapper);
        }

        if (utils.bool(self.options.clear)) {
            self.$clear = $(
                '<button type="button" class="btn btn-xs btn-danger" title="' +
                    self.options.clear +
                    '"><span class="glyphicon glyphicon-trash"></span></button>'
            )
                .addClass(self.options.classClearName)
                .on("click", function (e) {
                    e.preventDefault();
                    if (self.$date) {
                        self.$date.data("pickadate").clear();
                    }
                    if (self.$time) {
                        self.$time.data("pickatime").clear();
                    }
                    self.emit("updated");
                })
                .appendTo(self.$wrapper);
        }
    },
    updateValue: function () {
        var self = this,
            value = "";

        if (self.options.date !== false) {
            var date = self.$date.data("pickadate").component,
                dateValue = self.$date.data("pickadate").get("select"),
                formatDate = date.formats.toString;
            if (dateValue) {
                value += formatDate.apply(date, [
                    self.options.date.formatSubmit,
                    dateValue,
                ]);
            }
        }

        if (self.options.date !== false && self.options.time !== false) {
            value += " ";
        }

        if (self.options.time !== false) {
            var time = self.$time.data("pickatime").component,
                timeValue = self.$time.data("pickatime").get("select"),
                formatTime = time.formats.toString;
            if (timeValue) {
                value += formatTime.apply(time, ["HH:i", timeValue]);
            }
        }

        if (self.options.timezone !== null) {
            var timezone = " " + self.$timezone.attr("data-value");
            if (timezone) {
                value += timezone;
            }
        }

        self.$el.val(value);

        self.emit("updated");
    },
});
