define([
  'underscore',
  'mockup-patterns-filemanager-url/js/basepopover',
  'text!mockup-patterns-thememapper-url/templates/rulebuilder.xml',
], function(_, PopoverView, RulebuilderTemplate) {
  'use strict';
  var rulebuilderTemplate = _.template(RulebuilderTemplate);

  var RuleBuilderView = PopoverView.extend({
    className: 'popover rulebuilderView',
    title: _.template('<%= _t("Rule Builder") %>'),
    content: rulebuilderTemplate,
    render: function() {
      PopoverView.prototype.render.call(this);
      return this;
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      if (!this.opened) {
        return;
      } else {
        this.app.ruleBuilder.checkSelectors();
      }
    }

  });

  return RuleBuilderView;
});
