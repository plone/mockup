define([], function() {
  'use strict';

  var menuOptions = {
    'cutItem': [
      'mockup-patterns-structure-url/js/actions',
      'cutClicked',
      '#',
      'Cut',
    ],
    'copyItem': [
      'mockup-patterns-structure-url/js/actions',
      'copyClicked',
      '#',
      'Copy'
    ],
    'pasteItem': [
      'mockup-patterns-structure-url/js/actions',
      'pasteClicked',
      '#',
      'Paste'
    ],
    'move-top': [
      'mockup-patterns-structure-url/js/actions',
      'moveTopClicked',
      '#',
      'Move to top of folder'
    ],
    'move-bottom': [
      'mockup-patterns-structure-url/js/actions',
      'moveBottomClicked',
      '#',
      'Move to bottom of folder'
    ],
    'set-default-page': [
      'mockup-patterns-structure-url/js/actions',
      'setDefaultPageClicked',
      '#',
      'Set as default page'
    ],
    'selectAll': [
      'mockup-patterns-structure-url/js/actions',
      'selectAll',
      '#',
      'Select all contained items'
    ],
    'openItem': [
      'mockup-patterns-structure-url/js/navigation',
      'openClicked',
      '#',
      'Open'
    ],
    'editItem': [
      'mockup-patterns-structure-url/js/navigation',
      'editClicked',
      '#',
      'Edit'
    ],
  };

  var ActionMenu = function(menu) {
    // If an explicit menu was specified as an option to AppView, this
    // constructor will not override that.
    if (menu.menuOptions !== null) {
      return menu.menuOptions;
    }

    var result = {};
    result.cutItem = menuOptions.cutItem;
    result.copyItem = menuOptions.copyItem;
    if (menu.app.pasteAllowed && menu.model.attributes.is_folderish) {
      result.pasteItem = menuOptions.pasteItem;
    }
    if (!menu.app.inQueryMode() && menu.options.canMove !== false) {
      result['move-top'] = menuOptions['move-top'];
      result['move-bottom'] = menuOptions['move-bottom'];
    }
    if (!menu.model.attributes.is_folderish && menu.app.setDefaultPageUrl) {
      result['set-default-page'] = menuOptions['set-default-page'];
    }
    if (menu.model.attributes.is_folderish) {
      result.selectAll = menuOptions.selectAll;
    }
    if (menu.options.header) {
      result.openItem = menuOptions.openItem;
    }
    result.editItem = menuOptions.editItem;
    return result;
  };

  return ActionMenu;
});
