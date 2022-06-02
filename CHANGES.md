

## [5.0.0-alpha.8](https://github.com/plone/mockup/compare/5.0.0-alpha.7...5.0.0-alpha.8) (2022-06-02)


### Bug Fixes


* **pat structure:** datatable sorting ([a3335ff](https://github.com/plone/mockup/commit/a3335ffb2f258c7b30490ab785d9fc1abd6f7c33))


* **pat structure:** default page marker position ([f0bb04c](https://github.com/plone/mockup/commit/f0bb04c0b84a4e8e266cc5e733c0bbc498670737))


* **pat structure:** row actions cut/copy/default_page ([179fb41](https://github.com/plone/mockup/commit/179fb41bd8cfd709eacde7778ab687374b39b9e1))



### Maintenance


* **Build:** update datatables.net ([a42f4a9](https://github.com/plone/mockup/commit/a42f4a9b2eb287d1207cd6706a932045b6d0fc02))


* **Bundle:** new underscore release ([eeafed0](https://github.com/plone/mockup/commit/eeafed0db3eab6aee0b26593c17bd5f730050db2))

## [5.0.0-alpha.7](https://github.com/plone/mockup/compare/5.0.0-alpha.6...5.0.0-alpha.7) (2022-06-01)


### Features


* **pat structure:** lead image position in title column ([5ea6653](https://github.com/plone/mockup/commit/5ea6653c69c0a8708f8dffb37ec321d6444e1f44))



### Bug Fixes


* **pat structure:** dataTable styles ([a8e7250](https://github.com/plone/mockup/commit/a8e7250fef79294472a1c8c4ab8b8249d2745bde))



### Breaking Changes


* **core utils:** Remove createElementFromHTML. Use create_from_string from Patternslib core dom instead. ([7033e97](https://github.com/plone/mockup/commit/7033e97c4519e575e7485bfa0372be2876f832f4))


* **core utils:** resolveIcon: Simplify method and remove as_node and css_class. ([0ecfb33](https://github.com/plone/mockup/commit/0ecfb33c6be1b10fa4f92e7ed5e02a411f504aea))
These methods were used only in two places and can be substituted with create_from_string from Patternslib core dom.


### Maintenance


* Code formating. ([0486dcb](https://github.com/plone/mockup/commit/0486dcbcd6c06668651f5596465b81a5753a5dca))


* **core utils:** api doc for resolvIcon. ([14b1f9c](https://github.com/plone/mockup/commit/14b1f9c368f0fce531769add7376ba5dc78805d8))


* **core utils:** resolvIcon: Add a timeout for fetching icons remotely. Timeout is 5s. ([3a87d18](https://github.com/plone/mockup/commit/3a87d18994b07e56c19afef6a2ef1dd9a416bad0))


* **pat structure:** bootstrap classes for checkbox/select elements ([9bef30f](https://github.com/plone/mockup/commit/9bef30fc13db039696e26823de14965c7425f624))


* **pat structure:** Upgrade to backbone.paginator 2.x. ([e383de8](https://github.com/plone/mockup/commit/e383de87f7e89a50f91693d355f3cbce22684b22))


* Upgrade dependencies. ([b886321](https://github.com/plone/mockup/commit/b8863219fbefdcba75f583494f7c03972b3aa540))

## [5.0.0-alpha.6](https://github.com/plone/mockup/compare/5.0.0-alpha.5...5.0.0-alpha.6) (2022-05-23)


### Maintenance


* **Build:** Makefile: Do clean and install before releasing. ([51e9077](https://github.com/plone/mockup/commit/51e90776b572575d0367044cb8d5a84140c0b103))
This avoids any node_modules subdirectories from linked dependencies to land in the build.

* **Build:** Makefile: Only do a build:webpack when make build. Also makes release faster, where we do not need to build the docs - yet. ([8837459](https://github.com/plone/mockup/commit/88374594fe2278965e71aa76340cf70eb0c0c7a0))


* **Bundle:** Move dependency backbone.paginator to devDependencies to avoid version conflicts. ([f40f64d](https://github.com/plone/mockup/commit/f40f64d17ae3207d90d59390b5430850f1d8b205))
backbone.paginator is now in devDependencies as it requests outdated
versions of Backbone and Underscore. Having this in normal dependencies
field would eventually let backbone.paginator register itself in an
outdated Backbone version and make it unavailable by those used in
structure pattern.
Having this in devDependencies avoids this, but also makes the structure
pattern unavailable in add-on bundles unless this dependency is
explicitly added.
However, this should be fixed in a more sane way. But that's out of
scope for now.

## [5.0.0-alpha.5](https://github.com/plone/mockup/compare/5.0.0-alpha.4...5.0.0-alpha.5) (2022-05-23)


### Bug Fixes


* **pat structure:** Also import backbone.paginator and avoid a import/initialization problem where Backbone wasn't available. ([7c2b37f](https://github.com/plone/mockup/commit/7c2b37fefca06724e748ecac986d6f512fce06a7))



### Breaking Changes


* **core router:** Remove unused backbone router module. ([64ef907](https://github.com/plone/mockup/commit/64ef907d8a330b6ec2c80adfd8bd2c9e533b57dc))


* **pat modal:** Remove untested and unused (core Plone) router option. ([79bcc81](https://github.com/plone/mockup/commit/79bcc8109beff43751c3d1ae5611359cd9f4dabd))



### Maintenance


* **Build:** Explicitly add underscore as dependency. ([26fdd0a](https://github.com/plone/mockup/commit/26fdd0a688fb355d1f634749217deeac275834fb))


* **Build:** Fix backbone and underscore dependencies. backbone.paginator requests outdated versions. ([f229b9a](https://github.com/plone/mockup/commit/f229b9afc481a7f6f18cc7e43d34476e5b439ebf))


* **Build:** Remove non interactive ci-mode from Makefile to allow for OTP prompt and two-factor auth on npm. Also remove dry-run as we're now asked for each step. ([7ba9ff8](https://github.com/plone/mockup/commit/7ba9ff8b39f4cd96e54a82059d83b75a53778cf5))


* **pat modal:** Code formatting. ([ab780b4](https://github.com/plone/mockup/commit/ab780b4354a6ab48f53530f573c198b285b8535c))


* **pat structure:** Don't depend on lodash. ([6f92a53](https://github.com/plone/mockup/commit/6f92a53cf748a6c0551e5151bff95a2b22b2d4d9))


* **pat structure:** Importing backbone.paginator in collections.result is enough. Document why we add Underscore and Backbone to the global namespace. ([068301f](https://github.com/plone/mockup/commit/068301f406729d8c4e60840665e9845dceda5b99))

## [5.0.0-alpha.4](https://github.com/plone/mockup/compare/5.0.0-alpha.3...5.0.0-alpha.4) (2022-05-19)


### Maintenance


* **Bundle:** expose-loader not needed anymore. ([0001ee0](https://github.com/plone/mockup/commit/0001ee0f5b3fe4f15bdc80ecec75194c4ca6f5be))


* **Bundle:** Upgrade to Patternslib 8.0.2. ([76c8421](https://github.com/plone/mockup/commit/76c842177edf88a558e4369984ecfecc8bdd6bae))

## [5.0.0-alpha.3](https://github.com/plone/mockup/compare/5.0.0-alpha.2...5.0.0-alpha.3) (2022-05-19)


### Maintenance


* **Bundle:** Upgrade to Bootstrap 5.2.0-beta1. ([0de73b2](https://github.com/plone/mockup/commit/0de73b2f2881406a3a63c6d58bcc796535f04101))

## [5.0.0-alpha.2](https://github.com/plone/mockup/compare/5.0.0-alpha.1...5.0.0-alpha.2) (2022-05-18)


### Features


* **Build:** Create jquery and bootstrap bundles with module federation support. ([32e00d4](https://github.com/plone/mockup/commit/32e00d447ba21d45bc608e7026e8312670bc080e))



### Maintenance


* **Build:** Fix Makefile - use github.preRelease switch for prerelease target. ([164a3a8](https://github.com/plone/mockup/commit/164a3a82f3360686668fe2412de489b048beb6ad))


* **Build:** Update GitHub workflows definition. ([1180bb5](https://github.com/plone/mockup/commit/1180bb5f746b76ff026f618450c579058bd7e5f3))


* **Build:** Upgrade Patternslib to 8.0.1. ([8103362](https://github.com/plone/mockup/commit/810336274bb1ccb08d0fbe6b37b32c4e00336a8e))


* **Bundle:** Upgrade dependencies. ([e87d935](https://github.com/plone/mockup/commit/e87d935d4897f27d4c9a0cb869f3fbd2ce7c630e))

## [5.0.0-alpha.1](https://github.com/plone/mockup/compare/5.0.0-alpha.0...5.0.0-alpha.1) (2022-05-18)


### Features


* **Build:** Use dynamic module federation. ([6aefc4b](https://github.com/plone/mockup/commit/6aefc4bd108b37aa2c292f6243e60a1005c8517f))



### Bug Fixes


* **Bundle:** Update new package name including [@plone](https://github.com/plone) scope. ([77bb86a](https://github.com/plone/mockup/commit/77bb86aa88dbb8c4189e8cf50e3650838b031cd8))


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


* **Bundle:** Also upload a compiled bundle release for GitHub. ([2604397](https://github.com/plone/mockup/commit/2604397277a3048ee77594e29c48b67d1f378df7))


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