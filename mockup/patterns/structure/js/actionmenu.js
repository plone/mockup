define(['underscore'], function(_) {
  'use strict';

  var menuOptions = {
    'openItem': {
      'url':      '#',
      'title':    'Open',
      'category': 'button',
      'iconCSS':  'glyphicon glyphicon-eye-open',
      'modal':    false
    },
    'editItem': {
      'url':      '#',
      'title':    'Edit',
      'category': 'button',
      'iconCSS':  'glyphicon glyphicon-pencil',
      'modal':    false
    },
    'cutItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'cutClicked',
      'url':      '#',
      'title':    'Cut',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'copyItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'copyClicked',
      'url':      '#',
      'title':    'Copy',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'pasteItem': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'pasteClicked',
      'url':      '#',
      'title':    'Paste',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'move-top': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'moveTopClicked',
      'url':      '#',
      'title':    'Move to top of folder',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'move-bottom': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'moveBottomClicked',
      'url':      '#',
      'title':    'Move to bottom of folder',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'set-default-page': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'setDefaultPageClicked',
      'url':      '#',
      'title':    'Set as default page',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    },
    'selectAll': {
      'library':  'mockup-patterns-structure-url/js/actions',
      'method':   'selectAll',
      'url':      '#',
      'title':    'Select all contained items',
      'category': 'dropdown',
      'iconCSS':  '',
      'modal':    false
    }
  };

  var ActionMenu = function(menu) {
    // If an explicit menu was specified as an option to AppView, this
    // constructor will not override that.
    if (menu.menuOptions !== null) {
      return menu.menuOptions;
    }

    var model = menu.model.attributes;
    var app = menu.app;

    var result = _.clone(menuOptions);
    if ( !(app.pasteAllowed && model.is_folderish)) {
      delete result.pasteItem;
    }
    if (app.inQueryMode() || menu.options.canMove === false) {
      delete result['move-top'];
      delete result['move-bottom'];
    }
    if (model.is_folderish || !app.setDefaultPageUrl) {
      delete result['set-default-page'];
    }

    if (!model.is_folderish) {
      delete result.selectAll;
    }

    var typeToViewAction = app.options.typeToViewAction;
    var viewAction = typeToViewAction && typeToViewAction[model.portal_type] || '';
    result.openItem.url = model.getURL + viewAction;
    result.editItem.url = model.getURL + '/@@edit';

    return result;
  };

  return ActionMenu;
});
