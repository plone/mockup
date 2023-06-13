---
permalink: "pat/livesearch/"
title: Livesearch
---

# Livesearch pattern.

## Configuration

|   Option    |  Type   | Default |                                  Description                                  |
| :---------: | :-----: | :-----: | :---------------------------------------------------------------------------: |
|   ajaxUrl   | string  |         |                                JSON search url                                |
|   perPage   | integer |    7    |                               results per page                                |
| quietMillis | integer |   350   | how long to wait after type stops before sending out request in milliseconds. |

| minimumInputLength | integer | miniumum number of letters before doing search. | 3 |
| inputSelector | string | 'input[type="text"]' | css select to input element search is done with. |
| itemTemplate | | | override template used to render item results |

## Examples

### Example 1

<form action="search" class="pat-livesearch" data-pat-livesearch="ajaxUrl:livesearch.json">
  <input type="text" />
</form>

```html
<form
    action="search"
    class="pat-livesearch"
    data-pat-livesearch="ajaxUrl:livesearch.json"
>
    <input type="text" />
</form>
```
