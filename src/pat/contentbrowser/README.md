---
permalink: "pat/contenbrowser/"
title: Contentbrowser
---

# Contentbrowser

Show a widget to select items in an offcanvas miller-column browser.


## Configuration

|           Option           |  Type   |                 Default                 |                                                                                                                                                          Description                                                                                                                                                          |
| :------------------------: | :-----: | :-------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|         attributes         |  array  | ['UID', 'Title', 'portal_type', 'path'] |                                                                                                   This list is passed to the server during an AJAX request to specify the attributes which should be included on each item.                                                                                                   |
|          basePath          | string  |            set to rootPath.             |                                                                                                                                               Start browse/search in this path.                                                                                                                                               |
|        contextPath         | string  |                                         |                                                                                                           Path of the object, which is currently edited. If this path is given, this object will not be selectable.                                                                                                           |
|         favorites          |  array  |                   []                    |                                                                                       Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path".                                                                                        |
|    maximumSelectionSize    | integer |                   -1                    |                                                                                              The maximum number of items that can be selected in a multi-select control. If this number is less than 1 selection is not limited.                                                                                              |
|          bSize             | integer |                   10                    |                                                                                                                                 Batch size to break down big result sets into multiple pages.                                                                                                                                 |
|         separator          | string  |                   ','                   |                                                                                                                                    Select2 option. String which separates multiple items.                                                                                                                                     |
|           upload           | boolean |                                         |                                                                                                                              Allow file and image uploads from within the related items widget.                                                                                                                               |
|       vocabularyUrl        | string  |                  null                   |                                                                                                                               This is a URL to a JSON-formatted file used to populate the list                                                                                                                                |


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
