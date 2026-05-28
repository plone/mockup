---
permalink: "pat/filemanager/"
title: Filemanager
---

# Filemanager

A folder-contents management UI — a modern, Backbone-free reimplementation of
`pat-structure`, built on Svelte 5 runes and talking only to
[plone.restapi](https://6.docs.plone.org/plone.restapi/docs/index.html).

It renders a batched, sortable table of a folder's contents with selection,
clipboard (cut/copy/paste), delete, drag-and-drop ordering, drag-into-folder,
multi-upload, in-app folder browsing (breadcrumbs), column configuration,
free-text/type filtering, and batch actions (workflow, tags, properties,
rename).

## How it works

The pattern mounts a Svelte app onto its trigger element. State lives in
rune-based store classes (`.svelte.ts`) provided to components via
`setContext`. Everything is discovered through restapi — `@querystring-search`
(listing + server-side sort), `@querystring`, `@breadcrumbs`, `@types`,
`@vocabularies`, `@workflow`, `@copy`/`@move`, `@tus-upload` and content
`PATCH`/`DELETE` — so the pattern only needs a context URL and (ideally) the
portal URL to work. There are **no** custom Plone JSON views and **no**
add-content menu (adding content is out of scope).

Sorting a column re-queries the server, so it orders the **whole** result set
before batching — not just the visible page (the core fix over the legacy
DataTables sort). Date columns sort on the catalog date index, so they sort as
real dates.

## Configuration

Options are passed as a JSON object in the `data-pat-filemanager` attribute,
using **camelCase** keys. All are optional except that a usable `contextUrl` is
required (it defaults to the current page URL with a trailing
`folder_contents` view stripped).

|        Option        |  Type   |              Default               |                                          Description                                          |
| :------------------: | :-----: | :--------------------------------: | :-------------------------------------------------------------------------------------------: |
| contextUrl           | string  | current page URL (folder)          | restapi URL of the folder to list. A trailing `/folder_contents` is stripped automatically.   |
| portalUrl            | string  | contextUrl                         | Portal root URL. Needed to derive portal-relative paths for the toolbar sync and breadcrumbs. |
| contextPath          | string  | pathname of contextUrl             | Portal-relative path of the context.                                                          |
| activeColumns        | array   | image, Title, review_state, ModificationDate | Column keys shown by default (see column keys below). Persisted per user in localStorage. |
| availableColumns     | array   | all column keys                    | Column keys offered in the column-configuration popover.                                      |
| portalTypes          | array   | [] (all types)                     | Restrict the listing to these `portal_type`s when no type filter is active.                   |
| searchIndex          | string  | "SearchableText"                   | Catalog index used by the free-text filter.                                                   |
| defaultBatchSize     | integer | 25                                 | Initial page size (`b_size`). Selectable at runtime: 10/25/50/100.                            |
| sortOn               | string  | "getObjPositionInParent"           | Initial sort index. Manual ordering (drag/move-top/bottom) is enabled only for this value.    |
| sortOrder            | string  | "ascending"                        | Initial sort order: `"ascending"` or `"descending"`.                                          |

### Column keys

`activeColumns` / `availableColumns` accept these keys:

| Key             | Label   | Type  | Sortable |
| --------------- | ------- | ----- | :------: |
| image           | Preview | image |    no    |
| Title           | Title   | title |   yes    |
| portal_type     | Type    | text  |   yes    |
| review_state    | State   | state |   yes    |
| ModificationDate| Modified| date  |   yes    |
| CreationDate    | Created | date  |   yes    |
| EffectiveDate   | Published | date|   yes    |
| ExpirationDate  | Expires | date  |   yes    |
| Subject         | Tags    | tags  |    no    |
| getObjSize      | Size    | text  |    no    |

## Accessibility & keyboard navigation

The pattern doesn't impose a custom grid-traversal model. The table is plain
semantic HTML (`<table>`/`<thead>`/`<th>`), so screen-reader semantics and the
native `Tab` order work out of the box: within each row you tab through the
select checkbox, the cell links, and the row-action menu. Focused ARIA widget
patterns are layered only where they're needed — the row-action menu and the
batch-action modal — and a shared `dismiss` action gives every popover the same
`Escape` / outside-click behavior.

### Popover dismissal — `src/utils/dismiss.ts`

A reusable Svelte action attached to the wrapper that holds both the toggle and
the popover (so clicking the toggle counts as "inside"):

- `Escape` closes the popover (and stops propagation so it doesn't reach outer
  handlers).
- A `pointerdown` outside the wrapper closes it.
- Listeners are bound on `document` only while the popover is open, so the many
  closed row menus (one per row) cost nothing.

Used by the row-action menu, the column-config popover, and the type-filter
popover.

### Row-action menu — `RowActionMenu.svelte` (ARIA menu pattern)

- Toggle button carries `aria-haspopup="true"`, `aria-expanded`, and a
  descriptive `aria-label` (*Actions for {title}*). The popover is `role="menu"`
  with `role="menuitem"` children.
- Opening the menu moves focus to the first **enabled** item.
- `↑` / `↓` rove focus (wrapping at the ends), `Home` / `End` jump to first /
  last. Disabled items (e.g. reorder actions when not in manual-order mode) are
  skipped.
- `Escape` or an outside click closes the menu and **returns focus to the
  toggle**, so keyboard users aren't dropped to the top of the page.

### Batch-action modal — `BatchActionModal.svelte` (dialog + focus trap)

- `role="dialog"` + `aria-modal="true"`, labelled by the action title.
- On open, focus moves to the first focusable control; on close it's restored to
  the element that opened the modal.
- `Tab` / `Shift+Tab` are trapped, cycling between the first and last focusable
  controls (disabled and hidden controls are excluded).
- `Escape` closes; the backdrop closes only when the backdrop itself is clicked
  (not its content), and the backdrop is `role="presentation"`.

### Labels, live regions, and icons

- Checkboxes have contextual labels (*Select all on this page*, *Select
  {name}*); the empty actions header column is labelled *Actions*.
- Sortable column headers are real `<button>`s; sort direction is shown with
  ▲/▼.
- Status messages render in a `role="status"` + `aria-live="polite"` region, so
  operation results are announced; each has a *Dismiss message* button.
- Breadcrumbs use `<nav aria-label="Breadcrumbs">` + `<ol>`.
- The upload zone is a `role="region"` whose label announces the drop
  affordance; each in-progress upload exposes a labelled `<progress>`.
- Column-config and type-filter popovers are `role="group"` with labels.
- Decorative icons are `aria-hidden="true"`; thumbnails carry `alt` text.

### Row selection

Rows can be selected by clicking, in addition to their checkboxes:

- **Click** selects just that row (replacing any existing selection).
- **Ctrl/Cmd+click** toggles a row in or out of the selection (multi-select).
- **Shift+click** selects the inclusive range from the last clicked row.

Clicks on a row's links, buttons, checkbox, or the row-action menu keep their
own behavior and never change the selection. The per-row and *Select all*
checkboxes remain the keyboard/accessible path; click-selection is a
mouse/pointer enhancement on top of them. Dragging a row that's part of a
multi-selection moves the **whole** selection (into a folder, via drop).

### Drag-and-drop keyboard alternatives

Drag interactions are mouse/pointer enhancements; each has a keyboard path:

- **Column reorder** — drag is mirrored by per-column *Move up* / *Move down*
  buttons (with *Move {name} up/down* labels) in the column-config popover.
- **Row reorder** — the row menu offers *Move up* / *Move down* (single step)
  plus *Move to top* / *Move to bottom*, all enabled only when `sortOn` is
  `getObjPositionInParent`. Single-step moves reorder within the visible page
  (the same scope as drag), so they're disabled at the first/last row of the
  page. Arbitrary cross-page placement still needs *Cut* → *Paste*.
- **Move into a folder** — *Cut* the row(s) → browse into the target folder →
  *Paste*.

All user-facing strings are routed through the patternslib i18n bridge
(`src/utils/i18n.ts`, `widgets` domain).

## Default

```html
<div
    class="pat-filemanager"
    data-pat-filemanager='{"contextUrl": "http://localhost:8080/Plone/folder", "portalUrl": "http://localhost:8080/Plone"}'
></div>
```

## Custom columns and initial sort

```html
<div
    class="pat-filemanager"
    data-pat-filemanager='{
        "contextUrl": "http://localhost:8080/Plone/folder",
        "portalUrl": "http://localhost:8080/Plone",
        "activeColumns": ["Title", "portal_type", "review_state", "EffectiveDate"],
        "sortOn": "sortable_title",
        "sortOrder": "ascending",
        "defaultBatchSize": 50
    }'
></div>
```

## Restrict to types

```html
<div
    class="pat-filemanager"
    data-pat-filemanager='{
        "contextUrl": "http://localhost:8080/Plone/folder",
        "portalUrl": "http://localhost:8080/Plone",
        "portalTypes": ["Document", "News Item"]
    }'
></div>
```

Note: this pattern compiles Svelte 5 components and runes-in-module
(`.svelte.ts`) stores — see the repo's `webpack.config.js` and `jest.config.js`
for the loader / transform setup.
