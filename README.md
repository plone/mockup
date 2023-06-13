<<<<<<< HEAD
Mockup
======


Copia del repositorio Mockup de ONCE en el que están todos los patterns de JavaScript (tinymce, folder_contents, ...).

Hay que utilizar la rama 'all' que es donde están las modificaciones que se han realizado para las modificaciones de ONCE.

Las modificaciones hay que realizarlas en la rama 'all' y después compilar los cambios para crear los archivos que hay que copiar a
plone.staticresources que es del que hay que hacer una nueva versión y hacer el correspondiente despliegue.

El proceso de compilación es el siguiente:



#.
- Añadir en la parte [sources] del buildout los dos paquetes mockup y plone.staticresources apuntando a los repositorios correspondientes de bitbucket

#.
- Crear una rama en mockup partiendo de la rama `all`
- Ejecutar `make bootstrap`
- Implementar la funcionalidad requerida.
- Ejecutar `make bundles`

#.
- Modificar la url del paquete mockup dentro del archivo `package.json` apuntando a la rama creada. Por ejemplo:
  Donde dice `"mockup": "https://github.com/plone/mockup.git"` añadir la rama al final:`, `"mockup": "https://github.com/plone/mockup.`git#erral-a11y-structure-pattern",
- Ejecutar `yarn install` para traer los paquetes

#.
-  Añadir un nuevo bloque en el archivo `buildout.cfg` para poder compilar los recursos:

```ini
[resources]
recipe = zc.recipe.egg
eggs = plone.staticresources
scripts =
    plone-compile-resources

```

No hay que olvidarse de añadir `resources` en el bloque `parts`:

```ini
parts +=
    instance
    zeo
    omelette
    zopepy
    resources
```
- Ejecutar el buildout para que se cree el script de compilación
- Ejecutar la compilación, poniendo en marcha ZEO, y después ejecutarlo: hauxe egin:

```bash
./bin/plone-compile-resources -b plone
./bin/plone-compile-resources -b plone-logged-in
./bin/plone-compile-resources -b plone-editor-tools
```

- Aunque innecesario, solicitamos compilar todos los "patterns".
- Dentro de plone.staticresources se crearán las versiones compiladas, de las que podemos hacer `git commit`
- Podemos crear la nueva versión de plone.staticresources con el número de versión correspondiente. **Atención**: el número de versión debe llevar el marcador `once` para diferenciarlo de las versiones propias de Plone. Debe ser algo así: `1.2.22.once.1`, siendo 1.2.22 la versión original del paquete del que hemos partido el desarrollo
=======
# Plone Mockup

Mockup is the JavaScript stack of the Plone Classic UI.

## Styleguide

-   Tab: 4 spaces for everything except for HTML and XML files (2 Spaces) and the Makefile (TAB).
    This rule is defined in the [.editorconfig file](./.editorconfig).

## Commit style guide

We automatically generate the changelog from the commit messages following the [Conventional Commits specification](https://www.conventionalcommits.org/).
Changelog generation is done by the [conventional changelog plugin](https://github.com/release-it/conventional-changelog/) for [release-it](https://github.com/release-it/release-it).
This is enforced via a pre-commit hook managed by [husky](https://github.com/typicode/husky).

### And this is how you use it

We have 4 different types of changelog entries:

-   Breaking Changes (type: `breaking`),
-   Features (type: `feat`),
-   Bug Fixes (type: `fix`),
-   Maintenance (type: `maint`).

We can group commits in the changelog via a scope - or grouping.
Let's follow a convention and use these groupings - but the grouping is optional and any other group name can be used.

-   "Dependencies" for upgrading package.json dependencies.
-   "Docs" for documentation.
-   "Build" for everything related to the release workflow, Webpack and building bundles.
-   "Cleanup" for cleaning up or reformatting code.
-   "pat PATTERNNAME" for changes to individual patterns in src/pat.
-   "core MODULENAME" for changes to core modules in src/core.

A commit message with a changelog-grouping must be structured like so: `TYPE(GROUP): MESSAGE`.
Without grouping: `TYPE: MESSAGE`

If the commit message doesn't follow this convention it won't be included in the changelog.
To bypass the pre-commit hook, use the git `-n` switch.
Example: `git commit yarn.lock -m"yarn install." -n`.

If you are working on a component like the structure pattern (pat-structure), use `pat structure` as a group.

Examples:

Add a feature to the structure pattern:

```
git commit src/pat/structure -m"feat(pat structure): Add feature to cook some coffee"
```

Cleanup task:

```
git commit -am"maint(Cleanup): Remove whitespace from documentation."

```

or without a grouping:

```
git commit -am"maint: Remove unnecessary file from root directory."
```

---

** Note **

Please keep commits on the `yarn.lock` file or any other auto-generated code seperate.

Just commit them seperately with `git commit yarn.lock -m"yarn install" -n`.

Having them seperately reduces the effort when merging or rebasing branches where a merge conflict can easily happen.
In such cases you can just withdraw your changes on the yarn.lock file or remove those commits and re-install with `yarn install` at the end of a successful merge or rebase.

---

## Install

-   Have a current version of Node.js installed.

-   To install, run: `make install`.

-   To run the demo server, do: `make serve`.

    This starts up the webpack build process in watch mode.
    Any JavaScript changes are immediately compiled.
    For some changes - like for adding new packages via `yarn add` and then using it you might need to restart.
    The command also spins up a development server for our `11ty` based documentation and demo pages.
    If you don't need the docs running, you can run `yarn start:webpack` or `npm run start:webpack` instead, so that only the webpack devserver is running.

-   Go to `http://localhost:8000`:
    On this port our demo and documentation pages are served.


# Development

You can directly develop with the 11ty based documentation / demo server by running ``make serve``.

If you want to develop in Plone, you have two options:

1) Run `make watch-plone`. You need buildout to have plone.staticresources checked out next to Mockup.
   Mockup will compile it's bundle directly into the `++plone++static` directory of plone.staticresources and update it when you change something in Mockup.

2) Run `npx yarn start:webpack`, go to the resource registry ( http://localhost:8080/Plone/@@resourceregistry-controlpanel ) and add the URL `http://localhost:8000/bundle.min.js` to the JavaScript input field of the plone bundle instead of the other URL `++plone++static/bundle-plone/bundle.min.js`.

For more commands inspect Makefile and the script part of the package.json.


## Running tests

Run `make check` to run all tests including `eslint` checks.

To run individual tests, run:

-   `jest`: Run all tests
-   `jest src/pat/PATH-TO-PATTERN`: Run a specific test suite
-   `jest src/pat/PATH-TO-PATTERN -t "Test name"`: Run a specific test matching "Test name" from a specific test suite.
-   `jest --watch`: Run the interactive test runner.

## Debugging tests

The tests are based on jsdom - a library mocking DOM and HTML standards in JavaScript.
No real browsers are involved, which make the tests run really fast.

Still, you can connect to the Chrome debugging interface via:

```
node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/PATH-TO-PATTERN``
```

Connect in chrome via (You need to click "continue" or "Resume script execution" in the inspector once to proceed):

```
chrome://inspect
```

You can pass Jest any parameter it accepts, like `-t TESTPATTERN`::

```
node --inspect-brk node_modules/.bin/jest --runInBand ./src/pat/PATH-TO-PATTERN -t test.name
```

You can put some `debugger;` statements to the code to break the execution and investigate.

## Developing external Packages

If you want to work on ony external package like Patternslib or any external Mockup pattern you can do so by linking those packages into the node_modules folder via `yarn link`.

1. Check out the external package you want to develop on.

2. Make sure you have installed the dependencies in the development package (e.g. by running `yarn install`). (TODO: verify that!)

3. Run `yarn link` in the external development package to register it with yarn.

4. Run `yarn link "PACKAGE-NAME"` in mockup to create the node_modules symlink.

After developing you might want to run `yarn unlink "PACKAGE-NAME"` to unlink the development package.

For more information see:

-   https://classic.yarnpkg.com/en/docs/cli/link/
-   https://classic.yarnpkg.com/en/docs/cli/unlink
-   https://docs.npmjs.com/cli/v7/commands/npm-link

**Please note:**: Make sure to unlink and reinstall development pacakges before building a production bundle.
In doubt, remove the node_modules directory and re-install.

## Bundle build analyzation

https://survivejs.com/webpack/optimizing/build-analysis/
https://formidable.com/blog/2018/finding-webpack-duplicates-with-inspectpack-plugin/

Build the stats.json file:

```
npx yarn build:stats
```

Check dependency tree and why which package was included:
https://www.npmjs.com/package/whybundled

```
npx whybundled stats.json
```

Visualize dependency tree and analyze bundle size:
https://www.npmjs.com/package/webpack-bundle-analyzer

```
npx webpack-bundle-analyzer stats.json
```


## i18n message extraction

To update the translation file, the following needs to be done:

1. Extract the messages from this package:

```
npx yarn run i18n
```

Or just ``npm run i18n``...

2. Copy the widgets.pot file to plone.app.locales

Assuming you are doing this from a buildout.coredev environment in the mockup folder:
```
cp widgets.pot ../plone.app.locales/plone/app/locales/locales/
```

3. Run i18ndude to update the po files

```
cd ../plone.app.locales/plone/app/locales/locales
i18ndude sync --pot widgets.pot */LC_MESSAGES/widgets.po
```

## i18n message handling in Plone

To test a translation, for example French:

- Edit the po file ``src/plone.app.locales/plone/app/locales/locales/fr/LC_MESSAGES/widgets.po``.

- Restart your instance to rebuild the mo file from the po file.

- Purge your localStorage and refresh the page to trigger a new download of the translations.

The translations are handled by ``src/core/i18n.js``.
This translation helper that calls the ``@@plonejsi18n`` view defined in plone.app.content to generate a JSON of the translations from the mo file.
The ``@@plonejsi18n`` view is called one time for a given domain and language and the result is cached in localStorage for 24 hours.
The only way to test the new translations is to restart the instance to update the mo file from the po file, and then to purge the localStorage to trigger a new download of the translations.
>>>>>>> upstream/master
