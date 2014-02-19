
GIT = git
NPM = npm

GRUNT = ./node_modules/grunt-cli/bin/grunt
BOWER = ./node_modules/bower/bin/bower
NODE_PATH = ./node_modules

all: test-once bundle docs

bundle: bundle-barceloneta bundle-widgets bundle-toolbar bundle-structure bundle-plone
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static
	# cp build/barceloneta* path/to/plonetheme.barceloneta/plonetheme/barceloneta/static
	# cp build/structure* path/to/wildcard.foldercontents/wildcard/foldercontents/static
	# cp build/plone* path/to/Products.CMFPlone/Products/CMFPlone/static
	# ----------------------------------------------------------------------- #

bundle-plone:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-plone

bundle-barceloneta:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-barceloneta

bundle-widgets:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-widgets

bundle-toolbar:
	mkdir -p build
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-toolbar

bundle-structure:
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-structure

bootstrap-common:
	mkdir -p build

bootstrap: clean bootstrap-common
	$(NPM) link --prefix=$(NODE_PATH)
	NODE_PATH=$(NODE_PATH) $(GRUNT) sed:bootstrap
	$(BOWER) install

bootstrap-nix: clean bootstrap-common
	nix-build default.nix -A build -o nixenv
	ln -s nixenv/lib/node_modules/plone-mockup/node_modules
	ln -s nixenv/bower_components

jshint:
	NODE_PATH=$(NODE_PATH) $(GRUNT) jshint

test:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test --pattern=$(pattern)

test-once:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_once --pattern=$(pattern)

test-dev:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_dev --pattern=$(pattern)

test-ci:
	NODE_PATH=$(NODE_PATH) $(GRUNT) test_ci

docs:
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	rm -rf docs/dev
	NODE_PATH=$(NODE_PATH) $(GRUNT) bundle-docs

publish: publish-widgets publish-toolbar publish-structure publish-barceloneta publish-docs

publish-docs: docs
	echo -e "Publishing 'docs' bundle!\n"; cd docs; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed to 'docs'."; git push -fq https://$(GH_TOKEN)@github.com/plone/mockup.git gh-pages > /dev/null; cd ..;

publish-widgets:
	echo -e "Publishing 'widgets' bundle!\n"; git clone git://github.com/plone/plone.app.widgets.git; cd plone.app.widgets; cp ../build/widgets* plone/app/widgets/static; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed 'widgets' bundle resources."; git push -fq https://$(GH_TOKEN)@github.com/plone/plone.app.widgets.git > /dev/null; cd ..;

publish-toolbar:
	echo -e "Publishing 'toolbar' bundle!\n"; git clone git://github.com/plone/plone.app.toolbar.git; cd plone.app.toolbar; cp ../build/toolbar* plone/app/toolbar/static; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed 'toolbar' bundle resources."; git push -fq https://$(GH_TOKEN)@github.com/plone/plone.app.toolbar.git > /dev/null; cd ..;

publish-structure:
	echo -e "Publishing 'structure' bundle!\n"; git clone git://github.com/collective/wildcard.foldercontents.git; cd wildcard.foldercontents; cp ../build/structure* wildcard/foldercontents/static; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed 'structure' bundle resources."; git push -fq https://$(GH_TOKEN)@github.com/collective/wildcard.foldercontents.git > /dev/null; cd ..;

publish-barceloneta:
	echo -e "Publishing 'barceloneta' bundle!\n"; git clone git://github.com/plone/plonetheme.barceloneta.git; cd plonetheme.barceloneta; cp ../build/barceloneta* plonetheme/barceloneta/static; git add -fA .; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed 'barceloneta' bundle resources."; git push -fq https://$(GH_TOKEN)@github.com/plone/plonetheme.barceloneta.git > /dev/null; cd ..;

publish-plone:
	echo -e "Publishing 'plone' bundle!\n"; git clone git://github.com/plone/Products.CMFPlone.git; cd Products.CMFPlone; git add -fA .; cp build/plone* Products/CMFPlone/static; git commit -m "Travis build $(TRAVIS_BUILD_NUMBER) pushed 'plone' bundle resources."; git push -fq https://$(GH_TOKEN)@github.com/plone/Products.CMFPlone.git > /dev/null; cd ..;

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

clean-all: clean
	if test -f $(BOWER); then $(BOWER) cache clean; fi

.PHONY: bundle bootstrap jshint test test-ci docs clean
