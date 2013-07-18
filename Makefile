GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium`
endif

all: compile jsint test-ci docs

compile:
	mkdir -p build

	$(GRUNT) compile-widgets
	$(GRUNT) compile-toolbar

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
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test --force

test-ci:
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) test-ci --force

docs:
	mkdir -p docs/dev

	$(GRUNT) docs
	mkdir -p docs/dev/lib/tinymce
	cp lib/tinymce/tinymce.min.js docs/dev/lib/tinymce/tinymce.min.js

	cp index.html docs/dev/index.html
	sed -i -e 's@<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.4.1.js"></script>@@g' docs/dev/index.html
	sed -i -e 's@stylesheet/less@stylesheet@g' docs/dev/index.html
	sed -i -e 's@less/docs.less@docs.min.css@g' docs/dev/index.html

	cp bower_components/bootstrap/img/glyphicons-halflings.png docs/dev/
	cp bower_components/bootstrap/img/glyphicons-halflings-white.png docs/dev/
	sed -i -e 's@../img/glyphicons-halflings.png@glyphicons-halflings.png@g' docs/dev/docs.min.css
	sed -i -e 's@../img/glyphicons-halflings-white.png@glyphicons-halflings-white.png@g' docs/dev/docs.min.css

	cp bower_components/font-awesome/font/fontawesome-webfont.eot docs/dev
	cp bower_components/font-awesome/font/fontawesome-webfont.woff docs/dev
	cp bower_components/font-awesome/font/fontawesome-webfont.ttf docs/dev
	cp bower_components/font-awesome/font/fontawesome-webfont.svg docs/dev
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont@fontawesome-webfont@g' docs/dev/docs.min.css

	cp bower_components/select2/select2.png docs/dev
	cp bower_components/select2/select2-spinner.gif docs/dev

	cp lib/tinymce/skins/lightgray/fonts/icomoon.eot docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon.svg docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon.woff docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon.ttf docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.eot docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.svg docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.woff docs/dev
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf docs/dev
	sed -i -e 's@fonts/icomoon@icomoon@g' docs/dev/docs.min.css

	cp lib/dropzone/downloads/images/spritemap.png docs/dev
	cp lib/dropzone/downloads/images/spritemap@2x.png docs/dev
	sed -i -e 's@images/spritemap@spritemap@g' docs/dev/docs.min.css

clean:
	mkdir -p build
	rm -rf build
	rm -rf node_modules
	rm -rf bower_components

	if test -f $(BOWER); then $(BOWER) cache-clean; fi

.PHONY: compile bootstrap jshint test test-ci docs clean
