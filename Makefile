GIT = git
NPM = npm
GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install

test:
	$(GRUNT) test
