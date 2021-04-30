import _ from "underscore";
import _t from "../../../core/i18n-wrapper";

var menuOptions = {
    "openItem": {
        url: "#",
        title: _t("Open"),
        category: "button",
        iconCSS: "glyphicon glyphicon-eye-open",
        css: "",
        modal: false,
    },
    "editItem": {
        url: "#",
        title: _t("Edit"),
        category: "button",
        iconCSS: "glyphicon glyphicon-pencil",
        css: "",
        modal: false,
    },
    "cutItem": {
        method: "cutClicked",
        url: "#",
        title: _t("Cut"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-scissors",
        css: "",
        modal: false,
    },
    "copyItem": {
        method: "copyClicked",
        url: "#",
        title: _t("Copy"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-duplicate",
        css: "",
        modal: false,
    },
    "pasteItem": {
        method: "pasteClicked",
        url: "#",
        title: _t("Paste"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-open-file",
        css: "",
        modal: false,
    },
    "move-top": {
        method: "moveTopClicked",
        url: "#",
        title: _t("Move to top of folder"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-step-backward rright",
        css: "",
        modal: false,
    },
    "move-bottom": {
        method: "moveBottomClicked",
        url: "#",
        title: _t("Move to bottom of folder"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-step-backward rleft",
        css: "",
        modal: false,
    },
    "set-default-page": {
        method: "setDefaultPageClicked",
        url: "#",
        title: _t("Set as default page"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-ok-circle",
        css: "",
        modal: false,
    },
    "selectAll": {
        method: "selectAll",
        url: "#",
        title: _t("Select all contained items"),
        category: "dropdown",
        iconCSS: "glyphicon glyphicon-check",
        css: "",
        modal: false,
    },
};

var ActionMenu = function (menu) {
    // If an explicit menu was specified as an option to AppView, this
    // constructor will not override that.
    if (menu.menuOptions !== null) {
        return menu.menuOptions;
    }

    var model = menu.model.attributes;
    var app = menu.app;

    var result = _.clone(menuOptions);
    if (!(app.pasteAllowed() && model.is_folderish)) {
        delete result.pasteItem;
    }
    if (app.inQueryMode() || menu.options.canMove === false) {
        delete result["move-top"];
        delete result["move-bottom"];
    }
    if (
        app.defaultPageTypes.indexOf(model.portal_type) == -1 ||
        !app.setDefaultPageUrl
    ) {
        delete result["set-default-page"];
    }

    if (!model.is_folderish) {
        delete result.selectAll;
    }

    var typeToViewAction = app.options.typeToViewAction;
    var viewAction = (typeToViewAction && typeToViewAction[model.portal_type]) || "";
    result.openItem.url = model.getURL + viewAction;
    result.editItem.url = model.getURL + "/edit";

    return result;
};

export default ActionMenu;
