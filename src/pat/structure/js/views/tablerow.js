import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import utils from "../../../../core/utils";
import Backbone from "backbone";

import ActionMenuView from "./actionmenu";
import TableRowTemplate from "../../templates/tablerow.xml";

export default Backbone.View.extend({
    tagName: "tr",
    className: "itemRow",
    template: _.template(TableRowTemplate),

    events: {
        "change input": "itemSelected",
        "click td.title a.manage": "itemClicked",
    },

    initialize: function (options) {
        this.options = options;
        this.app = options.app;
        this.selectedCollection = this.app.selectedCollection;
        this.table = this.options.table;
        this.now = new Date();
        this.listenTo(this.table, "context-info:set", this.render);
    },

    expired: function (data) {
        if (!data.attributes.ExpirationDate) {
            return false;
        }
        const dt = new Date(data.attributes.ExpirationDate);
        return this.now > dt;
    },

    ineffective: function (data) {
        if (!data.attributes.EffectiveDate) {
            return false;
        }
        const dt = new Date(data.attributes.EffectiveDate);
        return this.now > dt;
    },

    render: async function () {
        const data = this.model.toJSON();

        data.selected = !!this.selectedCollection.findWhere({UID: data.UID});
        data.attributes = this.model.attributes;
        data.activeColumns = this.app.activeColumns;
        data.availableColumns = this.app.availableColumns;
        data.portal_type = data.portal_type ? data.portal_type : "";
        data.contenttype = data.portal_type.toLowerCase().replace(/\.| /g, "-");
        data._authenticator = utils.getAuthenticator();
        data.thumb_scale = this.app.thumb_scale;

        const viewAction = (this.app.typeToViewAction && this.app.typeToViewAction[data.attributes.portal_type]) || "";
        data.viewURL = data.attributes.getURL + viewAction;

        data._t = _t;
        data.expired = this.expired(data);
        data.ineffective = this.ineffective(data);
        this.$el.html(this.template(data));
        const attrs = this.model.attributes;
        this.$el.addClass([`state-${attrs.review_state}`, `type-${attrs.portal_type}`]);
        if (data.is_folderish) {
            this.$el.addClass("folder");
        }
        if(data.id === this.table.contextInfo?.defaultPage){
            this.$el.addClass('default-page');
        }
        this.$el.attr("data-path", data.path);
        this.$el.attr("data-UID", data.UID);
        this.$el.attr("data-id", data.id);
        this.$el.attr("data-type", data.portal_type);
        this.$el.attr("data-folderish", data.is_folderish);
        this.$el.removeClass("expired");
        this.$el.removeClass("ineffective");

        if (data.expired) {
            this.$el.addClass("expired");
        }

        if (data.ineffective) {
            this.$el.addClass("ineffective");
        }

        this.el.model = this.model;

        const canMove = !!this.app.options.moveUrl;

        this.menu = new ActionMenuView({
            app: this.app,
            model: this.model,
            menuOptions: this.app.menuOptions,
            canMove: canMove,
        });
        await this.menu.render();
        $(".actionmenu-container", this.$el).append(this.menu.el);
        return this;
    },

    itemClicked: function (e) {
        /* check if this should just be opened in new window */
        const keyEvent = this.app.keyEvent;
        // Resolve the correct handler based on these keys.
        if ((keyEvent && keyEvent.ctrlKey) || !this.model.attributes.is_folderish) {
            // middle/ctrl-click or not a folder content
            // not yet implemented.
            return null;
        }

        e.preventDefault();
        // handler for folder, go down path and show in contents window.
        this.app.setCurrentPath(this.model.attributes.path);
        // also switch to fix page in batch
        this.app.collection.goTo(this.app.collection.information.firstPage);
    },

    itemSelected: function () {
        const checkbox = this.$("input")[0];
        if (checkbox.checked) {
            this.app.selectedCollection.add(this.model.clone());
        } else {
            this.app.selectedCollection.removeResult(this.model);
        }

        const selectedCollection = this.selectedCollection;

        /* check for shift click now */
        const keyEvent = this.app.keyEvent;
        if (
            keyEvent &&
            keyEvent.shiftKey &&
            this.app["last_selected"] && // jshint ignore:line
            this.app["last_selected"].parentNode !== null
        ) {
            // jshint ignore:line
            let $el = $(this.app["last_selected"]); // jshint ignore:line
            const lastCheckedIndex = $el.index();
            const thisIndex = this.$el.index();
            for (const item of this.app.tableView.$('input[type="checkbox"]')) {
                $el = $(item);
                const index = $el.parents("tr").index();
                if (
                    (index > lastCheckedIndex && index < thisIndex) ||
                    (index < lastCheckedIndex && index > thisIndex)
                ) {
                    this.checked = checkbox.checked;
                    const $tr = $(this).closest("tr.itemRow");
                    if ($tr.length > 0) {
                        const model = $tr[0].model;
                        const existing = selectedCollection.getByUID(
                            model.attributes.UID
                        );
                        if (this.checked) {
                            if (!existing) {
                                selectedCollection.add(model.clone());
                            }
                        } else if (existing) {
                            selectedCollection.removeResult(existing);
                        }
                    }
                }
            }
        }
        this.app["last_selected"] = this.el; // jshint ignore:line
    },
});
