define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-filemanager-url/js/basepopover'
], function($, _, Backbone, PopoverView) {
  'use strict';

  var CustomizeView = PopoverView.extend({
    className: 'popover customize',
    title: _.template('<%= translations.add_override %>'),
    content: _.template(
      '<form>' +
        '<div class="input-group">' +
          '<input type="text" class="search form-control" ' +
                  'id="search-field" placeholder="<%= translations.search_resources %>">' +
          '<span class="input-group-btn">' +
            '<input type="submit" class="btn btn-primary" value="<%= translations.search %>"/>' +
          '</span>' +
        '</div>' +
      '</form>' +
      '<ul class="results list-group">' +
      '</ul>'
    ),
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      self.$form = self.$('form');
      self.$results = self.$('.results');
      self.$form.submit(function(e){
        e.preventDefault();
        $.ajax({
          url: self.app.options.resourceSearchUrl,
          dataType: 'json',
          success: function(data){
            self.$results.empty();
            _.each(data, function(item){
              var $item = $(
                '<li class="list-group-item" data-id="' + item.id + '">' +
                  '<span class="badge"><a href=#">' + self.options.transitions.customize + '</a></span>' +
                  item.id +
                '</li>');
              $('a', $item).click(function(e){
                e.preventDefault();
                self.customize($(this).parents('li').eq(0).attr('data-id'));
              });
              self.$results.append($item);
            });
          }
        });
      });
      return self;
    },
    customize: function(resource) {
      var self = this;
      self.app.doAction('customize', {
        type: 'POST',
        data: {
          resource: resource
        },
        success: function(data) {
          self.hide();
          // clear out
          self.$('input.search').attr('value', '');
          self.$results.empty();
          self.app.$tree.tree('reload');
        }
      });
    }
  });

  return CustomizeView;
});
