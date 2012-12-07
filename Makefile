LESSC = lessc

NODEJS = node
BUILDJS = src/build.js
RJS = lib/r.js
STANDALONE = name=lib/almond include=main wrap=true
TARGETS = build/frontend.css build/backend.css

all:: clean $(TARGETS)

build/backend.css:
	$(LESSC) src/less/backend.less -x $@
build/frontend.css:
	$(LESSC) src/less/frontend.less -x $@

build/plone.js: lib/Patterns
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=none
build/plone.min.js: lib/Patterns
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=uglify
build/plone-standalone.js: lib/Patterns lib/almond
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=none $(STANDALONE)
build/plone-standalone.min.js: lib/Patterns lib/almond
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=uglify $(STANDALONE)

bootstrap:
	mkdir -p build
	git submodule update --init

clean:
	rm -f $(TARGETS)

.PHONY: all clean bootstrap
