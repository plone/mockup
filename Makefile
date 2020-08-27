GIT = git

NODE_PATH = ./mockup/node_modules
GRUNT = $(NODE_PATH)/grunt-cli/bin/grunt
BUILD_DIR = ./mockup/build

DEBUG =
ifeq ($(debug), true)
	DEBUG = --debug
endif
VERBOSE =
ifeq ($(verbose), true)
	VERBOSE = --verbose
endif


all: test-once bundles docs

stamp-npm: package.json
	yarn install
	touch stamp-npm

bundles: stamp-npm bundle-widgets bundle-structure bundle-plone
	# ----------------------------------------------------------------------- #
	# For plone 5, build the bundles on the plone side, as described in:
	# Products.CMFPlone/DEVELOPING_BUNDLES.rst
	# Do not copy the bundles from mockup to plone.
	# ----------------------------------------------------------------------- #

bundle-widgets:
	mkdir -p $(BUILD_DIR)
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-widgets $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bundle-structure:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-structure $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bundle-plone:
	mkdir -p $(BUILD_DIR)
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-plone $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bundle-filemanager:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-filemanager $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bundle-resourceregistry:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-resourceregistry $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

docs:
	rm -Rf mockup/docs; mkdir mockup/docs; cp -R .git mockup/docs; cd mockup/docs; $(GIT) checkout gh-pages;
	# if test ! -d mockup/docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages mockup/docs; fi
	rm -rf mockup/docs/dev
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-docs $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bootstrap-common:
	mkdir -p $(BUILD_DIR)

bootstrap: bootstrap-common
	NODE_PATH=$(NODE_PATH) yarn install
	# needed for building docs, otherwise expect/support/mocha.css links are broken
	cd mockup/node_modules/expect; test -x node_modules || ln -s ../../node_modules .

bootstrap-nix: clean bootstrap-common
	nix-build default.nix -A build -o nixenv
	ln -s nixenv/lib/node_modules/mockup/node_modules
	ln -s nixenv/node_modules

jshint:
	NODE_PATH=$(NODE_PATH) $(GRUNT) jshint $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

watch:
	NODE_PATH=$(NODE_PATH) $(GRUNT) watch $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

test: stamp-npm
	NODE_PATH=$(NODE_PATH) $(GRUNT) test $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-once: stamp-npm
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_once $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-jenkins: stamp-npm
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_jenkins $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-dev:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_dev $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-dev-ff:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_dev_ff $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-serve:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_serve $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-ci:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_ci $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

clean:
	mkdir -p $(BUILD_DIR)
	rm -rf $(BUILD_DIR)
	rm -rf mockup/node_modules
	rm -f stamp-npm

clean-deep: clean
	 yarn cache clean

publish-docs:
	echo -e "Publishing 'docs' bundle!\n"; cd mockup/docs; git add -fA .; git commit -m "Publishing docs"; git push -f git@github.com:plone/mockup.git gh-pages; cd ../..;
	# echo -e "Publishing 'docs' bundle!\n"; cd mockup/docs; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to 'docs'."; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..;

i18n-dump:
	NODE_PATH=$(NODE_PATH) $(GRUNT) i18n-dump --gruntfile=mockup/Gruntfile.js

.PHONY: bundle bundle-widgets bundle-structure bundle-plone docs bootstrap bootstrap-nix jshint test test-once test-dev test-dev-ff test-ci publish-docs clean clean-deep
