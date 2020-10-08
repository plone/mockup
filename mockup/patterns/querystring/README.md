---
permalink: "patterns/querystring/"
title: Querystring
---

# Querystring

## Default

```html
<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /tests/json/queryStringCriteria.json" />
```

## Without preview

```html
<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /tests/json/queryStringCriteria.json;
            showPreviews: false;" />
```

## Configuration

| Option | Type | Default | Description |
|-|-|-|-|
| criteria | object | {} | options to pass into criteria |
| indexOptionsUrl | string | null | URL to grab index option data from. Must contain "sortable_indexes" and "indexes" data in JSON object. |
| previewURL | string | 'portal_factory/@@querybuilder_html_results' | URL used to pass in a plone.app.querystring-formatted HTTP querystring and get an HTML list of results |
| previewCountURL | string | 'portal_factory/@@querybuildernumberofresults' | URL  used to pass in a plone.app.querystring-formatted HTTP querystring and  get an HTML string of the total number of records found with the query |
| classWrapperName | string | 'querystring-wrapper' | CSS class to apply to the wrapper element |
| classSortLabelName | string | 'querystring-sort-label' | CSS class to apply to the sort on label |
| classSortReverseName | string | 'querystring-sortreverse' | CSS class to apply to the sort order label and checkbox container |
| classSortReverseLabelName | string | 'querystring-sortreverse-label' | CSS class to apply to the sort order label |
| classPreviewCountWrapperName | string | 'querystring-previewcount-wrapper' | TODO |
| classPreviewResultsWrapperName | string | 'querystring-previewresults-wrapper' | CSS class to apply to the results wrapper |
| classPreviewWrapperName | string | 'querystring-preview-wrapper' | CSS class to apply to the preview wrapper |
| classPreviewName | string | 'querystring-preview' | CSS class to apply to the preview pane |
| classPreviewTitleName | string | 'querystring-preview-title' | CSS class to apply to the preview title |
| classPreviewDescriptionName | string | 'querystring-preview-description' | CSS class to apply to the preview description |
| classSortWrapperName | string | 'querystring-sort-wrapper' | CSS class to apply to the sort order and sort on wrapper |
| showPreviews | boolean | true | Should previews be shown? |
| selectionTemplate | string | Refer to source | Template for element that will be used to construct a selected item. |
| selectionTemplateSelector | string | null | Select an element from the DOM from which to grab the selectionTemplate. |