---
permalink: "pat/structure-updater/"
title: Structure Updater
---

# Structure updater pattern.

Update title and description based on the current folder contents location.

The Structure Updater pattern updates the information of the current context after a user navigated to a new folder.

## Configuration

|       Option        |  Type  | Default |                                   Description                                    |
| :-----------------: | :----: | :-----: | :------------------------------------------------------------------------------: |
|    titleSelector    | string |   ""    |          CSS selector to match title elements for the current context.           |
| descriptionSelector | string |   ""    | CSS selector to match description elements of the current context to be updated. |

## How to customize the Structure Updater pattern

The `mockup-pattern-structureupdater` updates the title and description on the page - if available - when a folder is changed in the structure pattern. It's triggered by the class `template-folder_contents`, which is available on the body tag when the folder contents page is opened. The pattern listens on the `context-info-loaded` event, which is triggered by the structure pattern.

Often you will have customized layouts, where you need to update also other parts of the site when the user changes to another folder.

### Pattern configuration

For simple cases, you can customize the CSS selector for the title and description via the options `titleSelector` and `descriptionSelector` for the pattern.
This can be done by adding options for that pattern via the resource registry control panel under the "Pattern options" tab or via the `registry.xml` profile like so:

  <record name="plone.patternoptions">
    <value purge="False">
      <element key="structureupdater">{"titleSelector": "h1.documentFirstHeading", "descriptionSelector": "footer"}</element>
    </value>
  </record>

> For the `titleSelector` and `descriptionSelector` you have to provide valid CSS selectors.
> Like with any CSS selector you can also specify mutliple selectors by seperating them via a comma sign.
