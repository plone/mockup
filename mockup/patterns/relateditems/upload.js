define([
  'underscore',
  'mockup-ui-url/views/popover',
  'mockup-patterns-upload',
  'mockup-utils',
], function(_, PopoverView, Upload, utils) {
  'use strict';

  var UploadView = PopoverView.extend({
    className: 'popover upload',
    title: _.template('<%- _t("Upload files") %>'),
    content: _.template(
      '<input type="text" name="upload" style="display:none" />' +
      '<div class="uploadify-me"></div>'),

    popover: undefined,

    initialize: function(options) {
      var self = this;
      self.app = options.app;
      PopoverView.prototype.initialize.apply(self, [options]);
    },

    render: function() {
      var self = this;
      self.popover = PopoverView.prototype.render.call(this);
      var options = {};
      options.success = function(e, response) {
        var uid = response.UID;
        if (uid) {
          var query = new utils.QueryHelper({
            vocabularyUrl: self.app.options.vocabularyUrl,
            attributes: self.app.options.attributes
          });
          var result = query.search(
              'UID',
              'plone.app.querystring.operation.selection.is',
              uid,
              function (e) {
                var data = self.app.$el.select2('data');
                data.push.apply(data, e.results);
                self.app.$el.select2('data', data, true);
                self.app.emit('selected');
                self.popover.hide();
              },
              false
          );
        }
        // getIcon, getURL, portal_type, review_state, Title, path
        // var itemHtml = self.applyTemplate('selection', item);
      };
      options.uploadMultiple = true;
      options.allowPathSelection = false;
      options.relativePath = 'fileUpload';
      options.baseUrl = self.app.options.rootUrl;
      self.upload = new Upload(self.$('.uploadify-me').addClass('pat-upload'), options);
      return this;
    },

    toggle: function(button, e) {
      /* we need to be able to change the current default upload directory */
      PopoverView.prototype.toggle.apply(this, [button, e]);
      var self = this;
      if (!this.opened) {
        return;
      }
      if (self.app.currentPath !== self.upload.currentPath) {
        self.upload.setPath(self.app.currentPath);
      }
    }

  });

  return UploadView;
});

