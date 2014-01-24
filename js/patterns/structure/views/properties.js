// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//


define([
  'jquery',
  'underscore',
  'backbone',
  'js/ui/views/popover',
  'mockup-patterns-pickadate',
  'mockup-patterns-select2'
], function($, _, Backbone, PopoverView, PickADate, Select2) {
  "use strict";

  var PropertiesView = PopoverView.extend({
    className: 'popover properties',
    title: _.template('Modify properties on items'),
    content: _.template(
      '<label>Publication Date</label>' +
      '<input name="effective" />' +
      '<label>Expiration Date</label>' +
      '<input name="expiration" />' +
      '<label>Copyright</label>' +
      '<textarea name="copyright"></textarea>' +
      '<label>Creators<label>' +
      '<input name="creators" style="width: 300px" />' +
      '<label>Contributors<label>' +
      '<input name="contributors" style="width: 300px" />' +
      '<label>Exclude from nav</label>' +
      '<label class="checkbox">' +
        '<input type="radio" name="exclude-from-nav" value="yes" />' +
        'Yes' +
      '</label>' +
      '<label class="checkbox">' +
        '<input type="radio" name="exclude-from-nav" value="no" />' +
        'No' +
      '</label>' +
      '<button class="btn btn-block btn-primary">Apply</button>'
    ),
    events: {
      'click button': 'applyButtonClicked'
    },
    initialize: function(options){
      this.app = options.app;
      PopoverView.prototype.initialize.apply(this, [options]);
    },
    render: function(){
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
    applyButtonClicked: function(e){
      var data = {
        effectiveDate: this.effectivePickADate.$date.attr('value'),
        effectiveTime: this.effectivePickADate.$time.attr('value'),
        expirationDate: this.expirationPickADate.$date.attr('value'),
        expirationTime: this.expirationPickADate.$time.attr('value'),
        copyright: this.$copyright.val(),
        contributors: JSON.stringify(this.$contributors.select2('data')),
        creators: JSON.stringify(this.$creators.select2('data'))
      };
      if(this.$('[name="exclude-from-nav"]:checked').length > 0){
        data.exclude_from_nav = this.$('[name="exclude-from-nav"]:checked').val();
      }
      this.app.defaultButtonClickEvent(this.triggerView, data);
      this.hide();
    },
    toggle: function(button, e){
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if(!this.opened){
        return;
      }
      this.$effective.attr('value', '');
      this.$expiration.attr('value', '');
      this.$copyright.html('');
      this.$creators.select2('data', []);
      this.$contributors.select2('data', []);
      this.$exclude.each(function(){
        this.checked = false;
      });
    }
  });

  return PropertiesView;
});
