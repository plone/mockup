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
          { id: 'autotoc',                   url: 'patterns/autotoc/pattern.js',                   title: 'Autotoc',                     description: 'Automatically generate a table of contents'                                                },
          { id: 'backdrop',                  url: 'patterns/backdrop/pattern.js',                  title: 'Backdrop',                    description: 'TODO'                                                                                      },
          { id: 'contentloader',             url: 'patterns/contentloader/pattern.js',             title: 'Content Loader',              description: 'Dynamically configure content to be reloaded'                                              },
          { id: 'cookietrigger',             url: 'patterns/cookietrigger/pattern.js',             title: 'Cookie Trigger',              description: 'Shows a DOM element if browser cookies are disabled.'                                      },
          { id: 'eventedit',                 url: 'patterns/eventedit/pattern.js',                 title: 'Event Edit Forms',            description: 'Start/End delta validation whole day and open end handling'                                },
          { id: 'filemanager',               url: 'patterns/filemanager/pattern.js',               title: 'File Manager',                description: 'Manage file system-like resources'                                                         },
          { id: 'formautofocus',             url: 'patterns/formautofocus/pattern.js',             title: 'Form Auto Focus',             description: 'TODO'                                                                                      },
          { id: 'formunloadalert',           url: 'patterns/formunloadalert/pattern.js',           title: 'Form Unload Alert',           description: 'A pattern to warn user when changes are unsaved and they try to navigate away from page'   },
          { id: 'inlinevalidation',          url: 'patterns/inlinevalidation/pattern.js',          title: 'Inline Validation',           description: 'Client side validation of form fields'                                                     },
          { id: 'livesearch',                url: 'patterns/livesearch/pattern.js',                title: 'Live search',                 description: 'Live search widget'                                                                        },
          { id: 'markspeciallinks',          url: 'patterns/markspeciallinks/pattern.js',          title: 'Mark special links',          description: 'Mark special links based on protocol and optionally open in new window.'                   },
          { id: 'modal',                     url: 'patterns/modal/pattern.js',                     title: 'Modal',                       description: 'Creates a modal dialog (also called overlay)'                                              },
          { id: 'moment',                    url: 'patterns/moment/pattern.js',                    title: 'Moment',                      description: 'Human date representation of dates'                                                        },
          { id: 'pickadate',                 url: 'patterns/pickadate/pattern.js',                 title: 'Pick-A-Date',                 description: 'Allows the user to select a date (with or without time) through a calendar'                },
          { id: 'preventdoublesubmit',       url: 'patterns/preventdoublesubmit/pattern.js',       title: 'Prevent Double Submit',       description: 'A pattern to prevent submitting a form twice'                                              },
          { id: 'querystring',               url: 'patterns/querystring/pattern.js',               title: 'Querystring',                 description: 'A widget for creating queries for collections'                                             },
          { id: 'recurrence',                url: 'patterns/recurrence/pattern.js',                title: 'Recurrence Widget',           description: 'Recurrence widget'                                                                         },
          { id: 'relateditems',              url: 'patterns/relateditems/pattern.js',              title: 'Related Items',               description: 'An advanced widget for selecting related items'                                            },
          { id: 'resourceregistry',          url: 'patterns/resourceregistry/pattern.js',          title: 'Resource Registry',           description: 'Register and override resources'                                                           },
          { id: 'select2',                   url: 'patterns/select2/pattern.js',                   title: 'Select2',                     description: 'Autocompletes multiple or single selections from any kind of data source (with search!)'   },
          { id: 'sortable',                  url: 'patterns/sortable/pattern.js',                  title: 'Sortable',                    description: 'Sort items in list using drag and drop'                                                    },
          { id: 'structure',                 url: 'patterns/structure/pattern.js',                 title: 'Structure',                   description: 'Managing a folder of items'                                                                },
          { id: 'textareamimetypeselector',  url: 'patterns/textareamimetypeselector/pattern.js',  title: 'Textarea MimeType Selector',  description: 'Selects the MimeType for a textarea and changes the widget according to the MimeType'      },
          { id: 'texteditor',                url: 'patterns/texteditor/pattern.js',                title: 'Text editor',                 description: 'Edit files TTW nicely'                                                                     },
          { id: 'thememapper',               url: 'patterns/thememapper/pattern.js',               title: 'Theme Mapper',                description: 'Map theme rules'                                                                           },
          { id: 'tinymce',                   url: 'patterns/tinymce/pattern.js',                   title: 'TinyMCE',                     description: 'Rich text editor'                                                                          },
          { id: 'toggle',                    url: 'patterns/toggle/pattern.js',                    title: 'Toggle',                      description: 'Toggles any attribute value after some event is fired'                                     },
          { id: 'tooltip',                   url: 'patterns/tooltip/pattern.js',                   title: 'Tooltip',                     description: 'A pattern to show a tooltip on hover'                                                      },
          { id: 'tree',                      url: 'patterns/tree/pattern.js',                      title: 'Tree',                        description: 'Manage tree of items'                                                                      },
          { id: 'upload',                    url: 'patterns/upload/pattern.js',                    title: 'Upload',                      description: 'File upload with drag and drop support.'                                                   }
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

