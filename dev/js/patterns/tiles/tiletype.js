define([
  'jquery',
  'js/patterns/modalform'
], function($, modalform) {
  'use strict';

  var TileTypeBase = {
    init: function(name) {
      var self = this;
      self.name = name;
      self.typeid = self.name.replace(/\./g, '-');
    },

    styleButtons: function(buttons) {
      buttons.css('cssText', 'color: #333333 !important;');
      buttons.addClass('tile-button');
    },

    styleActions: function(actions) {
      var self = this;
      self.styleButtons($('> li > a', actions));
      $('> li', actions).css('display', 'inline');
    },

    getActions: function(el) {
      var self = this,
          actions = $('.tiletype-actions', el).clone();

      if (actions.size() === 0) {
        actions = $('#tiletype-' + self.typeid + ' .tiletype-actions').clone();
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
      tiletype || {}
    );

    return constructor;
  }


  // API for creating and managing tile types
  var API = {
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
      if (TypeRegistry[name] === undefined) {
        TypeRegistry[name] = createTileType(name, tiletype, base);
      }

      return TypeRegistry[name];
    }
  };

  return API;

});
