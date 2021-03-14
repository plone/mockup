---
permalink: "pat/relateditems/"
title: Related items
---

# Related items

This is the related items pattern.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| attributes | array | ['UID', 'Title', 'portal_type', 'path'] | This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. |
| basePath | string| set to rootPath. | Start browse/search in this path. |
| breadcrumbTemplate | string |  | Template to use for a single item in the breadcrumbs. |
| breadcrumbTemplateSelector | string | null | Select an element from the DOM from which to grab the breadcrumbTemplate. |
| closeOnSelect | boolean | true | Select2 option. Whether or not the drop down should be closed when an item is selected. |
| contextPath | string |  | Path of the object, which is currently edited. If this path is given, this object will not be selectable. |
| dropdownCssClass | string | 'pattern-relateditems-dropdown' | Select2 option. CSS class to add to the drop down element. |
| favorites | array | [] | Array of objects. These are favorites, which can be used to quickly jump to different locations. Objects have the attributes "title" and "path". |
| maximumSelectionSize | integer | -1 | The  maximum number of items that can be selected in a multi-select control.  If this number is less than 1 selection is not limited. |
| minimumInputLength | integer | 0 | Number of characters necessary to start a search. |
| mode | string |  | Initial widget mode. Possible values: are 'auto', 'search' and 'browse'. If set to 'search', the catalog is searched for a searchterm. If set to 'browse', browsing starts at basePath. Default: 'auto', which means the combination of both. |
| orderable | boolean | true | Whether or not items should be drag-and-drop sortable. |
| pageSize | integer | 10 | Batch size to break down big result sets into multiple pages. |
| recentlyUsed | boolean | false | Show the recently used items dropdown. |
| recentlyUsedMaxItems | integer | 20 | Maximum items to keep in recently used list. 0: no restriction. |
| resultTemplate | string | Refer to source | Template for an item in the in the list of results. Refer to source for default. |
| resultTemplateSelector | string | null | Select an element from the DOM from which to grab the resultTemplate. |
| rootPath | string | "/" | Only display breadcrumb path elements deeper than this path. |
| rootUrl | string |  | Visible URL up to the rootPath. This is prepended to the currentPath to generate submission URLs. |
| scanSelection | boolean |  | Scan the list of selected elements for other patterns. |
| selectableTypes | array | null | If the value is null all types are selectable. Otherwise, provide a list of strings to match item types that are selectable. |
| selectionTemplate | string | Refer to source | Template for element that will be used to construct a selected item. |
| selectionTemplateSelector | string | null | Select an element from the DOM from which to grab the selectionTemplate. |
| separator | string | ',' | Select2 option. String which separates multiple items. |
| sortOn | string | null | Index  on which to sort on. If null, will default to term relevance (no sort)  when searching and folder order (getObjPositionInParent) when browsing. |
| sortOrder | string | 'ascending' | Sort ordering. |
| tokenSeparators | array | [",", " "] | Select2 option, refer to select2 documentation. |
| toolbarTemplate | string |  | Template for element to which toolbar items will be appended. |
| toolbarTemplateSelector | string | null | Select an element from the DOM from which to grab the toolbarTemplate. |
| upload | boolean |  | Allow file and image uploads from within the related items widget. |
| uploadAllowView | string |  | View, which returns a JSON response in the form of {allowUpload: true}, if upload is allowed in the current context. |
| vocabularyUrl | string | null | This is a URL to a JSON-formatted file used to populate the list |
| width | string | '100%' | Specify a width for the widget. |


## Default, mode "search/browse" auto (combination of both)

<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test.json"}' />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test.json"}' />
```

## Default, mode "browse"

<input type="text" class="pat-relateditems"
    data-pat-relateditems="width:30em;
                            mode:search;
                            vocabularyUrl:relateditems-test.json" />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems="width:30em;
                            mode:search;
                            vocabularyUrl:relateditems-test.json" />
```

## Default, mode "search"

<input type="text" class="pat-relateditems"
    data-pat-relateditems="width:30em;
                            mode:browse;
                            vocabularyUrl:relateditems-test.json" />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems="width:30em;
                            mode:browse;
                            vocabularyUrl:relateditems-test.json" />
```


## Default, mode auto, favorites and recentlyUsed

<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"vocabularyUrl": "relateditems-test.json", "favorites": [{"title": "Projects", "path": "/path"}], "recentlyUsed": true}' />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"vocabularyUrl": "relateditems-test.json", "favorites": [{"title": "Projects", "path": "/path"}], "recentlyUsed": true}' />
```


## Existing values, some bad

<input type="text" class="pat-relateditems"
    value="asdf1234gsad,sdfbsfdh345,asdlfkjasdlfkjasdf,kokpoius98"
    data-pat-relateditems="width:30em; vocabularyUrl:relateditems-test.json" />

```html
<input type="text" class="pat-relateditems"
    value="asdf1234gsad,sdfbsfdh345,asdlfkjasdlfkjasdf,kokpoius98"
    data-pat-relateditems="width:30em; vocabularyUrl:relateditems-test.json" />
```


## Selectable Types

<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test-selectale.json"}' />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test-selectable.json"}' />
```


## Select a single item

<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test.json", "maximumSelectionSize": 1}' />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Document"], "vocabularyUrl": "relateditems-test.json", "maximumSelectionSize": 1}' />
```


## Mode "browse", Upload

<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Image", "File"], "vocabularyUrl": "relateditems-test.json", "upload": true}' />

```html
<input type="text" class="pat-relateditems"
    data-pat-relateditems='{"selectableTypes": ["Image", "File"], "vocabularyUrl": "relateditems-test.json", "upload": true}' />
```

