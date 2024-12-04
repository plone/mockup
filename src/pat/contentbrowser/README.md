---
permalink: "pat/contenbrowser/"
title: Contentbrowser
---

# Contentbrowser

Show a widget to select items in an offcanvas miller-column browser.


## Configuration

|           Option           |  Type   |                 Default                 |                                                                        Description                                                                        |
| :------------------------: | :-----: | :-------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------: |
|       vocabularyUrl        | string  |                   null                  |                                             This is a URL to a JSON-formatted file used to populate the list                                              |
|         attributes         |  array  | ['UID', 'Title', 'portal_type', 'path'] |                 This list is passed to the server during an AJAX request to specify the attributes which should be included on each item.                 |
|          rootPath          | string  |                   "/"                   |                                              Browsing/searching root path. You will not get beneath this path                                             |
|          rootUrl           | string  |                                         |                                                               Browsing/searching root url.                                                                |
|          basePath          | string  |            set to rootPath.             |                                                             Start browse/search in this path.                                                             |
|        contextPath         | string  |                                         |                         Path of the object, which is currently edited. If this path is given, this object will not be selectable.                         |
|         favorites          |  array  |                   []                    |     Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path".      |
|    maximumSelectionSize    | integer |                   -1                    |            The maximum number of items that can be selected in a multi-select control. If this number is less than 1 selection is not limited.            |
|           mode             | string  |                "browse"                 |                                                            Toggle between "browse" and "search"                                                           |
|           width            | integer |                                         |                                                    Override the width of the selected items field                                                         |
|           bSize            | integer |                   10                    |                                                          Batch size of the items listed in levels                                                         |
|          maxDepth          | integer |                                         |                                                           Maximum level depth for "browse" mode                                                           |
|         separator          | string  |                   ','                   |                                                  Select2 option. String which separates multiple items.                                                   |
|           upload           | boolean |                                         |                                            Allow file and image uploads from within the related items widget.                                             |
|       recentlyUsed         | boolean |                  false                  |                                                           Show the recently used items dropdown.                                                          |
|      recentlyUsedKey       | integer |                                         |                     Storage key for saving the recently used items. This is generated with fieldname and username in the patternoptions.                  |
|    recentlyUsedMaxItems    | integer |                    20                   |                                              Maximum items to keep in recently used list. 0: no restriction.                                              |
|     customComponentKeys    |  dict   |                    {}                   |                                           Register custom components. Currently only "SelectedItem" implemented                                           |


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

Currently only for `SelectedItem` component available.

```html
<input
    type="text"
    class="pat-contentbrowser"
    data-pat-contentbrowser='{
        "customComponentKeys": {
            "SelectedItem": "pat-contentbrowser.myfield.MySelectedItemComponent",
        },
    }'
/>
```

Copy the existing component `src/SelectedItem.svelte` to your addon, customize it and register it in your JS bundle as follows:

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

Note: this needs the `svelte-loader` plugin in your webpack.config.js ... see mockups webpack config for info.

