define([
  'jquery',
  'underscore',
  'mockup-patterns-filemanager-url/js/basepopover',
  'translate'
], function($, _, PopoverView, _t) {
  'use strict';

  var FileSearchView = PopoverView.extend({
    className: 'popover filesearch',
    title: _.template('<%= _t("File Search") %>'),
    content: _.template(
      '<form>' +
        '<div class="input-group">' +
          '<input type="text" class="search form-control" ' +
                  'id="file-search-field" placeholder="<%= _t("Find theme resource in plone") %>">' +
          '<span class="input-group-btn">' +
            '<input type="submit" class="btn btn-primary" value="<%= _t("Search") %>"/>' +
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
      self.$form.submit(function(e) {
        e.preventDefault();
        $.ajax({
          url: self.app.options.resourceSearchUrl,
          dataType: 'json',
          success: function(data) {
            self.$results.empty();
            _.each(data, function(item) {
              var $item = $(
                '<li class="list-group-item" data-id="' + item.id + '">' +
                  '<span class="badge"><a href=#">' + _t('Customize') + '</a></span>' +
                  item.id +
                '</li>');
              $('a', $item).click(function(e) {
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
          self.app.refreshTree();
        }
      });
    }
  });

  return FileSearchView;
});
