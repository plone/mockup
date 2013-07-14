GIT = git
NPM = npm
JAM = ./node_modules/.bin/jam
LESSC = ./node_modules/.bin/lessc
CSSMIN = ./node_modules/.bin/cssmin
UGLIFYJS = ./node_modules/.bin/uglifyjs
TESTEM = ./node_modules/.bin/testem

DOCS = docs/index.html docs/widgets.html docs/toolbar.html docs/patterns.html
WIDGETS = build/widgets.min.js build/widgets.css build/widgets.png build/widgets-spinner.gif
TOOLBAR = build/toolbar_init.js build/toolbar_init.min.js build/toolbar_init.css build/toolbar.js build/toolbar.min.js build/toolbar.css build/toolbar-webfont.eot build/toolbar-webfont.ttf build/toolbar-webfont.woff build/toolbar-webfont.otf

all:: widgets toolbar

clean: clean_docs clean_widgets clean_toolbar

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) install jamjs less cssmin uglify-js --prefix=./node_modules
	$(NPM) install testem --prefix=./node_modules
	$(JAM) install


tests:
	$(TESTEM)

tests-ci:
	$(TESTEM) ci


clean_docs:
	rm -rf docs/*

docs: clean_docs $(DOCS)
	# ----------------------------------------------------------------------- #
	# commit docs folder to gh-pages                                          #
	# ----------------------------------------------------------------------- #

docs/index.html: docs/index.js docs/index.css
	cp index.html $@
	sed -i -e 's@<link href="jam/SyntaxHighlighter/styles/shCore.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link href="less/shThemeGitHub.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@<link href="index.css" rel="stylesheet" type="text/css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@<script src="index.js"></script>@g' $@
	sed -i -e 's@<script src="jam/SyntaxHighlighter/scripts/XRegExp.js"></script>@@g' $@
	sed -i -e 's@<script src="jam/SyntaxHighlighter/scripts/shCore.js"></script>@@g' $@
	sed -i -e 's@<script src="jam/SyntaxHighlighter/scripts/shBrushBash.js"></script>@@g' $@

docs/index.js:
	$(UGLIFYJS) jam/SyntaxHighlighter/scripts/XRegExp.js > $@
	$(UGLIFYJS) jam/SyntaxHighlighter/scripts/shCore.js >> $@
	$(UGLIFYJS) jam/SyntaxHighlighter/scripts/shBrushBash.js >> $@

docs/index.css:
	$(CSSMIN) jam/SyntaxHighlighter/styles/shCore.css > $@
	$(CSSMIN) less/shThemeGitHub.css >> $@
	$(LESSC) less/mockup.less | $(CSSMIN) >> $@
	sed -i -e 's@../jam/font-awesome/@@g' $@

docs/jquery.js:
	$(UGLIFYJS) jam/jquery/dist/jquery.js > $@

docs/img:
	mkdir $@
	cp img/* $@

docs/widgets.html: docs/jquery.js docs/widgets.js docs/widgets.css docs/widgets.png docs/widgets-spinner.gif
	cp widgets.html $@
	sed -i -e 's@<link href="jam/SyntaxHighlighter/styles/shCore.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link href="less/shThemeGitHub.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet" type="text/css" href="jam/plone-select2/select2.css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/widgets.less" />@<link href="widgets.css" rel="stylesheet" type="text/css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@@g' $@
	sed -i -e 's@jam/jquery/dist/jquery.js@jquery.js@g' $@
	sed -i -e 's@<script src="jam/require.js"></script>@@g' $@
	sed -i -e 's@<script src="js/demo/widgets.js"></script>@<script src="widgets.js"></script>@g' $@

docs/widgets.js:
	$(JAM) compile -i js/demo/widgets -i sinon -e jquery --no-minify --almond $@
	sed -i -e 's@define('\''sinon'\'', \['\''sinon/sinon'\''\], function (main) { return main; });@@g' $@
	sed -i -e 's@define("sinon/sinon", function(){});@define("sinon", function(){ return window.sinon; });@g' $@

docs/widgets.css:
	$(CSSMIN) jam/SyntaxHighlighter/styles/shCore.css > $@
	$(CSSMIN) less/shThemeGitHub.css >> $@
	$(CSSMIN) jam/plone-select2/select2.css >> $@
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css >> $@
	$(LESSC) less/widgets.less | $(CSSMIN) >> $@
	$(LESSC) less/mockup.less | $(CSSMIN) >> $@
	sed -i -e 's@select2.png@widgets.png@g' $@
	sed -i -e 's@select2-spinner.gif@widgets-spinner.gif@g' $@
	sed -i -e 's@../jam/font-awesome/@@g' $@

docs/widgets.png:
	cp jam/plone-select2/select2.png $@

docs/widgets-spinner.gif:
	cp jam/plone-select2/select2-spinner.gif $@

docs/toolbar.html: docs/jquery.js docs/toolbar_init.js docs/toolbar_init.css docs/toolbar.js docs/toolbar.css docs/img docs/font
	cp toolbar.html $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@<link rel="stylesheet" type="text/css" href="toolbar_init.css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@<script src="toolbar_init.js"></script>@g' $@
	sed -i -e 's@<script src="js/iframe.js"></script>@@g' $@
	sed -i -e 's@jam/plone-select2/select2.css;@@g' $@
	sed -i -e 's@jam/pickadate/themes/pickadate.02.classic.css;@@g' $@
	sed -i -e 's@less/toolbar.less;@@g' $@
	sed -i -e 's@jam/less/dist/less-1.3.3.js;@@g' $@
	sed -i -e 's@jam/jquery/dist/jquery.js;@jquery.js;@g' $@
	sed -i -e 's@jam/require.js;@toolbar.css;@g' $@
	sed -i -e 's@js/demo/toolbar.js;@toolbar.js;@g' $@

docs/toolbar_init.js:
	$(UGLIFYJS) js/iframe.js > $@

docs/toolbar_init.css:
	$(LESSC) less/mockup.less | $(CSSMIN) > $@
	sed -i -e 's@../jam/font-awesome/@@g' $@

docs/toolbar.js:
	$(JAM) compile -i js/demo/toolbar -e jquery --no-minify --almond $@
	sed -i -e 's@define('\''sinon'\'', \['\''sinon/sinon'\''\], function (main) { return main; });@@g' $@
	sed -i -e 's@define("sinon/sinon", function(){});@define("sinon", function(){ return window.sinon; });@g' $@

docs/toolbar.css:
	$(CSSMIN) jam/plone-select2/select2.css > $@
	$(CSSMIN) jam/pickadate.02.classic.css >> $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@
	sed -i -e 's@../jam/font-awesome/@@g' $@

docs/font:
	mkdir $@
	cp jam/font-awesome/font/* $@

docs/patterns.html: docs/patterns.css docs/patterns.js docs/patterns.png docs/patterns-spinner.gif
	cp patterns.html $@
	sed -i -e 's@<link href="jam/SyntaxHighlighter/styles/shCore.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link href="less/shThemeGitHub.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet" type="text/css" href="jam/plone-select2/select2.css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet" type="text/css" href="jam/pickadate/themes/pickadate.02.classic.css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/widgets.less" />@<link rel="stylesheet" type="text/css" href="patterns.css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@@g' $@
	sed -i -e 's@<script src="jam/jquery/dist/jquery.js"></script>@@g' $@
	sed -i -e 's@<script src="jam/require.js"></script>@@g' $@
	sed -i -e 's@<script src="js/demo/widgets.js"></script>@<script src="patterns.js"></script>@g' $@

docs/patterns.png:
	cp jam/plone-select2/select2.png $@

docs/patterns-spinner.gif:
	cp jam/plone-select2/select2-spinner.gif $@


docs/patterns.css:
	$(CSSMIN) jam/SyntaxHighlighter/styles/shCore.css > $@
	$(CSSMIN) less/shThemeGitHub.css >> $@
	$(CSSMIN) jam/plone-select2/select2.css >> $@
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css >> $@
	$(LESSC) less/widgets.less | $(CSSMIN) >> $@
	$(LESSC) less/mockup.less | $(CSSMIN) >> $@
	sed -i -e 's@select2.png@patterns.png@g' $@
	sed -i -e 's@select2-spinner.gif@patterns-spinner.gif@g' $@
	sed -i -e 's@../jam/font-awesome/@@g' $@

docs/patterns.js:
	$(UGLIFYJS) jam/less/dist/less-1.3.3.js > $@
	$(UGLIFYJS) jam/jquery/dist/jquery.js >> $@
	$(JAM) compile -i js/demo/widgets -i sinon -e jquery --no-minify --almond tmp
	sed -i -e 's@define('\''sinon'\'', \['\''sinon/sinon'\''\], function (main) { return main; });@@g' tmp
	sed -i -e 's@define("sinon/sinon", function(){});@define("sinon", function(){ return window.sinon; });@g' tmp
	cat tmp >> $@
	rm tmp


clean_widgets:
	rm -rf $(WIDGETS)

widgets: clean_widgets $(WIDGETS)
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# ----------------------------------------------------------------------- #

build/widgets.min.js:
	$(JAM) compile -i js/bundles/widgets -e jquery --almond $@
	echo "require(['jquery', 'jam/Patterns/src/registry', 'js/bundles/widgets'], function(jQuery, registry) { jQuery(document).ready(function() { registry.scan(jQuery('body')); }); });" >> $@

build/widgets.css:
	$(LESSC) less/sunburst.less >> $@
	sed -i -e 's@select2.png@++resource++plone.app.widgets.png@g' $@
	sed -i -e 's@select2-spinner.gif@++resource++plone.app.widgets-spinner.gif@g' $@

build/widgets.png:
	cp jam/plone-select2/select2.png $@

build/widgets-spinner.gif:
	cp jam/plone-select2/select2-spinner.gif $@


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
#	$(LESSC) less/toolbar_init.less | $(CSSMIN) >> $@
	$(LESSC) less/toolbar_init.less >> $@

build/toolbar.js:
	$(JAM) compile -i js/bundles/toolbar -e jquery --no-minify --almond $@
	echo "require(['js/bundles/toolbar']);" >> $@

build/toolbar.min.js: build/toolbar.js
	$(UGLIFYJS) build/toolbar.js > $@

build/toolbar-webfont.eot:
	cp jam/font-awesome/font/fontawesome-webfont.eot $@

build/toolbar-webfont.ttf:
	cp jam/font-awesome/font/fontawesome-webfont.ttf $@

build/toolbar-webfont.woff:
	cp jam/font-awesome/font/fontawesome-webfont.woff $@

build/toolbar-webfont.otf:
	cp jam/font-awesome/font/FontAwesome.otf $@

build/toolbar.css: build/widgets.css
	cat build/widgets.css > $@
	$(LESSC) less/toolbar.less >> $@	
#	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@
	sed -i -e 's@../jam/font-awesome/font/fontawesome-webfont.eot@++resource++plone.app.toolbar.eot@g' $@
	sed -i -e 's@../jam/font-awesome/font/fontawesome-webfont.ttf@++resource++plone.app.toolbar.ttf@g' $@
	sed -i -e 's@../jam/font-awesome/font/fontawesome-webfont.woff@++resource++plone.app.toolbar.woff@g' $@
	sed -i -e 's@../jam/font-awesome/font/fontawesome-webfont.otf@++resource++plone.app.toolbar.otf@g' $@


