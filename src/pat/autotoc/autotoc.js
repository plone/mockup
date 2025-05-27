import $ from "jquery";
import Base from "@patternslib/patternslib/src/core/base";
import utils from "@patternslib/patternslib/src/core/utils";
import Tab from "bootstrap/js/dist/tab";

export default Base.extend({
    name: "autotoc",
    trigger: ".pat-autotoc",
    parser: "mockup",
    defaults: {
        section: "section",
        levels: "h1,h2,h3",
        IDPrefix: "autotoc-item-",
        classTOCName: "autotoc-nav nav",
        classContentAreaName: "autotoc-content tab-content",
        classSectionName: "autotoc-section tab-pane fade",
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

        self.$nav = $("<nav/>")
            .attr("aria-label", "Tab Navigation")

        self.$toc = $("<ul/>")
            .addClass(self.options.classTOCName)
            .appendTo(self.$nav);

        if (self.options.prependTo) {
            self.$nav.prependTo(self.options.prependTo);
        } else if (self.options.appendTo) {
            self.$nav.appendTo(self.options.appendTo);
        } else {
            self.$nav.prependTo(self.$el);
        }


        if (self.options.className) {
            self.$el.addClass(self.options.className);
        }

        $(self.options.section, self.$el)
            .addClass(self.options.classSectionName)
            .attr("role", "tabpanel")
            .attr("tabindex", "0")

        var asTabs = self.$el.hasClass("autotabs");

        if (asTabs) {
            self.$toc.addClass("nav-tabs");
            self.$contentArea = $("<div/>").addClass(self.options.classContentAreaName);
            self.$contentArea.insertAfter(self.$nav);
            $(self.options.section, self.$el).appendTo(self.$contentArea);
            $(self.options.section, self.$el).find("legend").hide();
        } else {
            self.$toc.addClass([
                "flex-column",
                "float-end",
                "border",
                "mt-0",
                "me-0",
                "mb-3",
                "ms-3",
                "py-2",
                "px-0"
            ])
        }

        var activeId = null;

        $(self.options.levels, self.$el).each(function (i) {
            const section = this.closest(self.options.section);
            const $level = $(this);
            let id = $level.prop("id") ? $level.prop("id") : $(section).prop("id");

            if (!id || $("#" + id).length > 0) {
                id = self.options.IDPrefix + self.name + "-" + i;
            }

            const tabId = `${id}-tab`;
            $(section).attr("id", id).attr("aria-labelledby", tabId);

            if (window.location.hash === "#" + id) {
                activeId = tabId;
            }
            if (activeId === null && $level.hasClass(self.options.classActiveName)) {
                activeId = tabId;
            }
            $level.data("navref", id);

            const $navItem = $("<li/>");
            $navItem
                .addClass("nav-item")
                .attr("role", "presentation")
                .appendTo(self.$toc);

            const $nav = $("<a/>");
            $nav.appendTo($navItem)
                .text($level.text())
                .attr("id", tabId)
                .attr("href", "#" + id)
                .attr("aria-controls", id)
                .attr("data-bs-toggle", "tab")
                .attr("data-bs-target", `#${id}`)
                .addClass([
                    "nav-link",
                    self.options.classLevelPrefixName + self.getLevel($level),
                ])
                .on("click", function (e, options) {
                    if (!options) {
                        options = {
                            doScroll: true,
                            skipHash: false,
                        };
                    }
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
                            window.history.pushState({}, "", `#${id}`);
                        }
                    }
                });
            if (!asTabs) {
                $nav.addClass([
                    "text-decoration-underline",
                    "p-0",
                    "mx-3",
                ]);
            }
            $level.data("autotoc-trigger-id", id);

            self.tabs.push({
                section: section,
                id: id,
                nav: $nav[0],
            });
        });

        if (activeId) {
            const activeTabButton = self.$toc.find("a#" + activeId)[0];
            if (activeTabButton) {
                const tab = Tab.getOrCreateInstance(activeTabButton);
                tab.show();
            }
        } else {
            const firstTabButton = self.$toc.find("a").first()[0];
            if (firstTabButton) {
                const tab = Tab.getOrCreateInstance(firstTabButton);
                tab.show();
            }
        }

        // After DOM tree is built, initialize eventual validation
        this.initialize_validation();
    },

    initialize_validation: function () {
        const el = this.el

        // Initialize only on forms
        const form = el.closest("form");
        if (!form) {
            return;
        }

        for (const tab of this.tabs) {
            if (
                tab.section.querySelectorAll(
                    "label.required, label .required, [required]",
                ).length > 0
            ) {
                tab.nav.classList.add("required");
            } else {
                tab.nav.classList.remove("required");
            }
        }

        // Initialize the validation css class markings only for pat-validation forms.
        if (!form.matches(".pat-validation")) {
            return;
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
