ESLINT ?= npx eslint
YARN   ?= npx yarn


stamp-yarn:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
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
	npx release-it --dry-run --ci && \
		npx release-it --ci


.PHONY: serve
serve:: stamp-yarn
	$(YARN) run start


#
