---
permalink: "pat/contentloader/"
title: Content loader
---

# Content loader pattern.

Load remote or local content into a target.

## Configuration

| Option  |  Type  | Default |                                                                            Description                                                                            |
| :-----: | :----: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| content | string |  null   | CSS selector for content, which is going to replace the target. Can be a local element already in the DOM tree or come from an AJAX call by using the url option. |
| target  | string |  null   |                           CSS selector of target element, which is being replaced. If it's empty, the pattern element will be replaced.                           |
| trigger | string | "click" |                                                                 Event to trigger content loading.                                                                 |
|   url   | string |  null   |                                            To load content from remote resource. Use 'el' to use with anchor tag href.                                            |

## Examples

### Example 1

<a href="#" class="pat-contentloader" data-pat-contentloader="content:#clexample1;target:#clexample1target;">Load content</a>

<div id="clexample1target">Original Content</div>
<div id="clexample1" style="display:none">Replaced Content</div>

### Example 2

<a href="#" class="pat-contentloader" data-pat-contentloader="url:/something.html;">Load content</a>
