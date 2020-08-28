define([
  'jquery',
  'underscore',
  'mockup-patterns-filemanager-url/js/basepopover',
  'translate'
], function($, _, PopoverView, _t) {
  'use strict';

  var FindInFiles = PopoverView.extend({
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
    title: _.template('<%= _t("Find in File") %>'),
    content: _.template(
      '<form>' +
        '<div class="input-group">' +
          '<input type="text" class="search form-control" ' +
                  'id="file-search-field" placeholder="<%= _t("Find text within theme resource in plone") %>">' +
        '</div>' +
        '<div class="input-group">' +
          '<input type="submit" class="btn btn-primary" value="<%= _t("Search") %>"/>' +
        '</div>' +
      '</form><br/>' +
      '<ul style="max-height: 400px; overflow: auto;" class="results list-group">' +
      '</ul>'
    ),
    appendToResults: function(item){
      var self = this, seen = null;
      var file_item =
        '<li class="list-group-item" data-id="' + item.file.label + '">' +
          '<span class="badge">' + _t(item.file.filename) + '</span><ul>';
      for(var x in item.lines){
        seen = item.lines[x];
        file_item += '<li class="list-group-item" data-id="' + item.file.label + '">' +
          '<span class="badge"><a class="ff-open-file" data-target="'+item.file.path+'" ' +
          'target-line="'+seen.line+'" href="#">Line ' +
          '<span style="display: inline-block; width: 100px;">' + seen.line +
          '</span><span>'+seen.text+'</span><a></span></li>';
      }
      file_item += '</ul></li>';
      var $item = $(file_item);
      $('a', $item).click(function(e) {
        e.preventDefault();
        self.findinfiles(
          $(this).attr("data-target"),
          parseInt($(this).attr("target-line"))
        );
      });
      self.$results.append($item);
    },

    filterFile: function(patt, item){
      var self = this;
      $.ajax({
        url: self.app.options.actionUrl + '?action=getFile&path='+item.path.replace("/", "%2F"),
        dataType: 'json',
        success: function(data) {
          var contents = data["contents"];
          if(contents == undefined){
            return;
          }
          var lines = contents.split("\n");
          var seen = [], line = '';
          var result = null;
          for(var x in lines){
            line = lines[x];
            result = patt.exec(line);
            if(result != null){
              seen.push({
                "line": parseInt(x) + 1,
                "text": '<b>'+result[0]+'</b>'+line.substr(result["index"] + result[0].length, 20)
              });
            }
          }
          if(seen.length > 0){
            self.appendToResults({file: item, lines: seen});
            self.noMatches += seen.length;
          }
        }
      });
    },
    filterFiles: function(patt, data){
      var self = this;
      _.each(data, function(item) {
        if(item.folder){
          self.filterFiles(patt, item.children);
        }else{
          self.filterFile(patt, item);
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
          }
        });
      });
      return self;
    },
    findinfiles: function(resource, line) {
      var self = this;
      self.app.doAction('getFile', {
        data: {
          path: resource
        },
        dataType: 'json',
        success: function(data) {
          self.app.fileData[resource] = data;
          self.app.openEditor(resource, {goToLine: line});
        }
      });
    }
  });

  return FindInFiles;
});
