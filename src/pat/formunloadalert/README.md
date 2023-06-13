---
permalink: "pat/formunloadalert/"
title: Formunloadalert
---

# Formunloadalert pattern.

PATTERN description

## Configuration

|     Option     |  Type  |                                   Default                                   |                            Description                             |
| :------------: | :----: | :-------------------------------------------------------------------------: | :----------------------------------------------------------------: |
| changingEvents | string |                            "change keyup paste"                             |      Events on which to check for changes (space-separated).       |
| changingFields | string |                     "input,select,textarea,fileupload"                      |      Fields on which to check for changes (comma-separated).       |
|    message     | string | "Discard changes? If you click OK, any changes you have made will be lost." | Confirmation message to display when dirty form is being unloaded. |

## Examples

### Example 1

<form class="pat-formunloadalert" onsubmit="javascript:return false;">
  <input type="text" value="" />
  <select>
    <option value="1">value 1</option>
    <option value="2">value 2</option>
  </select>
  <input
    class="btn btn-large btn-primary"
    type="submit" value="Submit" />
  <br />
  <a href="/">Click here to go somewhere else</a>
</form>

```html
<form class="pat-formunloadalert" onsubmit="javascript:return false;">
    <input type="text" value="" />
    <select>
        <option value="1">value 1</option>
        <option value="2">value 2</option>
    </select>
    <input class="btn btn-large btn-primary" type="submit" value="Submit" />
    <br />
    <a href="/">Click here to go somewhere else</a>
</form>
```
