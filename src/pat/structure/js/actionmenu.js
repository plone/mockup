import _ from "underscore";
import _t from "../../../core/i18n-wrapper";

const menuOptions = {
    "openItem": {
        url: "#",
        title: _t("Open"),
        category: "button",
        icon: "plone-view",
        css: "",
        modal: false,
    },
    "editItem": {
        url: "#",
        title: _t("Edit"),
        category: "button",
        icon: "plone-edit",
        css: "",
        modal: false,
    },
    "cutItem": {
        method: "cutClicked",
        url: "#",
        title: _t("Cut"),
        category: "dropdown",
        icon: "plone-cut",
        css: "",
        modal: false,
    },
    "copyItem": {
        method: "copyClicked",
        url: "#",
        title: _t("Copy"),
        category: "dropdown",
        icon: "plone-copy",
        css: "",
        modal: false,
    },
    "pasteItem": {
        method: "pasteClicked",
        url: "#",
        title: _t("Paste"),
        category: "dropdown",
        icon: "plone-paste",
        css: "",
        modal: false,
    },
    "move-top": {
        method: "moveTopClicked",
        url: "#",
        title: _t("Move to top of folder"),
        category: "dropdown",
        icon: "arrow-bar-up",
        css: "",
        modal: false,
    },
    "move-bottom": {
        method: "moveBottomClicked",
        url: "#",
        title: _t("Move to bottom of folder"),
        category: "dropdown",
        icon: "arrow-bar-down",
        css: "",
        modal: false,
    },
    "set-default-page": {
        method: "setDefaultPageClicked",
        url: "#",
        title: _t("Set as default page"),
        category: "dropdown",
        icon: "check-circle",
        css: "",
        modal: false,
    },
    "selectAll": {
        method: "selectAll",
        url: "#",
        title: _t("Select all contained items"),
        category: "dropdown",
        icon: "check-all",
        css: "",
        modal: false,
    },
};

const ActionMenu = function (menu) {
    // If an explicit menu was specified as an option to AppView, this
    // constructor will not override that.
    if (menu.menuOptions !== null) {
        return menu.menuOptions;
    }

    const model = menu.model.attributes;
    const app = menu.app;

    const result = _.clone(menuOptions);
    if (!(app.pasteAllowed() && model.is_folderish)) {
        delete result.pasteItem;
    }
    if (app.inQueryMode() || menu.options.canMove === false) {
        delete result["move-top"];
        delete result["move-bottom"];
    }
    if (
        app.defaultPageTypes.indexOf(model.portal_type) === -1 ||
        !app.setDefaultPageUrl
    ) {
        delete result["set-default-page"];
    }

    if (!model.is_folderish) {
        delete result.selectAll;
    }

    const typeToViewAction = app.options.typeToViewAction;
    const viewAction = (typeToViewAction && typeToViewAction[model.portal_type]) || "";
    result.openItem.url = model.getURL + viewAction;
    result.editItem.url = model.getURL + "/edit";

    return result;
};

export default ActionMenu;
