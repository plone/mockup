JAM = jam
LESSC = lessc
CSSMIN = cssmin
WIDGETS = build/widgets.js build/widgets.css build/widgets.png

all:: widgets

clean: clean_widgets

bootstrap:
	mkdir -p build
	$(JAM) install

test:
	buster test -vv -r specification

clean_widgets:
	rm -rf $(WIDGETS)

widgets: clean_widgets $(WIDGETS)
	# ----------------------------------------------------------------------- #
	# $ cp build/widgets.* path/to/plone.app.widgets/plone/app/widgets/static #
	# ----------------------------------------------------------------------- #

build/widgets.js:
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

.PHONY: all clean bootstrap test widgets
