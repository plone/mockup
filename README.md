# Mockup
Copia del repositorio Mockup de ONCE en el que están todos los patterns de JavaScript (tinymce, folder_contents, ...).

**La rama MASTER es para Plone 6**. Para Plone 5, usa la rama ``plone5``

## Instrucciones para la descarga y sincronización con el repositorio original ``plone/mockup``
Para mantener tu copia local sincronizada con el repositorio de `github` de **Plone**, y así actualizar el producto con los cambios que allí se produzcan, es necesario seguir estos pasos:


1. **Clonar el repositorio de `Bitbucket`**

    Puedes clonar el repositorio usando git o mediante el buildout en tu entorno de desarrollo

    ```bash
    git clone ssh://git@bitbucket.once.es:7999/web-commons/mockup.git
    ```

    ```title="instance-develop.cfg"
    [sources]
    ...
    mockup = git ssh://git@bitbucket.once.es:7999/web-commons/mockup.git branch=master
    ```


2. **Sincronizar con el repositorio original ``plone/mockup``**

    Para ello, es necesario añadir el ``upstream``. El repositorio original se llama comunmente "upstream".

    Cambiate a la carpeta con el producto ``mockup``:
    ```shell
    cd mockup
    ```

    Ahora añadimos el upstream:
    ```
    git remote add upstream git@github.com:plone/mockup.git
    ```

    Comprobamos que las URLs remotas están correctamente configuradas:
    ```shell
    git remote -v

    origin  ssh://git@bitbucket.once.es:7999/web-commons/mockup.git (fetch)
    origin  ssh://git@bitbucket.once.es:7999/web-commons/mockup.git (push)
    upstream        git@github.com:plone/mockup.git (fetch)
    upstream        git@github.com:plone/mockup.git (push)
    ```


3. **Mantener el upstream actualizado**

    Ahora que tenemos ambas URLs configuradas, podemos actualizar los dos origenes de manera independiente.

    ```shell
    git fetch upstream
    ```
    Con este comando obtenemos los cambios desde el ``upstream``.


4. **Fusionar los cambios del upstream con nuestro repositorio**

    Ahora podemos fusionar los cambios a nuestro `master`, por ejemplo:
    ```shell
    git merge upstream/master master
    ```
    Con esto, fusionamos los últimos cambios desde la rama master del upstream en nuestra rama local master. Si lo prefieres, también puedes usar `git pull`, que no es más que un fetch y un merge en un único paso.
    **Truco Pro** Una manera más óptima sería hacer *rebase* porque obtiene los últimos cambios de la rama upstream y re-aplica tus cambios sobre los entrantes. Por ejemplo:
    ```shell
    git rebase upstream/master
    ```


## PLONE 6. USO DE ``MOCKUP`` PARA ACTUALIZAR ``PLONE.STATICRESOURCES``

El uso de ``mockup`` para Plone 6 es diferente que para Plone 5. Así pues, siguiendo las instrucciones dadas en ``plone.staticresources`` y ``mockup``, estos son los pasos a seguir para modificar y distribuir nuestras personalizaciones y/o correcciones:

- [mockup](https://github.com/plone/mockup.git)
- [plone.staticresources](https://github.com/plone/plone.staticresources.git)

### 1. Crear una copia local en tu buildout (instance-develop.cfg)  

Añade esto a tu fichero buildout.cfg y haz un ``buildout``

```title="instance-develop.cfg"
[sources]
...
mockup = git ssh://git@bitbucket.once.es:7999/web-commons/mockup.git branch=master
plone.staticresources = ssh://git@bitbucket.once.es:7999/web-commons/plone.staticresources.git branch=master
```

### 2. Modifica la funcionalidad necesaria
Ahora vamos a instalar las depencencias del ``mockup`` para poder realizar cambios.

#### 2.1 Instalación

**Requisitos**: Necesitas tener instalada la versión actual de Node.js.

Para instalar las dependencias, dentro de la carpeta mockup, ejecuta: `make install`

```shell
(w6club) src/mockup$ make install
npx yarn install
yarn install v1.22.19
warning ../../../../package.json: No license field
[1/5] Validating package.json...
[2/5] Resolving packages...
[3/5] Fetching packages...
[4/5] Linking dependencies...
warning "@patternslib/patternslib > @fullcalendar/luxon2@5.11.5" has incorrect peer dependency "luxon@^2.0.0".
warning " > bootstrap@5.3.0" has unmet peer dependency "@popperjs/core@^2.11.7".
warning "@patternslib/dev > jest-watch-typeahead > ansi-escapes > type-fest@3.10.0" has unmet peer dependency "typescript@>=4.7.0".
[5/5] Building fresh packages...
$ patch --forward node_modules/select2/select2.js < patches/select2.patch || true
patching file node_modules/select2/select2.js
Done in 32.40s.
# Install pre commit hook
npx yarn husky install
yarn run v1.22.19
warning ../../../../package.json: No license field
$ /home/mabehora/proyectos/w6club/src/mockup/node_modules/.bin/husky install
husky - Git hooks installed
Done in 0.40s.
touch stamp-yarn
```

#### 2.1 Desarrollo

Se puede desarrollar directamente con el servidor demo, basado en la documentación 11ty, ejecutando ``make serve``.

Sin embargi, para desarrollar en Plone, tenemos dos opciones:

1. Ejecutar ``make watch-plone`` (Recomendada): Mockup compilará el bundle de staticresources directamente al directorio ``++plone++static`` del paquete ``plone.staticresources`` y lo actualizará cuando realices alguna modificación en los fuentes de Mockup.
2. Ejecutar ``npx yarn start:webpack``, ir al panel de control ``resource registry`` y añadir la URL ``http://localhost:8000/bundle.min.js`` en el campo JavaScript del Bundle Plone, sustituyendo la otra URL ``++plone++static/bundle-plone/bundle.min.js``.


## PLONE 5. USO DE ``MOCKUP`` PARA ACTUALIZAR ``PLONE.STATICRESOURCES``

Hay que utilizar la rama `plone5` que es donde están las modificaciones que se han realizado para las modificaciones de ONCE.

Las modificaciones hay que realizarlas en la rama `plone5` y después compilar los cambios para crear los archivos que hay que copiar a
`plone.staticresources` que es del que hay que hacer una nueva versión y hacer el correspondiente despliegue.

El proceso de compilación es el siguiente:



#.
- Añadir en la parte [sources] del buildout los dos paquetes `mockup` y `plone.staticresources` apuntando a los repositorios correspondientes de bitbucket

#.
- Crear una rama en `mockup` partiendo de la rama `plone5`
- Ejecutar `make bootstrap`
- Implementar la funcionalidad requerida.
- Ejecutar `make bundles`

#.
- Modificar la url del paquete `mockup` dentro del archivo `package.json` apuntando a la rama creada. Por ejemplo:
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