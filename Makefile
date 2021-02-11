YARN 		    ?= npx yarn

.PHONY: install
install: stamp-yarn


stamp-yarn:
	$(YARN) install
	touch stamp-yarn


.PHONY: clean
clean:
	rm -rf $(BUNDLER_DIR) node_modules stamp-yarn


.PHONY: dev-all
dev-all: dev-patternslib dev-pat-tinymce dev-pat-code-editor

.PHONY: dev-patternslib
dev-patternslib:
	mkdir -p devsrc; cd devsrc; test -x patternslib || git clone git@github.com:Patternslib/Patterns.git --branch mockup-updates patternslib

.PHONY: dev-patternslib-sass
dev-patternslib-sass:
	mkdir -p devsrc; cd devsrc; test -x patterns-sass || git clone git@github.com:Patternslib/patterns-sass.git --branch mockup-updates patterns-sass

.PHONY: dev-pat-tinymce
dev-pat-tinymce:
	mkdir -p devsrc; cd devsrc; test -x pat-tinymce || git clone git@github.com:Patternslib/pat-tinymce.git --branch master pat-tinymce

.PHONY: dev-pat-code-editor
dev-pat-code-editor:
	mkdir -p devsrc; cd devsrc; test -x pat-code-editor || git clone git@github.com:Patternslib/pat-code-editor.git --branch master pat-code-editor

.PHONY: dev-volto
dev-volto:
	mkdir -p devsrc; cd devsrc; test -x volto || git clone git@github.com:plone/volto.git --branch thet-mockup volto
