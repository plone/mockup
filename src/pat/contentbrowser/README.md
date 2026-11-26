---
permalink: "pat/contenbrowser/"
title: Contentbrowser
---

# Contentbrowser

Show a widget to select items in an offcanvas miller-column browser.


## Configuration

|           Option           |  Type   |                 Default                 |                                                                        Description                                                               |
| :------------------------: | :-----: | :-------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: |
| vocabularyUrl              | string  | null                                    | This is a URL to a JSON-formatted file used to populate the list                                                                                 |
| attributes                 | array   | ['UID', 'Title', 'portal_type', 'path'] | This list is passed to the server during an AJAX request to specify the attributes which should be included on each item.                        |
| rootPath                   | string  | "/"                                     | Browsing/searching root path. You will not get beneath this path                                                                                 |
| rootUrl                    | string  |                                         | Browsing/searching root url.                                                                                                                     |
| basePath                   | string  | set to rootPath.                        | Start browse/search in this path.                                                                                                                |
| contextPath                | string  |                                         | Path of the object, which is currently edited. If this path is given, this object will not be selectable.                                        |
| selectableTypes            | array   | []                                      | List of portal_types to be selectable                                                                                                            |
| browseableTypes            | array   | autodetect folderish types.             | List of portal_types to be browseable                                                                                                            |
| favorites                  | array   | []                                      | Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path". |
| maximumSelectionSize       | integer | -1                                      | The maximum number of items that can be selected in a multi-select control. If this number is less than 1 selection is not limited.              |
| mode                       | string  | "browse"                                | Toggle between "browse" and "search"                                                                                                             |
| layout                     | string  | "list"                                  | Toggle between "list" and "grid" (show teaser image in column)                                                                                   |
| width                      | integer | unset                                   | Override the width of the selected items field                                                                                                   |
| bSize                      | integer | 10                                      | Batch size of the items listed in levels                                                                                                         |
| sort_on                    | string  | "sortable_title"                        | Item sorting criteria. It has to be a valid sorting index of the Catalog                                                                         |
| sort_order                 | string  | "ascending"                             | Sorting ordering. It has to ve a valid value for the Catalog: "ascending" or "descending"                                                        |
| maxDepth                   | integer |                                         | Maximum level depth for "browse" mode                                                                                                            |
| separator                  | string  | ','                                     | Select2 option. String which separates multiple items.                                                                                           |
| upload                     | boolean | false                                   | Allow file and image uploads from within the related items widget.                                                                               |
| uploadAddImmediately       | boolean | true                                    | Add uploaded item(s) immediately to the selected items field.                                                                                    |
| uploadAcceptedMimetypes    | string  |                                         | Define accepted mimetypes of files to be uploaded.For example "image/*" accepts only images                                                      |
| recentlyUsed               | boolean | false                                   | Show the recently used items dropdown.                                                                                                           |
| recentlyUsedKey            | integer |                                         | Storage key for saving the recently used items. This is generated with fieldname and username in the patternoptions.                             |
| recentlyUsedMaxItems       | integer | 20                                      | Maximum items to keep in recently used list. 0: no restriction.                                                                                  |
| componentRegistryKeys      | dict    | {}                                      | Use custom components registered in the `@plone/registry` component registry. Currently only "selectedItem" is implemented.                      |
| searchIndex                | string  | "SearchableText"                        | Catalog search index for filtering and search mode. (Note: only ZCTextIndex allowed)                                                             |
| unmarkedReviewStates       | array   | ["published", "external"]               | Workflow states which get no state indicator. See "Workflow state".                                                                               |


## Workflow state

Items which are not published are marked with a dot in the color of their workflow state.
The dot is shown in the item list, in the preview and on the selected items.
In the item list it is at the end of the row, before the arrow of a folder.
Its tooltip and accessible name contain the translated id of the state.

The color is taken from the CSS variable `--plone-state-<review_state>` of the theme, with underscores replaced by hyphens, e.g. `--plone-state-internally-published`.
States without such a variable get a neutral ring.
Items without a workflow get no dot.
The states `published` and `external` get no dot either.
Change this with the option `unmarkedReviewStates`, e.g. `[]` to mark all states, or `["internally_published"]` for an intranet.

The items also get the CSS class `state-<review_state>`, like the rows of the structure pattern.


## Default

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{"selectableTypes": ["Document"], "vocabularyUrl": "contentbrowser-test.json"}'
/>
```

## Existing values, some bad

```html
<input
    type="text"
    class="pat-contentbrowser"
    value="asdf1234gsad,sdfbsfdh345,asdlfkjasdlfkjasdf,kokpoius98"
    data-pat-contentbrowser="width:30em; vocabularyUrl:contentbrowser-test.json"
/>
```

## Selectable Types

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{"selectableTypes": ["Document"], "vocabularyUrl": "contentbrowser-test-selectable.json"}'
/>
```

## Select a single item

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{"selectableTypes": ["Document"], "vocabularyUrl": "contentbrowser-test.json", "maximumSelectionSize": 1}'
/>
```

## Mode "browse", Upload

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{"selectableTypes": ["Image", "File"], "vocabularyUrl": "contentbrowser-test.json", "upload": true}'
/>
```

## Register custom component

Use the `componentRegistryKeys.selectedItem` configuration value as follows to override the `SelectedItem` component (only supported component currently).

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{
        "componentRegistryKeys": {
            "selectedItem": "pat-contentbrowser.myfield.MySelectedItemComponent"
        }
    }'
/>
```

Copy the existing component `src/SelectedItem.svelte` to your addon, customize it and register it in your JS bundle as follows:

Note: the `name` of the registered component must match the `componentRegistryKeys.selectedItem` config value defined above.
It can be any unique identifier.
If no custom component is registered for the configured key, the pattern falls back to the default component registered as `pat-contentbrowser.SelectedItem`.

To replace the component site-wide without any pattern configuration, register your component under the default key `pat-contentbrowser.SelectedItem` instead.
The pattern only registers its own default component if nothing is registered under that key yet, so an add-on registration is kept no matter whether the add-on bundle initializes before or after the pattern.

```javascript
...
import plone_registry from "@plone/registry";
...

async function register_selecteditem_component() {
    // we register our component to a custom keyname,
    // which later can be used for pattern_options
    const SelectedImages = (await import("./MySelectedItemComponent.svelte")).default;
    plone_registry.registerComponent({
        name: "pat-contentbrowser.myfield.MySelectedItemComponent",
        component: SelectedImages,
    });
}
register_selecteditem_component();

...

```

Note: this needs the `svelte-loader` plugin in your webpack.config.js ... see mockups `webpack.config.js` for more info.

Your add-on bundle also has to share the Svelte runtime via module federation, so that your component runs on the same runtime instance as the Plone bundle.
Add the same `svelte` and `svelte/` shared entries as in mockups `webpack.config.js` to your module federation config:

```javascript
mf_config({
    name: package_json.name,
    remote_entry: config.entry["mybundle.min"],
    dependencies: {
        ...package_json.dependencies,
    },
    shared: {
        svelte: {
            singleton: true,
            requiredVersion: package_json.dependencies["svelte"],
        },
        "svelte/": {
            singleton: true,
            requiredVersion: package_json.dependencies["svelte"],
        },
    },
});
```

