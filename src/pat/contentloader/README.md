---
permalink: "pat/contentloader/"
title: Content loader
---

# Content loader pattern.

## Options

content(string): CSS selector for content, which is going to replace the target. Can be a local element already in the DOM tree or come from an AJAX call by using the url option.
target(string): CSS selector of target element, which is being replaced. If it's empty, the pattern element will be replaced.
trigger(string): Event to trigger content loading. Defaults to "click"
url(string): To load content from remote resource. Use 'el' to use with anchor tag href.


## Example 1

<a href="#" class="pat-contentloader" data-pat-contentloader="content:#clexample1;target:#clexample1target;">Load content</a>
<div id="clexample1target">Original Content</div>
<div id="clexample1" style="display:none">Replaced Content</div>


## Example 2

<a href="#" class="pat-contentloader" data-pat-contentloader="url:something.html;">Load content</a>

