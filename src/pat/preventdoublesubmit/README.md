---
permalink: "pat/preventdoublesubmit/"
title: Prevent double submit
---

# Prevent double submit pattern.


## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| guardClassName | string | "submitting" | Class applied to submit button after it is clicked once. |
| optOutClassName | string | "allowMultiSubmit" | Class used to opt-out a submit button from double-submit prevention. |
| message | string | "You already clicked the submit button. Do you really want to submit this form again?" | Message to be displayed when "opt-out" submit button is clicked a second time. |


## Example

<form class="pat-preventdoublesubmit" onsubmit="javascript:return false;">
  <input type="text" value="submit this value please!" />
  <input class="btn btn-large btn-primary" type="submit" value="Single submit" />
  <input class="btn btn-large btn-primary allowMultiSubmit" type="submit" value="Multi submit" />
</form>

```html
<form class="pat-preventdoublesubmit" onsubmit="javascript:return false;">
  <input type="text" value="submit this value please!" />
  <input class="btn btn-large btn-primary" type="submit" value="Single submit" />
  <input class="btn btn-large btn-primary allowMultiSubmit" type="submit" value="Multi submit" />
</form>
```

