# Changelog



## [5.0.0-alpha.26](https://github.com/plone/mockup/compare/5.0.0-alpha.25...5.0.0-alpha.26) (2022-11-14)


### Bug Fixes


* **Build:** Fix webpack cacheGroup optimization configuration. ([df853db](https://github.com/plone/mockup/commit/df853dbee2c6cf3eab9fa3e9a8e8f18dcbe24363))

## [5.0.0-alpha.25](https://github.com/plone/mockup/compare/5.0.0-alpha.24...5.0.0-alpha.25) (2022-11-07)


### Features


* **pat tinymce:** Only import plugins that are actually enabled ([85846e6](https://github.com/plone/mockup/commit/85846e69295cf1209c72a51d1a44bca193e6fa8b))

* Use webpack's `splitChunks` optimization for generating chunks ([6209520](https://github.com/plone/mockup/commit/62095201a66ffc5ae5c418f2a7ffe044b6bd75ac))


### Bug Fixes


* **core i18n:** fix tests ([65f0379](https://github.com/plone/mockup/commit/65f0379baa299f6612a0513b3c9ad18bd1b99a10))

* **pat markspeciallinks:** fix tests ([67e031d](https://github.com/plone/mockup/commit/67e031d4edd037cdc27300fd460cbf2f0cda1862))

* **pat recurrence:** Fix editing weekly weekdays. ([5d288c7](https://github.com/plone/mockup/commit/5d288c7fb9e25ee695a9bca0c35460f9259c4a7d))

* **pat recurrence:** Fix pagination of recurrence dates to not close overlay. ([a011ba2](https://github.com/plone/mockup/commit/a011ba26cdcd87244015b94d1253d70ffde5cb63))


### Maintenance


* **Build:** Update path to the webpack module federation config. ([bfdaf25](https://github.com/plone/mockup/commit/bfdaf25b038242e7870aa8f335e1f12a5a616ecb))

* **Build:** Upgrade to @patternslib/patternslib 9.7.0-alpha.2 and @patternslib/dev to 3.0.0. ([1fa9d49](https://github.com/plone/mockup/commit/1fa9d49a42f0ab40735b48d3b573b36ac915737c))

* Do not use `--env` for environment variables ([63a33ff](https://github.com/plone/mockup/commit/63a33fffc86a368215370479c436d75b6926e9ab))

* **pat modal:** Fix tests. ([aacd9fa](https://github.com/plone/mockup/commit/aacd9fac9da84833b72780ca2c3e66f1b3b442cd))

* **pat toggle:** Fix tests. ([fd8f5ea](https://github.com/plone/mockup/commit/fd8f5ea2711228e3a0032c9020c1a595e373b833))

* **pat-livesearch:** Fix tests. ([20e5876](https://github.com/plone/mockup/commit/20e5876731d08cd02ece2967adc4f86545476d5b))

* **Tests:** Extend the jest config from Patternslib which has important mocks in place. ([aca56b9](https://github.com/plone/mockup/commit/aca56b98103771b039487323612a3ffd40c13268))

* **Tests:** Remove unneeded test setup which comes already from @patternslib/patternslib. ([accf632](https://github.com/plone/mockup/commit/accf63286a3b625d0425d2990186f81cd49d2edc))

* **Tests:** Rename to setup-tests for consistency with Patternslib. ([a7d65ad](https://github.com/plone/mockup/commit/a7d65ad283aeafe42d9af18153c4bbd987f7cc7f))

* Upgrade dependencies. ([796804a](https://github.com/plone/mockup/commit/796804a5caba68fd433b3044869621918eff6732))

* Upgrade Patternslib to 9.7.0-alpha.5. ([4866f30](https://github.com/plone/mockup/commit/4866f309e4ac13f2e13ae5279ca41605d98fa867))

## [5.0.0-alpha.24](https://github.com/plone/mockup/compare/5.0.0-alpha.23...5.0.0-alpha.24) (2022-10-03)


### Features


* pat-tinymce: add table header by default ([c6e27bb](https://github.com/plone/mockup/commit/c6e27bbce44478bfb969314fa05b090c294a235a))


### Bug Fixes


* pat-tinymce: fix inserttable button tooltip ([663b7f5](https://github.com/plone/mockup/commit/663b7f5cf730bdc3e953b8d3871f311d5bf6cd26))

* pat-tinymce: Translate inserttable button tooltip. ([9878245](https://github.com/plone/mockup/commit/9878245580d5512377d844d05c86e4d4b304427d))


### Maintenance


* **Build:** Update Bootstrap 5.2.2 ([54c731f](https://github.com/plone/mockup/commit/54c731f0806934dcd3fc724a182c92e5a3255844))

## [5.0.0-alpha.23](https://github.com/plone/mockup/compare/5.0.0-alpha.22...5.0.0-alpha.23) (2022-10-03)


### Bug Fixes


* **Docs:** Fix eleventy documentation to include correct Prism theme. ([8394c6f](https://github.com/plone/mockup/commit/8394c6f8c7e5b0a8c91c78ea90fa789f8b0d0c50))

* **pat relateditems:** call .stopPropagation on events for breadcrumbs links. Fixes: gh-1221 ([3cdca38](https://github.com/plone/mockup/commit/3cdca38ec89b49c1780fbb16c39d1dd84b313db3))


### Maintenance


* **Build:** Unlink all eventually linked @Patternslib dependencies before building bundles. ([4501e3c](https://github.com/plone/mockup/commit/4501e3cef8b2577069f4ec7791cd63272701cabf))

* **Build:** Upgrade dependencies. ([b2e3184](https://github.com/plone/mockup/commit/b2e3184e9e14820cae63e17b2f9fbbf751d47b79))

## [5.0.0-alpha.22](https://github.com/plone/mockup/compare/5.0.0-alpha.21...5.0.0-alpha.22) (2022-09-21)


### Bug Fixes


* **pat relateditems:** Fix initialization of ordering for pre-populated items. Fixes: [#1205](https://github.com/plone/mockup/issues/1205). ([ae42f40](https://github.com/plone/mockup/commit/ae42f40a9758b884f4d4f652fc4e5b7ee3a47110))Co-authored-by: Johannes Raggam <thetetet@gmail.com>
Co-authored-by: Maurits van Rees <maurits@vanrees.org>

* **pat select2:** Fix initialization of ordering for pre-populated items. Fixes: [#1205](https://github.com/plone/mockup/issues/1205). ([0ddcb5b](https://github.com/plone/mockup/commit/0ddcb5b9b4a89149228e59f82b791622663c5db1))Co-authored-by: Johannes Raggam <thetetet@gmail.com>
Co-authored-by: Maurits van Rees <maurits@vanrees.org>

* **pat-select2:** load language files ([b172397](https://github.com/plone/mockup/commit/b17239731260388c0a093ca5bc4c709faa48576c))

* **pat-tinymce:** set the language in tiny options ([ba6e749](https://github.com/plone/mockup/commit/ba6e749f6e8000f6df210f9103d07aba69ff8885))


### Maintenance


* **Build:** upgrade Bootstrap to 5.2.1 ([73afbcc](https://github.com/plone/mockup/commit/73afbcc05dbf084ff392d3dcc7b3086bf27e5357))

## [5.0.0-alpha.21](https://github.com/plone/mockup/compare/5.0.0-alpha.20...5.0.0-alpha.21) (2022-08-11)


### Features


* **pat date-picker:** Add pat-date-picker from @patternslib/patternslib. ([0fa79a4](https://github.com/plone/mockup/commit/0fa79a45563fbf04d3fc996b7b74be4e3d8e3c44))


### Maintenance


* **Build:** Include bundle name and version in generated files (Feature of @patternslib/dev 2.4.0.) ([ffbc1c4](https://github.com/plone/mockup/commit/ffbc1c42a515ad0a7aac9aa885eeb922d3e1f61c))

* Upgrade dependencies. ([1025636](https://github.com/plone/mockup/commit/10256367741e8d2e46256c09eeace8d62957f271))

## [5.0.0-alpha.20](https://github.com/plone/mockup/compare/5.0.0-alpha.19...5.0.0-alpha.20) (2022-08-11)


### Bug Fixes


* **pat modal:** fix zIndex of pat-modal, tinymce uses 1300, so we have to be higher ([2f4fd88](https://github.com/plone/mockup/commit/2f4fd88a12304e23d8fb0a13853632463e67018c))

* **pat modal:** make it respect backdropOptions.zIndex if it is set ([50c1696](https://github.com/plone/mockup/commit/50c1696ef67a078f1fb20f18f707d18d6d9d1ce8))

* **pat tinymce:** fix zIndex for link modals in tinymce to be higher than 1300 ([2618a38](https://github.com/plone/mockup/commit/2618a38814a75a288a0f1f5bef5e8ee8b7345a68))

## [5.0.0-alpha.19](https://github.com/plone/mockup/compare/5.0.0-alpha.18...5.0.0-alpha.19) (2022-08-03)


### Features


* **pat textareamimetypeselector:** Initialize all textareas with the same name. ([ff206b9](https://github.com/plone/mockup/commit/ff206b9a02bf4e049c388bc09f240c3c755a7da3))


### Bug Fixes


* **pat querystring:** Do not close modal if querystring criteria is removed. ([d22bb0b](https://github.com/plone/mockup/commit/d22bb0b1890c520aa5ed28ce3bed6553fec1e2c8))

* **pat relateditems:** Minor CSS fixes for uploader dropdown. ([7c730eb](https://github.com/plone/mockup/commit/7c730eb8b9a92adc113a2327b82f9df53caf8777))

* **pat schemaeditor:** Fix adding fields to fieldsets, and drag and drops between fieldsets. Prevent adding fields to fieldsets from behaviors. fixes gh-1201 ([9c3ec96](https://github.com/plone/mockup/commit/9c3ec96d5b247a4d3c3ececc28938af61f02d3c7))

* **pat search:** Use core utils loader. ([a67f76e](https://github.com/plone/mockup/commit/a67f76eedc51eb16d54b5b7e415f75fe7178f330))

## [5.0.0-alpha.18](https://github.com/plone/mockup/compare/5.0.0-alpha.17...5.0.0-alpha.18) (2022-07-21)


### Maintenance


* **Build:** Update Boostrap to 5.2.0 and Boostrap Icons to 1.9.1 ([92b33cc](https://github.com/plone/mockup/commit/92b33cc270c433af6d05961c75eb17d2b5316c37))

## [5.0.0-alpha.17](https://github.com/plone/mockup/compare/5.0.0-alpha.16...5.0.0-alpha.17) (2022-07-18)


### Bug Fixes


* **pat relateditems:** Make templates customizeable again via patternoptions ([984a9a6](https://github.com/plone/mockup/commit/984a9a6fde0720c0220fb153d35834e999035a51))

## [5.0.0-alpha.16](https://github.com/plone/mockup/compare/5.0.0-alpha.15...5.0.0-alpha.16) (2022-07-12)


### Features


* **i18n:** Add i18n script for gettext extraction and document the use of it. ([93ddfd7](https://github.com/plone/mockup/commit/93ddfd7fb5fd3efd35ba0e22f5300eb9f33b1393))

* **pat depends:** Add pat-depends from @patternslib/patternslib to the build. ([f9acd2a](https://github.com/plone/mockup/commit/f9acd2a8bc1eef6fb4a3173b4f293e656f908c1d))This allows for optional form fields or other HTML‌ structure which depen on the value of form inputs.


### Bug Fixes


* **Build:** Fix Makefile and override make bundle target from @patternslib/dev. ([dbbca9d](https://github.com/plone/mockup/commit/dbbca9d8b973d399e8b3c0db098452965339aa97))

* **i18n:** Translatable strings need to be in one line. ([66e6358](https://github.com/plone/mockup/commit/66e6358e48ac77a1c692a16dce151779ac55f8e9))

* **pat tinymce:** Fix `linkType` mismatch in link/image modal ([12252a5](https://github.com/plone/mockup/commit/12252a535b5ac14a8a30890c6d0c2ede0ac6b749))

## [5.0.0-alpha.15](https://github.com/plone/mockup/compare/5.0.0-alpha.14...5.0.0-alpha.15) (2022-07-11)

## [5.0.0-alpha.14](https://github.com/plone/mockup/compare/5.0.0-alpha.13...5.0.0-alpha.14) (2022-07-08)


### Bug Fixes


* **pat modal:** Use jquery-form to be able to upload binary data via AJAX. ([7466336](https://github.com/plone/mockup/commit/74663368b364b596a4a6e139de6708318eef7c1d))


### Maintenance


* **Build:** Upgrade @patternslib/patternslib to 9.0.0-beta.1. ([cc97892](https://github.com/plone/mockup/commit/cc9789218e72b93646bf421924dd8e14981db1b9))

* **pat manageportlets:** Load jquery-form asynchronously. ([29145cf](https://github.com/plone/mockup/commit/29145cfc1aba30c58ccbf36c6dfadb44f2f480cd))

* **pat modal:** Fix eslint errors. ([e5506ee](https://github.com/plone/mockup/commit/e5506eeffaf636136b3d0a8ebc8157543617dde4))

## [5.0.0-alpha.13](https://github.com/plone/mockup/compare/5.0.0-alpha.12...5.0.0-alpha.13) (2022-07-08)


### Features


* Register jQuery and bootstrap globally with the main mockup bundle. ([a58eeab](https://github.com/plone/mockup/commit/a58eeabea00c014a00fb616885b277d15d60eb18))


### Bug Fixes


* Correct prettier config file name. ([545bd59](https://github.com/plone/mockup/commit/545bd59b38c676c94c38252c590590fd918e69c6))


### Maintenance


* Upgrade to @patternslib/dev 2.3.0. ([3c3dabb](https://github.com/plone/mockup/commit/3c3dabbd085e959354c80a26c98506910b539011))


### Breaking Changes


* Remove bootstrap bundle. ([4cd878e](https://github.com/plone/mockup/commit/4cd878ed86db4a11225474eb6c50813d9e08a8fe))

* Remove jquery bundle. ([7596a14](https://github.com/plone/mockup/commit/7596a14bfa1d7cbaf1ffeb37d6019f3b1ffe2cdd))

## [5.0.0-alpha.12](https://github.com/plone/mockup/compare/5.0.0-alpha.11...5.0.0-alpha.12) (2022-07-06)


### Maintenance


* Adapt to @patternslib/dev module federation changes. ([730ab0f](https://github.com/plone/mockup/commit/730ab0f4c4b214bd39a1e266ab0123578c4fb606))

* **Build:** Upgrade dependencies. ([b297ac4](https://github.com/plone/mockup/commit/b297ac46687130a45b72e89019b9fa43a78f2d3a))

* **Build:** Upgrade Patterns to 9.0.0-beta.0 and pat-code-editor to 3.0.0. ([d6996bf](https://github.com/plone/mockup/commit/d6996bf5bf1ea244f9e216ff071e62b7964655c7))

* **Cleanup:** prettier whole code base. ([e19f23e](https://github.com/plone/mockup/commit/e19f23e5ef79197810422f66e70127c77a0c7ec8))

* **Cleanup:** Remove dependency regenerator-runtime except from test setup. The async/await runtime handling is already built-in in current Babel. ([e848c13](https://github.com/plone/mockup/commit/e848c13a063bad6eea980bfaae90413f53159cfa))

* **Cleanup:** Remove unused dependencies. ([a5ef3f2](https://github.com/plone/mockup/commit/a5ef3f21f86cd58e7e19093f3a5d6abcbbe925d4))

* **Cleanup:** Remove unused imports and variables. ([9b79ce3](https://github.com/plone/mockup/commit/9b79ce3808ff68acd2e8411cd455981a6aeaa78c))

* **Cleanup:** Remove unused r.js file. ([e6322d3](https://github.com/plone/mockup/commit/e6322d3dd7d8f43220fdd5997d474a495b45e4cc))

* Depend on @patternslib/dev and extend from there. ([2f2ef5f](https://github.com/plone/mockup/commit/2f2ef5fe47406713340d044444d35fceeb3313ee))

* Extend babel config from @patternslib/dev. ([b702492](https://github.com/plone/mockup/commit/b702492f1b614b60c1e058b093ec1c818375ed11))

* Extend commitlint config from @patternslib/dev. ([4330cf7](https://github.com/plone/mockup/commit/4330cf7b99d91e22ae38d72bc7e982856162584c))

* Extend eslint config from @patternslib/dev. ([857f678](https://github.com/plone/mockup/commit/857f678f314e5d41eac182a676447a18402b1f77))

* Extend jest config from @patternslib/dev. ([5c43d43](https://github.com/plone/mockup/commit/5c43d43d5c39f6fc123f3dd900b00082ceb8cc24))

* Extend Makefile from @patternslib/dev. ([5da74f4](https://github.com/plone/mockup/commit/5da74f4e76fec1c66b6707be6479a61bfcecfc11))

* Extend prettier config from @patternslib/dev. ([08ce446](https://github.com/plone/mockup/commit/08ce4466d8594200df16ad4538fc67cc6adc3471))

* Extend release-it config from @patternslib/dev. ([ec69436](https://github.com/plone/mockup/commit/ec69436c837516cc654f11e4c8104b13bd7cbaf1))

* Extend webpack config from @patternslib/dev. ([811673a](https://github.com/plone/mockup/commit/811673a0db4e0133ea19adee2bd6b84cc04ddbda))

## [5.0.0-alpha.11](https://github.com/plone/mockup/compare/5.0.0-alpha.10...5.0.0-alpha.11) (2022-06-29)


### Bug Fixes


* **pat structure:** fix tablerow items without `exclude_from_nav` attribute. ([1de6ce5](https://github.com/plone/mockup/commit/1de6ce573ac1a8e8beba34dda1dd03a22cede58b))

## [5.0.0-alpha.10](https://github.com/plone/mockup/compare/5.0.0-alpha.9...5.0.0-alpha.10) (2022-06-20)


### Features


* **pat structure:** simplify badge styling and add new "exclude_from_nav" badge ([a0d3573](https://github.com/plone/mockup/commit/a0d35731d661292f0aec653c4e14542dfc6c2d83))

## [5.0.0-alpha.9](https://github.com/plone/mockup/compare/5.0.0-alpha.8...5.0.0-alpha.9) (2022-06-08)


### Bug Fixes


* **pat structure:** bootstrap popover fix ([6611570](https://github.com/plone/mockup/commit/661157061958ffbb58aa1c5d2295e14a7540a42e))

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
