define([
  'jquery',
  'js/patterns/base',
  'js/patterns/tiletype'
], function($, Base, TileType) {
  "use strict";

  // The Tile pattern deals with specific instances of different types of tiles
  //  -- how to load, display, edit, delete, etc
  //
  // available options:
  //  typename -- type of tile, eg 'text', 'image', etc..
  //  autoshow -- if true, then the tile will show automatically after it has
  //              been created
  //  forceload -- if true, then the tile will force an ajax call to load the
  //               contents of the tile, regardless of whether or not the inner
  //               wrapper contains content
  //  innerWrapper -- css class associated with the element that contains all
  //                  tile content
  //  url -- URL to use for the default tile view
  //  ajaxType -- type to use for the jquery $.ajax call
  //
  var Tile = Base.extend({
    name: "tile",
    defaults: {
      type: 'text',
      autoshow: true,
      forceload: false,
      innerWrapper: 'tile'
    },

    init: function() {
      var self = this;

      // tile type _instance_ -- used to gather information (like actions)
      // about this particular tile that apply to all tiles of this type
      self.type = TileType.get(self.options.type);

      // Get a COPY of the actions appropriate for this tile from it's type
      self.actions = self.type.getActions(self.$el)

      // Grab the element that should contain all the tile content, if it does
      // not exist, create it and append it to the tiles child list
      self.wrapper = $(self.options.innerWrapper);
      if(self.wrapper.length <= 0) {
        self.wrapper = $('<div/>').addClass(self.options.innerWrapper);
        self.$el.append(self.wrapper);
        $(self.wrapper).css('position', 'relative'); // to make sure the buttons are positioned correctly
      }

      if(self.options.autoshow) {
        self.show();
      }
    },

    show: function() {
      var self = this;

      if(self.options.forceload) {
        self.hide(); // get rid of all visible content in the tile
      }

      // tiles with content don't need to be dynamically loaded,
      // unless the tile has been marked as forced to load
      if($(self.wrapper).html().trim() === "") {
        // add actions
        $(self.wrapper).append(self.actions);

        // show actions on hover
        $('li > a', self.actions).off('hover').on('hover', function(e) {
          if(self.actions.is(":visible")) {
            self.actions.show();
          } 
          else {
            self.actions.hide();
          }
        });
        self.wrapper.off('hover').on('hover', function(e) {
          if(self.actions.is(":visible")) {
            self.actions.hide();
          }
          else {
            self.actions.show();
          }
        });

        // load content
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
          $(self.wrapper).append(contentcore);

          self.trigger('after-ajax', self, textStatus, xhr);
        });
      }

    },

    hide: function() {
      $(self.wrapper).html("");
    }
  });

  return Tile;

});
