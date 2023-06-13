---
permalink: "pat/cookietrigger/"
title: Cookie Trigger
---

# Cookie Trigger pattern.

Show a DOM element if browser cookies are disabled.

## Example

If you do not see a message between the following START and END, you have cookies allowed and this pattern works.

START

<div class="portalMessage error pat-cookietrigger">
  Cookies are not enabled. You must enable cookies before you can log in.
</div>

END

```html
<div class="portalMessage error pat-cookietrigger">
    Cookies are not enabled. You must enable cookies before you can log in.
</div>
```
