ESLINT ?= npx eslint
YARN   ?= npx yarn


stamp-yarn:
	$(YARN) install
	# Install pre commit hook
	#Do not yet - while heave development - enforce pre-commit commitlint hook.
	#$(YARN) husky install
	touch stamp-yarn


clean-dist:
	rm -Rf dist/


.PHONY: clean
clean: clean-dist
	rm -f stamp-yarn
	rm -Rf node_modules/


eslint: stamp-yarn
	$(ESLINT) ./src


.PHONY: check
check:: stamp-yarn eslint
	$(YARN) run test


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build


.PHONY: release-major
release-major: check
	npx release-it major --dry-run --ci && \
		npx release-it major --ci


.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci


.PHONY: release-patch
release-patch: check
	npx release-it patch --dry-run --ci && \
		npx release-it patch --ci


.PHONY: serve
serve:: stamp-yarn
	$(YARN) run start


### Dev checkouts

.PHONY: dev-patternslib
dev-patternslib:
	mkdir -p devsrc; cd devsrc; test -x patternslib || git clone git@github.com:Patternslib/Patterns.git --branch master patternslib

.PHONY: dev-pat-code-editor
dev-pat-code-editor:
	mkdir -p devsrc; cd devsrc; test -x pat-code-editor || git clone git@github.com:Patternslib/pat-code-editor.git --branch master pat-code-editor

.PHONY: dev-pat-content-browser
dev-pat-content-browser:
	mkdir -p devsrc; cd devsrc; test -x pat-content-browser || git clone git@github.com:Patternslib/pat-content-browser.git --branch master pat-content-browser

.PHONY: dev-pat-tinymce
dev-pat-tinymce:
	mkdir -p devsrc; cd devsrc; test -x pat-tinymce || git clone git@github.com:Patternslib/pat-tinymce.git --branch master pat-tinymce

.PHONY: dev-volto
dev-volto:
	mkdir -p devsrc; cd devsrc; test -x volto || git clone git@github.com:plone/volto.git --branch thet-mockup volto

.PHONY: dev-patternslib-sass
dev-patternslib-sass:
	mkdir -p devsrc; cd devsrc; test -x patterns-sass || git clone git@github.com:Patternslib/patterns-sass.git --branch mockup-updates patterns-sass

#
