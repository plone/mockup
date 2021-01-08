---
permalink: "pat/textareamimetypeselector/"
title: Textarea Mimetype Selector
---

# Textarea Mimetype Selector pattern.

This pattern displays a mimetype selection widget for textareas. It switches the widget according to the selected mimetype.

## widgets option Structure

Complex Object/JSON structure with MimeType/PatternConfig pairs.
The MimeType is a string like "text/html".
The PatternConfig is a object with a "pattern" and an optional "patternOptions" attribute.
The "pattern" attribute's value is a string with the patterns name and the "patternOptions" attribute is a object with whatever options the pattern needs.
For example, to use the TinyMCE pattern for the HTML mimetype, use "text/html": {"pattern": "tinymce"}

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| textareaName | string | "" | Value of name attribute of the textarea. |
| widgets | object  | {'text/html': {pattern: 'tinymce', patternOptions: {}}} | MimeType/PatternConfig pairs. |

## Examples

### Example 1

<div/>
```html
<div/>
```


### Mimetype selection on textarea including text/html mimetype with TinyMCE editor.

<textarea name="text">
 <h1>hello world</h1>
</textarea>
<select
   name="text.mimeType"
   class="pat-textareamimetypeselector"
   data-pat-textareamimetypeselector='{
     "textareaName": "text",
     "widgets": {
       "text/html": {
         "pattern": "tinymce",
         "patternOptions": {
           "tiny": {
             "plugins": [],
             "menubar": "edit format tools",
             "toolbar": " "
           }
         }
       }
     }
   }'
 >
 <option value="text/html">text/html</option>
 <option value="text/plain" selected="selected">text/plain</option>
</select>
```html
<textarea name="text">
 <h1>hello world</h1>
</textarea>
<select
   name="text.mimeType"
   class="pat-textareamimetypeselector"
   data-pat-textareamimetypeselector='{
     "textareaName": "text",
     "widgets": {
       "text/html": {
         "pattern": "tinymce",
         "patternOptions": {
           "tiny": {
             "plugins": [],
             "menubar": "edit format tools",
             "toolbar": " "
           }
         }
       }
     }
   }'
 >
 <option value="text/html">text/html</option>
 <option value="text/plain" selected="selected">text/plain</option>
</select>
```

### Mimetype selection on textarea with inline TinyMCE editor.

<textarea name="text2">
 <h1>hello world</h1>
</textarea>
<select
   name="text.mimeType"
   class="pat-textareamimetypeselector"
   data-pat-textareamimetypeselector='{
     "textareaName": "text2",
     "widgets": {
       "text/html": {
         "pattern": "tinymce",
         "patternOptions": {
           "inline": true,
           "tiny": {
             "plugins": [],
             "menubar": "edit format tools",
             "toolbar": " "
           }
         }
       }
     }
   }'
 >
 <option value="text/html">text/html</option>
 <option value="text/plain" selected="selected">text/plain</option>
</select>

```html
<textarea name="text2">
 <h1>hello world</h1>
</textarea>
<select
   name="text.mimeType"
   class="pat-textareamimetypeselector"
   data-pat-textareamimetypeselector='{
     "textareaName": "text2",
     "widgets": {
       "text/html": {
         "pattern": "tinymce",
         "patternOptions": {
           "inline": true,
           "tiny": {
             "plugins": [],
             "menubar": "edit format tools",
             "toolbar": " "
           }
         }
       }
     }
   }'
 >
 <option value="text/html">text/html</option>
 <option value="text/plain" selected="selected">text/plain</option>
</select>
```

