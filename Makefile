##############
## Please note
##############

# First, run ``make install``.
# After that you have all the targets from @patternslib/dev available.

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


yarn.lock install:
	$(YARN) install


.PHONY:
watch-plone:
	$(YARN) run watch:webpack:plone


.PHONY:
bundle-plone:
	$(YARN) run build:webpack:plone


.PHONY: bundle
bundle: install
	$(YARN) run build:webpack


# Unlink any linked dependencies before building a bundle.
bundle-pre:
	-$(YARN) unlink @patternslib/dev
	-$(YARN) unlink @patternslib/pat-code-editor
	-$(YARN) unlink @patternslib/patternslib
	$(YARN) install --force

.PHONY: storybook
storybook: install ## Run Storybook in dev mode
	$(YARN) run storybook

.PHONY: build-storybook
build-storybook: install ## Build Storybook as static files
	$(YARN) build-storybook
