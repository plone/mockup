-include .env
export

ESLINT ?= npx eslint
YARN   ?= npx yarn


stamp-yarn:
	$(YARN) install --ignore-scripts
	# Check if you can really ignore scripts by running:
	#   npx can-i-ignore-scripts
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
		npx release-it major --ci && \
		npx release-it --github.release --github.update --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci && \
		npx release-it --github.release --github.update --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: release-patch
release-patch: check
	npx release-it patch --dry-run --ci && \
		npx release-it patch --ci && \
		npx release-it --github.release --github.update --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: serve
serve:: stamp-yarn
	$(YARN) run start


#
