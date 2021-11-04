---
permalink: "pat/formautofocus/"
title: Formautofocus
---

# Formautofocus pattern.

## Configuration

|  Option   |  Type  |                     Default                     | Description |
| :-------: | :----: | :---------------------------------------------: | :---------: |
| condition | string |                   "div.error"                   |             |
|  target   | string | "div.error :input:not(.formTabs):visible:first" |             |
|  always   | string |      ":input:not(.formTabs):visible:first"      |             |

## Examples

### Example 1

<h4>Form without Autofocus</h4>
<form>
  <div class="error">
    <input type="text" placeholder="should not be focused" name="in_other_form_should_not_be_focused" />
  </div>
</form>
<h4>Form with Autofocus</h4>
<form class="pat-formautofocus">
  <div>
    <input type="text" placeholder="should not be focused" name="a_should_not_be_focused" class="formTabs" />
    <input type="text" placeholder="should not be focused" name="b_should_not_be_focused" />
  </div>
  <div class="error">
    <input type="text" placeholder="should not be focused" name="c_should_not_be_focused" class="formTabs" />
    <input type="text" name="d_should_be_focused" />
  </div>
</form>

```html
<h4>Form without Autofocus</h4>
<form>
  <div class="error">
    <input type="text" placeholder="should not be focused" name="in_other_form_should_not_be_focused" />
  </div>
</form>
<h4>Form with Autofocus</h4>
<form class="pat-formautofocus">
  <div>
    <input type="text" placeholder="should not be focused" name="a_should_not_be_focused" class="formTabs" />
    <input type="text" placeholder="should not be focused" name="b_should_not_be_focused" />
  </div>
  <div class="error">
    <input type="text" placeholder="should not be focused" name="c_should_not_be_focused" class="formTabs" />
    <input type="text" name="d_should_be_focused" />
  </div>
</form>
```
