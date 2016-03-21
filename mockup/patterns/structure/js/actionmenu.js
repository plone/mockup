define(['underscore'], function(_) {
  'use strict';

  var menuOptions = {
    'openItem': {
      'library':  'mockup-patterns-structure-url/js/navigation',
      'method':   'openClicked',
      'url':      '#',
      'title':    'Open',
      'category': 'button',
      'iconCSS':  'glyphicon glyphicon-eye-open'
    },
    'editItem': {
      'library':  'mockup-patterns-structure-url/js/navigation',
      'method':   'editClicked',
      'url':      '#',
      'title':    'Edit',
      'category': 'button',
      'iconCSS':  'glyphicon glyphicon-pencil'
    },
    'cutItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'cutClicked',
      'url':      '#',
      'title':    'Cut',
      'category': 'dropdown',
      'iconCSS':  '',
    },
    'copyItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'copyClicked',
      'url':      '#',
      'title':    'Copy',
      'category': 'dropdown',
      'iconCSS':  ''
    },
    'pasteItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'pasteClicked',
      'url':      '#',
      'title':    'Paste',
      'category': 'dropdown',
      'iconCSS':  ''
    },
    'move-top': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'moveTopClicked',
      'url':      '#',
      'title':    'Move to top of folder',
      'category': 'dropdown',
      'iconCSS':  ''
    },
    'move-bottom': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'moveBottomClicked',
      'url':      '#',
      'title':    'Move to bottom of folder',
      'category': 'dropdown',
      'iconCSS':  ''
    },
    'set-default-page': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'setDefaultPageClicked',
      'url':      '#',
      'title':    'Set as default page',
      'category': 'dropdown',
      'iconCSS':  ''
    },
    'selectAll': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'selectAll',
      'url':      '#',
      'title':    'Select all contained items',
      'category': 'dropdown',
      'iconCSS':  ''
    }
  };

  var ActionMenu = function(menu) {
    // If an explicit menu was specified as an option to AppView, this
    // constructor will not override that.
    if (menu.menuOptions !== null) {
      return menu.menuOptions;
    }

    var result = _.clone(menuOptions);
    if ( !(menu.app.pasteAllowed && menu.model.attributes.is_folderish)) {
      delete result.pasteItem;
    }
    if (menu.app.inQueryMode() || menu.options.canMove === false) {
      delete result['move-top'];
      delete result['move-bottom'];
    }
    if (menu.model.attributes.is_folderish || !menu.app.setDefaultPageUrl) {
      delete result['set-default-page'];
    }

    if (!menu.model.attributes.is_folderish) {
      delete result.selectAll;
    }

    result.openItem.url = menu.model.attributes.getURL;
    result.editItem.url = menu.model.attributes.getURL + '/@@edit';

    return result;
  };

  return ActionMenu;
});
