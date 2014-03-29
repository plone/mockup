require([
  'mockup-docs',
  'text!docs-getting-started',
  'text!docs-learn',
  'text!docs-contribute',
  'bootstrap-collapse',
  'mockup-fakeserver'
], function(Docs, GETTING_STARTED, LEARN, CONTRIBUTE) {
  'use strict';

  var docs = new Docs({
    pages: [
      { id: 'index',
        title: 'Mockup',
        description: 'A collection of client side patterns for faster and easier ' +
                     'web  development',
        text: '[See it in action!](#pattern)',
        autotoc: false
      },
      { id: 'getting-started',
        title: 'Getting Started',
        description: 'How to install and get started with Mockup',
        text: GETTING_STARTED
      },
      { id: 'learn',
        title: 'Learn',
        description: 'How to start developing with Mockup',
        text: LEARN
      },
      { id: 'pattern',
        title: 'Patterns',
        description: 'All the patterns you\'ll ever need',
        autotoc: false,
        patterns: [
          { id: 'accessibility',
            title: 'Accessibility',
            description: 'Easily change text size on a page',
            url: './js/patterns/accessibility.js'
          },
          { id: 'autotoc',
            title: 'Autotoc',
            description: 'Automatically generate a table of contents',
            url: './js/patterns/autotoc.js'
          },
          { id: 'backdrop',
            title: 'Backdrop',
            description: 'TODO',
            url: 'js/patterns/backdrop.js'
          },
          { id: 'formautofocus',
            title: 'Form Auto Focus',
            description: 'TODO',
            url: 'js/patterns/formautofocus.js'
          },
          { id: 'formunloadalert',
            title: 'Form Unload Alert',
            description: 'A pattern to warn user when changes are unsaved and they try to navigate away from page',
            url: 'js/patterns/formunloadalert.js'
          },
          { id: 'modal',
            title: 'Modal',
            description: 'Creates a modal dialog (also called overlay)',
            url: 'js/patterns/modal.js'
          },
          { id: 'moment',
            title: 'Moment',
            description: 'Human date representation of dates',
            url: 'js/patterns/moment.js'
          },
          { id: 'pickadate',
            title: 'Pick-A-Date',
            description: 'Allows the user to select a date (with or without time) through a calendar',
            url: './js/patterns/pickadate.js'
          },
          { id: 'preventdoublesubmit',
            title: 'Prevent Double Submit',
            description: 'A pattern to prevent submitting a form twice',
            url: 'js/patterns/preventdoublesubmit.js'
          },
          { id: 'querystring',
            title: 'Querystring',
            description: 'A widget for creating queries for collections',
            url: 'js/patterns/querystring.js'
          },
          { id: 'relateditems',
            title: 'Related Items',
            description: 'An advanced widget for selecting related items',
            url: 'js/patterns/relateditems.js'
          },
          { id: 'select2',
            title: 'Select2',
            description: 'Autocompletes, multiple or single selections from any kind of data source (with search!)',
            url: 'js/patterns/select2.js'
          },
          { id: 'sortable',
            title: 'Sortable',
            description: 'Sort items in list using drag and drop',
            url: 'js/patterns/sortable.js'
          },
          { id: 'structure',
            title: 'Structure',
            description: 'Managing a folder of items',
            url: 'js/patterns/structure/pattern.js'
          },
          { id: 'tablesorter',
            title: 'Table Sorter',
            description: 'A pattern you can apply to a table so it can have its items rearranged when clicking the header',
            url: 'js/patterns/tablesorter.js'
          },
          { id: 'tinymce',
            title: 'TinyMCE',
            description: 'Rich text editor',
            url: 'js/patterns/tinymce/pattern.js'
          },
          { id: 'toggle',
            title: 'Toggle',
            description: 'Toggles any attribute value after some event is fired',
            url: './js/patterns/toggle.js'
          },
          { id: 'tooltip',
            title: 'Tooltip',
            description: 'A pattern to show a tooltip on hover',
            url: 'js/patterns/tooltip.js'
          },
          { id: 'tree',
            title: 'Tree',
            description: 'Manage tree of items',
            url: 'js/patterns/tree.js'
          },
          { id: 'upload',
            title: 'Upload',
            description: 'File upload with drag and drop support.',
            url: 'js/patterns/upload/pattern.js'
          }
        ]
      },
      { id: 'contribute',
        title: 'Contribute',
        description: 'How to start contributing',
        position: 'right',
        text: CONTRIBUTE
      }
    ]
  });

  return docs;
});

