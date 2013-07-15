define([
  'jquery',
  'js/patterns/base',
  'js/patterns/tiles/tiletype',
  'js/patterns/modalform.js'
], function($, Base, TileType) {
  "use strict";

  // wire events to action buttons.
  //
  // The TileType knows how to handle actions for a tile instance of that type,
  // so this method associates button actions with those actions by reading
  // the class list of each action button for class names in the form
  // 'action-<action name>' where '<action-name>' is the name of a function
  // in the TileType.actions object.
  //
  // $el -- the tile element with 'pat-tile' css class
  // actions -- the unordered list containing the action buttons
  function hookupActions($el) {
    $('> li > a', $el.actions).each(function(i, action) {
      var actionnames = [];
      $($(action).attr('class').split(' ')).each(function(i, classname) {
        if(classname.substr(0, 7) === 'action-') {
          actionnames.push(classname.substr(7, classname.length));
        }
      });

      $.each(actionnames, function(i, actionmethod) {
        if($el.type.actions !== undefined && $el.type.actions[actionmethod] !== undefined) {
          $(action).off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $el.type.actions[actionmethod]($el);
          });
        }
      });
    });
  }



  // The Tile pattern deals with specific instances of different types of tiles
  //  -- specifically, how to load and display them.
  //
  // Action behavior is defined by the TileType associated with this Tile.
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
      self.actions = self.type.getActions(self.$el);

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
        hookupActions(self);

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
          var contentcore = $('#content', respcontent).html();
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
