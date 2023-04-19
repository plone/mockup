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