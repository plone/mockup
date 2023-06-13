---
permalink: "pat/structure/"
title: Structure
---

# Structure pattern.

## Configuration

|     Option      |  Type  | Default |               Description                |
| :-------------: | :----: | :-----: | :--------------------------------------: |
|  vocabularyUrl  | string |  null   |       Url to return query results        |
| indexOptionsUrl | string |  null   | Url to configure querystring widget with |
|     upload      | string |  null   |      upload configuration settings       |
|     moveUrl     | string |  null   |   For supporting drag drop reordering    |
| contextInfoUrl  | string |  null   |         For supporting add menu          |

## Example

<div class="pat-structure"
     data-pat-structure="vocabularyUrl:/relateditems-test.json;
                         uploadUrl:/upload;
                         moveUrl:/moveitem;
                         indexOptionsUrl:./test-querystringcriteria.json;
                         contextInfoUrl:{path}/context-info;"></div>

```html
<div
    class="pat-structure"
    data-pat-structure="vocabularyUrl:/relateditems-test.json;
                         uploadUrl:/upload;
                         moveUrl:/moveitem;
                         indexOptionsUrl:./test-querystringcriteria.json;
                         contextInfoUrl:{path}/context-info;"
></div>
```
