GIT = git
NPM = npm

GRUNT = ./node_modules/.bin/grunt
BOWER = ./node_modules/.bin/bower

UNAME := $(shell uname)
BOWER_CHROME=`which chrome`
ifeq ($(UNAME), Linux)
	BOWER_CHROME=`which chromium`
endif

all: compile jshint test-ci docs

compile: compile-widgets compile-toolbar
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static    #
	# ----------------------------------------------------------------------- #

compile-widgets:
	mkdir -p build

	$(GRUNT) compile-widgets
	cp js/bundles/widgets_develop.js build/widgets.js

	rm build/widgets.css
	touch build/widgets.css

	cp bower_components/font-awesome/font/fontawesome-webfont.eot build/widgets-fontawesome-webfont.eot
	cp bower_components/font-awesome/font/fontawesome-webfont.woff build/widgets-fontawesome-webfont.woff
	cp bower_components/font-awesome/font/fontawesome-webfont.ttf build/widgets-fontawesome-webfont.ttf
	cp bower_components/font-awesome/font/fontawesome-webfont.svg build/widgets-fontawesome-webfont.svg
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont@++resource++plone.app.widgets-fontawesome-webfont@g' build/widgets.min.css

	cp bower_components/select2/select2.png build/widgets-select2.png
	cp bower_components/select2/select2-spinner.gif build/widgets-select2-spinner.gif
	sed -i -e 's@select2.png@++resource++plone.app.widgets-select2.png@g' build/widgets.min.css
	sed -i -e 's@select2-spinner.gif@++resource++plone.app.widgets-select2-spinner.gif@g' build/widgets.min.css

	cp lib/tinymce/skins/lightgray/fonts/icomoon.eot build/widgets-icomoon.eot
	cp lib/tinymce/skins/lightgray/fonts/icomoon.svg build/widgets-icomoon.svg
	cp lib/tinymce/skins/lightgray/fonts/icomoon.woff build/widgets-icomoon.woff
	cp lib/tinymce/skins/lightgray/fonts/icomoon.ttf build/widgets-icomoon.ttf
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.eot build/widgets-icomoon-small.eot
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.svg build/widgets-icomoon-small.svg
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.woff build/widgets-icomoon-small.woff
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf build/widgets-icomoon-small.ttf
	sed -i -e 's@fonts/icomoon@++resource++plone.app.widgets-icomoon@g' build/widgets.min.css

	cp lib/dropzone/downloads/images/spritemap.png build/widgets-spritemap.png
	cp lib/dropzone/downloads/images/spritemap@2x.png build/widgets-spritemap@2x.png
	sed -i -e 's@images/spritemap@spritemap@g' build/widgets.min.css

compile-toolbar:
	mkdir -p build

	$(GRUNT) compile-toolbar
	cp js/bundles/toolbar_develop.js build/toolbar.js

	rm build/toolbar.css build/toolbar_init.css
	touch build/toolbar.css
	touch build/toolbar_init.css
	touch build/toolbar_init.js

	cp bower_components/bootstrap/img/glyphicons-halflings.png build/toolbar-glyphicons-halflings.png
	cp bower_components/bootstrap/img/glyphicons-halflings-white.png build/toolbar-glyphicons-halflings-white.png
	sed -i -e 's@../img/glyphicons-halflings.png@++resource++plone.app.toolbar-glyphicons-halflings.png@g' build/toolbar.min.css
	sed -i -e 's@../img/glyphicons-halflings-white.png@++resource++plone.app.toolbar-glyphicons-halflings-white.png@g' build/toolbar.min.css

	cp bower_components/font-awesome/font/fontawesome-webfont.eot build/toolbar-fontawesome-webfont.eot
	cp bower_components/font-awesome/font/fontawesome-webfont.woff build/toolbar-fontawesome-webfont.woff
	cp bower_components/font-awesome/font/fontawesome-webfont.ttf build/toolbar-fontawesome-webfont.ttf
	cp bower_components/font-awesome/font/fontawesome-webfont.svg build/toolbar-fontawesome-webfont.svg
	sed -i -e 's@../bower_components/font-awesome/font/fontawesome-webfont@++resource++plone.app.toolbar-fontawesome-webfont@g' build/toolbar.min.css

	cp bower_components/select2/select2.png build/toolbar-select2.png
	cp bower_components/select2/select2-spinner.gif build/toolbar-select2-spinner.gif
	sed -i -e 's@select2.png@++resource++plone.app.toolbar-select2.png@g' build/toolbar.min.css
	sed -i -e 's@select2-spinner.gif@++resource++plone.app.toolbar-select2-spinner.gif@g' build/toolbar.min.css

	cp lib/tinymce/skins/lightgray/fonts/icomoon.eot build/toolbar-icomoon.eot
	cp lib/tinymce/skins/lightgray/fonts/icomoon.svg build/toolbar-icomoon.svg
	cp lib/tinymce/skins/lightgray/fonts/icomoon.woff build/toolbar-icomoon.woff
	cp lib/tinymce/skins/lightgray/fonts/icomoon.ttf build/toolbar-icomoon.ttf
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.eot build/toolbar-icomoon-small.eot
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.svg build/toolbar-icomoon-small.svg
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.woff build/toolbar-icomoon-small.woff
	cp lib/tinymce/skins/lightgray/fonts/icomoon-small.ttf build/toolbar-icomoon-small.ttf
	sed -i -e 's@fonts/icomoon@++resource++plone.app.toolbar-icomoon@g' build/toolbar.min.css

	cp lib/dropzone/downloads/images/spritemap.png build/toolbar-spritemap.png
	cp lib/dropzone/downloads/images/spritemap@2x.png build/toolbar-spritemap@2x.png
	sed -i -e 's@images/spritemap@spritemap@g' build/toolbar.min.css

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) link --prefix=./node_modules
	$(BOWER) install

jshint:
	$(GRUNT) jshint

test: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:dev --force

test-ci: jshint
	CHROME_BIN=$(BOWER_CHROME) $(GRUNT) karma:ci --force

docs:
	mkdir -p docs/dev

	$(GRUNT) docs
	mkdir -p docs/dev/lib/tinymce
	cp lib/tinymce/tinymce.min.js docs/dev/lib/tinymce/tinymce.min.js

	cp index.html docs/dev/index.html
	sed -i -e 's@<script src="node_modules/grunt-contrib-less/node_modules/less/dist/less-1.4.1.js"></script>@@g' docs/dev/index.html
	sed -i -e 's:<style type="text/less">@import "less/docs.less";@isBrowser\: true;</style>:<link rel="stylesheet" type="text/css" href="docs.min.css" />:g' docs/dev/index.html

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
