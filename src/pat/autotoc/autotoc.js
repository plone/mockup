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

        const $nav = $("<nav/>")
            .attr("aria-label", "Tab Navigation");

        const $toc = $("<ul/>")
            .addClass(self.options.classTOCName)
            .appendTo($nav);

        if (self.options.prependTo) {
            $nav.prependTo(self.options.prependTo);
        } else if (self.options.appendTo) {
            $nav.appendTo(self.options.appendTo);
        } else {
            $nav.prependTo(self.$el);
        }

        if (self.options.className) {
            self.$el.addClass(self.options.className);
        }

        $(self.options.section, self.$el)
            .addClass(self.options.classSectionName)
            .attr("role", "tabpanel")
            .attr("tabindex", "0");

        var asTabs = self.$el.hasClass("autotabs");

        if (asTabs) {
            $toc.addClass("nav-tabs");
            self.$contentArea = $("<div/>").addClass(self.options.classContentAreaName);
            self.$contentArea.insertAfter($nav);
            $(self.options.section, self.$el).appendTo(self.$contentArea);
            $(self.options.section, self.$el).find("legend").hide();
        } else {
            $toc.addClass([
                "flex-column",
                "float-end",
                "border",
                "mt-0",
                "me-0",
                "mb-3",
                "ms-3",
                "py-2",
                "px-0"
            ]);
        }

        var activeId = null;

        $(self.options.levels, self.$el).each(function (i) {
            const $level = $(this);
            const $section = $level.closest(self.options.section);
            let sectionId = $section.prop("id");
            let sectionHash = `#${sectionId}`;
            const tabId = `${self.options.IDPrefix}${self.name}-${i}`;
            const tabHash = `#${tabId}`;
            const levelId = `${tabId}-pane`;
            const levelHash = `#${levelId}`;

            if (!asTabs) {
                $level.attr("id", levelId).attr("aria-labelledby", tabId);
            } else {
                $section.attr("aria-labelledby", tabId);
                if (!sectionId) {
                    // sections without ID get auto generated "<tabId>-pane"
                    sectionId = levelId;
                    sectionHash = `#${levelId}`;
                    $section.attr("id", levelId);
                }
            }

            // NOTE: if you have nested autotocs then you have to add the
            // parent autotoc tabId to `options.IDPrefix` of the sub autotoc
            // in order to mark parent and sub tab as active.
            if (activeId === null && (window.location.hash.indexOf(tabHash) == 0 || $level.hasClass(self.options.classActiveName))) {
                activeId = tabId;
            }

            const $navItem = $("<li/>");
            $navItem
                .addClass("nav-item")
                .attr("role", "presentation")
                .appendTo($toc);

            const $nav = $("<a/>");
            $nav.appendTo($navItem)
                .html($level.html())
                .attr("id", tabId)
                .attr("href", asTabs ? sectionHash : levelHash)
                .attr("aria-controls", asTabs ? sectionId : levelId)
                .attr("data-bs-toggle", "tab")
                .attr("data-bs-target", asTabs ? sectionHash : levelHash)
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
                            window.history.pushState({}, "", tabHash);
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

            self.tabs.push({
                section: $section[0],
                id: levelId,
                nav: $nav[0],
            });
        });

        const activeTabButton = activeId ? $toc.find("a#" + activeId)[0] : $toc.find("a").first()[0];
        const tab = Tab.getOrCreateInstance(activeTabButton);
        tab.show();

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
