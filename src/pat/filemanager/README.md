---
permalink: "pat/filemanager/"
title: Filemanager
---

# Filemanager

A folder-contents management UI — a modern, Backbone-free reimplementation of
`pat-structure`, built on Svelte 5 runes and talking only to
[plone.restapi](https://6.docs.plone.org/plone.restapi/docs/index.html).

It renders a batched, sortable listing of a folder's contents — switchable
between a **table** view and a photo-organizing **grid** view — with selection,
clipboard (cut/copy/paste), delete, drag-and-drop ordering, drag-into-folder,
multi-upload (including dropping files directly onto a subfolder to upload into
it, or dropping a whole **folder** to recreate it — see *Folder drop* below),
in-app folder browsing (breadcrumbs), column configuration,
free-text/type filtering, advanced querystring filtering (build complex
`plone.app.querystring` criteria like pat-structure), and batch actions
(workflow, tags, properties, rename). The view choice is persisted per user in
a cookie.

## How it works

The pattern mounts a Svelte app onto its trigger element. State lives in
rune-based store classes (`.svelte.ts`) provided to components via
`setContext`. Everything is discovered through restapi — `@querystring-search`
(listing + server-side sort), `@querystring`, `@breadcrumbs`, `@types`,
`@vocabularies`, `@workflow`, `@copy`/`@move`, `@tus-upload` and content
`PATCH`/`DELETE` — so the pattern only needs a context URL and (ideally) the
portal URL to work. There are **no** custom Plone JSON views and **no**
add-content menu (adding content is out of scope).

The standard restapi calls (breadcrumbs, copy/move, delete, reorder, folder
create) go through the official **`@plone/client`** (aurora); the calls the
current alpha client can't yet express — the sorted/batched listing, workflow
transitions, rearrange / set-default-page, link integrity, and tus upload —
stay on the pattern's own minimal `fetch` layer. See
`docs/upstream-plone-client.md` for the upstream fixes that would let the rest
migrate.

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
| defaultView          | string  | "table"                            | Initial listing view: `"table"` or `"grid"`. Switchable at runtime; persisted per user in a cookie. |
| folderType           | string  | "Folder"                           | Portal type created for folders recreated from an OS folder drop (see *Folder drop* below).   |
| viewActionTypes      | array   | ["File", "Image"]                  | Portal types opened at `…/view` instead of the bare object URL (which would download/display the raw content). Mirrors the registry record `plone.types_use_view_action_in_listings`. |
| headerSelector       | string  | "#content > header"                | CSS selector of the page header (title / byline / description) kept in sync with the current folder while browsing (see *Context header sync* below). |

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

### Status indicators

The title cell (and grid card) shows small inline badges after the title,
derived from catalog metadata already returned by `@querystring-search` — no
extra request:

| Badge                  | Condition | Source field |
| ---------------------- | --------- | ------------ |
| Excluded from navigation | `exclude_from_nav` is set | `exclude_from_nav` |
| Before publishing date | `EffectiveDate` is set and in the future (inactive portal content) | `EffectiveDate` |
| Expired                | `ExpirationDate` is set and in the past | `ExpirationDate` |
| Working copy           | item is a `plone.app.iterate` working copy | `is_working_copy` |

The date checks live in `src/utils/format.ts` (`isIneffective` / `isExpired`)
and the badges render unconditionally regardless of which columns are active.

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

### Batch-action modal — `BatchActionModal.svelte` (native `<dialog>`)

- A single native `<dialog>` opened with `.showModal()`, so it **overlays** the
  listing on a dimmed `::backdrop` and the rest of the page is inert while open.
  It's labelled by the action title via `aria-label`.
- The toolbar's State / Tags / Properties / Rename buttons **toggle** it: clicking
  the open action closes the dialog, clicking another switches the form in place.
  Each button reflects its state with `aria-pressed`.
- The native dialog handles accessibility for us: it moves focus inside on open,
  **traps** `Tab` within the dialog, restores focus to the trigger on close, and
  closes on `Escape`. An `$effect` keyed on `modal.isOpen` calls
  `.showModal()` / `.close()`; the `cancel` event is blocked while a batch
  operation runs, and a backdrop click closes the dialog.
- Opening animates with a short CSS keyframe (`filemanager-modal-in`).

### Labels, live regions, and icons

- Checkboxes have contextual labels (*Select all on this page*, *Select
  {name}*); the empty actions header column is labelled *Actions*.
- Sortable column headers are real `<button>`s; sort direction is shown with
  ▲/▼.
- Status messages render in a `role="status"` + `aria-live="polite"` region, so
  operation results are announced; each has a *Dismiss message* button.
- Breadcrumbs use `<nav aria-label="Breadcrumbs">` + `<ol>`.
- The upload zone is a `role="region"` whose label announces the drop
  affordance; each in-progress upload exposes a labelled `<progress>`. While a
  file is dragged over the zone, a "drop files here to upload to this folder"
  strip appears below the listing as a `role="region"` so the current folder is
  always a reachable drop target — even when every row is a folder that would
  otherwise claim the drop.
- Column-config, type-filter and advanced-filter popovers are `role="group"`
  with labels; every query-builder control carries an `aria-label`.
- Decorative icons are `aria-hidden="true"`; thumbnails carry `alt` text.

### Views

The toolbar offers a **Table** / **Grid** switch (the choice persists in a
cookie). Both views share the same selection, drag (reorder + drag-into-folder),
clipboard, filtering, pagination, upload, and batch actions — the shared drag
logic lives in `ListInteractions`, driven by a [sortablejs](https://github.com/SortableJS/Sortable)
`use:` action (`utils/sortable.ts`), so each view only differs in the rendered
element. The grid is a photo-organizing view with larger
previews; column configuration is table-only and hidden in grid mode. The grid
is an ARIA `listbox` of `option` cards. Each card is a **single tab stop** — its
checkbox and title link are removed from the tab order (`tabindex="-1"`), so
**Tab** jumps from one card to the next, not into the controls within a card.
With a card focused, **Space** toggles its selection (a second press deselects;
Shift+Space extends a range) and **Enter** opens it (folders drill in-app, other
items navigate to the object).

### Row / card selection

Rows and grid cards can be selected by clicking, in addition to their checkboxes:

- **Click** selects just that item (replacing any existing selection).
- **Ctrl/Cmd+click** toggles an item in or out of the selection (multi-select).
- **Shift+click** selects the inclusive range from the last clicked item.
- **Space** (grid, card focused) toggles the focused card (second press
  deselects); **Shift+Space** extends a range; **Enter** opens it.

Clicks on an item's links, buttons, checkbox, or the row-action menu keep their
own behavior and never change the selection. The per-item and *Select all*
checkboxes remain the keyboard/accessible path; click-selection is a
mouse/pointer enhancement on top of them. Dragging an item that's part of a
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

The grid view has no per-item menu, so its keyboard reorder / move-to-top-bottom
and set-as-default-page paths are the table view's row menu — switch to the table
for those. Cut/copy/paste/delete and the batch actions (workflow, tags,
properties, rename) work identically in both views via the toolbar.

### Folder drop

Dropping a **folder** from the OS (onto the listing, a subfolder row, or the
"up to parent" card) recreates the folder structure in Plone and uploads every
file inside it, recursively. Because a deep folder can be a large, hard-to-undo
import, the drop is first **calculated and previewed**: a dialog shows the
folder count, file count, total size and the folder tree, and nothing is written
until you approve it (Cancel discards the drop entirely). Plain file drops are
unaffected — they upload immediately with no preview. The recreated containers
use the `folderType` option (default `"Folder"`). Folders are read via the
browser's `DataTransferItem.webkitGetAsEntry()` entries API; browsers without it
fall back to flat-file uploads.

### Context header sync

The page header above the listing — the title (`.documentFirstHeading`), the
byline (`#section-byline`) and the description (`.documentDescription`), all
rendered by Plone inside `#content > header` — is kept in sync with the folder
you browse into. On each in-app navigation the filemanager fetches the target
context's HTML and **transplants its `#content > header`** into the live page
(and updates the browser tab title). Because it reuses the server's own markup,
the byline (author, localized published/modified dates, expired flag, i18n)
comes through verbatim — no client-side reconstruction. The header node is
selected with the configurable `headerSelector` option (default
`"#content > header"`). This replaces the old `pat-structure` +
`structure-updater` event dance; the filemanager updates the header on its own.

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
