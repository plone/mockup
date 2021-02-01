import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import utils from "../../../../core/utils";
import registry from "patternslib/src/core/registry";
import BaseView from "../../../../core/ui/views/base";
import ActionMenuTemplate from "../../templates/actionmenu.xml";
import "../../../modal/modal";
import "../../../tooltip/tooltip";
import "bootstrap/js/src/dropdown";
import actionmenu_generator from "../actionmenu";
import Actions from "../actions";

export default BaseView.extend({
    className: "btn-group actionmenu",
    template: _.template(ActionMenuTemplate),

    // Static menu options
    menuOptions: null,
    // Dynamic menu options

    eventConstructor: function (definition) {
        const method = definition.method;
        if (!method || !this.actions[method]) {
            return false;
        }
        return this.actions[method];
    },

    events: function () {
        /* Backbone.view.events
         * Specify a set of DOM events, which will bound to methods on the view.
         */
        var self = this;
        var result = {};
        var menuOptionsCategorized = {};
        _.each(self.menuOptions, function (menuOption, key) {
            // set a unique identifier to uniquely bind the events.
            var idx = utils.generateId();
            menuOption.idx = idx;
            menuOption.name = key; // we want to add the action's key as class name to the output.

            var category = menuOption.category || "dropdown";
            if (menuOptionsCategorized[category] === undefined) {
                menuOptionsCategorized[category] = [];
            }
            menuOptionsCategorized[category].push(menuOption);
            menuOption.css = menuOption.css || "";
            if (menuOption.modal === true) {
                // add standard pat-plone-modal.
                // If you want another modal implementation, don't use modal=true but set the css option on action items.
                menuOption.css += " pat-plone-modal";
            }

            // Create event handler and add it to the results object.
            var e = self.eventConstructor(menuOption);
            if (e) {
                result["click a." + idx] = e;
            }
        });

        // Abusing the loop above to also initialize menuOptionsCategorized
        self.menuOptionsCategorized = menuOptionsCategorized;
        return result;
    },

    initialize: async function (options) {
        var self = this;
        this.actions = new Actions(options);
        BaseView.prototype.initialize.apply(self, [options]);
        self.options = options;
        self.selectedCollection = self.app.selectedCollection;

        // Then acquire the constructor method if specified, and
        // override those options here.  All definition done here so
        // that self.events() will return the right things.
        self.menuOptions = actionmenu_generator(self);
    },
    render: function () {
        var self = this;
        self.$el.empty();

        var data = this.model.toJSON();
        data.header = self.options.header || null;
        data.menuOptions = self.menuOptionsCategorized;
        self.$el.html(
            self.template(
                $.extend(
                    {
                        _t: _t,
                        id: utils.generateId(),
                    },
                    data
                )
            )
        );

        if (data.menuOptions.dropdown) {
            self.$dropdown = self.$(".dropdown-toggle");
            self.$dropdown.dropdown();
        }

        if (self.options.className) {
            self.$el.addClass(self.options.className);
        }

        registry.scan(this.$el);

        return this;
    },
});
