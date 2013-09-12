define(['backbone'], function(Backbone) {
  "use strict";

  var Button = Backbone.Model.extend({

    defaults: function(){
      return {
        title: 'Button',
        click: function(e){
          e.preventDefault();
        }
      };
    }
  });

  return Button;
});
