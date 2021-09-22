import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import "../pickadate/pickadate";

export default Base.extend({
    name: "eventedit",
    trigger: ".pat-eventedit",
    parser: "mockup",
    defaults: {
        errorClass: "error",
    },
    init: function () {
        var self = this,
            $el = self.$el,
            jq_open_end,
            jq_end,
            jq_start;
        const jq_whole_day = $(
            "#formfield-form-widgets-IEventBasic-whole_day input",
            $el
        );
        const jq_time = $(
            "#formfield-form-widgets-IEventBasic-start .pattern-pickadate-time-wrapper, #formfield-form-widgets-IEventBasic-end .pattern-pickadate-time-wrapper",
            $el
        );

        if (jq_whole_day.length > 0 && jq_time.length > 0) {
            jq_whole_day.bind("change", function (e) {
                self.showHideWidget(jq_time, e.target.checked, true);
            });
            self.showHideWidget(jq_time, jq_whole_day.get(0).checked, false);
        }

        // OPEN END INIT
        jq_open_end = $("#formfield-form-widgets-IEventBasic-open_end input", $el);
        jq_end = $("#formfield-form-widgets-IEventBasic-end", $el);
        if (jq_open_end.length > 0) {
            jq_open_end.bind("change", function (e) {
                self.showHideWidget(jq_end, e.target.checked, true);
            });
            self.showHideWidget(jq_end, jq_open_end.get(0).checked, false);
        }

        // START/END SETTING/VALIDATION
        jq_start = $("#formfield-form-widgets-IEventBasic-start", $el);
        jq_start.each(function () {
            $(this).on("change", ".picker__input", function () {
                self.updateEndDate();
            });
        });
        jq_end.each(function () {
            $(this).on("change", ".picker__input", function () {
                self.validateEndDate();
            });
        });
    },

    getDateTime: function (datetimewidget) {
        var date, time, datetime;
        date = $(
            '.pattern-pickadate-date-wrapper input[name="_submit"]',
            datetimewidget
        ).prop("value");
        date = date.split("-");
        time =
            $(
                '.pattern-pickadate-time-wrapper input[name="_submit"]',
                datetimewidget
            ).prop("value") || "00:00";
        time = time.split(":");

        // We can't just parse the ``date + 'T' + time`` string, because of
        // Chromium bug: https://code.google.com/p/chromium/issues/detail?id=145198
        // When passing date and time components, the passed date/time is
        // interpreted as local time and not UTC.
        datetime = new Date(
            parseInt(date[0], 10),
            parseInt(date[1], 10) - 1, // you know, javascript's month index starts with 0
            parseInt(date[2], 10),
            parseInt(time[0], 10),
            parseInt(time[1], 10)
        );
        return datetime;
    },

    getTimeDelta: function () {
        // Return time delta between the start and end dates in days
        var self = this,
            $el = self.$el,
            start_datetime,
            end_datetime;
        start_datetime = self.getDateTime(
            $("#formfield-form-widgets-IEventBasic-start", $el)
        );
        end_datetime = self.getDateTime(
            $("#formfield-form-widgets-IEventBasic-end", $el)
        );
        return (end_datetime - start_datetime) / 1000 / 60;
    },

    updateEndDate: function () {
        var self = this,
            $el = self.$el,
            jq_start,
            jq_end,
            start_date,
            new_end_date;
        jq_start = $("#formfield-form-widgets-IEventBasic-start", $el);
        jq_end = $("#formfield-form-widgets-IEventBasic-end", $el);

        start_date = self.getDateTime(jq_start);
        new_end_date = new Date(start_date.getTime());
        new_end_date.setMinutes(start_date.getMinutes() + self.getTimeDelta());

        if (new_end_date && !isNaN(new_end_date.getTime())) {
            $(".pattern-pickadate-date", jq_end)
                .pickadate("picker")
                .set("select", new_end_date);
            $(".pattern-pickadate-time", jq_end)
                .pickatime("picker")
                .set("select", new_end_date);
        }
    },

    validateEndDate: function () {
        var self = this,
            $el = self.$el,
            jq_start,
            jq_end,
            start_datetime,
            end_datetime;
        jq_start = $("#formfield-form-widgets-IEventBasic-start", $el);
        jq_end = $("#formfield-form-widgets-IEventBasic-end", $el);
        start_datetime = self.getDateTime(jq_start);
        end_datetime = self.getDateTime(jq_end);
        if (end_datetime < start_datetime) {
            jq_end.addClass(self.options.errorClass);
        } else {
            jq_end.removeClass(self.options.errorClass);
        }
    },

    showHideWidget: function (widget, hide, fade) {
        var $widget = $(widget);
        if (hide === true) {
            if (fade === true) {
                $widget.fadeOut();
            } else {
                $widget.hide();
            }
        } else {
            if (fade === true) {
                $widget.fadeIn();
            } else {
                $widget.show();
            }
        }
    },
});
