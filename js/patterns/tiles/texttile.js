define([
  'jquery',
  'js/patterns/tiletype'
], function($, TileType) {

  var TextTile = TileType.register('text', {
    actions: {
      // $el - the element with the .pat-tile class
      edit: function($el) {
        console.log('edit the tile');
      },

      // $el - the element with the .pat-tile class
      remove: function($el) {
        console.log('remove the tile');
      },
    }
  });

});
