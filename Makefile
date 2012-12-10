LESSC = lessc

NODEJS = node
STANDALONE = name=lib/almond include=main wrap=true
TARGETS = build/css/frontend.css build/css/backend.css build/js/backend.js build/js/frontend.js build/images build/index.html

all:: clean $(TARGETS)

build/css/backend.css:
	$(LESSC) src/less/backend.less -x $@
build/css/frontend.css:
	$(LESSC) src/less/frontend.less -x $@
build/js/frontend.js:
	$(NODEJS) lib/r.js -o baseUrl=src insertRequire=frontend mainConfigFile=src/frontend.js name=../lib/almond include=frontend wrap=true optimize=uglify out=$@
build/js/backend.js:
	$(NODEJS) lib/r.js -o baseUrl=src insertRequire=backend mainConfigFile=src/backend.js name=../lib/almond include=backend wrap=true optimize=uglify out=$@
build/images:
	cp images/* build/images
build/index.html:
	cp index.html $@
	sed -i 's@stylesheet/less@stylesheet@g' $@
	sed -i 's@src/less/frontend.less@css/frontend.css@g' $@
	sed -i 's@lib/less.js"></script><script data-main="src/frontend" src="lib/require.js@js/frontend.js@g' $@
	sed -i 's@data-iframe-resources="build/backend.css;lib/require.js?data-main=src/backend;"@data-iframe-resources="css/backend.css;js/backend.js"@g' $@

bootstrap:
	git submodule update --init

test:
	buster test -vv -r specification -c src/plone.app.toolbar/plone/app/toolbar/resources/test/buster.js

clean:
	rm -rf $(TARGETS)

.PHONY: all clean bootstrap test
