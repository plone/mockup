import $ from "jquery";
import _ from "underscore";
import _t from "../../core/i18n-wrapper";
import Base from "@patternslib/patternslib/src/core/base";
import dom from "@patternslib/patternslib/src/core/dom";

export default Base.extend({
    name: "livesearch",
    trigger: ".pat-livesearch",
    parser: "mockup",
    timeout: null,
    active: false,
    results: null,
    selectedItem: -1,
    resultsClass: "livesearch-results list-group d-none",
    defaults: {
        ajaxUrl: null,
        defaultSortOn: "",
        perPage: 7,
        quietMillis: 350,
        timeoutHide: 200,
        minimumInputLength: 4,
        inputSelector: 'input[type="text"]',
        itemTemplate:
            '<li class="search-result <%- state %> list-group-item list-group-item-action">' +
            '<a class="text-reset text-decoration-none" href="<%- url %>">' +
            '<div class="row">' +
            '<div class="col info">' +
            '<div class="heading"><%- title %></div>' +
            '<div class="description"><%- description %></div>' +
            "</div>" +
            "<% if (img_tag) { %> " +
            '<div class="col img">' +
            "<%= img_tag %>" +
            "</div>" +
            "<% } %> " +
            "</div>" +
            "</a>" +
            "</li>",
    },
    doSearch: function (page) {
        var self = this;
        self.active = true;
        self.render();
        self.$el.addClass("searching");
        var query = self.$el.serialize();
        if (page === undefined) {
            page = 1;
        }
        var sort_on = (function () {
            var parameters = location.search,
                sorton_position = parameters.indexOf("sort_on");
            if (sorton_position === -1) {
                // return default sort
                var $searchResults = $("#search-results");
                if ($searchResults.length > 0) {
                    return $searchResults.attr("data-default-sort");
                }
                return self.options.defaultSortOn;
            }
            // cut string before sort_on parameter
            var sort_on = parameters.substring(sorton_position);
            // cut other parameters
            sort_on = sort_on.split("&")[0];
            // get just the value
            sort_on = sort_on.split("=")[1];
            return sort_on;
        })();

        $.ajax({
            url:
                self.options.ajaxUrl +
                "?" +
                query +
                "&page=" +
                page +
                "&perPage=" +
                self.options.perPage +
                "&sort_on=" +
                sort_on,
            dataType: "json",
        })
            .done(function (data) {
                self.results = data;
                self.page = page;
                // maybe odd here.. but we're checking to see if the user
                // has typed while a search was being performed. Perhap another search if so
                if (query !== self.$el.serialize()) {
                    self.doSearch();
                }
            })
            .fail(function () {
                self.results = {
                    items: [
                        {
                            url: "",
                            title: _t("Error"),
                            description: _t("There was an error searching…"),
                            state: "error",
                            error: false,
                        },
                    ],
                    total: 1,
                };
                self.page = 1;
            })
            .always(function () {
                self.active = false;
                self.selectedItem = -1;
                self.$el.removeClass("searching");
                self.render();
            });
    },
    render: function () {
        var self = this;
        self.$results.empty();

        /* find a status message */

        if (self.active) {
            self.$results.append(
                $('<li class="searching list-group-item">' + _t("searching…") + "</li>")
            );
        } else if (self.results === null) {
            // no results gathered yet
            self.$results.append(
                $(
                    '<li class="no-results no-search list-group-item">' +
                        _t("enter search phrase") +
                        "</li>"
                )
            );
        } else if (self.results.total === 0) {
            self.$results.append(
                $(
                    '<li class="no-results list-group-item">' +
                        _t("no results found") +
                        "</li>"
                )
            );
        } else {
            self.$results.append(
                $(
                    '<li class="results-summary list-group-item">' +
                        _t("found") +
                        " " +
                        self.results.total +
                        " " +
                        _t("results") +
                        "</li>"
                )
            );
        }

        if (self.results !== null) {
            var template = _.template(self.options.itemTemplate);
            _.each(self.results.items, function (item, index) {
                var $el = $(template($.extend({ _t: _t }, item)));
                $el.attr("data-url", item.url).on("click", function () {
                    if (!item.error) {
                        window.location = item.url;
                    }
                });
                if (index === self.selectedItem) {
                    $el.addClass("active");
                }
                self.$results.append($el);
            });
            var nav = {};
            if (self.page > 1) {
                var $prev = $(
                    '<a href="#" class="prev position-absolute ps-3 start-0">' +
                        _t("Previous") +
                        "</a>"
                );
                $prev.on("click", function (e) {
                    self.disableHiding = true;
                    e.preventDefault();
                    self.doSearch(self.page - 1);
                });
                nav.prev = $prev;
            }
            if (self.page * self.options.perPage < self.results.total) {
                var $next = $(
                    '<a href="#" class="next position-absolute pe-3 end-0">' +
                        _t("Next") +
                        "</a>"
                );
                $next.on("click", function (e) {
                    self.disableHiding = true;
                    e.preventDefault();
                    self.doSearch(self.page + 1);
                });
                nav.next = $next;
            }
            if (nav.next || nav.prev) {
                var $li = $(
                    '<li class="list-group-item load-more d-flex justify-content-center"><span class="page">' +
                        self.page +
                        "</span></li>"
                );
                if (nav.prev) {
                    $li.prepend(nav.prev);
                }
                if (nav.next) {
                    $li.append(nav.next);
                }
                self.$results.append($li);
            }
        }
        self.show();
    },
    show: function () {
        /* we are positioning directly below the
         input box, same width */
        var self = this;

        self.$results[0].classList.remove("d-none");
        self.$el[0].classList.add("livesearch-active");
    },
    hide: function () {
        this.$el[0].classList.remove("livesearch-active");
        this.$results[0].classList.add("d-none");
    },
    init: function () {
        // import("./livesearch.scss");

        var self = this;

        self.$input = self.$el.find(self.options.inputSelector);
        self.$input
            .off("focusout")
            .on("focusout", function () {
                /* we put this in a timer so click events still
           get trigger on search results */
                setTimeout(function () {
                    /* hack, look above, to handle dealing with clicks
             unfocusing element */
                    if (!self.disableHiding) {
                        self.hide();
                    } else {
                        self.disableHiding = false;
                        // and refocus elemtn
                        self.$input.focus();
                    }
                }, self.options.timeoutHide);
            })
            .off("focusin")
            .on("focusin", function () {
                if (!self.onceFocused) {
                    /* Case: field already filled out but no reasons
             present yet, do ajax search and grab some results */
                    self.onceFocused = true;
                    if (self.$input.val().length >= self.options.minimumInputLength) {
                        self.doSearch();
                    }
                } else if (!dom.is_visible(self.$results[0])) {
                    self.render();
                }
            })
            .attr("autocomplete", "off")
            .off("keyup")
            .on("keyup", function (e) {
                var code = e.keyCode || e.which;
                // first off, we're capturing esc presses
                if (code === 27) {
                    self.$input.val("");
                    self.hide();
                    return;
                }
                // then, we're capturing up, down and enter key presses
                if (
                    self.results &&
                    self.results.items &&
                    self.results.items.length > 0
                ) {
                    if (code === 13) {
                        /* enter key, check to see if there is a selected item */
                        if (self.selectedItem !== -1) {
                            window.location = self.results.items[self.selectedItem].url;
                        }
                        return;
                    } else if (code === 38) {
                        /* up key */
                        if (self.selectedItem !== -1) {
                            self.selectedItem -= 1;
                            self.render();
                        }
                        return;
                    } else if (code === 40) {
                        /* down key */
                        if (self.selectedItem < self.results.items.length) {
                            self.selectedItem += 1;
                            self.render();
                        }
                        return;
                    }
                }

                /* then, we handle timeouts for doing ajax search */
                if (self.timeout !== null) {
                    clearTimeout(self.timeout);
                    self.timeout = null;
                }
                if (self.active) {
                    return;
                }
                if (self.$input.val().length >= self.options.minimumInputLength) {
                    self.timeout = setTimeout(function () {
                        self.doSearch();
                    }, self.options.quietMillis);
                } else {
                    self.results = null;
                    self.render();
                }
            });
        $("#sorting-options a").on("click", function (e) {
            e.preventDefault();
            self.onceFocused = false;
        });

        /* create result dom */
        self.$results = $('<ul class="' + self.resultsClass + '"></ul>').insertAfter(
            self.$el
        );
    },
});
