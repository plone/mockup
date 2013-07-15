GIT = git
NPM = npm
GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium`
endif

compile:
	mkdir -p build

	$(GRUNT) compile-js
	$(GRUNT) compile-less
	$(GRUNT) compile-css

	rm build/widgets.css build/toolbar.css build/toolbar_init.css

	cp bower_components/select2/select2.png build/widgets-select2.png
	cp bower_components/select2/select2-spinner.gif build/widgets-select2-spinner.gif
	sed -i -e 's@select2.png@++resource++plone.app.widgets-select2.png@g' build/widgets.min.css
	sed -i -e 's@select2-spinner.gif@++resource++plone.app.widgets-select2-spinner.gif@g' build/widgets.min.css

	cp bower_components/font-awesome/font/fontawesome-webfont.eot build/widgets-fontawesome.eot
	cp bower_components/font-awesome/font/fontawesome-webfont.ttf build/widgets-fontawesome.ttf
	cp bower_components/font-awesome/font/fontawesome-webfont.woff build/widgets-fontawesome.woff
	cp bower_components/font-awesome/font/FontAwesome.otf build/widgets-fontawesome.otf
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.eot@++resource++plone.app.widgets-fontawesome.eot@g' build/widgets.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.ttf@++resource++plone.app.widgets-fontawesome.ttf@g' build/widgets.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.woff@++resource++plone.app.widgets-fontawesome.woff@g' build/widgets.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.otf@++resource++plone.app.widgets-fontawesome.otf@g' build/widgets.min.css

	cp bower_components/font-awesome/font/fontawesome-webfont.eot build/toolbar-fontawesome.eot
	cp bower_components/font-awesome/font/fontawesome-webfont.ttf build/toolbar-fontawesome.ttf
	cp bower_components/font-awesome/font/fontawesome-webfont.woff build/toolbar-fontawesome.woff
	cp bower_components/font-awesome/font/FontAwesome.otf build/toolbar-fontawesome.otf
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.eot@++resource++plone.app.toolbar-fontawesome.eot@g' build/toolbar.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.ttf@++resource++plone.app.toolbar-fontawesome.ttf@g' build/toolbar.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.woff@++resource++plone.app.toolbar-fontawesome.woff@g' build/toolbar.min.css
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont.otf@++resource++plone.app.toolbar-fontawesome.otf@g' build/toolbar.min.css


	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static    #
	# ----------------------------------------------------------------------- #

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install

jshint:
	$(GRUNT) jshint

test:
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test

test-ci:
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test-ci

clean:
	mkdir -p build
	rm build/* -rf
	rmdir build

