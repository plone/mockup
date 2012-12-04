NODEJS = node
BUILDJS = src/build.js
RJS = lib/r.js
STANDALONE = name=lib/almond include=main wrap=true
TARGETS = build/plone.js plone/plone.min.js build/plone-standalone.js build/plone-standalone.min.js

all:: $(TARGETS)

build/plone.js: lib/Patterns
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=none
build/plone.min.js: lib/Patterns
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=uglify
build/plone-standalone.js: lib/Patterns lib/almond
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=none $(STANDALONE)
build/plone-standalone.min.js: lib/Patterns lib/almond
	$(NODEJS) $(RJS) -o $(BUILDJS) out=$@ optimize=uglify $(STANDALONE)

bootstrap:
	git submodule update --init

clean:
	rm -f $(TARGETS)

.PHONY: all clean bootstrap
