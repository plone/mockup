Changelog
=========

2.7.4 (2018-06-21)
------------------

New features:

- pat-contentloader: Add ``loading-done`` event.
  [agitator, thet]

Bug fixes:

- pat-contentloader: Add 'content-load-error' to other exit-cases too. Clean up classes on initialization.
  [thet]

- Fix for loading country specific language codes
  [lyralemos]


2.7.3 (2018-06-21)
------------------

New features:

- Mark special links: Mark external link with rel="noopener"
  https://developers.google.com/web/tools/lighthouse/audits/noopener
  [mamico]

- pat-contentloader: Add ``loading-done`` event.
  [agitator, thet]

Bug fixes:

- pat-contentloader: Add 'content-load-error' to other exit-cases too. Clean up classes on initialization.
  [thet]

- pat-contentloader: When the content which replaces the target is empty, empty the target instead of removing it.
  This fixes a problem, where an empty result didn't did remove the ability to successfully replace the target for subsequent content loads.
  [thet]

- Relateditems: Do not filter out current context.
  Filtering out the current context makes sense for the related items field but it can be problematic for other use cases.
  [thet]

- Relateditems: Raise the timeout when typing searchterms from 100 milliseconds to 500 milliseconds to prevent a too high server load.
  [thet]

- Improved default relateditems pattern sort.
  It now defaults to search term ranking when searching
  and folder position (getObjPositionInParent) when browsing.
  [davisagli]

- Tinymce: When editing an image, and it had the 'Original' scale selected,
  make sure that 'Original' is prefilled in the scale drop down
  [frapell]

- Tinymce: Fix issue where Webpack less-loader was unable to load TinyMCE bundle styles
  [datakurre]

- Fix for loading country specific language codes
  [lyralemos]


2.7.2 (2018-04-08)
------------------

New features:

- Add `imageClasses` option to the tinymce pattern
  to allow overriding the list of alignment classes.
  [davisagli]

- Include TinyMCE 4.7.6
  [frapell]

Bug fixes:

- Link to /edit rather than /@@edit from structure pattern actions.
  This fixes the link for Archetypes content items.
  [davisagli]


2.7.1 (2018-02-11)
------------------

Bug fixes:

- Modal performance: don't reposition after loading each img
  [cillianderoiste]

- Fixing problem with parseBodyTag when txt contains
  non ASCII chars.
  [mamico]


2.7.0 (2018-01-27)
------------------

New features:

- Related Items: Add dropdown with recently added items.
  [thet]

Bug fixes:

- Marked as compatible with Python 2.7, 3.5, 3.6.
  Easy because we basically have no Python code.
  Compatible with Plone 5.1 and 5.2.  [maurits]

- Fixing problems with wrong relative date translations for norwegian sites.
  [martior]

- Fixed resource registry override tab's Save button being disabled
  [obct537]

- Add type="button" to pickadate buttons to avoid form submit problems.
  [cekk]

- image modal: use image description for modal title
  [ksuess]


2.6.2 (2017-11-26)
------------------

New features:

- Structure pattern:

  - Make action menu bar sticky.
  - Make action menu more compact, so that it doesn't break into a newline early.
  - Use more tooltips in the action menu.
  [thet]

- Related items pattern:

- Avoid double initialization of Select2.
  [thet]

  - Added options to change sorting.
  [Gagaro]

- TinyMCE pattern:

  - Make anchor handling more flexible
  [tomgross]

  - Mark special links
  - Do not mark anchors as special links
  [frapell]

Bug fixes:

- Related items widget: Fix case, where ``initSelection`` broke on an error in Select2.
  [thet]

- Querystring pattern: Fix #716, where the path-depth was added to string values like the title when a path criteria was present.
  [thet]

- Structure pattern:

  - Set default page icon on item row. Fixes: https://github.com/plone/Products.CMFPlone/issues/2131
  - Pass event data for the ``structure-url-changed`` event correctly.

  [jensens, thet]


2.6.1 (2017-10-03)
------------------

Bug fixes:

- Restore ability from < 2.5.1 to let the ``drop`` callback be a function.
  It can still be the name of the function in the global namespace.
  Fixes #808.
  [thet]

- Concatenate value for select multiple input in generic popover in the structure pattern.
  [Gagaro]


2.6.0 (2017-09-06)
------------------

New features:

- Queue validation calls in inlinevalidation pattern using jQuery default queue
  to ensure validations are called in order and allow custom custom code to be
  queued after validation has completed
  [datakurre]

- pattern-pickadate: Emit the ``updated.pickadate.patterns`` event when clicking the "clear" and "now" buttons.
  [thet]

Bug fixes:

- TinyMCE: Fix seen issue where pattern failed, because importcss_file_filter
  was already a function
  [datakurre]

- Translate "Title" for the table template
  [cillianderoiste]


2.5.1 (2017-09-03)
------------------

New features:

- Query String Widget: Allow configuration of subwidgets.
  [thet]

- Added docs for the structureupdater pattern.
  [thet]

- Related Items: Simplify templates a bit.
  [thet]

Bug fixes:

- Fix callback of sortable pattern.
  [tomgross]

- Related Items: Fix filtering of non-selectable and non-browsable items, so that no empty list elements are contained.
  Filtering behavior is: When browsing, show only folderish or non-selected, selectable items (but non-selectable, folderish items are greyed out).
  When searching, show only selectable items, which were not already selected.
  This fixes an issue where it was impossible to select items when many items were filtered out.
  [thet]

2.5.0 (2017-07-03)
------------------

New features:

 - Improve the user experience for the theme editor
  - Search for files and text within files and opening the file upon click.
  - Add Bootstrap Dropdown menu to the UI views.
  - Enable Drag and Drop inside of the theme editor file tree.
  - Fixed the Drag and Drop files to root of the file tree.
  - Fixed the autoscrolling issue when dragging a file in the file tree.
  - Add Anchor (a) tag to the UI views.
  - Upgrade JQTree to 1.4.1
  - Enable Drag and Drop inside of the theme editor file tree.
  - Add contextual menu to theme files in the file tree.
  [b4oshany]

 - Make thumb scale in folder contents listing adjustable/supressable.
   Replace meaningless paper clip icon (fontello) with mime type icons from mimetype registry.
   https://github.com/plone/Products.CMFPlone/issues/1734
   [fgrcon]

- For ``pat-modal``, let the ajax modal variant acquire it's ajax url when the modal is shown instead when the pattern is initialized.
  This makes the modal respect a dynamically changed href attribute on a anchor tag, after it was initialized.
  [thet]

- New pattern ``mockup-patterns-structureupdater`` to update title and description depending on the current context on Plone's folder contents page.
  [thet]

- Add default plone color less variables for a more consistent design.
  They will be overwritten by values set by Plone or integration projects.
  [thet]

- Structure widget:
  - Show ineffective label in folder contents for not yet effective and published content, likewise it's done with expires.
    Show effective and ineffective label styled as bootstrap badges.
  - Show "Description" below title, if it's set in ``availableColumns`` and ``activeColumns`` to save some screen space.
  - Do not break whitespace within actionmenu links and don't underline them when hovering.
  - Trigger ``context-info-loaded`` on body to be able to listen to the event outside the pattern.
  [thet]

- Related Items widget:
    - Add new mode "auto", which automatically sets ``search`` mode when a searchterm is present, otherwise ``browse`` mode.
    - Use searchterm as substring, which matches also within words by wrapping searchterm with the "*" wildcard.
    - Show a "One level up" button in the result set in browse mode.
    - Show folder icons in in the result set front of items instead a arrow behind the items.
    - Filter out non-selectable and non-folderish items in the result set when in browse mode.
    - Add option to scan the selected list of items for other patterns.
    - Add option for contextPath - objects with this path will not be selectable. This prevents the object where the relation is set on to from being selected and self-referenced.
    - Make favorites container positon relative, so that the absolute positioned dropdown appears correctly.
  [thet]

- Include TinyMCE 4.5.6
  [frapell]

Bug fixes:

- Upload pattern: Fix missing plone.protect authenticator token which led to broken uploads.
  [thet]

- fixed css-classes for thumb scales ...
  https://github.com/plone/Products.CMFPlone/issues/2077
  [fgrcon]

- modal: Fixed duplicate window.confirm on form unload.
  Fixes `issue 777 <https://github.com/plone/mockup/issues/777>`_.
  [seanupton]

- formunloadalert: Fixed incorrect use of Function.prototype.apply,
  when call() was seemingly intended; fixes case where modal close leads to
  exception.  Fixes `issue 776 <https://github.com/plone/mockup/issues/776>`_.
  [seanupton]

- In the insert link/image modal, pass use the correct related items widget options from the ``linkModal`` attribute.
  [thet]

- Fixed path to tooltip less files.
  This gave an ugly site in develoment mode when editing the loggedin bundle css.
  Fixes `issue 1843 <https://github.com/plone/Products.CMFPlone/issues/1843>`_.
  [maurits]

- Style filemanager toolbar to better fix small screens.
  [thet]

- Fix pattern options initialization according to change in plone.app.theming.
  See: https://github.com/plone/plone.app.theming/pull/124
  [thet]

- Fix setting empty ace editor instance by passing an empty text.
  [thet]

- Unify disabling of buttons by using setting the ``disabled`` DOM property instead using classes.
  Fixes thememapper button staying disabled all the time.
  [thet]

- Autoformat + eslint fixes for thememapper and filemanager patterns.
  [thet]

- Update ``ace-builds`` to 1.2.6, which fixes IME handling in new Chrome.
  [thet]

- Fix i18n in upload pattern.
  [cedricmessiant]

- Do not use relative paths for imports in less files.
  Use the less variables for paths instead.
  Fixes a case, where less files couldn't be found in Plone development mode.
  [thet]

- fix datepicker markup, see plone/Products.CMFPlone#1953 - removes also ugly separator and uses CSS to add space.
  [jensens]

- fix pat-moment: localization of default date display.
  This was american english only, now it uses the configured locale format LLL (see momentjs docs) which is almost the same,
  but works in any language.
  [jensens]

- fix structure pattern: do not use a relative date in structure pattern, editors are complaining and it indeed is bad UX.
  format with date and time in localized format 'L LT'
  [jensens]

- fix structure pattern: if title is empty then show items ID.
  [jensens]

- fix localization of "Open folder" link title in related items pattern
  [datakurre]

- Fix issue where formunloadalert pattern raised initialization error for modals.
  [datakurre]

- Update jqtree to version 1.4.1
  [datakurre]


2.4.0 (2017-02-20)
------------------

Incompatibilities:

- The related items and structure patterns have changed quite a lot.
  Customizations might break due to these changes.
  See below.


New:

- PickADate pattern: Add a button to set the date or time to now and another to clear all inputs.
  Remove the clear buttons from the date and time picker itself, as they allowed incomplete input submission (e.g. date only when date and time were required).
  Also remove the now obsolete footer buttons as a whole from the date picker.
  Add options ``today`` and  ``clear`` to hide those buttons when set to ``false``.
  Use ``display: inline-block`` instead of problematic ``float:left``.
  Refs: PR #740, Fixes #732.
  [thet]

- PickADate pattern: Add option to automatically set the time when changing the date.
  It defaults to set the time to the current time.
  [thet]

- Change default sort option in livesearch pattern.
  [rodfersou]

- Show expired label in folder contents for expired attributes
  [vangheem]

- Related Items refactorings:

    - Make "search" and "browse" mode user-selectable via buttons.

    - Remove obsolete tree widget, use "browse" mode instead.

    - Let "search" mode search recursively.

    - Let "browse" mode start from current path.

    - Immediately open select2 results when clicking on "Browse" or "Search" or browsing somewhere.

    - Show only selectable items in "search" mode, if defined.

    - Show only selectable and folderish items in "browse" mode, if selctable items are defined.

    - Exclude already selected items in result list.

    - Default closeOnSelect to true.

    - Show "Open folder" arrow only when in "browse" mode.

    - Seperate templates from JavaScript into xml files.

    - Allow optional image and file upload (especially useful for image and file reference widgets).

    - Allow configuration of "favorites" to quickly switch the current path via a dropdown menu.

    - Adapt TinyMCE pattern to related item changes and remove now obsolete selection and result templates.

    - Calculate all paths relative to the ``rootPath``, so that breadcrumbs navigation and favorites do not show paths outside the rootPath.

    - For results and selected items with images, add a line break after the image.
  [thet]


- More Related items pattern:

    - Result button style allow for more room for scrollbar, and have subltle color change on hover to deliniate user-expected behavior of browsing vs. selecting item.

    - Related Items pattern: content icon cross-compatibility with Plone 5.x and 4.x (via plone.app.widgets 1.x); in Plone 5 getIcon returned from brain is a boolean, in Plone 4, it is a string -- use this to show content icons in Plone 5 as previous, but also show image scale in Plone 4, but only for images.  This is the most reasonable solution to avoid requesting many broken image scales (404) in Plone 4.

  [seanupton]


- Structure pattern refactorings:

    - Prevent popovers to be closed when clicking on non-visible elements which still use screen space (those with visibility: hidden or opacity: 0). That in addition to elements, which are not visible at all and do not use screen space (display: none). Prevents upload form in structure pattern to be closed when opening the file selection tool.

    - Use thumb scale for image preview in rename dialog and optimize the rename dialog layout.

    - Remove ``pat-relateditems`` path selection widget but make sure, the path can still be set via navigation within the structure pattern.

    - Add ``css`` action menu item option and always do a pattern scan on action menu items. This allows to set patterns on them, e.g. to open a modal or use tooltips.

    - Sort Available Columns dialog entries.

  [thet]


- Contentloader pattern: Remotely loaded HTML content is wrapped in a ``div`` element, to allow jQuery to find also the first element.
  jQuery starts to search at it's first child element.
  [thet]

- TinyMCE: Simplify definition of custom imageScales by passing a JSON string.
  [thet]

- Upload pattern: Add option ``allowPathSelection`` to disable the related items path selection.
  [thet]

- Upgrade TinyMCE to 4.4.3
  [ebrehault]

- Add select2 result class based on value of option so it can be styled
  [vangheem]

- Add to interpret TinyMCE ``importcss_selector_filter`` and ``filter`` value
  of each ``importcss_groups`` configuration value as RegExp value instead
  of plain string to make importcss-plugin more configurable through pattern
  [datakurre]

- Add ``defaultSortOn`` option in ``livesearch`` pattern.
  [Gagaro]

- Add an option to set the path operator in QueryHelp and relateditem pattern.
  [Gagaro]

- Add srcset attribute to image modal
  [didrix]

Fixes:

- Change ``bool`` function in mockup-utils to allow for truthy values and match on falsy values.
  [thet]

- Fix jquery.event.drag to work with HTML5 drag
  [vangheem]

- Move tooltip pattern definition after bootstrapTooltip function definition.
  This should fix `bootstrapTooltip is not a constructor errors`.
  [vangheem]

- Make ``pat-tooltip`` useable by it's own by including the necessary less files and reuse that one in other patterns.
  Allow configuration of ``placement`` parameter.
  [thet]

- Update outdated links in Learn.md
  [staeff]

- Use github fork of grunt-sed and remove unused task.
  [gforcada]

- Fixes issue when HTML escaping select2 values. Now removing HTML completely and leave the input unescaped.
  [petschki]

- Fix conflict between upload and relateditem browse button.
  [Gagaro]


2.3.0 (2016-08-19)
------------------

Incompatibilities:

- Remove support for node version < ``0.11`` and update travis dependencies.
  [thet]

- Needs RequireJS configuration for ``mockup-patterns-relateditems-url``.
  [thet]


New:

- Related items pattern: Result button style allow for more room for scrollbar, and have subltle color change on hover to deliniate user-expected behavior of browsing vs. selecting item.
  [seanupton]

 - Related items pattern: Related Items pattern: content icon cross-compatibility with Plone 5.x and 4.x (via plone.app.widgets 1.x); in Plone 5 getIcon returned from brain is a boolean, in Plone 4, it is a string -- use this to show content icons in Plone 5 as previous, but also show image scale in Plone 4, but only for images.  This is the most reasonable solution to avoid requesting many broken image scales (404) in Plone 4.
  [seanupton]

- Structure pattern refactorings:

    - Allow definition of action menu items not only as dropdowns but also as buttons.

    - Add ``openItem`` and ``editItem`` actions as buttons and remove the open icon from the title column.

    - Open ``openItem`` links according to ``typeToViewAction`` instead of default with the ``/view`` postfix.

    - Open ``editItem`` under ``/@@edit`` instead ``/edit``.

    - Remove JS event handlers for externally opening simple URLs and use the href attribute instead.

    - Add ``iconCSS`` option for action menus items to add icons.

    - Add ``modal`` option for action menus items to allow links open in a modal.

    - Add ``iconSize`` option to set the icon size if a item has an image.

    - Use icons for all actionmenu entries.

    - Use the tooltip pattern for all actionmenu buttons.

    - Use pat-moment also for ``start``, ``end`` and ``last_comment_date`` columns.

    - For columns with date fields, show an empty column if the date value is 'None'.

    - Remove the checkbox and the actionmenu from the breadcrumbs bar for the current active folder to simplify the structure pattern.
      The actionmenu contained redundant actions (cut, copy, paste) and selecting the current folder is possible one level up.

    - Don't show empty alerts with ``alert-warning`` CSS class.
      Show them transparent but in the same height as if they were not empty.
      Align HTML structue with bootstrap ones and use ``<strong>`` for alert labels.

    - Fix rearrange button

  [thet]

- Be able to set structure status from server with object of { text: '', label: '', type: 'warning'}
  so you can customize the status message from ajax handlers.
  [vangheem]

- Add body class for active popover.
  [vangheem]

- Add ``test-dev-ff`` as Makefile target and the related grunt/karma setup to run tests in Firefox.
  [thet]

- Update bower.json dependencies except backbone which tests would fail.
  Keep jQuery at ``1.11.3`` as long as this might be used in Plone 4.x together with plone.app.jquerytools, which uses the deprecated internal ``$.buildFragments`` method.
  [thet]

- Update package.json dependencies, except less which has incompatible changes since 2.0 (less.parse).
  [thet]

- Livesearch pattern: clear search term and hide results when Esc is pressed
  [datakurre]


Fixes:

- Upload pattern LESS: included omitted styles for progress bar
  in upload patttern by importing seletected styles from Bootstrap LESS.
  Fixes incorrect/omitted display of progress bar in plone.app.widgets 1.x.
  Built widgets.min.css is only 64 bytes larger, when gzipped.
  [seanupton]

- Updated the documentation in LEARN.md
  [janga1997]

- Fix issues where querystring widget was broke due to issues with
  checks for undefined
  [datakurre]

- Fix urls in modals not opening in new window
  [vangheem]

- Fix positioning of popovers in structure
  [vangheem]

- Escape input into select2 widget
  [vangheem]

- Fix issue where using filter when paging would not work in the structure pattern
  [vangheem]

- Fix structure to always default to page 1 of results when moving between breadcrumbs
  [vangheem]

- Fix possible grid markup in modal
  [petschki]

- Fix paste button not working
  [vangheem]

- Re-add missing ``mockup-patterns-autotoc`` and ``mockup-patterns-modal`` dependencies to TinyMCE link modal.
  [thet]

- Fix tests and mocks on real browsers for structure pattern test, which threw CSRF errors.
  [metatoaster]

- Moment pattern: Don't try to parse obvious invalid dates ("None", "").
  Avoids Moment.js deprecation warnings.
  [thet]


2.2.0 (2016-03-31)
------------------

New:

- set XML syntax coloring for .pt files in text editor
  [ebrehault]

- Structure now accept customization options for a number of things in
  the form of requirejs modules.  This currently includes the extended
  menuOptions definition, the menuGenerator per result item, the click
  handler the link for each individual item, and the collection module
  for interaction with the server side API for item generation.

  Where applicable, the default implementation are now named requirejs
  includes with those as the defaults to the relevant parameters.

  Incidentally, this also required a major cleanup/refactoring of how
  the ResultCollection class interacts with the pattern and its support
  classes.
  [metatoaster]

- Structure now supports IPublishTraverse style subpaths for push state.
  [metatoaster]

- Alternative parameter/syntax for specification of the pushState url to
  be inline with the usage of ``{path}`` token in URL templates.
  [metatoaster]

Fixes:

- Fix fakeserver ``relateditems-test.json`` response to return ISO dates for ``CreationDate``, ``ModificationDate`` and ``EffectiveDate``, as they really do in Plone.
  This resolves a moment deprecation warning in structure examples.
  [thet]

- JSHint fixes and jscs formatings for structure pattern.
  [thet]

- Cleanup RequireJS dependencies.
  [thet]

- Fix TinyMCE to work with Safari when using inline mode. This fixes bug where Safari
  would not work with mosaic
  [vangheem]

- ``.jscs.json`` format fixes for newer jscs versions.
  [thet]

- Fix ``Makefile`` to use ``mockup/build`` instead of ``build``.
  [thet]

- Fix structure so rendering does not fail when paste button is missing.
  [metatoaster]

- Fix structure so that different views can have its own saved visible
  column ordering settings.  Also loosen the coupling of the columns to
  the data to aid in view rendering.
  [metatoaster]

- Fix Build CSS button in thememapper with file system-based themes to display
  the generated CSS in the editor.
  [ebrehault]

2.1.3 (2016-02-27)
New:

- Upgrade TinyMCE to 4.3.4
  [vangheem]


Fixes:



2.1.3 (2016-03-10)
------------------

New:

- Fix resource registry not allowing to go into development mode when
  bundle is selected
  [vangheem]

- Add rootPath suppport to relatedItems, to support navigation roots.
  [alecm]

Fixes:

- fix query string preview using date queries
  [vangheem]

- fix saving values for query string
  [vangheem]

- be able to use multiple importcss_file_filter files
  [vangheem]

- Fix issue where if existing querystring path value is ".::1",
  after edit, the wrong value will be selected

- Calculate z-index for modals dynamically to always be on top
  [vangheem]

- Fix path widgets initialization in querystring pattern.
  [Gagaro]

- Fix XSS vulnerability issues in structure and relateditem pattern.
  [metatoaster]

- Fix `aria-hidden` attribute control problem on folder content panel
  [terapyon]

- Trim links in tinymce before inserting them in the source.
  [Gagaro]

- Ensure we have all content for tree query in relateditems
  [Gagaro]

- Fix default value for treeVocabularyUrl in relateditems.
  [Gagaro]

2.1.2 (2016-01-08)
------------------


Fixes:

- Changed how the querystring pattern displays path-based criteria to use
  related items widget and some pre-baked often-used queries
  [obct537]


2.1.1 (2015-12-17)
------------------

New:


- do not set overflow hidden on modal wrapper parent. This should already
  be taken care of with plone-modal-open class being applied to the body.
  This should fix issues with scrolling when this isn't properly cleared
  [vangheem]
- Changed how the querystring pattern displays options for path-based queries,
  to improve usability for less tech-savvy users.
  [obct537]

Fixes:

- Use ``selection.any`` in querystring pattern.
  Issue https://github.com/plone/Products.CMFPlone/issues/1040
  [maurits]

- Import TinyMCE ``Content.Objects.less`` from the lightgray skin in ``less``
  mode, not ``Content.less`` in ``inline`` mode.
  Fixes plone/Products.CMFPlone/#755 - visual aids not visible.
  ``Content.Objects.less`` also doesn't overwrite our fonts.
  [thet]

- Enforce a ``min-width`` for tables while editing and visual aids turned on.
  Fixes plone/Products.CMFPlone#920.
  [thet]

- Cleanup and rework: contenttype-icons and showing thumbnails
  for images/leadimages in listings ...
  https://github.com/plone/Products.CMFPlone/issues/1226
  [fgrcon]

- Fix flaky behavior of Resource Registries buttons
  https://github.com/plone/Products.CMFPlone/issues/1141
  [davilima6]

2.1.0 (2015-11-10)
------------------

New:
- Fixed issue causing the querystring pattern to query multiple times per change
  [obct537]

- Added the ``momentFormat`` option to the ``structure`` pattern.
  [Gagaro]

- Removed mockup-core as a dependency.
  [jcbrand, goibhniu]

**NOTE**:
    `mockup-patterns-base` has been deprecated.
    Individual patterns now need to be updated to use `pat-base` instead
    of `mockup-patterns-base` and also explicitly set `parser` to `'mockup'`
    in the `Base.extend` call.
    Refer to any of the core Mockup patterns for examples.

Fixes:

- Do not set overflow hidden on modal wrapper parent. This should already
  be taken care of with plone-modal-open class being applied to the body.
  This should fix issues with scrolling when this isn't properly cleared
  [vangheem]

- Use window.pushState instead of setting hash for autotoc pattern
  when tabs change.
  [vangheem]

- Set value for ``ReferenceWidget`` in querystring.
  [Gagaro]

- Correction of a mistake in css z-index related items widget.
  The content bar appeared behind the widget. [hersonrodrigues]

- Fix modal when leaving a modal in a modal.
  [Gagaro]


2.0.12 (2015-09-20)
-------------------

- Update manifest to include required files.
  [esteele]

2.0.11 (2015-09-20)
-------------------

- Update manifest to include required json files.
  [esteele]


2.0.10 (2015-09-20)
-------------------

- Fix buttons positions on resource registry (closes `886`).
  [rodfersou]

- Fix inline TinyMCE to work together with mosaic. The ``inline`` option must
  now be passed to the patterns option object instead to the patterns tiny
  options object.
  [thet]

- Pass more i18n labels to the PickADate pattern
  [ichim-david]


2.0.9 (2015-09-11)
------------------

- Use hash to keep autotoc position settings
  [vangheem]

- Fix inline TinyMCE to work together with ``pat-textareamimetypeselector``.
  [thet]

- Fix scrolling when closing a modal within a modal
  [ebrehault]


2.0.8 (2015-09-08)
------------------

- Fixed issue causing folders to be overwritten in the thememapper
  [obct537]

- Thememapper popups now close when the user clicks somewhere else
  [obct537]

- Add option to use tinyMCE inline on a contenteditable div. The pattern
  creates a contenteditable div from the textarea, copies the textarea's
  content to it and handles copying changed text back to the textarea on form
  submit.
  [thet]


2.0.7 (2015-09-07)
------------------

- Fix structure pattern sorting
  [vangheem]

- checkout tinymce language with ``-`` in addition to ``_``
  [vangheem]

2.0.6 (2015-08-23)
------------------

- Improvements to dynamic popover content handling
  [vangheem]

- Lessbuilder will now guess filenames based on manifest.cfg
  [obct537]

- Filemanager popovers will now close on file change
  [obct537]

- Added button to clear the sitewide theme cache to the thememapper interface
  [obct537]

- Querystring pattern: Create date widgets with existing data, if present.
  Also subscribe to the ``updated.pickadate.patterns`` to update values when
  date widgets change.
  [frapell]

- Pickadate pattern: Set the value using the .val() method
  [frapell]

- Pickadate pattern: Allow to choose format to be used when creating widget
  with existing data, and use that to format the returned value.
  [frapell]

- add action value to form when using disableAjaxFormSubmit option on modal
  [vangheem]

- Modal Pattern: If ``data-view-url`` attribute is available on the body, use
  it. Otherwise look for ``data-base-url`` and finally for a ``<base>`` tag.
  [ale-rt]

- filemanager will now re-open files to the same line/position as when it was closed
  [obct537]

- Fixed "less is not defined" error while in production mode
  [obct537]

- lessbuilder will now use relative urls
  [obct537]

- add "Save As" option in less builder
  [obct537]

- add Refresh button to filemanager
  [obct537]

- filemanager tree now remains open after add/delete/rename/upload
  [obct537]

- changed styling in thememapper/filemanager to be more consistent and user friendly
  [obct537]

- better interaction with insert uploaded image/link in tinymce
  [vangheem]

- add plone primary button styles for insert tinymce modals
  [vangheem]

- better interaction with insert uploaded image/link in tinymce
  [vangheem]

- add plone primary button styles for insert tinymce modals
  [vangheem]

- remove unused tablesorter pattern
  [vangheem]

- switch to tab where link/image data is loaded from on tinymce pattern
  [vangheem]

- detect valid url on tinymce external
  [vangheem]

- add Python syntax coloring in text editor
  [ebrehault]


2.0.5 (2015-07-18)
------------------

- add optional setTitle option to pat-moment, put timestamp in element title
  [braytonosg]

- fix pickadate default timezone to work even if the default isn't the
  last timezone in the list
  [braytonosg]

- remove add menu from structure as we will rely on toolbar add menu
  for this functionality
  [vangheem]

- give stronger warning with rearrange feature, specially on root
  [vangheem]

- show quick view for items in structure row
  [vangheem]

- upgrade mockup-core to 2.1.10
  [vangheem]

- fix inserting image right after you upload it in tinymce
  [vangheem]

- Accessibility fixes for structure:
    - label "cog"/actions
    - provide title attribute on buttons
    - add aria-hidden true/false attrs and role=tooltip for popovers
  [vangheem]

- remove accessibility pattern. see
    https://github.com/plone/Products.CMFPlone/issues/627
    https://github.com/plone/Products.CMFPlone/issues/348

- be able to specify not submit modal forms with ajax
  [vangheem]

- Fix 'Reserved Order' typo
  [frapell]

- add feature detection support to upload pattern usage. Upload pattern
  will not work without drag n' drop and file api.
  [vangheem]

- rename structure "breadcrumbs" class to "fc-breadcrumbs" to prevent name clashes

- fix select2 widget's use of allowNewItems so that we can restrict select2
  value to only what is in the vocabulary

- rename "columns" and "selected" structure popover classes to "attribute-columns"
  and "selected-items" to prevent the possibility of clashing with other css
  as they are common class names.

- Update structure pattern to have buttons be more generic and extensible
  [vangheem]

- Upgrade pickadate to 3.5.6
  [vangheem]

- Fix problem where wrong items would get selected when moving from
  page to page with structure pattern
  [vangheem]

- UI/UX improvements to related items folder tree select
  [vangheem]

- correctly set href and id for autotoc pattern
  [vangheem]

- fix title not being set on images in tinymce
  [vangheem]

- Improve the upload pattern so it shows useful messages in case of errors
  [frapell]

- When refreshing the upload path for the upload pattern in tinymce, clear its
  value first
  [frapell]

- use autotoc tab style for resource registry
  [vangheem]

- be able to add new file to resource registry overrides
  [vangheem]

- fix livesearch word wrapping issue
  [vangheem]

- capitalize "Save" buttons on resource registry
  [vangheem]

- Set pat-tooltip's html option to ``true`` by default, as it cannot be set by
  the options. Real fix has still to be done.
  [thet]

- Bugfix in pat-tooltip's HTML support.
  [thet]


2.0.4 (2015-05-31)
------------------

- upgrade to mockup-core 2.1.9
  [vangheem]

- add image modal type
  [vangheem]

- Allow to provide a sort_on and sort_order attributes for the QueryHelper
  [frapell]

- handle errors better with the modal pattern
  [vangheem]

- fix weird issue with selecting multiple links and images on a page
  while you are editing
  [vangheem]

- Update to jQuery 1.11.3, moment 2.10.3 and jquery.recurrenceinput.js v1.5.
  [thet]

- Cleanup: Use ``windows.alert`` and ``window.confirm`` instead globals. Remove
  bootstrap-tooltip from requirejs config, as we have our own. Define more
  export variables for Bootstrap plugins.
  [thet]

- fix rename structure popover. It was missing _t template param
  [vangheem]

- update loading icon to work without font icons and handle
  using with modals and backdrops better
  [vangheem]

- fix selecting a folder to upload to for upload pattern
  [vangheem]


2.0.3 (2015-05-13)
------------------

- modal should emit shown and hidden event after body class toggled
  [vangheem]

- cancel should also clear created bundle or resource
  [vangheem]

- fix some structure styling issues
  [vangheem]

- Update more framework dependencies.
  [thet]

- Update to jQuery 1.11.2.
  [thet]

- Change TinyMCE initLanguage's ajax calls to ``GET`` method, as Zope's
  ZPublisher doesn't know about ``HEAD`` requests. Explicitly set the request
  to be cached, so there shouldn't be a negative performance impact. Removes
  some Plone 404's.
  [thet]

- Update Bootstrap to 3.3.4, which includes the WOFF2 version of Glyphicons.
  Removes some 404s.
  [thet]

- TinyMCE and upload pattern: Re-add triggering of the ``uploadAllCompleted``
  event and pass the server's response and path uid to it. TinyMCE's link
  plugin is listening to it and uses the information to create a URL out of the
  uploaded files. Fixes #471.
  [thet]

- Update Dropzone.js to it's latest 4.0.1 version.
  [thet]

- hide some fields from plone-legacy bundle interface since that bundle
  is a special case
  [vangheem]

- consistent behavior in changing development mode settings for
  resource registries pattern
  [vangheem]

- Be able to provide default scale selection so users do not select
  original scale as often
  [vangheem]

- TinyMCE: bugfix, where a link had to be guessed because of missing data-
  attributes, use set instead of setRaw. Add tests.
  [frapell]

- Add recurrence pattern styles to widget bundle.
  [thet]

- lazy load translations so we can potential hold off detecting language until
  the DOM is loaded
  [vangheem]

- Change all index references from ``Type`` to ``portal_type``. E.g. the
  TinyMCE configuration option ``containsobjects`` expects portal_type values,
  not Type.
  [thet]


2.0.2 (2015-04-01)
------------------

- Upgrade patternslib and mockup-core to fix install issues
  [vangheem]

- Use i18n.currentLanguage to initialise TinyMCE lang option. Fallback to
  closest lang if the required one is missing in TinyMCE (for instance, if
  fr_be.js is missing, we try fr.js and if fr.js is missing, we try fr_Fr.js).
  [ebrehault, davisp1]

- Fix building of docs with ``make docs``.
  [thet]

- update related items tree widget integration to have a bit better
  user interaction. Automatically open folder nodes and implement double click
  [vangheem]

- fix rendering issue with tinymce link/image overlay and tree selector
  [vangheem]

2.0.1 (2015-03-25)
------------------

- be able to use tinymce plone plugins without image upload part
  [vangheem]

2.0.0 (2015-03-17)
------------------

- make sure mockup can be installable with bower again
  [vangheem]

- Bring back TinyMCE ``sed`` and ``copy`` from ``mockup`` into ``mockup-core``.
  If we create bundles from an external package based on patterns from mockup,
  we don't want to care about the sed and copy tasks too. Instead, those should
  be defined on the patterns itself, but thats for a future release.
  [thet]

- Add ``id`` and ``Title`` to the default available columns of the structure
  pattern.
  [thet]

- fix bootstrap css bleeding into global namespaces
  [vangheem]

- add recurrence pattern
  [vangheem]

- add livesearch pattern
  [vangheem]

- add history support for structure
  [vangheem]

- Patternslib merge: Use Patternslib's scanner and registry.  This allows us
  to: Use Patternslib patterns with Mockup/Plone and use Mockup patterns with
  Patternslib outside of Plone. For changes required to patterns, see:
  mockup/GETTING_STARTED.md . Refs: #460.
  [jcbrand]

- Add icons to relateditems pattern (see https://github.com/plone/mockup/issues/442)
  [petschki]


1.8.3 (2015-01-26)
------------------

New patterns:

- Add "markspeciallinks" pattern.
  [agitator, fulv]

- Add mimetype selector pattern for textareas.
  [thet]

- Add Cookie Trigger pattern. It shows a DOM element if browser cookies are
  disabled.
  [jcbrand]

- Add Inline Validation pattern for z3c.form, Archetypes and zope.formlib
  inline validation.
  [jcbrand]

- Add passwordstrength pattern based on the ``zxcvbn`` library. Ref: #433.
  [lentinj]


Fixes and enhancements:

- Test fixes.
  [vangheem]

- Various structure pattern fixes.
  [vangheem]

- Make relateditems fullwidth.
  [vangheem]

- Add npm and bower tasks to Makefile.
  [benniboy]

- TinyMCE pattern fix: Don't append scale to generated image url, if no scale
  is given.
  [frapell]

- In the resource registry bundle detail view, add the fields
  ``last_compilation``, ``jscompilation`` and ``csscompilation`` for display.
  This gives more insight about the state of each bundle.
  [thet]

- More jQuery 1.9 compatibility changes: Change ``attr`` to ``prop`` for
  setting / getting the state of ``multiple``, ``selected``, ``checked`` and
  ``disabled`` states.
  [thet]

- Relicensing from MIT to BSD. Refs #24
  [thet]

- Modal Pattern: If ``data-base-url`` attribute is available on the body, use
  it. Otherwise search for a ``<base>`` tag. Plone 5 dropped the usage of base
  tags.
  [ACatlla, thet]

- Fix less variable overrides on resourceregistry pattern when building
  CSS from less resources
  [datakurre]

- Depend on ``tinymce-builded`` 4.1.6, include TinyMCE copy and sed
  configuration in here and fix some sed tasks.
  Revert cd89d377e10a28b797fd3c9d48410ad6ad597486: "Remove bower dependency on
  ``tinymce-builded``, since the ``tinymce`` dependency already points to the
  official builded ``tinymce-dist`` reposotory." ``tinymce-dist`` doesn't
  include the language files, which are needed.
  [thet]

- Fix thememapper pattern.
  [ebrehault]

- Fix broken HTML tag on structure pattern's ``actionmenu.xml``.
  [datakurre]

- File label cannot be used as path.
  [ebrehault]

- Include ``docs.less`` from ``mockup-core``, which can better be reused. Use
  ``@{bowerPath}`` less variable where possible.
  [thet]

- Eventedit pattern: Use more specific CSS selectors, so that switching
  whole_day on and off doesn't hide the publication date's time component.
  Refs: https://github.com/plone/plone.app.event/pull/169
  [thet]

- Depend on newer `mockup-core` version.
  [thet]

- Fix tests to run within reorganized folder structure from 1.8.2.
  [thet]


1.8.2 (2014-11-01)
------------------

- Reorganize folders so that javascript is included in the cooked egg.
  [esteele]


1.8.1 (2014-11-01)
------------------

- Size for modals may be specified.
  [bloodbare]

- Include vagrant setup as an install option for Mockup.
  [frapell]


v1.8.0 (2014-10-26)
-------------------

- Bower updates, except pickadate and backbone.paginator.
  [thet]

- Cleanup: Remove unused ``*._develop.js`` bundles. Remove unused bundles
  ``toolbar`` and ``tiles``. Remove unused bower dependencies ``domready``,
  ``respond`` and ``html5shiv``. Move all NixOS plattform specific ``*.nix``
  config files to a ``.nix`` subdirectory. Fix index.html markup. Remove unused
  ``__init__.py``.
  [thet]

- Remove licensing and author information from source files. Fixes #421 Fixes
  #422.
  [thet]

- Package metadata changes including removal of deprecated version specifier
  from bower.json.
  [thet]

- Remove bower dependency on ``tinymce-builded``, since the ``tinymce``
  dependency already points to the official builded ``tinymce-dist``
  reposotory. Raise TinyMCE version to 4.1.6.
  [thet]

- Fix Makefile for node versions < and >= 0.11.x.
  [petschki, thet]

.. _`#886`: https://github.com/plone/Products.CMFPlone/issues/886
