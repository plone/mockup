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
| mark_special_links             | Boolean |  false  | Marks external or special protocl links with class. |

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
        <li><a href="https://plone.org">       https       </a>
        <li><a href="http://plone.org">        http        </a>
        <li><a href="ftp://plone.org">         ftp         </a>
        <li><a href="callto://plone.org">      callto      </a>
        <li><a href="bitcoin://plone.org">     bitcoin     </a>
        <li><a href="geo://plone.org">         geo         </a>
        <li><a href="im://plone.org">          im          </a>
        <li><a href="irc://plone.org">         irc         </a>
        <li><a href="ircs://plone.org">        ircs        </a>
        <li><a href="magnet://plone.org">      magnet      </a>
        <li><a href="mailto:info@plone.org">   mailto      </a>
        <li><a href="mms://plone.org">         mms         </a>
        <li><a href="news://plone.org">        news        </a>
        <li><a href="nntp://plone.org">        nntp        </a>
        <li><a href="openpgp4fpr://plone.org"> openpgp4fpr </a>
        <li><a href="sip://plone.org">         sip         </a>
        <li><a href="sms://plone.org">         sms         </a>
        <li><a href="smsto://plone.org">       smsto       </a>
        <li><a href="ssh://plone.org">         ssh         </a>
        <li><a href="tel://plone.org">         tel         </a>
        <li><a href="urn://plone.org">         urn         </a>
        <li><a href="webcal://plone.org">      webcal      </a>
        <li><a href="wtai://plone.org">        wtai        </a>
        <li><a href="xmpp://plone.org">        xmpp        </a>
    </ul>
</div>

```html
<div class="pat-markspeciallinks">
    <ul>
        <li><a href="https://plone.org">       https       </a>
        <li><a href="http://plone.org">        http        </a>
        <li><a href="ftp://plone.org">         ftp         </a>
        <li><a href="callto://plone.org">      callto      </a>
        <li><a href="bitcoin://plone.org">     bitcoin     </a>
        <li><a href="geo://plone.org">         geo         </a>
        <li><a href="im://plone.org">          im          </a>
        <li><a href="irc://plone.org">         irc         </a>
        <li><a href="ircs://plone.org">        ircs        </a>
        <li><a href="magnet://plone.org">      magnet      </a>
        <li><a href="mailto:info@plone.org">   mailto      </a>
        <li><a href="mms://plone.org">         mms         </a>
        <li><a href="news://plone.org">        news        </a>
        <li><a href="nntp://plone.org">        nntp        </a>
        <li><a href="openpgp4fpr://plone.org"> openpgp4fpr </a>
        <li><a href="sip://plone.org">         sip         </a>
        <li><a href="sms://plone.org">         sms         </a>
        <li><a href="smsto://plone.org">       smsto       </a>
        <li><a href="ssh://plone.org">         ssh         </a>
        <li><a href="tel://plone.org">         tel         </a>
        <li><a href="urn://plone.org">         urn         </a>
        <li><a href="webcal://plone.org">      webcal      </a>
        <li><a href="wtai://plone.org">        wtai        </a>
        <li><a href="xmpp://plone.org">        xmpp        </a>
    </ul>
</div>
```
