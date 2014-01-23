require([
  'mockup-docs',
  'text!docs-getting-started',
  'text!docs-tutorial',
  'text!docs-about',
  'bootstrap-collapse',
  'mockup-fakeserver'
], function(Docs, GETTING_STARTED, TUTORIAL, ABOUT) {
  new Docs({
    pages: [
      { id: 'index',
        title: 'Mockup',
        description: 'Collection of patterns for faster and easier web ' +
                     'development.',
        text: '[See it in action!](#pattern)',
        autotoc: false
      },
      { id: 'getting-started',
        title: 'Getting Started',
        description: 'An overview of Mockup, how to install it and start ' +
                     'using patterns.',
        text: GETTING_STARTED
      },
      { id: 'tutorial',
        title: 'Tutorial',
        description: 'How to start developing with Mockup.',
        text: TUTORIAL
      },
      { id: 'pattern',
        title: 'Patterns',
        description: 'All patterns you\'ll ever need.',
        autotoc: false,
        patterns: [
          { id: 'accessibility',
            title: 'Accessibility',
            description: 'Easily change text size on a page.',
            url: './js/patterns/accessibility.js'
          },
          { id: 'ace',
            title: 'Ace Editor',
            description: 'Edit files in the browser.',
            url: './js/patterns/ace.js'
          },
          { id: 'autotoc',
            title: 'Autotoc',
            description: 'Automatically generate a table of contents.',
            url: './js/patterns/autotoc.js'
          },
          { id: 'backdrop',
            title: 'Backdrop',
            description: 'TODO',
            url: 'js/patterns/backdrop.js'
          },
          { id: 'cookiedirective',
            title: 'Cookie Directive',
            description: 'A pattern that checks cookies enabled and asks permission for the user to allow cookies or not.',
            url: 'js/patterns/cookiedirective.js'
          },
          { id: 'dropzone',
            title: 'DropZone',
            description: 'File upload with drag and drop support.',
            url: 'js/patterns/dropzone.js'
          },
          { id: 'expose',
            title: 'Expose',
            description: 'Exposes the focused element by darkening everything else on the page. Useful to focus the user attention on a particular area.',
            url: 'js/patterns/expose.js'
          },
          { id: 'filemanager',
            title: 'Filemanager',
            description: 'TODO',
            url: 'js/patterns/filemanager/pattern.js'
          },
          { id: 'formautofocus',
            title: 'Form Auto Focus',
            description: 'TODO',
            url: 'js/patterns/formautofocus.js'
          },
          { id: 'formunloadalert',
            title: 'Form Unload Alert',
            description: 'A pattern to warn user when changes are unsaved and they try to navigate away from page.',
            url: 'js/patterns/formunloadalert.js'
          },
          { id: 'helloworld',
            title: 'Hello World',
            description: 'TODO',
            url: 'js/patterns/helloworld.js'
          },
          { id: 'livesearch',
            title: 'Live Search',
            description: 'Dynamically query the server and display results.',
            url: 'js/patterns/livesearch.js'
          },
          { id: 'modal',
            title: 'Modal',
            description: 'Creates a modal dialog (also called overlay).',
            url: 'js/patterns/modal.js'
          },
          { id: 'moment',
            title: 'Moment',
            description: 'Human date representation of dates.',
            url: 'js/patterns/moment.js'
          },
          { id: 'pickadate',
            title: 'Pick-A-Date',
            description: 'Allows the user to select a date (with or without time) through a calendar.',
            url: './js/patterns/pickadate.js'
          },
          { id: 'picture',
            title: 'Picture',
            description: 'A responsive image widget.',
            url: 'js/patterns/picture.js'
          },
          { id: 'preventdoublesubmit',
            title: 'Prevent Double Submit',
            description: 'A pattern to prevent submitting a form twice.',
            url: 'js/patterns/preventdoublesubmit.js'
          },
          { id: 'queryhelper',
            title: 'Queryhelper',
            description: 'TODO',
            url: 'js/patterns/queryhelper.js'
          },
          { id: 'querystring',
            title: 'Querystring',
            description: 'A widget for creating queries for collections.',
            url: 'js/patterns/querystring.js'
          },
          { id: 'relateditems',
            title: 'Related Items',
            description: 'An advanced widget for selecting related items.',
            url: 'js/patterns/relateditems.js'
          },
          { id: 'select2',
            title: 'Select2',
            description: 'Autocompletes, multiple or single selections from any kind of data source (with search!).',
            url: 'js/patterns/select2.js'
          },
          { id: 'sortable',
            title: 'Sortable',
            description: 'Sort items in list using drag and drop.',
            url: 'js/patterns/sortable.js'
          },
          { id: 'structure',
            title: 'Structure',
            description: 'Managing a folder of items.',
            url: 'js/patterns/structure/pattern.js'
          },
          { id: 'tablesorter',
            title: 'Table Sorter',
            description: 'A pattern you can apply to a table so it can have its items rearranged when clicking the header.',
            url: 'js/patterns/tablesorter.js'
          },
          { id: 'tinymce',
            title: 'TinyMCE',
            description: 'Rich text editor.',
            url: 'js/patterns/tinymce/pattern.js'
          },
          { id: 'toggle',
            title: 'Toggle',
            description: 'Toggles any attribute value after some event is fired.',
            url: './js/patterns/toggle.js'
          },
          { id: 'tooltip',
            title: 'Tooltip',
            description: 'A pattern to show a tooltip on hover.',
            url: 'js/patterns/tooltip.js'
          },
          { id: 'tree',
            title: 'Tree',
            description: 'Manage tree of items.',
            url: 'js/patterns/tree.js'
          }
        ]
      },
      { id: 'about',
        title: 'About',
        description: 'XXX.',
        position: 'right',
        text: ABOUT
      }
    ]
  });

});

