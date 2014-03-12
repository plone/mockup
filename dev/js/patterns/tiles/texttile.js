define([
  'jquery',
  'js/patterns/tiles/tiletype',
  'js/patterns/modalform'
], function($, TileType, ModalForm) {
  'use strict';

  var TextTile = TileType.register('text', {
    actions: {
      // tileobj - the tile object this tile type instance refers to
      edit: function(tileobj) {
        ModalForm.init(tileobj.$el, function(modal, modalInit, modalOptions) {
          ModalForm.template(modal.$modal, {
            buttons: 'input[name="form.buttons.save"],input[name="form.buttons.cancel"],input[name="form.button.save"],input[name="form.button.cancel"]',
            content: '#content-core'
          });
          $('span.label', modal.$modal).removeClass('label');
          $('.mce_editable', modal.$modal).addClass('pat-plone-tinymce');
          ModalForm.form(modal, modalInit, modalOptions, {
            buttons: {
              '.modal-body input[name="form.buttons.cancel"],.modal-body input[name="form.button.cancel"]': {},
              '.modal-body input[name="form.buttons.save"],.modal-body input[name="form.button.save"]': {
                onSuccess: function(modal, responseBody, state, xhr, form) {
                  //$('#portal-column-content', window.parent.document).html(
                  //    $('#portal-column-content', responseBody).html());
                  //modal.hide();
                }
              }
            }
          });
        },
        {
          width: '80%',
        });

        //var mod = tileobj.$el.data('pattern-modal');
        //mod.show();
      },

      // tileobj - the tile object this tile type instance refers to
      remove: function(tileobj) {
        console.log('remove the tile');
      },
    }
  });

});
