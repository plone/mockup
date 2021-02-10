---
permalink: "pat/toolbar/"
title: Toolbar
---

# Toolbar pattern.

## Example

```html
<div id="edit-zone">
    <div class="pat-toolbar" />
</div>
```

<div class="plone-toolbar-expanded plone-toolbar-top plone-toolbar-top-expanded">
<section id="edit-bar" role="toolbar">
  <div id="edit-zone">
    <div
      id="edit-zone"
      role="toolbar"
      class="pat-toolbar initialized"
      data-pat-toolbar='{"toolbar_width": "120px", "submenu_width": "180px", "desktop_width": "768px"}'
    >
      <div class="plone-toolbar-container">
        <a class="plone-toolbar-logo">
          <img
            alt="Plone Toolbar"
            src="http://0.0.0.0:8080/Plone/++plone++static/plone-toolbarlogo.svg"
          />
        </a>
        <nav>
          <ul class="plone-toolbar-main">
            <li id="contentview-folderContents" class="">
              <a
                href="http://0.0.0.0:8080/Plone/folder_contents?_authenticator=1fa07b7d8c690c03a11bc0271a1c744e905ee6b9"
                class=""
              >
                <span
                  class="icon-folderContents toolbar-menu-icon"
                  aria-hidden="true"
                >
                </span>
                <span>Contents</span>
              </a>
            </li>
            <li id="contentview-edit" class="">
              <a
                href="http://0.0.0.0:8080/Plone/front-page/edit?_authenticator=1fa07b7d8c690c03a11bc0271a1c744e905ee6b9"
                class=""
              >
                <span class="icon-edit toolbar-menu-icon" aria-hidden="true">
                </span>
                <span>Edit</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</section>
</div>
