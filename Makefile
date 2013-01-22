JAM = jam
LESSC = lessc
CSSMIN = cssmin
UGLIFYJS = uglifyjs
WIDGETS = build/widgets.js build/widgets.min.js build/widgets.css build/widgets.png
TOOLBAR = build/toolbar_init.js build/toolbar_init.min.js build/toolbar_init.css build/toolbar.js build/toolbar.min.js build/toolbar.css build/toolbar.png

all:: widgets toolbar

clean: clean_widgets clean_toolbar

bootstrap:
	mkdir -p build
	$(JAM) install

test:
	buster test -vv -r specification


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

build/widgets.css:
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css > $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.core.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.arrow.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.autocomplete.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.clear.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.focus.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.prompt.css >> $@
	$(CSSMIN) jam/jquery-textext/src/css/textext.plugin.tags.css >> $@
	$(LESSC) less/patterns.less | $(CSSMIN) >> $@
	sed -i 's@widgets.png@++resource++plone.app.widgets.png@g' $@

build/widgets.png:
	cp less/widgets.png $@


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

build/toolbar.min.js:
	$(JAM) compile -i js/toolbar -e jquery --almond $@

build/toolbar.css: build/widgets.css
	cat build/widgets.css > $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@                                
	sed -i 's@../img/glyphicons-halflings.png@++resource++plone.app.toolbar.png@g' $@

build/toolbar.png:
	cp jam/bootstrap/img/glyphicons-halflings.png $@


.PHONY: all clean bootstrap test widgets
