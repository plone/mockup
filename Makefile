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


.PHONY: install
stamp-yarn install:
	npx yarn install
	# Install pre commit hook
	npx yarn husky install
	touch stamp-yarn


.PHONY:
watch-plone:
	$(YARN) run watch:webpack:plone


.PHONY:
bundle-plone:
	$(YARN) run build:webpack:plone


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build:webpack

#
