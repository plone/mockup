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

    generate_events: function () {
        /* Backbone.view.events:
         * refactored since Backbone 1.4.1 calls "events" before "initialize"
         */
        const result = {};

        _.each(this.menuOptions, (menuOption, key) => {
            // Create event handler and add it to the results object.
            const method = menuOption.method;
            if (!method || !this.actions[method]) {
                return false;
            }
            result[`click a.${key}`] = this.actions[method].bind(this.actions);
        });

        return result;
    },

    initialize: function (options) {
        this.actions = new Actions(options);
        BaseView.prototype.initialize.apply(this, [options]);
        this.options = options;
        this.selectedCollection = this.app.selectedCollection;

        this.menuOptions = actionmenu_generator(this);
        // define events here and delegate them manually
        this.events = this.generate_events();
        // Backbone API
        this.delegateEvents();
    },

    menuOptionsCategorized: async function() {
        const result = {};

        _.each(this.menuOptions, async (menuOption, key) => {
            // set a unique identifier to uniquely bind the events.
            menuOption.idx = utils.generateId();
            menuOption.name = key; // we want to add the action's key as class name to the output.

            const category = menuOption.category || "dropdown";
            if (result[category] === undefined) {
                result[category] = [];
            }
            result[category].push(menuOption);
            menuOption.classes = [menuOption.name, menuOption.idx];
            if (menuOption.css) {
                menuOption.classes.push(menuOption.css);
            }
            if (menuOption.modal === true) {
                // add standard pat-plone-modal.
                // If you want another modal implementation, don't use modal=true but set the css option on action items.
                menuOption.css += " pat-plone-modal";
            }
            if (menuOption.icon) {
                menuOption.iconSVG = await utils.resolveIcon(menuOption.icon);
            }
        });

        return result;
    },

    render: async function () {
        this.el.innerHTML = "";

        const data = this.model.toJSON();
        data.header = this.options.header || null;
        data.menuOptions = await this.menuOptionsCategorized();

        this.el.innerHTML = this.template(
            $.extend(
                {
                    dropdownIcon: await utils.resolveIcon("plone-settings"),
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
        return this.el;
    },
});
