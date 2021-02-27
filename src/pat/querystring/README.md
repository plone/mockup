---
permalink: "pat/querystring/"
title: Querystring
---

# Querystring

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| criteria | object | {} | options to pass into criteria |
| indexOptionsUrl | string | null | URL to grab index option data from. Must contain "sortable_indexes" and "indexes" data in JSON object. |
| patternDateOptions | object | {} |  Options for the Date/Time select widget. |
| patternAjaxSelectOptions | object | {} | Options for the AJAX select widget. |
| patternRelateditemsOptions | object  | {} | Options for the related items widget. |
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


## Examples

### Default

<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /dist/test-querystringcriteria.json" />

```html
<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /dist/test-querystringcriteria.json" />
```

### Without previews

<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /dist/test-querystringcriteria.json;
            showPreviews: false;" />

```html
<input class="pat-querystring"
        data-pat-querystring="indexOptionsUrl: /dist/test-querystringcriteria.json;
            showPreviews: false;" />
```

