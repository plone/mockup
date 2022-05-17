-include .env
export

ESLINT ?= npx eslint
YARN   ?= npx yarn

PACKAGE_NAME = "mockup"


.PHONY: install
stamp-yarn install:
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


.PHONY: test
test: stamp-yarn
	$(YARN) run test


.PHONY: check
check: stamp-yarn eslint test


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build


# If you want to release on GitHub, make sure to have a .env file with a GITHUB_TOKEN.
# Also see:
#	https://github.com/settings/tokens
#	and https://github.com/release-it/release-it/blob/master/docs/github-releases.md#automated

release-zip: clean-dist bundle
	$(eval PACKAGE_VERSION := $(shell node -p "require('./package.json').version"))
	@echo name is $(PACKAGE_NAME)
	@echo version is $(PACKAGE_VERSION)
	mkdir -p dist/$(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)
	-mv dist/* dist/$(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)
	cd dist/ && zip -r $(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION).zip $(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)/

.PHONY: release-major
release-major: check
	npx release-it major --dry-run --ci && \
		npx release-it major --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: release-patch
release-patch: check
	npx release-it patch --dry-run --ci && \
		npx release-it patch --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: prerelease
prerelease:
	npx release-it --dry-run --ci --preRelease=alpha && \
		npx release-it --ci --preRelease=alpha && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md


.PHONY: serve
serve: stamp-yarn
	$(YARN) run start


.PHONY:
watch-plone:
	$(YARN) run watch:webpack:plone


.PHONY:
bundle-plone:
	$(YARN) run build:webpack:plone


#
