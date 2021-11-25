---
permalink: "pat/texteditor/"
title: Text Editor
---

# Text Editor pattern.

## Configuration

|     Option      |  Type   |          Default           |                          Description                          |
| :-------------: | :-----: | :------------------------: | :-----------------------------------------------------------: |
|      theme      | string  |            null            | Theme to use with editor. defaults to whatever it ships with. |
|      mode       | string  | What type of syntax is it? |                             text                              |
|      width      | integer |            500             |                     Width of the editor.                      |
|     height      | integer |            200             |                     Height of the editor.                     |
|     tabSize     | integer |             4              |                             TODO                              |
|    softTabs     | boolean |            true            |                     Use spaces for tabs.                      |
|    wrapMode     | boolean |           false            |                          Wrap text.                           |
|   showGutter    | boolean |            TODO            |                             true                              |
| showPrintMargin | boolean |     Show print margin.     |                             false                             |
|    readOnly     | boolean |     Read only editor.      |                             false                             |

## Examples

### Default
<pre class="pat-texteditor">
foobar
</pre>

```html
<pre class="pat-texteditor">
foobar
</pre>
```


