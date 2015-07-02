Changelog
=========

2.0.5 (unreleased)
------------------

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
