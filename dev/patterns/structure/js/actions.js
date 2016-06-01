define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-utils',
  'translate',
], function($, _, Backbone, Result, utils, _t) {
  'use strict';

  // use a more primative class than Backbone.Model?
  var Actions = Backbone.Model.extend({
    initialize: function(options) {
      this.options = options;
      this.app = options.app;
      this.model = options.model;
      this.selectedCollection = this.app.selectedCollection;
    },
    selectAll: function(e) {
      // This implementation is very specific to the default collection
      // with the reliance on its queryParser and queryHelper.  Custom
      // collection (Backbone.Paginator.requestPager implementation)
      // will have to come up with their own action for this.
      e.preventDefault();
      var self = this;
      var page = 1;
      var count = 0;
      var getPage = function() {
        self.app.loading.show();
        $.ajax({
          url: self.app.collection.url,
          type: 'GET',
          dataType: 'json',
          data: {
            query: self.app.collection.queryParser({
              searchPath: self.model.attributes.path
            }),
            batch: JSON.stringify({
              page: page,
              size: 100
            }),
            attributes: JSON.stringify(
              self.app.collection.queryHelper.options.attributes)
          }
        }).done(function(data) {
          var items = self.app.collection.parse(data, count);
          count += items.length;
          _.each(items, function(item) {
            self.app.selectedCollection.add(new Result(item));
          });
          page += 1;
          if (data.total > count) {
            getPage();
          } else {
            self.app.loading.hide();
            self.app.tableView.render();
          }
        });
      };
      getPage();
    },

    doAction: function(buttonName, successMsg, failMsg) {
      var self = this;
      $.ajax({
        url: self.app.buttons.get(buttonName).options.url,
        data: {
          selection: JSON.stringify([self.model.attributes.UID]),
          folder: self.model.attributes.path,
          _authenticator: utils.getAuthenticator()
        },
        dataType: 'json',
        type: 'POST'
      }).done(function(data) {
        var msg;
        if (data.status === 'success') {
          msg = _t(successMsg + ' "' + self.model.attributes.Title + '"');
          self.app.collection.pager();
          self.app.updateButtons();
        } else {
          msg = _t('Error ' + failMsg + ' "' + self.model.attributes.Title + '"');
        }
        self.app.setStatus({text: msg, type: data.status || 'warning'});
      });
    },

    cutClicked: function(e) {
      var self = this;
      e.preventDefault();
      self.doAction('cut', _t('Cut'), _t('cutting'));
    },
    copyClicked: function(e) {
      var self = this;
      e.preventDefault();
      self.doAction('copy', _t('Copied'), _t('copying'));
    },
    pasteClicked: function(e) {
      var self = this;
      e.preventDefault();
      self.doAction('paste', _t('Pasted into'), _t('Error pasting into'));
    },
    moveTopClicked: function(e) {
      e.preventDefault();
      this.app.moveItem(this.model.attributes.id, 'top');
    },
    moveBottomClicked: function(e) {
      e.preventDefault();
      this.app.moveItem(this.model.attributes.id, 'bottom');
    },
    setDefaultPageClicked: function(e) {
      e.preventDefault();
      var self = this;
      $.ajax({
        url: self.app.getAjaxUrl(self.app.setDefaultPageUrl),
        type: 'POST',
        data: {
          '_authenticator': $('[name="_authenticator"]').val(),
          'id': this.model.attributes.id
        },
        success: function(data) {
          self.app.ajaxSuccessResponse.apply(self.app, [data]);
        },
        error: function(data) {
          self.app.ajaxErrorResponse.apply(self.app, [data]);
        }
      });
    },
  });

  return Actions;
});
