---
permalink: "pat/tooltip/"
title: Tooltip
---

# Tooltip pattern.

You can use this inside Plone or on any static page. Please check below
for additional directions for non-Plone sites as there are some lines
of code you need to add to the header of your webpage.

For Plone:

- Make sure your viewing the page you want to add the tool tip too.
- Log in
- Create some text that you want to be the link that will reveal the
  tooltip.
- Select the view html button
- Find your text, and surround it with an HTML tag. Any normal tag works fine.
- It should look like:
  <span class="pat-tooltip" data-toggle="tooltip" title="Tooltip text">My link text</span>
- Choose Save


## Configuration

| Option | Type | Default | Description |
|:-:|:-:|:-:|:-:|
| enterEvent | string | "mouseenter" | Event used to trigger tooltip. |
| exitEvent | string | "mouseleave" | Event used to dismiss tooltip. |
| ajaxUrl | string | null | the ajax source of tooltip content. if null, tooltip displays content of title |
| contentSelector | string | null | selects a subset of content |
| class | string |  | add one or several (white space separated) class to tooltip, at the .tooltip.mockup-tooltip level |
| style | object |  | add css styles to tooltip, at the .tooltip.mockup-tooltip level |
| innerStyle | object |  | add css styles to tooltip, at the .tooltip-inner level |


## Example

<a href="#" data-toggle="tooltip" class="pat-tooltip"
      title="Setting the data-toggle and title makes this show up">
      Hover over this line to see a tooltip
</a>

```html
<a href="#" data-toggle="tooltip" class="pat-tooltip"
      title="Setting the data-toggle and title makes this show up">
      Hover over this line to see a tooltip
</a>
```

