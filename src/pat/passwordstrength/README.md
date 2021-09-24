---
permalink: "pat/passwordstrength/"
title: Password strength
---

# Password strength pattern.

## Configuration

| Option |  Type  | Default |                   Description                   |
| :----: | :----: | :-----: | :---------------------------------------------: |
| zxcvbn | string |  cdnjs  | Location to load zxcvbn from. Defaults to cdnjs |

## Examples

### Simple

<input type="password" class="pat-passwordstrength" />

```html
<input type="password" class="pat-passwordstrength" />
```

### Custom zxcvbn location

<input type="password"
       class="pat-passwordstrength"
       data-pat-passwordstrength="zxcvbn: //lowe.github.io/tryzxcvbn/zxcvbn.js"
       />

```html
<input
    type="password"
    class="pat-passwordstrength"
    data-pat-passwordstrength="zxcvbn: //lowe.github.io/tryzxcvbn/zxcvbn.js"
/>
```
