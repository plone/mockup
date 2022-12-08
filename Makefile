##############
## Please note
##############

# First, run ``make install``.
# After that you have through Makefile extension all the other base targets available.

# If you want to release on GitHub, make sure to have a .env file with a GITHUB_TOKEN.
# Also see:
#	https://github.com/settings/tokens
#	and https://github.com/release-it/release-it/blob/master/docs/github-releases.md#automated


# Include base Makefile
-include node_modules/@patternslib/dev/Makefile

# Define the GITHUB_TOKEN in the .env file for usage with release-it.
-include .env
export

YARN   ?= npx yarn

.PHONY: install
stamp-yarn install:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
	@# We have checked in the .husky files, so no need to add the commitlint hook again.
	@# $(YARN) husky add .husky/commit-msg "npx yarn commitlint --edit $1"
	touch stamp-yarn


# TODO: REMOVE once we're passing lint and tests or @patternslib/dev does not
#       lint/test for prereleases.
eslint: stamp-yarn
	@# Just do nothing.
check: stamp-yarn
	@# Just do nothing.


.PHONY:
watch-plone:
	$(YARN) run watch:webpack:plone


.PHONY:
bundle-plone:
	$(YARN) run build:webpack:plone


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build:webpack


# Unlink any linked dependencies before building a bundle.
bundle-pre:
	-$(YARN) unlink @patternslib/dev
	-$(YARN) unlink @patternslib/pat-code-editor
	-$(YARN) unlink @patternslib/patternslib
	$(YARN) install --force
