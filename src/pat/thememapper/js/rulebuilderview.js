import _ from "underscore";
import PopoverView from "../../filemanager/js/basepopover";
import RulebuilderTemplate from "../templates/rulebuilder.xml";

var rulebuilderTemplate = _.template(RulebuilderTemplate);

export default PopoverView.extend({
    className: "popover rulebuilderView",
    title: _.template('<%= _t("Rule Builder") %>'),
    content: rulebuilderTemplate,
    render: function () {
        PopoverView.prototype.render.call(this);
        return this;
    },
    toggle: function (button, e) {
        PopoverView.prototype.toggle.apply(this, [button, e]);
        if (!this.opened) {
            return;
        } else {
            this.app.ruleBuilder.checkSelectors();
        }
    },
});
