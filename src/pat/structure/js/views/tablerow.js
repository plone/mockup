import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import _t from "../../../../core/i18n-wrapper";
import utils from "../../../../core/utils";
import Backbone from "backbone";
import moment from "moment";

import Navigation from "../navigation";
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
        this.now = moment();
    },

    expired: function (data) {
        if (!data.attributes.ExpirationDate) {
            return false;
        }
        var dt = moment(data.attributes.ExpirationDate);
        return dt.diff(this.now, "seconds") < 0;
    },

    ineffective: function (data) {
        if (!data.attributes.EffectiveDate) {
            return false;
        }
        var dt = moment(data.attributes.EffectiveDate);
        return dt.diff(this.now, "seconds") > 0;
    },

    render: function () {
        var self = this;
        var data = this.model.toJSON();
        data.selected = false;
        if (this.selectedCollection.findWhere({ UID: data.UID })) {
            data.selected = true;
        }
        data.attributes = self.model.attributes;
        data.activeColumns = self.app.activeColumns;
        data.availableColumns = self.app.availableColumns;
        data.portal_type = data.portal_type ? data.portal_type : "";
        data.contenttype = data.portal_type.toLowerCase().replace(/\.| /g, "-");
        data._authenticator = utils.getAuthenticator();
        data.thumb_scale = self.app.thumb_scale;

        var viewAction =
            (self.app.typeToViewAction &&
                self.app.typeToViewAction[data.attributes.portal_type]) ||
            "";
        data.viewURL = data.attributes.getURL + viewAction;

        data._t = _t;
        data.expired = this.expired(data);
        data.ineffective = this.ineffective(data);
        self.$el.html(self.template(data));
        var attrs = self.model.attributes;
        self.$el
            .addClass("state-" + attrs["review_state"])
            .addClass("type-" + attrs.portal_type); // jshint ignore:line
        if (attrs["is_folderish"]) {
            // jshint ignore:line
            self.$el.addClass("folder");
        }
        self.$el.attr("data-path", data.path);
        self.$el.attr("data-UID", data.UID);
        self.$el.attr("data-id", data.id);
        self.$el.attr("data-type", data.portal_type);
        self.$el.attr("data-folderish", data["is_folderish"]); // jshint ignore:line
        self.$el.removeClass("expired");
        self.$el.removeClass("ineffective");

        if (data.expired) {
            self.$el.addClass("expired");
        }

        if (data.ineffective) {
            self.$el.addClass("ineffective");
        }

        self.el.model = this.model;

        var canMove = !!self.app.options.moveUrl;

        self.menu = new ActionMenuView({
            app: self.app,
            model: self.model,
            menuOptions: self.app.menuOptions,
            canMove: canMove,
        });

        $(".actionmenu-container", self.$el).append(self.menu.render().el);
        return this;
    },
    itemClicked: async function (e) {
        /* check if this should just be opened in new window */
        var keyEvent = this.app.keyEvent;
        // Resolve the correct handler based on these keys.
        // Default handlers live in ../navigation.js (bound to Nav)
        if ((keyEvent && keyEvent.ctrlKey) || !this.model.attributes.is_folderish) {
            // middle/ctrl-click or not a folder content
            // not yet implemented.
            return null;
        }
        return Navigation.folderClicked(e);
    },
    itemSelected: function () {
        var checkbox = this.$("input")[0];
        if (checkbox.checked) {
            this.app.selectedCollection.add(this.model.clone());
        } else {
            this.app.selectedCollection.removeResult(this.model);
        }

        var selectedCollection = this.selectedCollection;

        /* check for shift click now */
        var keyEvent = this.app.keyEvent;
        if (
            keyEvent &&
            keyEvent.shiftKey &&
            this.app["last_selected"] && // jshint ignore:line
            this.app["last_selected"].parentNode !== null
        ) {
            // jshint ignore:line
            var $el = $(this.app["last_selected"]); // jshint ignore:line
            var lastCheckedIndex = $el.index();
            var thisIndex = this.$el.index();
            this.app.tableView.$('input[type="checkbox"]').each(function () {
                $el = $(this);
                var index = $el.parents("tr").index();
                if (
                    (index > lastCheckedIndex && index < thisIndex) ||
                    (index < lastCheckedIndex && index > thisIndex)
                ) {
                    this.checked = checkbox.checked;
                    var $tr = $(this).closest("tr.itemRow");
                    if ($tr.length > 0) {
                        var model = $tr[0].model;
                        var existing = selectedCollection.getByUID(model.attributes.UID);
                        if (this.checked) {
                            if (!existing) {
                                selectedCollection.add(model.clone());
                            }
                        } else if (existing) {
                            selectedCollection.removeResult(existing);
                        }
                    }
                }
            });
        }
        this.app["last_selected"] = this.el; // jshint ignore:line
    },
});
