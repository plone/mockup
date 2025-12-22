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

PNPM = pnpm


pnpm-lock.yaml install:
	npm i -g corepack@latest && corepack enable
	$(PNPM) install


.PHONY:
watch-plone:
	$(PNPM) run watch:webpack:plone


.PHONY:
bundle-plone:
	$(PNPM) run build:webpack:plone


.PHONY: bundle
bundle: install
	$(PNPM) run build:webpack

.PHONY: docs
docs: install
	$(PNPM) build:webpack:docs
	$(PNPM) build:docs

# Unlink any linked dependencies before building a bundle.
bundle-pre:
	-$(PNPM) unlink @patternslib/dev
	-$(PNPM) unlink @patternslib/pat-code-editor
	-$(PNPM) unlink @patternslib/patternslib
	$(PNPM) install --force
