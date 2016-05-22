GIT = git
NPM = npm

GRUNT = ./node_modules/grunt-cli/bin/grunt
BOWER = ./node_modules/bower/bin/bower
NODE_PATH = ./node_modules
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
	npm install
	touch stamp-npm

stamp-bower: stamp-npm bower.json
	$(BOWER) install
	touch stamp-bower

bundles: stamp-bower bundle-widgets bundle-structure bundle-plone
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static
	# cp build/structure* path/to/wildcard.foldercontents/wildcard/foldercontents/static
	# cp build/plone* path/to/Products.CMFPlone/Products/CMFPlone/static
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
	$(NPM) link
	NODE_PATH=$(NODE_PATH) $(BOWER) install --config.interactive=0
	NODE_PATH=$(NODE_PATH) $(GRUNT) sed:bootstrap $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

bootstrap-nix: clean bootstrap-common
	nix-build default.nix -A build -o nixenv
	ln -s nixenv/lib/node_modules/mockup/node_modules
	ln -s nixenv/bower_components

jshint:
	NODE_PATH=$(NODE_PATH) $(GRUNT) jshint $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

watch:
	NODE_PATH=$(NODE_PATH) $(GRUNT) watch $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js

test: stamp-bower
	NODE_PATH=$(NODE_PATH) $(GRUNT) test $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-once: stamp-bower
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_once $(DEBUG) $(VERBOSE) --gruntfile=mockup/Gruntfile.js --pattern=$(pattern)

test-jenkins: stamp-bower
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
	rm -rf node_modules
	rm -rf mockup/bower_components
	rm -f stamp-npm stamp-bower
	rm -rf node_modules src/bower_components

clean-deep: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi
	if test -f $(NPM); then $(NPM) cache clean; fi

publish-docs:
	echo -e "Publishing 'docs' bundle!\n"; cd mockup/docs; git add -fA .; git commit -m "Publishing docs"; git push -f git@github.com:plone/mockup.git gh-pages; cd ../..;
	# echo -e "Publishing 'docs' bundle!\n"; cd mockup/docs; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to 'docs'."; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..;

i18n-dump:
	NODE_PATH=$(NODE_PATH) $(GRUNT) i18n-dump --gruntfile=mockup/Gruntfile.js

.PHONY: bundle bundle-widgets bundle-structure bundle-plone docs bootstrap bootstrap-nix jshint test test-once test-dev test-dev-ff test-ci publish-docs clean clean-deep
