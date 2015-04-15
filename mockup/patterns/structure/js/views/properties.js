define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-ui-url/views/popover',
  'mockup-patterns-pickadate',
  'mockup-patterns-select2'
], function($, _, Backbone, PopoverView, PickADate, Select2) {
  'use strict';

  var PropertiesView = PopoverView.extend({
    className: 'popover properties',
    title: _.template('<%- _t("Modify properties on items") %>'),
    content: _.template(
      '<div class="form-group">' +
        '<label><%- _t("Publication Date") %></label>' +
        '<input class="form-control" name="effective" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label><%- _t("Expiration Date") %></label>' +
        '<input class="form-control" name="expiration" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label><%- _t("Copyright") %></label>' +
        '<textarea class="form-control" name="copyright"></textarea>' +
      '</div>' +
      '<label><%- _t("Creators") %></label>' +
      '<div class="form-group">' +
        '<input name="creators" style="width: 300px" />' +
      '</div>' +
      '<label><%- _t("Contributors") %></label>' +
      '<div class="form-group">' +
        '<input name="contributors" style="width: 300px" />' +
      '</div>' +
      '<label><%- _t("Exclude from nav") %></label>' +
      '<div class="radio">' +
        '<label>' +
          '<input type="radio" name="exclude-from-nav" value="yes" />' +
          '<%- _t("Yes") %>' +
        '</label>' +
      '</div>' +
      '<div class="radio">' +
        '<label>' +
          '<input type="radio" name="exclude-from-nav" value="no" />' +
          '<%- _t("No") %>' +
        '</label>' +
      '</div>' +
      '<button class="btn btn-block btn-primary"><%- _t("Apply") %></button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options) {
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function() {
      PopoverView.prototype.render.call(this);
      this.$effective = this.$('[name="effective"]');
      this.$expiration = this.$('[name="expiration"]');
      this.$copyright = this.$('[name="copyright"]');
      this.$creators = this.$('[name="creators"]');
      this.$contributors = this.$('[name="contributors"]');
      this.$exclude = this.$('[name="exclude-from-nav"]');

      this.creatorsSelect2 = new Select2(this.$creators, {
        multiple: true,
        vocabularyUrl: this.app.options.usersVocabularyUrl
      });
      this.contributorsSelect2 = new Select2(this.$contributors, {
        multiple: true,
        vocabularyUrl: this.app.options.usersVocabularyUrl
      });
      this.effectivePickADate = new PickADate(this.$effective);
      this.expirationPickADate = new PickADate(this.$expiration);
      return this;
    },
    applyButtonClicked: function(e) {
      var data = {
        effectiveDate: this.effectivePickADate.$date.val(),
        effectiveTime: this.effectivePickADate.$time.val(),
        expirationDate: this.expirationPickADate.$date.val(),
        expirationTime: this.expirationPickADate.$time.val(),
        copyright: this.$copyright.val(),
        contributors: JSON.stringify(this.$contributors.select2('data')),
        creators: JSON.stringify(this.$creators.select2('data'))
      };
      if (this.$('[name="exclude-from-nav"]:checked').length > 0) {
        data['exclude_from_nav'] = this.$('[name="exclude-from-nav"]:checked').val(); // jshint ignore:line
      }
      this.app.defaultButtonClickEvent(this.triggerView, data);
      this.hide();
    },
    toggle: function(button, e) {
      PopoverView.prototype.toggle.apply(this, [button, e]);
      if (!this.opened) {
        return;
      }
      this.$effective.attr('value', '');
      this.$expiration.attr('value', '');
      this.$copyright.html('');
      this.$creators.select2('data', []);
      this.$contributors.select2('data', []);
      this.$exclude.each(function() {
        this.checked = false;
      });
    }
  });

  return PropertiesView;
});
