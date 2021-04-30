---
permalink: "pat/markspeciallinks/"
title: MarkSpecialLinks
---

# MarkSpecialLinks pattern.

Scan all links in the container and mark external links with class if they point outside the site, or are special protocols.
Also implements new window opening for external links.
To disable this effect for links on a one-by-one-basis, give them a class of 'link-plain'

## Configuration

|             Option             |  Type   | Default |                     Description                     |
| :----------------------------: | :-----: | :-----: | :-------------------------------------------------: |
| external_links_open_new_window | Boolean |  false  |        Open external links in a new window.         |
|       mark_special_links       | Boolean |  false  | Marks external or special protocl links with class. |

## Examples

### Default external link example

<div class="pat-markspeciallinks">
  <ul>
    <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
    <li>Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.</li>
    <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
    <li>Plone uses <a href="/">Mockup</a>.</li>
  </ul>
</div>

```html
<div class="pat-markspeciallinks">
    <ul>
        <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
        <li>
            Plone is written in
            <a class="link-plain" href="http://www.python.org">Python</a>.
        </li>
        <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
        <li>Plone uses <a href="/">Mockup</a>.</li>
    </ul>
</div>
```

### Open external link in new window

<div class="pat-markspeciallinks" data-pat-markspeciallinks='{"external_links_open_new_window": "true"}'>
  <ul>
    <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
    <li>Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.</li>
    <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
    <li>Plone uses <a href="/">Mockup</a>.</li>
  </ul>
</div>

```html
<div
    class="pat-markspeciallinks"
    data-pat-markspeciallinks='{"external_links_open_new_window": "true"}'
>
    <ul>
        <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
        <li>
            Plone is written in
            <a class="link-plain" href="http://www.python.org">Python</a>.
        </li>
        <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
        <li>Plone uses <a href="/">Mockup</a>.</li>
    </ul>
</div>
```

### Open external link in new window, without icons

<div class="pat-markspeciallinks" data-pat-markspeciallinks='{"external_links_open_new_window": "true", "mark_special_links": "false"}'>
  <ul>
    <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
    <li>Plone is written in <a class="link-plain" href="http://www.python.org">Python</a>.</li>
    <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
    <li>Plone uses <a href="/">Mockup</a>.</li>
  </ul>
</div>

```html
<div
    class="pat-markspeciallinks"
    data-pat-markspeciallinks='{"external_links_open_new_window": "true", "mark_special_links": "false"}'
>
    <ul>
        <li>Find out What's new in <a href="http://www.plone.org">Plone</a>.</li>
        <li>
            Plone is written in
            <a class="link-plain" href="http://www.python.org">Python</a>.
        </li>
        <li>Plone builds on <a href="http://zope.org">Zope</a>.</li>
        <li>Plone uses <a href="/">Mockup</a>.</li>
    </ul>
</div>
```

### List of all protocol icons

<div class="pat-markspeciallinks">
    <ul>
      <li><a href="http://www.plone.org">http</a></li>
      <li><a href="https://www.plone.org">https</a></li>
      <li><a href="mailto:info@plone.org">mailto</a></li>
      <li><a href="ftp://www.plone.org">ftp</a></li>
      <li><a href="news://www.plone.org">news</a></li>
      <li><a href="irc://www.plone.org">irc</a></li>
      <li><a href="h323://www.plone.org">h323</a></li>
      <li><a href="sip://www.plone.org">sip</a></li>
      <li><a href="callto://www.plone.org">callto</a></li>
      <li><a href="feed://www.plone.org">feed</a></li>
      <li><a href="webcal://www.plone.org">webcal</a></li>
    </ul>
</div>

```html
<div class="pat-markspeciallinks">
    <ul>
        <li><a href="http://www.plone.org">http</a></li>
        <li><a href="https://www.plone.org">https</a></li>
        <li><a href="mailto:info@plone.org">mailto</a></li>
        <li><a href="ftp://www.plone.org">ftp</a></li>
        <li><a href="news://www.plone.org">news</a></li>
        <li><a href="irc://www.plone.org">irc</a></li>
        <li><a href="h323://www.plone.org">h323</a></li>
        <li><a href="sip://www.plone.org">sip</a></li>
        <li><a href="callto://www.plone.org">callto</a></li>
        <li><a href="feed://www.plone.org">feed</a></li>
        <li><a href="webcal://www.plone.org">webcal</a></li>
    </ul>
</div>
```
