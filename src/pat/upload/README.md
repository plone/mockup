---
permalink: "pat/upload/"
title: Upload
---

# Upload pattern.

## Configuration

|       Option       |   Type   |                                                                                                                 Default                                                                                                                 |                                                            Description                                                            |
| :----------------: | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
|     showTitle      | boolean  |                                                                                                                  true                                                                                                                   |                                                      show/hide the h1 title                                                       |
|        url         |  string  |                                                                                                                  null                                                                                                                   |       If not used with a form, this option must provide the URL to submit to or baseUrl with relativePath needs to be used        |
|      baseUrl       |  string  |                                                                                                                  null                                                                                                                   |                  to be used in conjunction with relativePath to generate submission urls based on related items                   |
|    relativePath    |  string  |                                                                                                                  null                                                                                                                   |                                        again, to be used with baseUrl to create upload url                                        |
|   initialFolder    |  string  |                                                                                                                  null                                                                                                                   |                                  UID of initial folder related items widget should have selected                                  |
|    currentPath     |  string  |                                                                                                                  null                                                                                                                   |                                            Current path related items is starting with                                            |
|     className      |  string  |                                                                                                                "upload"                                                                                                                 |                                           value for class attribute in the form element                                           |
|     paramName      |  string  |                                                                                                                 "file"                                                                                                                  |                                        value for name attribute in the file input element                                         |
|     ajaxUpload     | boolean  |                                                                                                                  true                                                                                                                   |          true or false for letting the widget upload the files via ajax. If false the form will act like a normal form.           |
|        wrap        | boolean  |                                                                                                                  false                                                                                                                  |                            true or false for wrapping this element using the value of wrapperTemplate.                            |
|  wrapperTemplate   |  string  |                                                                                                    '<div class="upload-container"/>'                                                                                                    |                                       HTML template for wrapping around with this element.                                        |
|   resultTemplate   |  string  |                                                                         '<div class="dz-notice"><p>Drop files here...</p></div><div class="upload-previews"/>'                                                                          |                                 HTML template for the element that will contain file information.                                 |
|  autoCleanResults  | boolean  |                                                                                                                  true                                                                                                                   |                  condition value for the file preview in div element to fadeout after file upload is completed.                   |
| previewsContainer  | selector |                                                                                                           ".upload-previews"                                                                                                            |                                           CSS selector for file preview in div element.                                           |
|     container      | selector |                                                                                                                   ""                                                                                                                    | CSS selector for where to put upload stuff into in case of form. If not provided it will be place before the first submit button. |
| allowPathSelection | boolean  |                                                                                                                                                                                                                                         |            Use relatedItems to set a different path from the current path. (true, if baseUrl and relativePath are set)            |
|    relatedItems    |  object  | { attributes: ["UID", "Title", "Description", "getURL", "portal_type", "path", "ModificationDate"], batchSize: 20, basePath: "/", vocabularyUrl: null, width: 500, maximumSelectionSize: 1, placeholder: "Search for item on site..." } |                          Related items pattern options. Will only be used if allowPathSelection is true.                          |

## Example

<div class="pat-upload" data-pat-upload='{"url": "/upload",
                                          "relatedItems": {
                                              "vocabularyUrl": "/relateditems-test.json"
                                          }}'>
  <div>
    <p>Something here that is useful</p>
    <p>Something else here that is useful</p>
    <p>Another thing here that is useful</p>
  </div>
</div>

```html
<div
    class="pat-upload"
    data-pat-upload='{"url": "/upload",
                                          "relatedItems": {
                                              "vocabularyUrl": "/relateditems-test.json"
                                          }}'
>
    <div>
        <p>Something here that is useful</p>
        <p>Something else here that is useful</p>
        <p>Another thing here that is useful</p>
    </div>
</div>
```
