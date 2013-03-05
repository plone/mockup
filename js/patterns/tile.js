define([
  'jquery',
  'js/patterns/base'
], function($, Base, Parser) {
  "use strict";

  var Tile = Base.extend({
    name: "tile",
    defaults: {
    },
    init: function() {
      var self = this;

      self.ajaxXHR = $.ajax({
          url: self.options.url,
          type: self.options.ajaxType
      }).done(function(response, textStatus, xhr) {
        self.ajaxXHR = undefined;

        var respcontent = (/<body[^>]*>((.|[\n\r])*)<\/body>/im)
                            .exec(response)[0]
                            .replace('<body', '<div')
                            .replace('</body>', '</div>');
        var contentcore = $('#content-core', respcontent).html();
        self.$el.append(contentcore);

        self.trigger('after-ajax', self, textStatus, xhr);
      });
    }
  });

  return Tile;

});
