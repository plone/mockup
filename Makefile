GIT = git
NPM = npm
NPM_VERSION = $(shell npm -v)

GRUNT = ./node_modules/grunt-cli/bin/grunt
BOWER = ./node_modules/bower/bin/bower
NODE_PATH = ./node_modules

all: test-once bundles docs

bundles: bundle-widgets bundle-structure bundle-plone
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static
	# cp build/structure* path/to/wildcard.foldercontents/wildcard/foldercontents/static
	# cp build/plone* path/to/Products.CMFPlone/Products/CMFPlone/static
	# ----------------------------------------------------------------------- #

bundle-widgets:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-widgets

bundle-structure:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-structure

bundle-plone:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-plone

bundle-filemanager:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-filemanager

bundle-resourceregistry:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-resourceregistry

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-docs

bootstrap-common:
	mkdir -p build

bootstrap: clean bootstrap-common
	@echo $(NODE_VERSION)
ifeq (,$(findstring 1.4, $(NPM_VERSION)))
	# for node < v0.10.30, npm < 1.4.x
	$(NPM) link --prefix=$(NODE_PATH)
else
	$(NPM) link
endif
	NODE_PATH=$(NODE_PATH) $(BOWER) install --config.interactive=0
	NODE_PATH=$(NODE_PATH) $(GRUNT) sed:bootstrap

bootstrap-nix: clean bootstrap-common
	nix-build default.nix -A build -o nixenv
	ln -s nixenv/lib/node_modules/mockup/node_modules
	ln -s nixenv/bower_components

jshint:
	NODE_PATH=$(NODE_PATH) $(GRUNT) jshint jscs

watch:
	NODE_PATH=$(NODE_PATH) $(GRUNT) watch

test:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test --pattern=$(pattern)

test-once:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_once --pattern=$(pattern)

test-dev:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_dev --pattern=$(pattern)

test-ci:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_ci

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
