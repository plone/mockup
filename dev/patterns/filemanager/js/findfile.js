define([
  'jquery',
  'underscore',
  'mockup-patterns-filemanager-url/js/basepopover',
  'translate'
], function($, _, PopoverView, _t) {
  'use strict';

  var FindFile = PopoverView.extend({
    className: 'popover filesearch',
    closeOnOutClick: false,
    backdropOptions: {
      zIndex: '1009',
      opacity: '0.4',
      className: 'backdrop backdrop-popover',
      classActiveName: 'backdrop-active',
      closeOnEsc: false,
      closeOnClick: false
    },
    title: _.template('<%= _t("Find File") %>'),
    content: _.template(
      '<form>' +
        '<div class="input-group">' +
          '<input type="text" class="search form-control" ' +
                  'id="file-search-field" placeholder="<%= _t("Find theme resource in plone") %>">' +
        '</div>' +
        '<div class="input-group">' +
          '<input type="submit" class="btn btn-primary" value="<%= _t("Search") %>"/>' +
        '</div>' +
      '</form><br/>' +
      '<ul class="results list-group">' +
      '</ul>'
    ),
    appendToResults: function(item){
      var self = this;
      var $item = $(
        '<li class="list-group-item">' +
          '<span class="badge"><a data-target="' + item.path + '" href=#">' +
          _t(item.filename) + '</a></span>' +
        '</li>');
      $('a', $item).click(function(e) {
        e.preventDefault();
        self.findfile($(this).attr('data-target'));
      });
      self.$results.append($item);
    },
    filterFiles: function(patt, data){
      var self = this;
      _.each(data, function(item) {
        if(item.folder){
          self.filterFiles(patt, item.children);
        }else{
          if(patt.test(item.filename)){
            self.appendToResults(item);
            self.noMatches++;
          }
        }
      });
    },
    render: function() {
      var self = this;
      PopoverView.prototype.render.call(this);
      self.$form = self.$('form');
      self.$searchFor = self.$("input");
      self.$results = self.$('.results');
      self.$form.submit(function(e) {
        e.preventDefault();
        $.ajax({
          url: self.app.options.actionUrl + '?action=dataTree',
          dataType: 'json',
          success: function(data) {
            self.$results.empty();
            self.noMatches = 0;
            var searchFor = self.$searchFor.val();
            var patt = new RegExp(searchFor, "g");
            self.filterFiles(patt, data);
            if(self.noMatches == 0){
              self.$results.append("<span>No results found for " + searchFor + "</span>");
            }
          }
        });
      });
      return self;
    },
    findfile: function(resource) {
      var self = this;
      self.app.doAction('getFile', {
        data: {
          path: resource
        },
        dataType: 'json',
        success: function(data) {
          self.app.fileData[resource] = data;
          self.app.openEditor(resource);
        }
      });
    }
  });

  return FindFile;
});
