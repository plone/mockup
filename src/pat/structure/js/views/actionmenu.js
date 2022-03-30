import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import utils from "../../../../core/utils";
import registry from "@patternslib/patternslib/src/core/registry";
import BaseView from "../../../../core/ui/views/base";
import ActionMenuTemplate from "../../templates/actionmenu.xml";
import "../../../modal/modal";
import "@patternslib/patternslib/src/pat/tooltip/tooltip";
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
        return this.actions[method].bind(this.actions);
    },

    events: function () {
        /* Backbone.view.events
         * Specify a set of DOM events, which will bound to methods on the view.
         */
        const result = {};
        const menuOptionsCategorized = {};

        _.each(this.menuOptions, (menuOption, key) => {
            // set a unique identifier to uniquely bind the events.
            menuOption.idx = utils.generateId();
            menuOption.name = key; // we want to add the action's key as class name to the output.

            const category = menuOption.category || "dropdown";
            if (menuOptionsCategorized[category] === undefined) {
                menuOptionsCategorized[category] = [];
            }
            menuOptionsCategorized[category].push(menuOption);
            menuOption.classes = [menuOption.name, menuOption.idx];
            if(menuOption.css){
                menuOption.classes.push(menuOption.css);
            }
            if (menuOption.modal === true) {
                // add standard pat-plone-modal.
                // If you want another modal implementation, don't use modal=true but set the css option on action items.
                menuOption.css += " pat-plone-modal";
            }

            // Create event handler and add it to the results object.
            const e = this.eventConstructor(menuOption);
            if (e) {
                result[`click a.${menuOption.name}`] = e;
            }
        });

        // Abusing the loop above to also initialize menuOptionsCategorized
        this.menuOptionsCategorized = menuOptionsCategorized;
        return result;
    },

    initialize: function (options) {
        this.actions = new Actions(options);
        BaseView.prototype.initialize.apply(this, [options]);
        this.options = options;
        this.selectedCollection = this.app.selectedCollection;

        // Then acquire the constructor method if specified, and
        // override those options here.  All definition done here so
        // that this.events() will return the right things.
        this.menuOptions = actionmenu_generator(this);
    },

    render: async function () {
        this.el.innerHTML = "";

        const data = this.model.toJSON();
        data.header = this.options.header || null;
        data.menuOptions = this.menuOptionsCategorized;
        this.el.innerHTML = this.template(
            $.extend(
                {
                    dropdownIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                                   </svg>`,
                    _t: _t,
                    id: utils.generateId(),
                },
                data
            )
        );

        if (this.options.className) {
            this.$el.addClass(this.options.className);
        }

        registry.scan(this.$el);

        return this;
    },
});
