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

    selectAll: async function (e) {
        // This implementation is very specific to the default collection
        // with the reliance on its queryParser and queryHelper.  Custom
        // collection (PageableCollection implementation)
        // will have to come up with their own action for this.
        e.preventDefault();
        let page = 1;
        let count = 0;
        const getPage = async () => {
            this.app.loading.show();

            const url = new URL(this.app.collection.url);
            url.searchParams.append(
                "query",
                this.app.collection.queryParser({
                    searchPath: this.model.attributes.path,
                })
            );
            url.searchParams.append(
                "batch",
                JSON.stringify({
                    page: page,
                    size: 100,
                })
            );
            url.searchParams.append(
                "attributes",
                JSON.stringify(this.app.collection.queryHelper.options.attributes)
            );
            const resp = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            });
            const data = await resp.json();

            const items = this.app.collection.parse(data, count);
            count += items.length;
            for (const item of items) {
                this.app.selectedCollection.add(new Result(item));
            }
            page += 1;
            if (data.total > count) {
                await getPage();
            } else {
                this.app.loading.hide();
                await this.app.tableView.render();
            }
        };
        await getPage();
    },

    doAction: async function (buttonName, successMsg, failMsg) {
        const url = new URL(this.app.buttons.get(buttonName).options.url);
        const resp = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                selection: JSON.stringify([this.model.attributes.UID]),
                folder: this.model.attributes.path,
                _authenticator: utils.getAuthenticator(),
            }),
        });
        const data = await resp.json();

        let msg;
        if (data.status === "success") {
            msg = _t(`${successMsg} "${this.model.attributes.Title}"`);
            this.app.collection.fetch();
            this.app.updateButtons();
        } else {
            msg = _t(`Error ${failMsg} "${this.model.attributes.Title}"`);
        }
        this.app.clearStatus();
        this.app.setStatus({
            text: msg,
            type: data.status || "warning",
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

    setDefaultPageClicked: async function (e) {
        e.preventDefault();
        try {
            const url = new URL(this.app.getAjaxUrl(this.app.setDefaultPageUrl));
            const resp = await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    id: this.model.attributes.id,
                    _authenticator: $('[name="_authenticator"]').val(),
                }),
            });
            const data = await resp.json();
            this.app.ajaxSuccessResponse.apply(this.app, [data]);
        } catch (e) {
            this.app.ajaxSuccessResponse.apply(this.app, [e]);
        }
    },
});
