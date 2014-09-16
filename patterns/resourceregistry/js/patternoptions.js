/* global alert */

define([
  'jquery',
  'mockup-ui-url/views/base',
  'underscore',
  'mockup-utils',
  'mockup-patterns-resourceregistry-url/js/fields',
], function($, BaseView, _, utils, fields) {
  'use strict';

  var PatternOptionsView = BaseView.extend({
    tagName: 'div',
    className: 'tab-pane patternoptions',
    template: _.template(
      '<div class="clearfix">' +
        '<div class="btn-group pull-right">' +
          '<button class="btn btn-default add-pattern">Add pattern</button>' +
          '<button class="btn btn-default save">save</button>' +
        '</div>' +
      '</div>' +
      '<div class="row clearfix">' +
        '<div class="form col-md-12"></div></div>'),
    events: {
      'click .btn.save': 'saveClicked',
      'click .btn.add-pattern': 'addPattern'
    },

    initialize: function(options){
      BaseView.prototype.initialize.apply(this, [options]);
      this.loading = this.options.tabView.loading;
    },

    saveClicked: function(e){
      e.preventDefault();
      var self = this;
      self.options.tabView.loading.show();
      $.ajax({
        url: self.options.data.manageUrl,
        type: 'POST',
        dataType: 'json',
        data: {
          action: 'save-pattern-options',
          data: JSON.stringify(self.options.data.patternoptions),
          _authenticator: utils.getAuthenticator()
        },
        success: function(){
          self.options.tabView.loading.hide();
        },
        error: function(){
          self.options.tabView.loading.hide();
          alert('error saving less variables');
        }
      });
    },

    addPattern: function(e){
      e.preventDefault();
      var self = this;
      self.options.data.patternoptions[utils.generateId('new-pattern-')] = '';
      self.render();
    },

    inputChanged: function(){
      var self = this;
      var data = {};
      self.$('.form-group').each(function(){
        data[$(this).find('.field-name').val()] = $(this).find('.field-value').val();
      });
     self.options.data.patternoptions = data;
    },

    afterRender: function(){
      var self = this;
      var settings = self.options.data.patternoptions;
      var $form = self.$('.form');
      _.each(_.keys(settings), function(name){
        $form.append((new fields.PatternFieldView({
          registryData: settings,
          title: name,
          name: name,
          value: settings[name],
          onChange: function(){
            self.inputChanged();
          }
         }).render().el));
      });
    }
  });

  return PatternOptionsView;

});
