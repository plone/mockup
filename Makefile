NPM = npm
JAM = ./node_modules/jamjs/bin/jam.js
LESSC = ./node_modules/less/bin/lessc
CSSMIN = ./node_modules/cssmin/bin/cssmin
UGLIFYJS = ./node_modules/uglify-js/bin/uglifyjs

WIDGETS = build/widgets.js build/widgets.min.js
TOOLBAR = build/toolbar_init.js build/toolbar_init.min.js build/toolbar_init.css build/toolbar.js build/toolbar.min.js build/toolbar.css build/toolbar.png

all:: widgets toolbar

clean: clean_widgets clean_toolbar

bootstrap:
	mkdir -p build
	$(NPM) install jamjs less cssmin uglify-js --prefix=./node_modules
	$(NPM) install underscore buster buster-coverage buster-amd --prefix=./node_modules
	$(JAM) install

test:
	./node_modules/buster/bin/buster test -vv -r specification


clean_widgets:
	rm -rf $(WIDGETS)

widgets: clean_widgets $(WIDGETS)
	# ----------------------------------------------------------------------- #
	# cp build/widgets.* path/to/plone.app.widgets/plone/app/widgets/static   #
	# ----------------------------------------------------------------------- #

build/widgets.js:
	$(JAM) compile -i js/widgets -e jquery --no-minify --almond $@

build/widgets.min.js:
	$(JAM) compile -i js/widgets -e jquery --almond $@
	echo 'require(["js/widgets"]);' >> $@


clean_toolbar:
	rm -rf $(TOOLBAR)

toolbar: clean_toolbar $(TOOLBAR)
	# ----------------------------------------------------------------------- #
	# cp build/toolbar* path/to/plone.app.toolbar/plone/app/toolbar/static    #
	# ----------------------------------------------------------------------- #

build/toolbar_init.js:
	cat js/iframe.js > $@

build/toolbar_init.min.js:
	$(UGLIFYJS) js/iframe.js > $@

build/toolbar_init.css:
	$(LESSC) less/toolbar_init.less | $(CSSMIN) >> $@                           

build/toolbar.js:
	$(JAM) compile -i js/toolbar -e jquery --no-minify --almond $@
	echo 'require(["js/toolbar"]);' >> $@

build/toolbar.min.js:
	$(JAM) compile -i js/toolbar -e jquery --almond $@

build/toolbar.css: build/widgets.css
	cat build/widgets.css > $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@                                
	sed -i 's@../img/glyphicons-halflings.png@++resource++plone.app.toolbar.png@g' $@

build/toolbar.png:
	cp jam/bootstrap/img/glyphicons-halflings.png $@


.PHONY: all clean bootstrap test widgets
