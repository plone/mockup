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
        const method = definition.method?.bind?.(this);
        if (!method || !this.actions[method]) {
            return false;
        }
        return this.actions[method];
    },

    events: function () {
        /* Backbone.view.events
         * Specify a set of DOM events, which will bound to methods on the view.
         */
        const result = {};
        const menuOptionsCategorized = {};

        _.each(this.menuOptions, (menuOption, key) => {
            // set a unique identifier to uniquely bind the events.
            const idx = utils.generateId();
            menuOption.idx = idx;
            menuOption.name = key; // we want to add the action's key as class name to the output.

            const category = menuOption.category || "dropdown";
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
            const e = this.eventConstructor(menuOption);
            if (e) {
                result["click a." + idx] = e;
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
        for(const button of data.menuOptions.button){
           if(button.icon){
               button.iconSVG = await utils.resolveIcon('plone.icon.' + button.icon);
           }
        }
        for(const button of data.menuOptions.dropdown){
           if(button.icon){
               button.iconSVG = await utils.resolveIcon('plone.icon.' + button.icon);
           }
        }
        this.el.innerHTML = this.template(
            $.extend(
                {
                    dropdownIcon: await utils.resolveIcon('plone.icon.plone-settings'),
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
