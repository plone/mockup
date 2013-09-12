define(['backbone'], function(Backbone) {
  "use strict";

  var Result = Backbone.Model.extend({

    defaults: function(){
      return {
        is_folderish: false
      };
    }
  });

  return Result;
});
