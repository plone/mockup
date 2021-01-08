---
permalink: "pat/thememapper/"
title: Theme Mapper
---

# Theme Mapper pattern.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| filemanagerConfig | object | {} | The file manager pattern config. |
| mockupUrl | string | null | Mockup URL. |
| unthemedUrl | string | null | Unthemed site URL. |
| helpUrl |  | string | null | Helper docs URL. |
| previewUrl | string | null | URL to preview theme. |

## Example

<div class="pat-thememapper"
     data-pat-thememapper='filemanagerConfig:{"actionUrl":"/filemanager-actions"};
                           mockupUrl:/tests/files/mapper.html;
                           unthemedUrl:/tests/files/mapper.html;
                           previewUrl:http://www.google.com;
                           helpUrl:http://docs.diazo.org/en/latest'></div>

```html
<div class="pat-thememapper"
     data-pat-thememapper='filemanagerConfig:{"actionUrl":"/filemanager-actions"};
                           mockupUrl:/tests/files/mapper.html;
                           unthemedUrl:/tests/files/mapper.html;
                           previewUrl:http://www.google.com;
                           helpUrl:http://docs.diazo.org/en/latest'></div>
```
