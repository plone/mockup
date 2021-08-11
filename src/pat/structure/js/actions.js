import $ from "jquery";
import _t from "../../../core/i18n-wrapper";
import utils from "../../../core/utils";
import Backbone from "backbone";
import Result from "./models/result";

// use a more primative class than Backbone.Model?
export default Backbone.Model.extend({
    initialize: function (options) {
        this.options = options;
        this.app = options.app;
        this.model = options.model;
        this.selectedCollection = this.app.selectedCollection;
    },

    selectAll: function (e) {
        // This implementation is very specific to the default collection
        // with the reliance on its queryParser and queryHelper.  Custom
        // collection (Backbone.Paginator.requestPager implementation)
        // will have to come up with their own action for this.
        e.preventDefault();
        let page = 1;
        let count = 0;
        const getPage = () => {
            this.app.loading.show();
            $.ajax({
                url: this.app.collection.url,
                type: "GET",
                dataType: "json",
                data: {
                    query: this.app.collection.queryParser({
                        searchPath: this.model.attributes.path,
                    }),
                    batch: JSON.stringify({
                        page: page,
                        size: 100,
                    }),
                    attributes: JSON.stringify(
                        this.app.collection.queryHelper.options.attributes
                    ),
                },
            }).done((data) => {
                const items = this.app.collection.parse(data, count);
                count += items.length;
                for (const item of items) {
                    this.app.selectedCollection.add(new Result(item));
                }
                page += 1;
                if (data.total > count) {
                    getPage();
                } else {
                    this.app.loading.hide();
                    this.app.tableView.render();
                }
            });
        };
        getPage();
    },

    doAction: function (buttonName, successMsg, failMsg) {
        $.ajax({
            url: this.app.buttons.get(buttonName).options.url,
            data: {
                selection: JSON.stringify([this.model.attributes.UID]),
                folder: this.model.attributes.path,
                _authenticator: utils.getAuthenticator(),
            },
            dataType: "json",
            type: "POST",
        }).done((data) => {
            let msg;
            if (data.status === "success") {
                msg = _t(`${successMsg} "${this.model.attributes.Title}"`);
                this.app.collection.pager();
                this.app.updateButtons();
            } else {
                msg = _t(`Error ${failMsg} "${this.model.attributes.Title}"`);
            }
            this.app.clearStatus();
            this.app.setStatus({
                text: msg,
                type: data.status || "warning",
            });
        });
    },

    cutClicked: function (e) {
        e.preventDefault();
        this.doAction("cut", _t("Cut"), _t("cutting"));
    },

    copyClicked: function (e) {
        e.preventDefault();
        this.doAction("copy", _t("Copied"), _t("copying"));
    },

    pasteClicked: function (e) {
        e.preventDefault();
        this.doAction("paste", _t("Pasted into"), _t("Error pasting into"));
    },

    moveTopClicked: function (e) {
        e.preventDefault();
        this.app.moveItem(this.model.attributes.id, "top");
    },

    moveBottomClicked: function (e) {
        e.preventDefault();
        this.app.moveItem(this.model.attributes.id, "bottom");
    },

    setDefaultPageClicked: function (e) {
        e.preventDefault();
        $.ajax({
            url: this.app.getAjaxUrl(this.app.setDefaultPageUrl),
            type: "POST",
            data: {
                _authenticator: $('[name="_authenticator"]').val(),
                id: this.model.attributes.id,
            },
            success: (data) => {
                this.app.ajaxSuccessResponse.apply(this.app, [data]);
            },
            error: (data) => {
                this.app.ajaxErrorResponse.apply(this.app, [data]);
            },
        });
    },
});
