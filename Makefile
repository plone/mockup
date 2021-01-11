YARN 		    ?= npx yarn

.PHONY: install
install: stamp-yarn


stamp-yarn:
	$(YARN) install
	touch stamp-yarn


.PHONY: clean
clean:
	rm -rf $(BUNDLER_DIR) node_modules stamp-yarn


.PHONY: dev-patternslib
dev-patternslib:
	mkdir -p devsrc; cd devsrc; test -x patternslib     || git clone git@github.com:Patternslib/Patterns.git --branch mockup-updates patternslib


.PHONY: dev-volto
dev-volto:
	mkdir -p devsrc; cd devsrc; test -x volto           || git clone git@github.com:plone/volto.git --branch thet-mockup volto
