/* global define, describe, beforeEach, afterEach, it */
define([
    "expect",
    "jquery",
    "sinon",
    "pat-registry",
    "mockup-patterns-pickadate",
    "mockup-patterns-select2",
], function (expect, $, sinon, registry, PickADate) {
    "use strict";

    window.mocha.setup("bdd");
    $.fx.off = true;

    /* ==========================
   TEST: PickADate
  ========================== */

    describe("PickADate", function () {
        beforeEach(function () {
            this.$el = $(
                '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "false"}\'/></div>'
            );
            this.clock = sinon.useFakeTimers(
                new Date(2016, 12, 23, 15, 30).getTime()
            );
        });

        afterEach(function () {
            $("body").empty();
            this.clock.restore();
        });

        it("date and time element initialized", function () {
            var self = this;

            // pickadate is not initialized
            expect($(".pattern-pickadate-wrapper", self.$el).length).to.equal(
                0
            );

            // scan dom for patterns
            registry.scan(self.$el);

            // pickadate is initialized
            expect($(".pattern-pickadate-wrapper", this.$el).length).to.equal(
                1
            );

            var dateWrapper = $(".pattern-pickadate-date", self.$el).parent(),
                timeWrapper = $(".pattern-pickadate-time", self.$el).parent();

            // main element is hidden
            expect(self.$el.is(":hidden")).to.be.equal(true);

            // date and time inputs are there by default
            expect($(".pattern-pickadate-date", self.$el).length).to.equal(1);
            expect($(".pattern-pickadate-time", self.$el).length).to.equal(1);

            // no value on main element
            expect(self.$el.val()).to.be.equal("");

            // no picker is open
            expect(dateWrapper.find(".picker--opened").length).to.be.equal(0);
            expect(timeWrapper.find(".picker--opened").length).to.be.equal(0);
        });

        it("open date picker", function () {
            var self = this;
            registry.scan(self.$el);
            var dateWrapper = $(".pattern-pickadate-date", self.$el).parent(),
                timeWrapper = $(".pattern-pickadate-time", self.$el).parent();

            // we open date picker (calendar)
            $(".pattern-pickadate-date", self.$el).click();

            this.clock.tick(1000);
            // date picker should be opened but not time picker
            expect(dateWrapper.find(".picker--opened").length).to.be.equal(1);
            expect(timeWrapper.find(".picker--opened").length).to.be.equal(0);
        });

        it("select date from picker", function () {
            var self = this;
            registry.scan(self.$el);
            var dateWrapper = $(".pattern-pickadate-date", self.$el).parent(),
                timeWrapper = $(".pattern-pickadate-time", self.$el).parent();

            // select some date
            $(".pattern-pickadate-date", self.$el).click();
            var $selectedDate = dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", self.$el).attr("data-value")
            ).to.be.equal($selectedDate.attr("data-pick"));

            // since time is not selected we still dont expect main element to have
            // value
            expect($(".pat-pickadate", self.$el).val()).to.be.equal("");

            // we open time picker
            $(".pattern-pickadate-time", self.$el).click();

            // time picker should be opened but not date picker
            this.clock.tick(1000);
            expect(dateWrapper.find(".picker--opened").length).to.be.equal(0);
            expect(timeWrapper.find(".picker--opened").length).to.be.equal(1);

            // select some time
            var $selectedTime = timeWrapper.find("li").first().next().click();

            // selected time should be saved on time picker element
            expect(
                $(".pattern-pickadate-time", self.$el).attr("data-value")
            ).to.be.equal($selectedTime.attr("data-pick"));

            // main element should now have value
            expect($(".pat-pickadate", self.$el).val()).to.not.equal("");
        });

        it("date and time picker except custom settings", function () {
            var self = this;

            // custom settings for date and time widget
            $(".pat-pickadate", self.$el).attr(
                "data-pat-pickadate",
                JSON.stringify({
                    date: {
                        selectYears: false,
                        selectMonths: false,
                    },
                    time: {
                        interval: 60,
                    },
                })
            );

            // scan dom for patterns
            registry.scan(self.$el);

            // there are not dropdowns to select year or month
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--year").length
            ).to.be.equal(0);
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--month").length
            ).to.be.equal(0);

            // there should be 24 items for each hour in time picker list.
            // The clear button is not shown in favor of a date + time clear button.
            expect(
                $(".pattern-pickadate-time", self.$el).parent().find("li")
                    .length
            ).to.be.equal(24);
        });

        it("only date element", function () {
            var self = this;

            // add option which disables time picker
            $(".pat-pickadate", self.$el).attr(
                "data-pat-pickadate",
                "time:false"
            );

            // pickadate is not initialized
            expect($(".pattern-pickadate-wrapper", self.$el).length).to.equal(
                0
            );

            // scan dom for patterns
            registry.scan(self.$el);

            // pickadate is initialized
            expect($(".pattern-pickadate-wrapper", self.$el).length).to.equal(
                1
            );

            var dateWrapper = $(".pattern-pickadate-date", self.$el).parent();

            // main element is hidden
            expect(self.$el.is(":hidden")).to.be.equal(true);

            // date input is there by default
            expect($(".pattern-pickadate-date", self.$el).length).to.equal(1);
            expect($(".pattern-pickadate-time", self.$el).length).to.equal(0);

            // no value on main element
            expect(self.$el.val()).to.be.equal("");

            // date picker is not open
            expect(dateWrapper.find(".picker--opened").length).to.be.equal(0);

            // we open date picker (calendar)
            $(".pattern-pickadate-date", self.$el).click();

            // date picker should be opened
            this.clock.tick(1000);
            expect(dateWrapper.find(".picker--opened").length).to.be.equal(1);

            // select some date
            var $selectedDate = dateWrapper.find("td > div").first().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-date", self.$el).attr("data-value")
            ).to.be.equal($selectedDate.attr("data-pick"));

            // and also on main element since time element is disabled
            expect($(".pat-pickadate", self.$el).val()).to.not.equal("");
        });

        it("only time element", function () {
            var self = this;

            // add option which disables date picker
            $(".pat-pickadate", self.$el).attr(
                "data-pat-pickadate",
                "date:false"
            );

            // pickadate is not initialized
            expect($(".pattern-pickadate-wrapper", self.$el).length).to.equal(
                0
            );

            // scan dom for patterns
            registry.scan(self.$el);

            // pickadate is initialized
            expect($(".pattern-pickadate-wrapper", self.$el).length).to.equal(
                1
            );

            var timeWrapper = $(".pattern-pickadate-time", self.$el).parent();

            // main element is hidden
            expect(self.$el.is(":hidden")).to.be.equal(true);

            // time input is there by default
            expect($(".pattern-pickadate-date", self.$el).length).to.equal(0);
            expect($(".pattern-pickadate-time", self.$el).length).to.equal(1);

            // no value on main element
            expect(self.$el.val()).to.be.equal("");

            // time picker is not open
            expect(timeWrapper.find(".picker--opened").length).to.be.equal(0);

            // we open time picker (calendar)
            $(".pattern-pickadate-time", self.$el).click();

            // time picker should be opened
            this.clock.tick(1000);
            expect(timeWrapper.find(".picker--opened").length).to.be.equal(1);

            // select some time
            var $selectedTime = timeWrapper.find("li").first().next().click();

            // selected date should be saved on date picker element
            expect(
                $(".pattern-pickadate-time", self.$el).attr("data-value")
            ).to.be.equal($selectedTime.attr("data-pick"));

            // and also on main element since time element is disabled
            expect($(".pat-pickadate", self.$el).val()).to.not.equal("");
        });

        it("populating date and time picker", function () {
            var self = this;

            // custom settings for date and time widget
            $(".pat-pickadate", self.$el).attr("value", "2001-10-10 10:10");

            // scan dom for patterns
            registry.scan(self.$el);

            // date picker value is parsed correctly from main element ...
            expect(
                $(".pattern-pickadate-date", self.$el).attr("data-value")
            ).to.be.equal("2001-10-10");

            // ... and make sure 2001-10-10 is picked in the date picker calendar
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--year > :selected")
                    .val()
            ).to.be.equal("2001");
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--month > :selected")
                    .val()
            ).to.be.equal("9");
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__day--selected")
                    .text()
            ).to.be.equal("10");

            // time picker value is parsed correctly from main element
            expect(
                $(".pattern-pickadate-time", self.$el).attr("data-value")
            ).to.be.equal("10:10");

            // and make sure 10:00 AM is picked in the time picker list
            expect(
                $(".pattern-pickadate-time", self.$el)
                    .parent()
                    .find(".picker__list-item--selected")
                    .attr("data-pick")
            ).to.be.equal("630");
        });

        it("populating only time picker", function () {
            var self = this;

            // custom settings for date and time widget
            $(".pat-pickadate", self.$el)
                .attr("value", "15:10")
                .attr("data-pat-pickadate", "date:false");

            // scan dom for patterns
            registry.scan(self.$el);

            // time picker value is parsed correctly from main element
            expect(
                $(".pattern-pickadate-time", self.$el).attr("data-value")
            ).to.be.equal("15:10");

            // and make sure 10:00 AM is picked in the time picker list
            expect(
                $(".pattern-pickadate-time", self.$el)
                    .parent()
                    .find(".picker__list-item--selected")
                    .attr("data-pick")
            ).to.be.equal("930");
        });

        it("populating only date picker", function () {
            var self = this;

            // custom settings for date and time widget
            $(".pat-pickadate", self.$el)
                .attr("value", "1801-12-30")
                .attr("data-pat-pickadate", "time:false");

            // scan dom for patterns
            registry.scan(self.$el);

            // date picker value is parsed correctly from main element ...
            expect(
                $(".pattern-pickadate-date", self.$el).attr("data-value")
            ).to.be.equal("1801-12-30");

            // ... and make sure 1801-12-30 is picked in the date picker calendar
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--year > :selected")
                    .val()
            ).to.be.equal("1801");
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__select--month > :selected")
                    .val()
            ).to.be.equal("11");
            expect(
                $(".pattern-pickadate-date", self.$el)
                    .parent()
                    .find(".picker__day--selected")
                    .text()
            ).to.be.equal("30");
        });

        it("getting around bug in pickatime when selecting 00:00", function () {
            var self = this;

            // custom settings for time widget
            $(".pat-pickadate", self.$el)
                .attr("value", "00:00")
                .attr("data-pat-pickadate", "date:false");

            registry.scan(self.$el);

            // time picker value is parsed correctly from main element
            expect(
                $(".pattern-pickadate-time", self.$el).attr("data-value")
            ).to.be.equal("00:00");

            // and make sure 10:00 AM is picked in the time picker list
            expect(
                $(".pattern-pickadate-time", self.$el)
                    .parent()
                    .find(".picker__list-item--selected")
                    .attr("data-pick")
            ).to.be.equal("0");
        });

        describe("PickADate with timezone", function () {
            it("has date, time and timezone", function () {
                var self = this,
                    $input = $(".pat-pickadate", self.$el).attr(
                        "data-pat-pickadate",
                        '{"timezone": {"data": [' +
                            '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                            '{"id":"Europe/Vienna","text":"Europe/Vienna"}]},' +
                            '"autoSetTimeOnDateChange": "false"}'
                    );
                self.$el.appendTo("body");
                registry.scan($input);

                // date and time should exist by default
                var $timeWrapper = $(
                        ".pattern-pickadate-time-wrapper",
                        self.$el
                    ),
                    $dateWrapper = $(
                        ".pattern-pickadate-date-wrapper",
                        self.$el
                    );
                expect($timeWrapper.length).to.equal(1);
                expect($dateWrapper.length).to.equal(1);

                // timezone elements should not be available
                var $results = $("li.select2-result-selectable");
                expect($results.length).to.equal(0);

                var $pattern = $("input.pattern-pickadate-timezone");
                $pattern.on("select2-open", function () {
                    // timezone elements should be available
                    $results = $("li.select2-result-selectable");
                    expect($results.length).to.equal(2);
                });
                $("a.select2-choice").trigger("mousedown");

                // value of main element should be empty
                expect($(".pat-pickadate").val()).to.equal("");

                // after changing timezone the value should still be empty
                $pattern.select2("val", "Europe/Berlin", {
                    triggerChange: true,
                });
                expect($pattern.val()).to.equal("Europe/Berlin");
                expect($input.val()).to.equal("");

                // set date and time and check if value of main element gets timezone
                $(".pattern-pickadate-date", self.$el).click();
                $dateWrapper.find("td > div").first().click();
                expect($input.val()).to.equal("");
                $(".pattern-pickadate-time", self.$el).click();
                $timeWrapper.find("li").first().next().click();
                expect($input.val()).to.equal(
                    $("input:last", $dateWrapper).val() +
                        " " +
                        $("input:last", $timeWrapper).val() +
                        " " +
                        "Europe/Berlin"
                );

                // change timezone to second value and check if value of main element changes
                $pattern.select2("val", "Europe/Vienna", {
                    triggerChange: true,
                });
                expect($pattern.val()).to.equal("Europe/Vienna");
                expect($input.val()).to.equal(
                    $("input:last", $dateWrapper).val() +
                        " " +
                        $("input:last", $timeWrapper).val() +
                        " " +
                        "Europe/Vienna"
                );
            });

            it("should take the default timezone when it is set", function () {
                var self = this,
                    $input = $(".pat-pickadate", self.$el).attr(
                        "data-pat-pickadate",
                        '{"timezone": {"default": "Europe/Vienna", "data": [' +
                            '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                            '{"id":"Europe/Vienna","text":"Europe/Vienna"},' +
                            '{"id":"Europe/Madrid","text":"Europe/Madrid"}' +
                            "]}}"
                    );
                self.$el.appendTo("body");
                registry.scan($input);

                // check if data values are set to default
                expect(
                    $(".pattern-pickadate-timezone .select2-chosen").text()
                ).to.equal("Europe/Vienna");
                expect(
                    $("input.pattern-pickadate-timezone").attr("data-value")
                ).to.equal("Europe/Vienna");
            });

            it("should only set the default value when it exists in the list", function () {
                var self = this,
                    $input = $(".pat-pickadate", self.$el).attr(
                        "data-pat-pickadate",
                        '{"timezone": {"default": "Europe/Madrid", "data": [' +
                            '{"id":"Europe/Berlin","text":"Europe/Berlin"},' +
                            '{"id":"Europe/Vienna","text":"Europe/Vienna"}' +
                            "]}}"
                    );
                self.$el.appendTo("body");
                registry.scan($input, ["pickadate"]);

                // check if visible and data value are set to default
                expect(
                    $(".pattern-pickadate-timezone .select2-chosen").text()
                ).to.equal("Enter timezone...");
                expect(
                    $("input.pattern-pickadate-timezone").attr("data-value")
                ).to.equal(undefined);
            });

            it("should write to default and disable the dropdown field if only one value exists", function () {
                var self = this,
                    $input = $(".pat-pickadate", self.$el).attr(
                        "data-pat-pickadate",
                        '{"timezone": {"data": [' +
                            '{"id":"Europe/Berlin","text":"Europe/Berlin"}' +
                            "]}}"
                    );
                self.$el.appendTo("body");
                registry.scan($input, ["pickadate"]);

                var $time = $(".pattern-pickadate-timezone");

                // check if data values are set to default
                expect($(".select2-chosen", $time).text()).to.equal(
                    "Europe/Berlin"
                );
                expect(
                    $("input.pattern-pickadate-timezone").attr("data-value")
                ).to.equal("Europe/Berlin");

                expect(
                    $(".pattern-pickadate-timezone").data("select2")._enabled
                ).to.equal(false);
                expect($(".select2-container-disabled").length).to.equal(1);
            });
        });

        describe("automatically set the time on changing the date", function () {
            it("parseTimeOffset works as expected", function () {
                var pickadate = new PickADate(this.$el, {});

                // test false/true
                expect(pickadate.parseTimeOffset("false")).to.be.equal(false);
                expect(pickadate.parseTimeOffset("true")).to.eql([0, 0]);

                // test setting straight to time
                expect(pickadate.parseTimeOffset("[12, 34]")).to.eql([12, 34]);

                // test adding / substracting
                expect(pickadate.parseTimeOffset("+[1, 10]")).to.eql([16, 40]);
                expect(pickadate.parseTimeOffset("-[1, 10]")).to.eql([14, 20]);

                // Test not exceeding dat/hour boundaries
                expect(pickadate.parseTimeOffset("+[10, 10]")).to.eql([23, 40]);
                expect(pickadate.parseTimeOffset("-[16, 10]")).to.eql([0, 20]);
                expect(pickadate.parseTimeOffset("+[1, 40]")).to.eql([16, 59]);
                expect(pickadate.parseTimeOffset("-[1, 40]")).to.eql([14, 0]);
                expect(pickadate.parseTimeOffset("+[1000, 1000]")).to.eql([
                    23,
                    59,
                ]);
                expect(pickadate.parseTimeOffset("-[1000, 1000]")).to.eql([
                    0,
                    0,
                ]);

                // test complete/partly nonsense
                expect(pickadate.parseTimeOffset("blabla")).to.eql([0, 0]);
                expect(pickadate.parseTimeOffset("[10,20]")).to.eql([10, 20]);
                expect(pickadate.parseTimeOffset('[10,"aha"]')).to.eql([10, 0]);
                expect(pickadate.parseTimeOffset('["who", 20]')).to.eql([
                    0,
                    20,
                ]);
            });

            it("sets the time when date is changed per default", function () {
                var $el = $('<div><input class="pat-pickadate" />');
                registry.scan($el);

                var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

                // set date and time and check if time is also set
                $(".pattern-pickadate-date", $el).click();
                var $selectedDate = $dateWrapper
                    .find("td > div")
                    .first()
                    .click();

                // selected date should be saved on date picker element
                expect(
                    $(".pattern-pickadate-date", $el).attr("data-value")
                ).to.be.equal($selectedDate.attr("data-pick"));

                // default time should be available on time picker element.
                expect(
                    $(".pattern-pickadate-time", $el).attr("data-value")
                ).to.be.equal("15,30");

                // pickadate should be have this value set.
                expect($(".pat-pickadate", $el).val()).to.contain("15:30");
            });

            it("sets the time to a specific value when date is changed", function () {
                var $el = $(
                    '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "[12,30]"}\'/>'
                );
                registry.scan($el);

                var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

                // set date and time and check if time is also set
                $(".pattern-pickadate-date", $el).click();
                var $selectedDate = $dateWrapper
                    .find("td > div")
                    .first()
                    .click();

                // selected date should be saved on date picker element
                expect(
                    $(".pattern-pickadate-date", $el).attr("data-value")
                ).to.be.equal($selectedDate.attr("data-pick"));

                // default time should be available on time picker element.
                expect(
                    $(".pattern-pickadate-time", $el).attr("data-value")
                ).to.be.equal("12,30");

                // pickadate should be have this value set.
                expect($(".pat-pickadate", $el).val()).to.contain("12:30");
            });

            it("sets the time to a positive offset of the current time when date is changed", function () {
                var $el = $(
                    '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "+[1,0]"}\'/>'
                );
                registry.scan($el);

                var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

                // set date and time and check if time is also set
                $(".pattern-pickadate-date", $el).click();
                var $selectedDate = $dateWrapper
                    .find("td > div")
                    .first()
                    .click();

                // selected date should be saved on date picker element
                expect(
                    $(".pattern-pickadate-date", $el).attr("data-value")
                ).to.be.equal($selectedDate.attr("data-pick"));

                // default time should be available on time picker element.
                expect(
                    $(".pattern-pickadate-time", $el).attr("data-value")
                ).to.be.equal("16,30");

                // pickadate should be have this value set.
                expect($(".pat-pickadate", $el).val()).to.contain("16:30");
            });

            it("sets the time to a negative offset of the current time when date is changed", function () {
                var $el = $(
                    '<div><input class="pat-pickadate" data-pat-pickadate=\'{"autoSetTimeOnDateChange": "-[1,0]"}\'/>'
                );
                registry.scan($el);

                var $dateWrapper = $(".pattern-pickadate-date", $el).parent();

                // set date and time and check if time is also set
                $(".pattern-pickadate-date", $el).click();
                var $selectedDate = $dateWrapper
                    .find("td > div")
                    .first()
                    .click();

                // selected date should be saved on date picker element
                expect(
                    $(".pattern-pickadate-date", $el).attr("data-value")
                ).to.be.equal($selectedDate.attr("data-pick"));

                // default time should be available on time picker element.
                expect(
                    $(".pattern-pickadate-time", $el).attr("data-value")
                ).to.be.equal("14,30");

                // pickadate should be have this value set.
                expect($(".pat-pickadate", $el).val()).to.contain("14:30");
            });
        });

        describe("set / clear date and time with buttons", function () {
            it("set and clear date and time", function () {
                var $el = $('<div><input class="pat-pickadate"/>');
                registry.scan($el);

                // first, it's unset
                expect($(".pat-pickadate", $el).val()).to.be.equal("");

                // now set it to now.
                $(".pattern-pickadate-now", $el).click();
                // TODO: should test for emitting ``updated.pickadate.patterns``, but our expect framework doesn't support that.
                expect($(".pat-pickadate", $el).val()).to.be.equal(
                    "2017-01-23 15:30"
                );

                // now clear it.
                $(".pattern-pickadate-clear", $el).click();
                // TODO: should test for emitting ``updated.pickadate.patterns``, but our expect framework doesn't support that.
                expect($(".pat-pickadate", $el).val()).to.be.equal("");
            });

            it("set and clear date", function () {
                var $el = $(
                    "<div><input class=\"pat-pickadate\" data-pat-pickadate='date:false'/>"
                );
                registry.scan($el);

                // first, it's unset
                expect($(".pat-pickadate", $el).val()).to.be.equal("");

                // now set it to now.
                $(".pattern-pickadate-now", $el).click();
                expect($(".pat-pickadate", $el).val()).to.be.equal("15:30");

                // now clear it.
                $(".pattern-pickadate-clear", $el).click();
                expect($(".pat-pickadate", $el).val()).to.be.equal("");
            });

            it("set and clear time", function () {
                var $el = $(
                    "<div><input class=\"pat-pickadate\" data-pat-pickadate='time:false'/>"
                );
                registry.scan($el);

                // first, it's unset
                expect($(".pat-pickadate", $el).val()).to.be.equal("");

                // now set it to now.
                $(".pattern-pickadate-now", $el).click();
                expect($(".pat-pickadate", $el).val()).to.be.equal(
                    "2017-01-23"
                );

                // now clear it.
                $(".pattern-pickadate-clear", $el).click();
                expect($(".pat-pickadate", $el).val()).to.be.equal("");
            });

            it("hide today and clear buttons", function () {
                var $el = $(
                    "<div><input class=\"pat-pickadate\" data-pat-pickadate='today:false;clear:false'/>"
                );
                registry.scan($el);
                // today and clear buttons are missing
                expect($(".pattern-pickadate-now", $el).length).to.be.equal(0);
                expect($(".pattern-pickadate-clear", $el).length).to.be.equal(
                    0
                );
            });
        });
    });
});
