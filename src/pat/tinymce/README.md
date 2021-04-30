---
permalink: "pat/tinymce/"
title: tinyMCE
---

# tinyMCE pattern.

## Configuration

|       Option       |  Type   |                                                                                                                                                                                                   Default                                                                                                                                                                                                   |                                                                                          Description                                                                                           |
| :----------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ----------- | --------------------------------------------- | ------------------------------ | ----------------------------------------------------------- | ---- |
|    relatedItems    | object  |                                                                                   { attributes: ["UID", "Title", "Description", "getURL", "portal_type", "path", "ModificationDate"], batchSize: 20, basePath: "/", vocabularyUrl: null, width: 500, maximumSelectionSize: 1, placeholder: "Search for item on site..." }                                                                                   |                                                                                 Related items pattern options.                                                                                 |
|       upload       | object  |                                                                                                                                                                     { attributes: look at upload pattern for getting the options list }                                                                                                                                                                     |                                                                                    Upload pattern options.                                                                                     |
|        text        | object  | { insertBtn: "Insert", cancelBtn: "Cancel", insertHeading: "Insert link", title: "Title", internal: "Internal", external: "External", email: "Email", anchor: "Anchor", subject: "Subject" image: "Image", imageAlign: "Align", scale: "Size", alt: "Alternative Text", captionFromDescription: "Show Image Caption from Image Description", caption: "Image Caption", externalImage: "External Image URI"} |                                                                                      Translation strings                                                                                       |
|    imageScales     | string  |                                                                                                                                                                                                                                                                                                                                                                                                             |                                                        Image scale name/value object-array or JSON string for use in the image dialog.                                                         |
|     targetList     |  array  |                                                                                       [ {text: "Open in this window / frame", value: ""}, {text: "Open in new window", value: "_blank"}, {text: "Open in parent window / frame", value: "_parent"}, {text: "Open in top frame (replaces all frames)", value: "_top"}]                                                                                       |                                                                                              TODO                                                                                              |
|     imageTypes     | string  |                                                                                                                                                                                                   'Image'                                                                                                                                                                                                   |                                                                                              TODO                                                                                              |
|    folderTypes     | string  |                                                                                                                                                                                             'Folder,Plone Site'                                                                                                                                                                                             |                                                                                              TODO                                                                                              |
|        tiny        | object  |                                                                  { plugins: [ "advlist autolink lists charmap print preview anchor", "usearchreplace visualblocks code fullscreen autoresize", "insertdatetime media table contextmenu paste plonelink ploneimage" ], menubar: "edit table format tools view insert", toolbar: "undo redo                                                                   |                                                                                          styleselect                                                                                           | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | unlink plonelink ploneimage", autoresize_max_height: 1500 } | TODO |
|    prependToUrl    | string  |                                                                                                                                                                                                     ""                                                                                                                                                                                                      |                                                                          Text to prepend to generated internal urls.                                                                           |
|    appendToUrl     | string  |                                                                                                                                                                                                     ""                                                                                                                                                                                                      |                                                                           Text to append to generated internal urls.                                                                           |
| prependToScalePart | string  |                                                                                                                                                                                               "/imagescale/"                                                                                                                                                                                                |                                                                       Text to prepend to generated image scale url part.                                                                       |
| appendToScalePart  | string  |                                                                                                                                                                                                     ""                                                                                                                                                                                                      |                                                                       Text to append to generated image scale url part.                                                                        |
|   linkAttribute    | string  |                                                                                                                                                                                                   "path"                                                                                                                                                                                                    |                                                                          Ajax response data attribute to use for url.                                                                          |
|    defaultScale    | string  |                                                                                                                                                                                                 "Original"                                                                                                                                                                                                  |                                                                                   Scale name to default to.                                                                                    |
|       inline       | boolean |                                                                                                                                                                                                    false                                                                                                                                                                                                    | Show tinyMCE editor inline instead in an iframe. Use this on textarea inputs. If you want to use this pattern directly on a contenteditable, pass "inline: true" to the "tiny" options object. |

## Examples

### Default

<form>
 <textarea class="pat-tinymce"
     data-pat-tinymce='{"relatedItems": {
                           "vocabularyUrl": "/relateditems-test.json"
                           }}'></textarea>
</form>

```html
<form>
    <textarea
        class="pat-tinymce"
        data-pat-tinymce='{"relatedItems": {
                           "vocabularyUrl": "/relateditems-test.json"
                           }}'
    ></textarea>
</form>
```

### With dropzone

<form>
 <textarea class="pat-tinymce"
     data-pat-tinymce='{"relatedItems": {"vocabularyUrl": "/relateditems-test.json" },
                       "upload": {"baseUrl": "/", "relativePath": "upload"}
                       }'></textarea>
</form>

```html
<form>
    <textarea
        class="pat-tinymce"
        data-pat-tinymce='{"relatedItems": {"vocabularyUrl": "/relateditems-test.json" },
                       "upload": {"baseUrl": "/", "relativePath": "upload"}
                       }'
    ></textarea>
</form>
```

### Inline editing

<form>
 <textarea class="pat-tinymce" data-pat-tinymce='{"inline": true}'>
   <h3>I'm a content editable</h3>
   <p>Try to edit me!</p>
 </textarea>
</form>

```html
<form>
    <textarea class="pat-tinymce" data-pat-tinymce='{"inline": true}'>
   <h3>I'm a content editable</h3>
   <p>Try to edit me!</p>
 </textarea
    >
</form>
```
