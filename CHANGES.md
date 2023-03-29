# Changelog



## [5.0.7](https://github.com/plone/mockup/compare/5.0.6...5.0.7) (2023-03-29)


### Bug Fixes


* **pat recurrence:** Various UI issues in recurrence modal. ([e71ae95](https://github.com/plone/mockup/commit/e71ae952dc2cb63041f08d595b477fabe1cf5c2f))


### Maintenance


* Upgrade dependencies. ([7e51ac5](https://github.com/plone/mockup/commit/7e51ac56692f4b8c1b356f8dbb2f618f33b59f57))

## [5.0.6](https://github.com/plone/mockup/compare/5.0.5...5.0.6) (2023-03-21)


### Maintenance


* **bundle:** Add `pat-checklist` ([b62dfb0](https://github.com/plone/mockup/commit/b62dfb031bc7437d47dbf03f3056238b8b93d7cd))

* override  for release-it ([14f84e0](https://github.com/plone/mockup/commit/14f84e0b3db6df732a3e4c6296879744136de0bf))

## [5.0.5](https://github.com/plone/mockup/compare/5.0.4...5.0.5) (2023-02-15)


### Bug Fixes


* **pata-datatables:** Need to downgrade due to incompability. ([f5c156c](https://github.com/plone/mockup/commit/f5c156c7ba94bec402f9f5978444c8122a771fe7))

## [5.0.4](https://github.com/plone/mockup/compare/5.0.3...5.0.4) (2023-02-15)


### Bug Fixes


* **pat-datatables:** Downgrade datatables to 1.12 to fix import errors. ([585ea8a](https://github.com/plone/mockup/commit/585ea8a972cba364f52c5fcf7d3927e01b9d87a4))Co-authored-by: toalba <tb@kleinundpartner.at>
Co-authored-by: Robert Niederreiter <rnix@squarewave.at>

* **pat-datatables:** Fix tests. ([9923015](https://github.com/plone/mockup/commit/9923015d6a366ae19b1895301dce1c00845cb587))Fix pat-structure test by requiring datatables from the test-setup
beforehand loading the test files. This is a necessary step for
datatables which wouldn't otherwise be attached to jQuery in tests.
Also freshly wrap the element with jQuery in the Patterns init method
after datatables was imported. A non-jQuery setup does not work at the
moment.


### Maintenance


* **cleanup:** Replace deprecated API calls. ([14c36bc](https://github.com/plone/mockup/commit/14c36bc8ec5b17f60defe9c2aafc1a7e4270c91a))

* **pat-datatables:** Actually, include all the datatables libraries. ([67ad865](https://github.com/plone/mockup/commit/67ad865bbd659b5c2b5626ce120bcc3c278aac66))We're depending on them anyways, so let's import all.
It's just a few kb of Bootstrap initialization code.

* Remove regenerator-runtime. This is not needed anymore. ([537219e](https://github.com/plone/mockup/commit/537219ec04bb0562d215409de8b08ee55935193a))

## [5.0.3](https://github.com/plone/mockup/compare/5.0.2...5.0.3) (2023-02-13)


### Bug Fixes


* **pat-relateditems:** Fix upload view. ([817d0e1](https://github.com/plone/mockup/commit/817d0e118d252b2409e0a065529a21cdc8ce80aa))


### Maintenance


* **Cleanup:** Autoformat with prettier. ([389b884](https://github.com/plone/mockup/commit/389b884cab5c9ce3a42f46a7e1fdb0741427e181))

* **Cleanup:** Fix eslint warnings. ([ff2def9](https://github.com/plone/mockup/commit/ff2def9b4ab0548b68f90633785772359d67dbf2))

* **Cleanup:** Fix more eslint warnings. ([e885446](https://github.com/plone/mockup/commit/e8854464552a07b8dd85608e458a0371282665cd))

* **Cleanup:** Fix remaining eslint warnings. ([38b9a85](https://github.com/plone/mockup/commit/38b9a851296c94540cc681af4458c240ec2b6a1b))

* **Cleanup:** Remove unused tests. ([f7a9bd3](https://github.com/plone/mockup/commit/f7a9bd35014063af9b09ff867c981393026895d0))

* **Cleanup:** Replace deprecated jquery API usage. ([3238565](https://github.com/plone/mockup/commit/323856592fbe58127ddbd156d2633b1aad8492a9))

* **Docs:** Update development information in the README. ([7a4a16f](https://github.com/plone/mockup/commit/7a4a16f7d0ea11b26f377a846b676f7d384908b2))

* Enable eslint and testing in GHA and the Makefile. ([014d872](https://github.com/plone/mockup/commit/014d87245f3487355532732acf4dc918c0ff4fbb))


## [5.0.2](https://github.com/plone/mockup/compare/5.0.1...5.0.2) (2023-02-13)


### Bug Fixes


* **pat recurrence:** Correct starttime of RDATE in recurrence. ([e70414f](https://github.com/plone/mockup/commit/e70414f0a0d0f73608e785fb27c6969e7e16fbe7))


## [5.0.1](https://github.com/plone/mockup/compare/5.0.0...5.0.1) (2023-02-10)


### Bug Fixes


* **pat-select2:** Do not replace multi select fields for pat-querystring. ([f096319](https://github.com/plone/mockup/commit/f096319ecb6c341558f0202e442772cb90cd11b2))A select[multiple] field without the multiple pattern option set is no longer
replaced with a input[type=hidden].
This fixes a problem in pat-querystring where switching from one
criteria to another duplicated the Select2 fields.
Select2 deals just fine with select[multiple] fields. The replacement
part should be evaluated for validity and eventually removed for a future
Mockup release.


## [5.0.0](https://github.com/plone/mockup/compare/5.0.0-beta.11...5.0.0) (2023-02-09)


### Features


* **pat-livesearch:** Make the timeout to hide the livesearch after focus was lost configurable. ([d939dd8](https://github.com/plone/mockup/commit/d939dd8c2a5e51bbb7fdde9502a8ba89e53f9968))

* **pat-relateditems:** Add ajaxTimeout option to configure the time to wait before ajax requests are done. ([44cdcc4](https://github.com/plone/mockup/commit/44cdcc410bfad66915eee8022823fd48af3b4afe))

* **pat-select2:** Add ajaxTimeout option to configure the time to wait before ajax requests are done. ([cd1d491](https://github.com/plone/mockup/commit/cd1d491a3430490128bb5f27e333c01dc83da65d))


### Bug Fixes


* **pat-relateditems:** Adapt to recent changes in pat-select2. ([1058ba8](https://github.com/plone/mockup/commit/1058ba8327820bc52b9e7d985c5422d697d1e62a))

* **pat-select2:** Do not load the english language translation files. English is the default language and no englich translation file exists. ([a4f6ad7](https://github.com/plone/mockup/commit/a4f6ad73f1c3f49f18a7184fd159d9b022dac3fe))

* **pat-select2:** Fix replacing the select with an input in multiple selection selects. ([9a27fd3](https://github.com/plone/mockup/commit/9a27fd39569e5ca0732826e1e1554be3557eea7f))


### Maintenance


* **pat structure:** fixing structure tests ([2b233c0](https://github.com/plone/mockup/commit/2b233c0ec89a7f9faee850eb3fdd3ccd383b96a9))

* **pat tinymce:** Uncomment and fix more tests ([6001867](https://github.com/plone/mockup/commit/6001867f933bc45192705d5dacda5550f1b22491))

* **pat-autotoc:** Remove test for jQuery plugin registration. That mode isn't supported anymore. ([391353e](https://github.com/plone/mockup/commit/391353e7d1d5fb416d17946323a58465364f6fad))

* **pat-livesearch:** Fix tests. ([69471b1](https://github.com/plone/mockup/commit/69471b128016b615ac44bcbe5bb5287b49c0506c))

* **pat-relateditems:** Fix tests. ([d917e4c](https://github.com/plone/mockup/commit/d917e4cb626f660ddf37cdf9f3b102f31e15897f))

* **pat-relateditems:** Modernize code. ([d8f2daa](https://github.com/plone/mockup/commit/d8f2daa9f45b6805dd9f35e791437e04bce47267))

* **pat-select2:** Fix tests. ([1ed3d6d](https://github.com/plone/mockup/commit/1ed3d6db8f9c8ab94de19f7c279f12b590da94c5))

* **pat-select2:** Fix tests. ([a8cf916](https://github.com/plone/mockup/commit/a8cf916904ae3b9746cab5d1cd1bd005a2b9ddbb))

* **pat-select2:** Modernize code. ([5588e96](https://github.com/plone/mockup/commit/5588e96ef1100e3a3522a719f7765eb53646de4a))

* **pat-sortable:** Fix tests. ([39efedd](https://github.com/plone/mockup/commit/39efedd5ccdb96cb23d955616673aa4ba649a71c))

* update iconmap.json ([41ba5e2](https://github.com/plone/mockup/commit/41ba5e22e296ec2402c1bc0fbdedc569d22f979f))

* Upgrade DataTables to 13. ([54f4d29](https://github.com/plone/mockup/commit/54f4d299ad4d80a77c3a50cfd651b31fced5e61b))

* Upgrade dependencies. ([8590f2b](https://github.com/plone/mockup/commit/8590f2b737eebbb69976a0394bdfb7dd57480de7))


## [5.0.0-beta.11](https://github.com/plone/mockup/compare/5.0.0-beta.10...5.0.0-beta.11) (2023-01-13)


### Bug Fixes


* **pat recurrence:** fix wrong month in BYENDDATE and RDATE when adding and occurrence ([76099ff](https://github.com/plone/mockup/commit/76099ffdee588d32e09d27147cdb5b400e7d544c))


## [5.0.0-beta.10](https://github.com/plone/mockup/compare/5.0.0-beta.9...5.0.0-beta.10) (2023-01-11)


### Bug Fixes


* **pat recurrence:** initial editing and correct time for additional RDATE values ([195ad31](https://github.com/plone/mockup/commit/195ad318492a77796193f5aa89abe35f4df4cbce))


## [5.0.0-beta.9](https://github.com/plone/mockup/compare/5.0.0-beta.8...5.0.0-beta.9) (2023-01-11)


### Maintenance


* update [@patternslib](https://github.com/patternslib) packages ([1439c02](https://github.com/plone/mockup/commit/1439c02b99bc4809ffcbe2d0640d428b1623603e))


## [5.0.0-beta.8](https://github.com/plone/mockup/compare/5.0.0-beta.7...5.0.0-beta.8) (2023-01-11)


### Bug Fixes


* **pat recurrence:** Fix recurrencewidget to initialize saved values correctly and fix RDATE and EXDATE editing ([f2f8336](https://github.com/plone/mockup/commit/f2f8336c8fa47f682728d2fc91d28d35995d9431))


### Maintenance


* **pat textareamimetypeselector:** Fix tests. ([99e646a](https://github.com/plone/mockup/commit/99e646a5548d622c265b42ac5ed44f64f21cb2e3))


## [5.0.0-beta.7](https://github.com/plone/mockup/compare/5.0.0-beta.6...5.0.0-beta.7) (2022-12-12)


### Bug Fixes


* **pat tinymce:** Add plonelink and ploneimage to valid_plugins always. ([9319689](https://github.com/plone/mockup/commit/9319689ccc3335f6fd592b5120c4023831c08f5a))


### Maintenance


* **pat tinymce:** Cleanup old code no longer needed. closes gh-1198 ([6e2803f](https://github.com/plone/mockup/commit/6e2803f66f15316a036f9e39604ad7883ebb3653))


## [5.0.0-beta.6](https://github.com/plone/mockup/compare/5.0.0-beta.5...5.0.0-beta.6) (2022-12-12)


### Bug Fixes


* Also include webpack.config.js in the build which is extended in plone.staticresources. ([ac4e717](https://github.com/plone/mockup/commit/ac4e7177939bf1e7027d8516e0d07438bca65c5c))


## [5.0.0-beta.5](https://github.com/plone/mockup/compare/5.0.0-beta.4...5.0.0-beta.5) (2022-12-12)


### Features


* **Build:** Include the build in the npm package. ([626a267](https://github.com/plone/mockup/commit/626a26713ae5cef0673add0c6e69cd82502aeea6))The compiled build is now included in npm packages by including the dist
directory in .npmignore. To not increase the package size too much the
JavaScript map files are not included. Now you can include Patternslib
by using unpkg or jsDelivr like so:

https://unpkg.com/@patternslib/pat-code-editor@4.0.0/dist/bundle.min.js
or
https://cdn.jsdelivr.net/npm/@patternslib/pat-code-editor@4.0.0/dist/bundle.min.js

* **pat tinymce:** Improve tinymce async initialization. Proper fallback when specific languages are not found, and avoid errors for missing or not found plugins. fixes gh-1253 ([a4d4e78](https://github.com/plone/mockup/commit/a4d4e78d596a62a3166635423b8cb337bf79f73b))


### Bug Fixes


* **pat modal:** Fix close selector for default cancel buttons. ([4905251](https://github.com/plone/mockup/commit/490525106a04a1998ae0a699bd21a7442a04a073))

* **pat recurrence:** Update occurrences on every field change/blur. ([4bf7430](https://github.com/plone/mockup/commit/4bf7430d5452291f17548d89f7e8236e50964ba6))

* **pat registry:** Fix record editing modals. ([8a864cf](https://github.com/plone/mockup/commit/8a864cf512d3a1672aca24ca769de92d7b4774c3))

* **pat structure:** fix escaped HTML in crumb and rename title. ([88ec616](https://github.com/plone/mockup/commit/88ec616559ee556f14f61c0dc8c4e6f3fd96fa01))

* **pat-datatables:** Fix DataTables problem with new version. ([9081186](https://github.com/plone/mockup/commit/9081186f943572640fee760f3e7975d1541398ea))The 1.13.1 series of datatables-net introduced an import error.
Fixing the version to the previous version which was known to work and exculde some imports with produce the same failure.


### Maintenance


* **Build:** Upgrade dependencies. ([7a46c8f](https://github.com/plone/mockup/commit/7a46c8fcba6d2b372d274ab83ce2fd4c8a988a14))

* define YARN in our Makefile. ([b589434](https://github.com/plone/mockup/commit/b589434397767240feda3f4bbf03f9332c1dfe53))

* Maintain own test setup config. ([238ff3b](https://github.com/plone/mockup/commit/238ff3b19b8da756285a306defadc00ae163b908))Don't extend from @patternslib/patternslib for setting up tests.
The config files are not included in the npm package distributions anymore.

* **pat-texteditor:** Use class based extension of @patternslib/pat-code-editor. ([1557679](https://github.com/plone/mockup/commit/15576797e51338d4345a90e242ede190d861f6b1))

* **pat-validation:** Update customization of error-template which is now a method of the Validation class. ([70c8c6b](https://github.com/plone/mockup/commit/70c8c6b4c291526035966d28d015ea4e4fb55d66))


## [5.0.0-beta.4](https://github.com/plone/mockup/compare/5.0.0-beta.3...5.0.0-beta.4) (2022-11-30)


### Features


* **i18n:** export "plone" and "widgets" translation domains ([9a8858d](https://github.com/plone/mockup/commit/9a8858de3f0120e740281075c4c7902111e16164))

* **pat livesearch:** toggle d-none instead of using the style attribute to show/hide the results ([c17c87d](https://github.com/plone/mockup/commit/c17c87d1a0b16702c8e2c0a4ae4ff80dcb09c0a4))

* **pat structure:** define translatable columns and translate with `plone` domain. ([117e480](https://github.com/plone/mockup/commit/117e4804b0d10c944c458dfe8ecdc1e6e331ec75))


### Bug Fixes


* **pat structure:** Bring back state color to `review_state` column. ([e02fe26](https://github.com/plone/mockup/commit/e02fe2622e34027193348cbd094c7e42642d9627))


### Maintenance


* **build:** Update dependencies. ([2547019](https://github.com/plone/mockup/commit/2547019e61e24d76be7b6accc314dca09a489e5e))


## [5.0.0-beta.3](https://github.com/plone/mockup/compare/5.0.0-beta.2...5.0.0-beta.3) (2022-11-23)


### Maintenance


* Update Bootstrap -> 5.2.3 ([acd098e](https://github.com/plone/mockup/commit/acd098e338fd4ffcea20c7493551fed7edb114c1))

* Upgrade dependencies ([d530364](https://github.com/plone/mockup/commit/d53036498cf4ff6e228a25f932df55584df9f6b5))


## [5.0.0-beta.2](https://github.com/plone/mockup/compare/5.0.0-beta.1...5.0.0-beta.2) (2022-11-18)


### Maintenance


* Upgrade dependencies. ([06ea46c](https://github.com/plone/mockup/commit/06ea46c23d6f28cc8d9e3fa6449f041b0d5db46c))


## [5.0.0-beta.1](https://github.com/plone/mockup/compare/5.0.0-beta.0...5.0.0-beta.1) (2022-11-18)


### Bug Fixes


* **Build:** Temporarily disable linting as long we're in prerelease mode. ([8387ebf](https://github.com/plone/mockup/commit/8387ebfea709a7bb2a7dcff22a8639a09feb81bd))

* **Build:** Temporarily disable linting/testing as long we're in prerelease mode. ([b740390](https://github.com/plone/mockup/commit/b74039040610e7e68a925d1dd84757365efe95ab))

* **Build:** Use single-colon target for check to overwrite the original from @patternslib/dev. ([316a9eb](https://github.com/plone/mockup/commit/316a9ebbdead0ec3a1d2c8810ec9693840a2d4bd))


### Maintenance


* **Build:** Upgrade dependencies. ([cb3d465](https://github.com/plone/mockup/commit/cb3d46516a55b5682887c837b67cc9062407c9f2))

* **Bundle:** Upgrade dependencies. ([32f2d86](https://github.com/plone/mockup/commit/32f2d86b762d17ba5330f62c0d593418e2dd50d7))


## [5.0.0-beta.0](https://github.com/plone/mockup/compare/5.0.0-alpha.27...5.0.0-beta.0) (2022-11-18)


## [5.0.0-alpha.27](https://github.com/plone/mockup/compare/5.0.0-alpha.26...5.0.0-alpha.27) (2022-11-17)


### Bug Fixes


* **pat tinymce:** remove picture-variants defaults ([47a9d6a](https://github.com/plone/mockup/commit/47a9d6a41228d2ebd2f10071a5232318f54c4187))

* set correct max-height for select2-results area ([4152adc](https://github.com/plone/mockup/commit/4152adc20aa20b268331fbf27881ce79478a1dca))


### Maintenance


* Upgrade dependencies ([cad4b9a](https://github.com/plone/mockup/commit/cad4b9af6d665de7e08e8974874b0bc1ce30aef1))


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