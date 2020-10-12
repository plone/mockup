---
permalink: "patterns/relateditems/"
title: RelatedItems
---

# relatedItems

This is the relatedItems pattern.

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


## Configuration

| Option | Type | Default | Description |
|-|-|-|-|
| vocabularyUrl | string | null | This is a URL to a JSON-formatted file used to populate the list |
| attributes | array | ['UID', 'Title', 'portal_type', 'path'] | This list is passed to the server during an AJAX request to specify the attributes which should be included on each item. |
| closeOnSelect | boolean | true | Select2 option. Whether or not the drop down should be closed when an item is selected. |
| dropdownCssClass | string | 'pattern-relateditems-dropdown' | Select2 option. CSS class to add to the drop down element. |
| maximumSelectionSize | integer | -1 | The  maximum number of items that can be selected in a multi-select control.  If this number is less than 1 selection is not limited. |
| orderable | boolean | true | Whether or not items should be drag-and-drop sortable. |
| selectableTypes | array | null | If the value is null all types are selectable. Otherwise, provide a list of strings to match item types that are selectable. |
| separator | string | ',' | Select2 option. String which separates multiple items. |
| sortOn | string | null | Index  on which to sort on. If null, will default to term relevance (no sort)  when searching and folder order (getObjPositionInParent) when browsing. |
| sortOrder | string | 'ascending' | Sort ordering. |
| tokenSeparators | array | [",", " "] | Select2 option, refer to select2 documentation. |
| width | string | '100%' | Specify a width for the widget. |
| breadcrumbTemplateSelector | string | null | Select an element from the DOM from which to grab the breadcrumbTemplate. |
| toolbarTemplateSelector | string | null | Select an element from the DOM from which to grab the toolbarTemplate. |
| resultTemplate | string | Refer to source | Template for an item in the in the list of results. Refer to source for default. |
| resultTemplateSelector | string | null | Select an element from the DOM from which to grab the resultTemplate. |
| selectionTemplate | string | Refer to source | Template for element that will be used to construct a selected item. |
| selectionTemplateSelector | string | null | Select an element from the DOM from which to grab the selectionTemplate. |