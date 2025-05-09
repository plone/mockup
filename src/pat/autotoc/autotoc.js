import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import utils from "@patternslib/patternslib/src/core/utils";

export default Base.extend({
    name: "autotoc",
    trigger: ".pat-autotoc",
    parser: "mockup",
    defaults: {
        section: "section",
        levels: "h1,h2,h3",
        IDPrefix: "autotoc-item-",
        classTOCName: "autotoc-nav",
        classSectionName: "autotoc-section",
        classLevelPrefixName: "autotoc-level-",
        classActiveName: "active",
        scrollDuration: "slow",
        scrollEasing: "swing",
        validationDelay: 200, // Note: This is set to twice as the default delay time for validation.
    },

    tabs: [],

    init: function () {
        import("./autotoc.scss");

        var self = this;

        self.$toc = $("<nav/>").addClass(self.options.classTOCName);

        if (self.options.prependTo) {
            self.$toc.prependTo(self.options.prependTo);
        } else if (self.options.appendTo) {
            self.$toc.appendTo(self.options.appendTo);
        } else {
            self.$toc.prependTo(self.$el);
        }

        if (self.options.className) {
            self.$el.addClass(self.options.className);
        }

        $(self.options.section, self.$el).addClass(self.options.classSectionName);

        var asTabs = self.$el.hasClass("autotabs");

        var activeId = null;

        $(self.options.levels, self.$el).each(function (i) {
            const section = this.closest(self.options.section);
            const $level = $(this);
            let id = $level.prop("id") ? $level.prop("id") : $(section).prop("id");

            if (!id || $("#" + id).length > 0) {
                id = self.options.IDPrefix + self.name + "-" + i;
            }
            if (window.location.hash === "#" + id) {
                activeId = id;
            }
            if (activeId === null && $level.hasClass(self.options.classActiveName)) {
                activeId = id;
            }
            $level.data("navref", id);
            const $nav = $("<a/>");
            $nav.appendTo(self.$toc)
                .text($level.text())
                .attr("id", id)
                .attr("href", "#" + id)
                .addClass(self.options.classLevelPrefixName + self.getLevel($level))
                .on("click", function (e, options) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!options) {
                        options = {
                            doScroll: true,
                            skipHash: false,
                        };
                    }
                    var $el = $(this);
                    self.$toc
                        .children("." + self.options.classActiveName)
                        .removeClass(self.options.classActiveName);
                    self.$el
                        .children("." + self.options.classActiveName)
                        .removeClass(self.options.classActiveName);
                    $(e.target).addClass(self.options.classActiveName);
                    $level
                        .parents(self.options.section)
                        .addClass(self.options.classActiveName);
                    if (
                        options.doScroll !== false &&
                        self.options.scrollDuration &&
                        $level &&
                        !asTabs
                    ) {
                        $("body,html").animate(
                            {
                                scrollTop: $level.offset().top,
                            },
                            self.options.scrollDuration,
                            self.options.scrollEasing
                        );
                    }
                    if (self.$el.parents(".plone-modal").length !== 0) {
                        self.$el.trigger("resize.plone-modal.patterns");
                    }
                    $(this).trigger("clicked");
                    if (!options.skipHash) {
                        if (window.history && window.history.pushState) {
                            window.history.pushState({}, "", "#" + $el.attr("id"));
                        }
                    }
                });
            $level.data("autotoc-trigger-id", id);

            self.tabs.push({
                section: section,
                id: id,
                nav: $nav[0],
            });
        });

        if (activeId) {
            $("a#" + activeId).trigger("click", {
                doScroll: true,
                skipHash: true,
            });
        } else {
            self.$toc.find("a").first().trigger("click", {
                doScroll: false,
                skipHash: true,
            });
        }

        // After DOM tree is built, initialize eventual validation
        this.initialize_validation(self.$el);
    },

    initialize_validation: function ($el) {
        const el = $el[0];

        // Initialize only on pat-validation forms.
        const form = el.closest("form.pat-validation");
        if (!form) {
            return;
        }

        for (const tab of this.tabs) {
            if (tab.section.querySelectorAll("[required]").length > 0) {
                tab.nav.classList.add("required");
            } else {
                tab.nav.classList.remove("required");
            }
        }

        const debounced_validation_marker = utils.debounce(() => {
            this.validation_marker();
        }, this.options.validationDelay);

        form.addEventListener("pat-update", (e) => {
            if (e.detail?.pattern !== "validation") {
                // Nothing to do.
                return;
            }
            debounced_validation_marker();
        });
    },

    validation_marker: function () {
        for (const tab of this.tabs) {
            if (tab.section.querySelectorAll(":invalid").length > 0) {
                tab.nav.classList.add("invalid");
            } else {
                tab.nav.classList.remove("invalid");
            }
        }
    },

    getLevel: function ($el) {
        var elementLevel = 0;
        $.each(this.options.levels.split(","), function (level, levelSelector) {
            if ($el.filter(levelSelector).length === 1) {
                elementLevel = level + 1;
                return false;
            }
        });
        return elementLevel;
    },
});
