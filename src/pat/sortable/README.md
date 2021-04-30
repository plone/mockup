---
permalink: "pat/sortable/"
title: Sortable
---

# Sortable pattern.

## Configuration

|   Option   |       Type       |     Default     |                                              Description                                              |
| :--------: | :--------------: | :-------------: | :---------------------------------------------------------------------------------------------------: |
|  selector  |      string      |      "li"       |                            Selector to use to draggable items in pattern.                             |
| dragClass  |      string      | "item-dragging" |                        Class to apply to original item that is being dragged.                         |
| cloneClass |      string      |   "dragging"    |                            Class to apply to cloned item that is dragged.                             |
|    drop    | function, string |       ""        | Callback function or name of callback function in global namespace to be called when item is dropped. |

## Examples

### Example 1

### Default

<style type="text/css" media="screen">
  .item-dragging { background-color: red; }
  .dragging { background: green; }
</style>
<ul class="pat-sortable">
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>

```html
<style type="text/css" media="screen">
    .item-dragging {
        background-color: red;
    }
    .dragging {
        background: green;
    }
</style>
<ul class="pat-sortable">
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
</ul>
```

### Table

The patttern needs to be defined on the direct parent element of the elements to be sorted.
Heads up: A <tbody> would be added to the table by browser automatically.
The pattern needs to be defined on the <tbody> then.

<table class="table table-stripped">
  <tbody class="pat-sortable" data-pat-sortable="selector:tr;">
    <tr>
      <td>One One</td>
      <td>One Two</td>
    </tr>
    <tr>
      <td>Two One</td>
      <td>Two Two</td>
    </tr>
    <tr>
      <td>Three One</td>
      <td>Three Two</td>
    </tr>
  </tbody>
</table>

```html
<table class="table table-stripped">
    <tbody class="pat-sortable" data-pat-sortable="selector:tr;">
        <tr>
            <td>One One</td>
            <td>One Two</td>
        </tr>
        <tr>
            <td>Two One</td>
            <td>Two Two</td>
        </tr>
        <tr>
            <td>Three One</td>
            <td>Three Two</td>
        </tr>
    </tbody>
</table>
```
