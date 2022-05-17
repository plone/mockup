

### [5.0.2-alpha.1](https://github.com/plone/mockup/compare/5.0.2-alpha.0...5.0.2-alpha.1) (2022-05-17)


### Bug Fixes


* **Bundle:** Update new package name including [@plone](https://github.com/plone) scope. ([77bb86a](https://github.com/plone/mockup/commit/77bb86aa88dbb8c4189e8cf50e3650838b031cd8))

### [5.0.2-alpha.0](https://github.com/plone/mockup/compare/5.0.1-alpha.0...5.0.2-alpha.0) (2022-05-17)


### Maintenance


* **Bundle:** Also upload a compiled bundle release for GitHub. ([2604397](https://github.com/plone/mockup/commit/2604397277a3048ee77594e29c48b67d1f378df7))

### [5.0.1-alpha.0](https://github.com/plone/mockup/compare/5.0.0-alpha.0...5.0.1-alpha.0) (2022-05-17)


### Features


* **Build:** Use dynamic module federation. ([6aefc4b](https://github.com/plone/mockup/commit/6aefc4bd108b37aa2c292f6243e60a1005c8517f))



### Bug Fixes


* **relateditems:** Move Select2 out of init. ([0a7c631](https://github.com/plone/mockup/commit/0a7c631d30553a43a43d616f3947ac0bc6232113))
If it wasn't already registered, it would register and scan the document now.
If there were previous relateditems already modifying the DOM structure
and placing pat-select2 classes to some items, the import here would try
to initialize them.
But those pat-select2 items were meant to be initialized via the
Patternslib API and not automatically and are missing some configuration
needed by select2 (query attribute...).
By moving the Select2 out of the init and importing it early fixes this
problem.

Note: This happened in plone.app.mosaic with module federation.
pat-select2 was already directly imported by the main Mockup bundle.
But since we didn't have a global pattern registry, the pattern was
re-initialized where it wouldn't have to.
Since the change in Patternslib 8.0.0 with a global pattern registry
this fix might become obsolete.

However, we should have an eye on dynamic pattern imports immediately
registering and scanning the docment and possibly prevent that in some
way.

See: https://github.com/Patternslib/Patterns/issues/961


### Maintenance


* **Build:** Add build:webpack:dev:plone as package.json script to allow for a Plone development build. ([acf9839](https://github.com/plone/mockup/commit/acf9839ddf5b29c34068085ce3ac8a4d8a90f0c7))


* **Build:** Add prerelease target in Makefile. ([ea8d4e4](https://github.com/plone/mockup/commit/ea8d4e4fc2f87f1757ffd984be00926080f8795b))


* **Build:** Upgrade dependencies. ([2312ee5](https://github.com/plone/mockup/commit/2312ee55eb90340bc8fb35db102f7befd71b81d4))


* **Cleanup:** Cleanup unused parameter in webpack config. ([f749505](https://github.com/plone/mockup/commit/f7495052f02f9fcbed0e56308359d9ad64b7a679))


* **Cleanup:** Remove pat-content-browser. ([abd58f7](https://github.com/plone/mockup/commit/abd58f77e0a8cc7ff5807ce6ea322a38fa7c5b28))
This can be provided by an external bundle.

* **Makefile:** Add watch-plone and bundle-plone targets to Makefile. ([62332d1](https://github.com/plone/mockup/commit/62332d1914de6ea57829f2cf4e5f908cd7f69d98))


* **pat querystring:** Cleanup - direct import of Select2 is not necessary. ([13d0e0d](https://github.com/plone/mockup/commit/13d0e0d9535c958eaf662308477b985d1a6c9225))

## [5.0.0-alpha.0](https://github.com/plone/mockup/compare/3.2.2...5.0.0-alpha.0) (2022-05-17)

### Breaking Changes

* Upgrade to modern JavaScript (ES6+), define modules and use imports.

* Remove RequireJS.

* Depend on latest Patternslib.

* Remove Mockup's ``pat-tooltip`` and use Patternslib ``pat-tooltip`` instead.

* Remove Mockup's ``pat-moment`` and use Patternslib ``pat-display-time`` instead.

* Remove Mockup's ``pat-eventedit``, which was unused. Instead use Patternslib' ``pat-date-picker``, ``pat-depends`` and ``pat-validation``.

* Restructure searchbox markup for mobile navigation as offcanvas sidebar.