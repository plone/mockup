GIT = git
NPM = npm
GRUNT = ./node_modules/.bin/grunt

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link

test:
	$(GRUNT) test
