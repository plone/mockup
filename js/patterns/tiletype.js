define([
  'jquery',
], function($) {
  "use strict";

  var TileTypeBase = {
    init: function(name) {
      var self = this;
      self.name = name;
      self.typeid = self.name.replace(/\./g, '-')
    },

    styleButtons: function(buttons) {
      buttons.css("cssText", "color: #333333 !important;");
      buttons.css({
        'cursor': 'pointer',
        'text-align': 'center',
        'text-shadow': '0 1px 1px rgba(255, 255, 255, 0.75)',
        'font-size': '11px',
        'line-height': '14px',
        'vertical-align': 'middle',
        'padding': '2px 6px',
        'margin-bottom': '0',

        'background-color': '#f5f5f5',
        'background-image': 'linear-gradient(top, #ffffff, #e6e6e6)',
        'background-repeat': 'repeat-x',
        '-webkit-box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        '-moz-box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',

        'border': '1px solid #cccccc',
        'border-color': '#e6e6e6 #e6e6e6 #bfbfbf',
        'border-bottom-color': '#b3b3b3',
        '-webkit-border-radius': '4px',
        '-moz-border-radius': '4px',
        'border-radius': '4px'
      });
    },

    styleActions: function(actions) {
      var self = this;
      self.styleButtons($('> li > a', actions));
      $('> li', actions).css('display', 'inline');
      actions.css({
        'z-index': '700',
        'position': 'absolute',
        'top': '0.3em',
        'right': '0.5em',
        'list-style': 'none',
        'margin': '0',
        'padding': '0'
      });
    },

    getActions: function(el) {
      var self = this,
          actions = $('.tiletype-actions', el).clone();

      if (actions.size() === 0) {
          actions = $('#tiletype-' + self.typeid +
              ' .tiletype-actions').clone();
      }

      self.styleActions(actions);
      return actions;
    }
  };


  var TypeRegistry = {};

  // generate a constructor for an instance of a TileType
  //
  // name -- string value representing the tile type name
  // tiletype -- optional object containing definitions for the tiletype instance
  // base -- optional base object to extend from
  function createTileType(name, tiletype, base) {
    var constructor = function() {
      this.__super = base || TileTypeBase;
      this.init(name);
    };

    constructor.prototype = $.extend(
      base || TileTypeBase,
      tiletype || {});

    return constructor;
  }


  // API for creating and managing tile types
  return {
    // object to use as base class for custom TileTypes
    Base: TileTypeBase,

    // get an instance of the tile type
    get: function(name) {
      return new (TypeRegistry[name])();
    },

    // create a constructor for a tile type, add it to the registry, and
    // return the resulting constructor, overwriting any existing constructor
    // in the registry with the name
    //
    // name -- string value representing the tile type name
    // tiletype -- optional object containing definitions for the tiletype instance
    // base -- optional base object to extend from
    register: function(name, tiletype, base) {
      if(TypeRegistry[name] === undefined) {
        TypeRegistry[name] = createTileType(name, tiletype, base);
      }

      return TypeRegistry[name];
    }
  };


});
