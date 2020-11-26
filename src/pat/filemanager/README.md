---
permalink: "pat/filemanager/"
title: File Manager
---

# File Manager pattern

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| aceConfig | object | {} | ace configuration |
| actionUrl | string |  | base url to get/put data. Action is passed is an a parameters, ?action=(dataTree, newFile, deleteFile, getFile, saveFile) |
| uploadUrl | string |  | url to upload files to |
| resourceSearchUrl | string |  | url to search for resources to customize |

## Examples
### Simple file manager

```html
<div class="pat-filemanager"
    data-pat-filemanager="actionUrl:/filemanager-actions;
                            resourceSearchUrl:/search-resources;">
</div>
```

<div class="pat-filemanager"
    data-pat-filemanager="actionUrl:/filemanager-actions;
                            resourceSearchUrl:/search-resources;">
</div>

### Filemanager with upload

```html
<div class="pat-filemanager"
    data-pat-filemanager="actionUrl:/filemanager-actions;
                            uploadUrl:/upload;
                            resourceSearchUrl:/search-resources;">
</div>
```

<div class="pat-filemanager"
    data-pat-filemanager="actionUrl:/filemanager-actions;
                            uploadUrl:/upload;
                            resourceSearchUrl:/search-resources;">
</div>
