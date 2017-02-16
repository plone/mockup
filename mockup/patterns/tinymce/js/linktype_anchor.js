define([
  'jquery',
  'mockup-tinymce-linktype-base',
  'text!mockup-patterns-tinymce-url/templates/link.xml',
], function($, BaseLinkType, LinkTemplate) {
  'use strict';

  var AnchorLink = BaseLinkType.extend({

    init: function() {
      BaseLinkType.prototype.init.call(this);
      this.$select = this.$el.find('select');
      this.anchorNodes = [];
      this.anchorData = [];
      this.populate();
    },

    value: function() {
      var val = this.$select.select2('data');
      if (val && typeof(val) === 'object') {
        val = val.id;
      }
      return val;
    },

    populate: function() {
      var self = this;
      self.$select.find('option').remove();
      self.anchorNodes = [];
      self.anchorData = [];
      var node, i, j, name, title;

      var nodes = self.tiny.dom.select('a.mceItemAnchor,img.mceItemAnchor,a.mce-item-anchor,img.mce-item-anchor');
      for (i = 0; i < nodes.length; i = i + 1) {
        node = nodes[i];
        name = self.tiny.dom.getAttrib(node, 'name');
        if (!name) {
          name = self.tiny.dom.getAttrib(node, 'id');
        }
        if (name !== '') {
          self.anchorNodes.push(node);
          self.anchorData.push({name: name, title: name});
        }
      }

      nodes = self.tiny.dom.select(self.linkModal.options.anchorSelector);
      if (nodes.length > 0) {
        for (i = 0; i < nodes.length; i = i + 1) {
          node = nodes[i];
          title = $(node).text().replace(/^\s+|\s+$/g, '');
          if (title === '') {
            continue;
          }
          name = title.toLowerCase().substring(0,1024);
          name = name.replace(/[^a-z0-9]/g, '-');
          /* okay, ugly, but we need to first check that this anchor isn't already available */
          var found = false;
          for (j = 0; j < self.anchorNodes.length; j = j + 1) {
            var anode = self.anchorData[j];
            if (anode.name === name) {
              found = true;
              // so it's also found, let's update the title to be more presentable
              anode.title = title;
              break;
            }
          }
          if (!found) {
            self.anchorData.push({name: name, title: title, newAnchor: true});
            self.anchorNodes.push(node);
          }
        }
      }
      if (self.anchorNodes.length > 0) {
        for (i = 0; i < self.anchorData.length; i = i + 1) {
          var data = self.anchorData[i];
          self.$select.append('<option value="' + i + '">' + data.title + '</option>');
        }
      } else {
        self.$select.append('<option>No anchors found..</option>');
      }
    },

    getIndex: function(name) {
      for (var i = 0; i < this.anchorData.length; i = i + 1) {
        var data = this.anchorData[i];
        if (data.name === name) {
          return i;
        }
      }
      return 0;
    },

    toUrl: function() {
      var val = this.value();
      if (val) {
        var index = parseInt(val, 10);
        var node = this.anchorNodes[index];
        var data = this.anchorData[index];
        if (data.newAnchor) {
          node.innerHTML = '<a name="' + data.name + '" class="mce-item-anchor"></a>' + node.innerHTML;
        }
        return '#' + data.name;
      }
      return null;
    },

    set: function(val) {
      var anchor = this.getIndex(val);
      this.$select.select2('data', '' + anchor);
    }

  });


  return {
    plugin: AnchorLink,
    name: 'anchor',
    template: LinkTemplate
  };

});
