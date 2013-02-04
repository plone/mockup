GIT = git
NPM = npm
JAM = ./node_modules/jamjs/bin/jam.js
LESSC = ./node_modules/less/bin/lessc
CSSMIN = ./node_modules/cssmin/bin/cssmin
BUSTER  = ./node_modules/buster/bin/buster
UGLIFYJS = ./node_modules/uglify-js/bin/uglifyjs

DOCS = docs/index.html docs/index.js docs/index.css docs/widgets.html docs/widgets.js docs/widgets.css docs/widgets.png docs/widgets-spinner.gif docs/toolbar.html docs/toolbar_init.js docs/toolbar_init.css docs/toolbar.js docs/toolbar.css docs/toolbar.png
WIDGETS = build/widgets.js build/widgets.min.js build/widgets.css build/widgets.png build/widgets-spinner.gif
TOOLBAR = build/toolbar_init.js build/toolbar_init.min.js build/toolbar_init.css build/toolbar.js build/toolbar.min.js build/toolbar.css build/toolbar.png

all:: widgets toolbar

clean: clean_docs clean_widgets clean_toolbar

bootstrap:
	mkdir -p build
	if test ! -d docs; then $(GIT) clone git://github.com/plone/mockup.git -b gh-pages docs; fi
	$(NPM) install jamjs less cssmin uglify-js --prefix=./node_modules
	$(NPM) install underscore buster buster-coverage buster-amd --prefix=./node_modules
	$(JAM) install

test:
	# ----------------------------------------------------------------------- #
	# Make sure you're running buster server and that at least one browser    #
	# captured:                                                               #
	#   % ./node_modules/buster/bin/buster server                             #
	#   buster-server running on http://localhost:1111                        #
	# ----------------------------------------------------------------------- #
	$(BUSTER) test -vv -r specification


clean_docs:
	rm -rf $(DOCS)

docs: clean_docs $(DOCS)
	# ----------------------------------------------------------------------- #
	# commit docs folder to gh-pages                                          #
	# ----------------------------------------------------------------------- #

docs/index.html:
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

docs/widgets.html:
	cp widgets.html $@
	sed -i -e 's@<link href="jam/SyntaxHighlighter/styles/shCore.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link href="less/shThemeGitHub.css" rel="stylesheet" type="text/css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet" type="text/css" href="jam/select2/select2.css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet" type="text/css" href="jam/pickadate/themes/pickadate.02.classic.css" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@@g' $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/widgets.less" />@<link href="widgets.css" rel="stylesheet" type="text/css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@<script src="widgets.js"></script>@g' $@
	sed -i -e 's@<script src="jam/jquery/dist/jquery.js"></script>@@g' $@
	sed -i -e 's@<script src="jam/require.js"></script>@@g' $@
	sed -i -e 's@<script src="js/demo/widgets.js"></script>@@g' $@

docs/widgets.js:
	$(JAM) compile -i js/demo/widgets -i sinon --no-minify --almond $@
	sed -i -e 's@define('\''sinon'\'', \['\''sinon/sinon'\''\], function (main) { return main; });@@g' $@
	sed -i -e 's@define("sinon/sinon", function(){});@define("sinon", function(){ return window.sinon; });@g' $@

docs/widgets.css:
	$(CSSMIN) jam/SyntaxHighlighter/styles/shCore.css > $@
	$(CSSMIN) less/shThemeGitHub.css >> $@
	$(CSSMIN) jam/select2/select2.css >> $@
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css >> $@
	$(LESSC) less/mockup.less | $(CSSMIN) >> $@
	$(LESSC) less/widgets.less | $(CSSMIN) >> $@
	sed -i -e 's@select2.png@widgets.png@g' $@
	sed -i -e 's@select2-spinner.gif@widgets-spinner.gif@g' $@

docs/widgets.png:
	cp jam/select2/select2.png $@

docs/widgets-spinner.gif:
	cp jam/select2/select2-spinner.gif $@

docs/toolbar.html:
	cp toolbar.html $@
	sed -i -e 's@<link rel="stylesheet/less" type="text/css" href="less/mockup.less" />@<link rel="stylesheet" type="text/css" href="toolbar_init.css" />@g' $@
	sed -i -e 's@<script src="jam/less/dist/less-1.3.3.js"></script>@<script src="toolbar_init.js"></script>@g' $@
	sed -i -e 's@<script src="js/iframe.js"></script>@@g' $@
	sed -i -e 's@jam/select2/select2.css;@@g' $@
	sed -i -e 's@jam/pickadate/themes/pickadate.02.classic.css;@@g' $@
	sed -i -e 's@less/toolbar.less;@@g' $@
	sed -i -e 's@jam/less/dist/less-1.3.3.js;@@g' $@
	sed -i -e 's@jam/require.js;@toolbar.css;@g' $@
	sed -i -e 's@js/demo/toolbar.js;@toolbar.js;@g' $@

docs/toolbar_init.js:
	$(UGLIFYJS) js/iframe.js > $@

docs/toolbar_init.css:
	$(LESSC) less/mockup.less | $(CSSMIN) > $@

docs/toolbar.js:
	$(JAM) compile -i js/demo/toolbar --no-minify --almond $@
	sed -i -e 's@define('\''sinon'\'', \['\''sinon/sinon'\''\], function (main) { return main; });@@g' $@
	sed -i -e 's@define("sinon/sinon", function(){});@define("sinon", function(){ return window.sinon; });@g' $@

docs/toolbar.css:
	$(CSSMIN) jam/select2/select2.css > $@
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css >> $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@
	sed -i -e 's@../img/glyphicons-halflings.png@toolbar.png@g' $@

docs/toolbar.png:
	cp jam/bootstrap/img/glyphicons-halflings.png $@


clean_widgets:
	rm -rf $(WIDGETS)

widgets: clean_widgets $(WIDGETS)
	# ----------------------------------------------------------------------- #
	# cp build/widgets* path/to/plone.app.widgets/plone/app/widgets/static    #
	# ----------------------------------------------------------------------- #

build/widgets.js:
	$(JAM) compile -i js/bundles/widgets -e jquery --no-minify --almond $@
	echo "require(['jquery', 'jam/Patterns/src/registry', 'js/bundles/widgets'], function(jQuery, registry) { jQuery(document).ready(function() { registry.scan(jQuery('body')); }); });" >> $@

build/widgets.min.js: build/widgets.js
	$(UGLIFYJS) build/widgets.js > $@

build/widgets.css:
	$(CSSMIN) jam/select2/select2.css > $@
	$(CSSMIN) jam/pickadate/themes/pickadate.02.classic.css >> $@
	$(LESSC) less/sunburst.less | $(CSSMIN) >> $@
	sed -i -e 's@select2.png@++resource++plone.app.widgets.png@g' $@
	sed -i -e 's@select2-spinner.gif@++resource++plone.app.widgets-spinner.gif@g' $@

build/widgets.png:
	cp jam/select2/select2.png $@

build/widgets-spinner.gif:
	cp jam/select2/select2-spinner.gif $@


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
	$(JAM) compile -i js/bundles/toolbar -e jquery --no-minify --almond $@
	echo "require(['jquery', 'jam/Patterns/src/registry', 'js/bundles/toolbar'], function(jQuery, registry) { jQuery(document).ready(function() { registry.scan(jQuery('body')); }); });" >> $@

build/toolbar.min.js: build/toolbar.js
	$(UGLIFYJS) build/toolbar.js > $@

build/toolbar.css: build/widgets.css
	cat build/widgets.css > $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@                                
	sed -i -e 's@../img/glyphicons-halflings.png@++resource++plone.app.toolbar.png@g' $@

build/toolbar.png:
	cp jam/bootstrap/img/glyphicons-halflings.png $@


.PHONY: all clean bootstrap test docs publish-demo widgets toolbar 
