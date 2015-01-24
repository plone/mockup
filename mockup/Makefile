GIT = git
NPM = npm
NODE_VERSION = $(shell node -v)
NODE_VERSION_MAJ = $(shell echo $(NODE_VERSION) | cut -f1 -d. | cut -f2 -dv )
NODE_VERSION_MIN = $(shell echo $(NODE_VERSION) | cut -f2 -d.)
NODE_VERSION_LT_011 = $(shell [ $(NODE_VERSION_MAJ) -eq 0 -a $(NODE_VERSION_MIN) -lt 11 ] && echo true)

GRUNT = ./node_modules/grunt-cli/bin/grunt
BOWER = ./node_modules/bower/bin/bower
NODE_PATH = ./node_modules

DEBUG =
ifeq ($(debug), true)
	DEBUG = --debug
endif
VERBOSE =
ifeq ($(verbose), true)
	VERBOSE = --verbose
endif


all: test-once bundles docs

bundles: bundle-widgets bundle-structure bundle-plone
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static
	# cp build/structure* path/to/wildcard.foldercontents/wildcard/foldercontents/static
	# cp build/plone* path/to/Products.CMFPlone/Products/CMFPlone/static
	# ----------------------------------------------------------------------- #

bundle-widgets:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-widgets $(DEBUG) $(VERBOSE)

bundle-structure:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-structure $(DEBUG) $(VERBOSE)

bundle-plone:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-plone $(DEBUG) $(VERBOSE)

bundle-filemanager:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-filemanager $(DEBUG) $(VERBOSE)

bundle-resourceregistry:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-resourceregistry $(DEBUG) $(VERBOSE)

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-docs $(DEBUG) $(VERBOSE)

bootstrap-common:
	mkdir -p build

bootstrap: clean bootstrap-common
	@echo node version: $(NODE_VERSION)
ifeq ($(NODE_VERSION_LT_011),true)
	# for node < v0.11.x
	$(NPM) link --prefix=.
	# remove lib/node_modules, which contains a symlink to the project root.
	# This leads to infinite recursion at the grunt copy task on make docs.
	rm -rf lib/node_modules
else
	$(NPM) link
endif
	NODE_PATH=$(NODE_PATH) $(BOWER) install --config.interactive=0
	NODE_PATH=$(NODE_PATH) $(GRUNT) sed:bootstrap $(DEBUG) $(VERBOSE)

bootstrap-nix: clean bootstrap-common
	nix-build default.nix -A build -o nixenv
	ln -s nixenv/lib/node_modules/mockup/node_modules
	ln -s nixenv/bower_components

jshint:
	NODE_PATH=$(NODE_PATH) $(GRUNT) jshint jscs $(DEBUG) $(VERBOSE)

watch:
	NODE_PATH=$(NODE_PATH) $(GRUNT) watch $(DEBUG) $(VERBOSE)

test:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test $(DEBUG) $(VERBOSE) --pattern=$(pattern)

test-once:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_once $(DEBUG) $(VERBOSE) --pattern=$(pattern)

test-dev:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_dev $(DEBUG) $(VERBOSE) --pattern=$(pattern)

test-serve:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_serve $(DEBUG) $(VERBOSE) --pattern=$(pattern)

test-ci:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_ci $(DEBUG) $(VERBOSE)

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

clean-deep: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi
	if test -f $(NPM); then $(NPM) cache clean; fi

publish-docs:
	echo -e "Publishing 'docs' bundle!\n"; cd docs; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to 'docs'."; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..;

.PHONY: bundle bundle-widgets bundle-structure bundle-plone docs bootstrap bootstrap-nix jshint test test-once test-dev test-ci publish-docs clean clean-deep
