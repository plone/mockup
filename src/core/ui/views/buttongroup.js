import _ from "underscore";
import ContainerView from "./container";

export default ContainerView.extend({
    tagName: "div",
    className: "btn-group",
    idPrefix: "btngroup-",
    disable: function () {
        _.each(this.items, function (button) {
            button.disable();
        });
    },
    enable: function () {
        _.each(this.items, function (button) {
            button.enable();
        });
    },
});
