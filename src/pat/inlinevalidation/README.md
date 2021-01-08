---
permalink: "pat/inlinevalidation/"
title: Inline Validation
---

# Inline Validation pattern.

## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| type | string |  | The type of form generating library. Either z3c.form, formlib or archetypes |


## Examples

### Example 1

<div class="pat-inlinevalidation" data-pat-upload='{"type": "z3c.form"}'>
  <input id="form-widgets-IDublinCore-title"
         name="form.widgets.IDublinCore.title"
         class="text-widget required textline-field"
         value="Welcome to Plone" type="text">
</div>

```html
<div class="pat-inlinevalidation" data-pat-upload='{"type": "z3c.form"}'>
  <input id="form-widgets-IDublinCore-title"
         name="form.widgets.IDublinCore.title"
         class="text-widget required textline-field"
         value="Welcome to Plone" type="text">
</div>
```
