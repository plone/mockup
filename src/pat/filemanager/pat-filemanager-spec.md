# Spec: `pat-filemanager` — Svelte rewrite of pat-structure

A modern, Backbone-free reimplementation of the Plone mockup `pat-structure`
folder-contents management UI, built on Svelte 5 runes and talking only to
plone.restapi.

## Decisions (locked)

- **Pattern name:** `pat-filemanager` (trigger `.pat-filemanager`, dir `src/pat/filemanager/`)
- **State management:** runes in `.svelte.ts` store classes (`$state`/`$derived`), provided to components via `setContext`
- **Grid / drag & drop:** custom Svelte table + [sortablejs](https://github.com/SortableJS/Sortable) for the drag gesture (the same library pat-contentbrowser uses), wrapped in a small Svelte `use:` action; the decision logic (reorder vs move-into-folder vs move-into-parent) lives in the shared `ListInteractions` controller. sortablejs animates the reorder; external file-drop (upload) stays on native DOM events. See §21. _(Earlier iterations used hand-rolled native HTML5 DnD with `animate:flip`; replaced by sortablejs — §21.)_
- **API gaps (rename, recursive workflow, bulk PATCH):** pure restapi with client-side loops, **no backend additions**
- no scss, use pure css or bootstrap, which is present by default in plone
## 1. Goals & non-goals

- **Goal:** feature parity with `pat-structure` + the new features listed below, on Svelte 5 runes, talking only to plone.restapi.
- **Drop entirely:** Backbone, Backbone.PageableCollection, underscore, the `window._` / `window.Backbone` globals, DataTables, and all custom Plone JSON views (`/cut`, `/copy`, `/paste`, `/rename`, `/workflow`, `/tags`, `/properties`, `/rearrange`, `/moveitem`, `/setdefaultpage`, `context-info`, and the `vocabularyUrl` GET-with-`query`-param contract).
- **Loose coupling:** the pattern only needs a context path + portal URL; everything else is discovered through restapi (`@navigation` / `@breadcrumbs`, `@types`, `@querystring`, `@vocabularies`). No dependency on `plone.app.content` browser views.
- custom listing views: currently we have a table with flexible columns, in the future a grid view for managing images with bigger previews is planned. Also it could be interesting to implement a miller column view like the pat-contentbrowser has and later reuse this in pat-contentbrowser.
- enable browsing thru folders (including breadcrumbs) in pat-filemanager like pat-structure does.


## 2. Directory layout (`src/pat/filemanager/`)

Mirrors the `pat-contentbrowser` split, but state lives in rune classes (`.svelte.ts`):

```
src/pat/filemanager/
  filemanager.js            # BasePattern wrapper + Parser, mount() Svelte App
  filemanager.test.js       # jest registration + integration tests
  filemanager.css           # pure CSS (no SCSS), flat selectors
  README.md
  src/
    App.svelte              # root: reads props -> builds stores, renders layout
    api/
      client.ts             # thin restapi fetch wrapper (auth header, JSON, errors)
      contents.ts           # @querystring-search, batching, sort
      operations.ts         # copy/move/delete/workflow/patch/ordering/rename
      upload.ts             # @tus-upload (+ plain POST fallback)
      vocabularies.ts       # @vocabularies, @types, @querystring
    stores/
      ContentsStore.svelte.ts   # results, batch, sort, loading ($state/$derived)
      SelectionStore.svelte.ts  # selected UIDs (page vs all-in-query)
      ClipboardStore.svelte.ts  # cut/copy buffer (client-side clipboard)
      ColumnsStore.svelte.ts    # active/available cols, order, persistence
      ConfigStore.svelte.ts     # immutable config from props
    components/
      Toolbar.svelte          # batch-action buttons, upload, add menu
      Breadcrumbs.svelte
      ContentTable.svelte     # table shell, header, select-all, the row <tr>s
                              #   (checkbox, columns, row menu), DnD + animate:flip
      ColumnCell.svelte       # renders a value by column type (date/state/tags/image)
      RowActionMenu.svelte    # open/edit/cut/copy/paste/move-top/bottom/default-page
      Pagination.svelte       # batch size + page nav
      ColumnsConfig.svelte    # toggle + drag-reorder columns popover
      FilterBar.svelte        # text search + querystring criteria
      UploadZone.svelte       # multi-upload button + drag/drop to listing
      BatchActionModal.svelte # native <dialog> host for workflow/tags/properties/rename
      modals/
        WorkflowForm.svelte
        PropertiesForm.svelte
        TagsForm.svelte
        RenameForm.svelte
      StatusMessages.svelte
    utils/
      format.ts             # date formatting (real Date), size, i18n bridge
      dnd.ts                # native HTML5 drag/drop svelte actions
```

State management detail: each store is a class exposing `$state` fields and
`$derived` getters. `App.svelte` instantiates them and passes them via
`setContext` so deep components stay decoupled, while the state itself is
rune-based (no `svelte/store` writables).

## 3. restapi endpoint mapping (pure restapi, client-side loops)

| Legacy custom endpoint | New plone.restapi call |
|---|---|
| `vocabularyUrl` (GET `?query=&attributes=&batch=`) | `POST {context}/@querystring-search` with `{query, metadata_fields, b_start, b_size, sort_on, sort_order}` |
| filter widget config (`indexOptionsUrl`) | `GET @querystring` |
| `contextInfoUrl` (breadcrumbs) | `GET @breadcrumbs` (NOTE: no add-new menu — adding content is out of scope) |
| `/cut`, `/copy` | **client-side** clipboard (`ClipboardStore`): record `{op, sources:[path]}` |
| `/paste` | `POST {targetFolder}/@move` (cut) or `POST {targetFolder}/@copy` (copy), body `{source:[...]}` |
| `/delete` | `DELETE {item}` looped over selection |
| `/rename` | `POST {parent}/@move` with new `id` (rename = move-in-place); looped |
| `/workflow` (+recursive) | `POST {item}/@workflow/{transition}`; recursive = walk descendants via `@search` then loop |
| `/tags` | `PATCH {item}` `{Subject:[...]}`, looped |
| `/properties` (+recursive) | `PATCH {item}` `{effective, expires, rights, creators, contributors, exclude_from_nav, language}`, looped (recursive walks descendants) |
| `/rearrange` (sort folder) | `PATCH {folder}` `{"sort":{"on":"<index>","order":"ascending"|"descending"}}` — full resort in one call; per-item: `{ordering:{obj_id, delta}}` |
| `moveUrl` move top/bottom | `PATCH {folder}` `{ordering:{obj_id:<id>, delta:"top"|"bottom"}}` |
| `setDefaultPageUrl` | `PATCH {folder}` `{default_page:<id>}` |
| workflow states / languages vocab | `GET @vocabularies/{name}` |
| multi-upload | `@tus-upload` (resumable) with plain `POST {folder}` File/Image fallback |
| image preview | request `image_scales` in `metadata_fields`; render `{base}/@@images/{field}/{scale}` |

> **Verify in Phase 0** (not yet deep-checked against source): exact payload for
> `ordering` / `default_page` on content `PATCH`, and whether `@move` accepts a
> renaming `id`. If `@move`+id doesn't rename, rename falls back to looping but
> stays pure-restapi. No backend changes planned.

Confirmed locally available restapi services:
`querystringsearch`, `querystring`, `copymove`, `workflow`, `content`
(add/update/delete/tus), `vocabularies`, `types`, `breadcrumbs`, `navigation`,
`locking`.

## 4. Solving the stated pain points & new features

- **Sort across whole result, not current batch:** `@querystring-search` sorts in the catalog via `sort_on`/`sort_order` *before* batching with `b_start`/`b_size`, so a column-sort re-queries the server and orders the entire result set. This is the core fix vs DataTables-sorts-current-page.
- **Real date sort:** sort on the catalog date index (`effective`, `created`, `modified`, `expires`) — the catalog sorts dates as dates, not text.
- **Customizable batch size:** `b_size` bound to `ContentsStore`, persisted in a cookie (`utils/storage.ts` `cookieStorage`), the same way legacy pat-structure stored it.
- **Image column / preview:** new `image` column type rendering a thumbnail scale, driven by `image_scales` metadata.
- **Drag-into-folder:** native DnD action; a folder row/card splits into drop **zones** — dropping on its central band → `@move` selected sources into that folder; dropping on its edge bands reorders relative to it (see §17). The grid also renders an **"up to parent"** placeholder that accepts a drop to move the sources into the parent container (or upload files there).
- **Multi-upload via drag/drop onto listing:** `UploadZone` overlay on `ContentTable`; drop files → `@tus-upload` to the current folder. Dropping files **directly onto a subfolder** row/card uploads into that folder instead (the row claims the drop and the zone skips it).
- **Select "current batch" vs "all in query":** `SelectionStore` tracks a mode; "all" runs a UID-only `@querystring-search` sweep (paged loop, like the legacy `selectAll`).
- **Persistent reorder:** ordering PATCH against the catalog `getObjPositionInParent`. The rows reorder optimistically and animate into place with `animate:flip` (see §19).

## 5. Feature parity checklist (from pat-structure)

- [x] Batched listing on content
- [x] Customizable batch size
- [x] Drag / drop sorting (persistent, catalog-index based; flip-animated — §19)
- [x] Rearrange folder (full-sort by criterion via `OrderingMixin sort` PATCH — §24)
- [x] Visible columns configuration (toggle + reorder + persist)
- [x] Select items: current batch or all-in-query
- [x] Multi-upload button (P5 — `@tus-upload` + plain-POST fallback)
- [x] Batch actions: cut, copy, paste, delete (P3); rename, tagging (P4)
- [x] Workflow status (with optional recursive application) (P4)
- [x] Edit properties (with optional recursive): publication date, expiration date, copyright/rights, creators, contributors, exclude_from_nav, language (P4)
- [x] Search + querystring filter (free-text + portal_type + advanced query builder: arbitrary `plone.app.querystring` criteria via `QueryBuilder.svelte`, like pat-structure)
- [x] Image preview in item listing (P1 — `image` column type, `thumbnailUrl`)
- [x] Per-item actions: move to top, move to bottom, cut, copy, set as default page
- [x] Breadcrumbs (with in-app folder browsing; syncs the Plone toolbar — §15; no add-new menu — adding content is out of scope)
- [x] Status messages (P4)
- [x] use a cookie to store batch size and visible columns (§19)

New features:

- [x] Drag into folder (single or multiple selected items) (P5)
- [x] Multi-upload directly to listing via drag/drop (P5)
- [x] Drop a folder to recreate it + upload its contents, with preview/approval (§26)
- [x] Column visual (non-persistent) sort applied over whole result set (P1)
- [x] Date columns sort by real date (P1 — catalog date index)
- [x] New `image` column (P1)
- [x] Allow switching views for the listing (table, grid for organizing photos, later maybe pat-contentbrowser style) (P7 — see §20)

## 6. Pattern registration & build (no build-system changes needed)

- `filemanager.js`: `class extends BasePattern`, `static trigger = ".pat-filemanager"`, a `Parser("filemanager")` declaring args (`context-url`, `portal-url`, `active-columns`, `available-columns`, `default-batch-size`, `sort-on`, `sort-order`, `upload`, etc.), then `mount(App, {target, props:{...this.options}})` — exactly the contentbrowser shape (`src/pat/contentbrowser/contentbrowser.js:54-91`).
- Register the import in `src/patterns.js` (next to the contentbrowser line at `:23`).
- webpack already compiles `.svelte` (svelte-loader, runes on via `svelte.config.js`); the pattern's pure-CSS file is imported from the wrapper's `init()` (the base config rule `/\.(?:sass|scss|css)$/` handles it). Nothing to add to webpack / jest config.

## 7. Testing

- jest + the existing `src/setup-tests.js` for pattern registration (mirror `src/pat/contentbrowser/contentbrowser.test.js`): scan DOM, assert mount.
- Unit-test the rune store classes (`.svelte.ts`) and `api/*` modules with mocked `fetch` (jsdom).
- Real tests only — no ad-hoc verification scripts.
- Manual UI verification in the running dev server (do not auto-start it; request a start when needed).

## 8. Phasing (incremental, each phase shippable)

1. **P0 – API spike:** `api/client` + `contents`; confirm `@querystring-search` batching/sort and the ordering / default_page / move-rename payloads. **DONE — see section 9.**
2. **P1 – Read-only listing:** ConfigStore, ContentsStore, ContentTable/Row, Breadcrumbs, Pagination, server-side column sort, image column. Feature-flagged alongside pat-structure. **DONE — see section 11.**
3. **P2 – Columns + filter:** ColumnsConfig (toggle/reorder/persist), FilterBar (`@querystring`). **DONE — see section 12.**
4. **P3 – Selection + clipboard:** SelectionStore (page/all), cut/copy/paste, delete, move top/bottom, set-default-page, ordering DnD. **DONE — see section 13.**
5. **P4 – Batch modals:** workflow (+recursive), tags, properties (+recursive), rename. **DONE — see section 14.**
6. **P5 – Upload:** multi-upload button + drag/drop-to-listing via `@tus-upload`; drag-into-folder. **DONE — see section 17.**
7. **P6 – Polish:** i18n, a11y, docs (styling stays pure CSS — no scss port), parity audit against section 5. **DONE — see section 18.**
8. **P7 – Switchable views:** ViewStore + view switcher, extract shared selection/drag logic, add a grid view for organizing photos (table ⇄ grid; miller later). **DONE — see section 20.**

## 9. P0 spike results (verified against local plone.restapi source)

Source: `src/plone.restapi/src/plone/restapi/...`

### @querystring-search (`services/querystringsearch/get.py`)
- **Use POST**, body `{query:[criteria], sort_on, sort_order, b_start, b_size, limit, fullobjects, metadata_fields}`.
- `query` IS the plone.app.querystring criteria list (`[{i,o,v}]`), not wrapped in `{criteria}`.
- Defaults: `b_size=25`, `limit=1000`. Sorting runs in the querybuilder **before** batching → whole-result sort (fixes the legacy current-batch-only sort).
- `metadata_fields`: the summary serializer (`serializer/summary.py:106-110`) reads it from `request.form`, and **falls back to the JSON body on POST**. `"_all"` expands to all catalog columns (`catalog.schema()`), incl. `image_scales` when present. So POST delivers our columns.
- **GET wipes `request.form`** (`get.py:104`) → metadata_fields lost. Therefore always POST.
- The service auto-excludes the **context's own UID** from results → call it on the folder being listed.

### Ordering / rearrange (`deserializer/mixins.py` `OrderingMixin`)
- PATCH the **container**:
  - Move one item: `{"ordering":{"obj_id":"<id>", "delta":"top"|"bottom"|<int>, "subset_ids":[...]}}` — covers move-top, move-bottom, and relative DnD.
  - Full resort: `{"sort":{"on":"<index>", "order":"ascending"|"descending"}}` — covers the legacy `/rearrange` in one call.
- `subset_ids` (if passed) must match current server order or it raises `400 Client/server ordering mismatch`. For DnD in a filtered/batched view, send the visible ids in their current order.

### @copy / @move (`services/copymove/copymove.py`)
- POST to the **target container**: `{"source":[path|url|uid, ...]}`. Returns `[{source, target}]` with server-assigned `new_id`.
- `@move` does **not** accept a rename id → **rename is NOT covered by @move**. Rename strategy: verify a live instance for any `@rename`-style support; otherwise rename needs a small fallback (the one true gap besides default_page). Both stay within "no pat-structure-custom endpoints".

### default_page (gap)
- No dedicated deserializer; only settable if the container schema exposes a writable `default_page` field. **Verify on a live instance in P1**; set-default-page may need a fallback.

## 10. Toolchain note (blocks the runes-based stores in P1)

The repo has **no TypeScript toolchain**: no tsconfig, no ts-loader/ts-jest/@babel/preset-typescript, and webpack `resolve.extensions` is `.js/.json/.wasm/.svelte` only. Also, runes-in-module files (`.svelte.js` / `.svelte.ts`) are **not** matched by the current webpack svelte rule (`test:/\.svelte$/`) nor by jest (`svelte-jester` only matches `.svelte`). `pat-contentbrowser` avoids this by using `svelte/store` writables, not runes-in-modules.

**Consequence:** the chosen "runes in `.svelte.ts` store classes" requires, before P1 stores land:
1. A webpack rule running `svelte-loader` over `\.svelte\.(js|ts)$` (and adding those to `resolve.extensions`).
2. A matching jest transform for `\.svelte\.(js|ts)$`.
3. If full TS is wanted: add `typescript` + `svelte-preprocess` + `tsconfig.json` + jest TS transform. Otherwise use `.svelte.js` (runes, JSDoc types) and skip the TS deps.

P0 api modules need no runes, so they ship as plain `.js` (matching contentbrowser) and are unaffected.

### Toolchain — DONE (unblocks P1)

The runes/TS toolchain is now wired up. Key gotcha discovered: svelte-loader and
svelte-jester compile `.svelte.ts` module files with `svelte.compileModule`, which
does **not** strip TypeScript and does **not** run `preprocess` (preprocess only
touches `<script>` blocks, so it never sees a tag-less `.svelte.ts`). TS must
therefore be stripped by a babel pass *before* `compileModule`.

- **Deps added** (`pnpm add -D`): `typescript`, `@babel/preset-typescript`,
  `svelte-preprocess`. Also ran `pnpm install` — `node_modules` was stale (had
  svelte 4.2.19; lockfile correctly pins 5.55.7).
- **`tsconfig.json`** — ES2022, `moduleResolution: bundler`, `strict`,
  `verbatimModuleSyntax: true` (required by svelte-preprocess for `lang="ts"`),
  scoped to `src/pat/filemanager`.
- **`babel.config.js`** — wraps the Patternslib base and appends
  `@babel/preset-typescript` (extension-gated, so plain `.js` is untouched).
  Covers plain `.ts` in webpack and all `.ts`/`.test.ts` under babel-jest.
- **`svelte.config.js`** — adds `preprocess: sveltePreprocess()` (for svelte-jester
  component `lang="ts"`), keeps `compilerOptions.runes: true`.
- **`webpack.config.js`** — `.svelte` rule gains `preprocess: sveltePreprocess()`;
  new `.svelte.(js|ts)` rule chains `[svelte-loader, babel-loader(preset-typescript
  only)]` (babel strips TS first, then `compileModule` sees intact runes); new plain
  `.ts` rule (babel-loader, excludes `.svelte.ts`); `resolve.extensions` now
  `[".js", ".ts", ".json", ".wasm", ".svelte"]`.
- **`jest.config.js`** — transform order matters (Jest first-match): a custom
  `tools/jest-svelte-module.cjs` handles `.svelte.(js|ts)` (strip TS →
  `compileModule` → ESM→CJS via `@babel/plugin-transform-modules-commonjs`, since
  the suite runs CJS jest); `.svelte` → `svelte-jester` with `{ preprocess: true }`;
  `.ts` falls through to babel-jest.
- **Verified**: a runes `.svelte.ts` store + `.test.ts` pass under jest, and a real
  webpack build compiled a `.ts` entry + `.svelte` (`lang="ts"`) + `.svelte.ts`
  store. The 8 P0 `contents.test.js` tests still pass.

> Note: the project runs jest in CJS mode and the one existing component test
> (`contentbrowser.test.js`) is `it.skip` with a dynamic `import()` of `App.svelte`,
> so svelte-jester component compilation is currently never exercised at runtime.
> Store/api unit tests (the P1 focus) and webpack builds are fully covered; if
> component-level DOM tests are wanted later, jest must be switched to ESM mode
> (`--experimental-vm-modules`), since svelte-jester requires ESM for Svelte 5
> components.

### P0 deliverables (done)
- `src/pat/filemanager/src/api/client.js` — restapi fetch wrapper (JSON, same-origin creds, `RestapiError`).
- `src/pat/filemanager/src/api/contents.js` — `buildCriteria()` + `searchContents()` (POST `@querystring-search`).
- `src/pat/filemanager/src/api/contents.test.js` — 8 jest tests, all passing.

## 11. P1 deliverables (done)

Read-only batched listing with server-side column sort and image previews.

- `src/stores/ConfigStore.svelte.ts` — immutable config from props; `COLUMN_DEFS`
  (key → label/field/sortIndex/type), default active/available columns, url +
  contextPath normalization, `column(key)` lookup.
- `src/stores/ContentsStore.svelte.ts` — runes (`$state`) listing state: items,
  total, loading, error, bStart/bSize, sortOn/sortOrder; `load()`, `sortBy()`
  (toggles order, resets page), `goToPage()` (clamped), `setBatchSize()`;
  `$derived`-style getters `currentPage`/`pageCount`.
- `src/api/breadcrumbs.js` — `fetchBreadcrumbs()` (GET `@breadcrumbs`).
- `src/utils/format.ts` — `formatDate` (Intl), `formatSize`, `thumbnailUrl`
  (resolve scale url from `image_scales`).
- Components: `App.svelte` (builds stores, `setContext`, initial `load()` on
  mount), `Breadcrumbs.svelte`, `ContentTable.svelte` (sortable headers,
  loading/empty/error rows), `ContentRow.svelte`, `ColumnCell.svelte`
  (title/text/date/state/tags/image/size), `Pagination.svelte` (prev/next +
  batch-size select). All pass `svelte-autofixer`.
- `filemanager.js` — `BasePattern` + `Parser("filemanager")`, mounts `App`.
  `filemanager.css` (pure CSS). Registered in `src/patterns.js`.
- Tests: `filemanager.test.js` (registration + option parsing),
  `src/stores/ContentsStore.test.ts` (store + ConfigStore units). Full suite:
  20 passing, 1 skipped (component DOM mount — needs ESM jest, see §10).

### Parser gotcha (important for the data attribute contract)
The Patternslib parser camelCases hyphenated arg names and **groups** args that
share a hyphen prefix (`context-*`, `sort-*`, `portal-*`) into nested objects.
When the whole `data-pat-filemanager` value is a JSON object, supply **camelCase
keys** (`contextUrl`, `sortOn`, `activeColumns`, …). Arguments are therefore
declared with **no defaults** (and no `multiple` flag): a non-undefined parser
default — or the `[null]` a `multiple` arg injects — overwrites the supplied
value during the hyphenated→camelCase cleanup. Runtime defaults live in
`App.svelte` props instead.

> Not yet implemented (later phases): selection +
> clipboard + ordering DnD (P3), batch modals (P4), upload (P5). The select-all
> / per-row checkboxes render disabled as placeholders.

## 12. P2 deliverables (done)

Column configuration and filtering on top of the P1 read-only listing.

- `src/stores/ColumnsStore.svelte.ts` — runes (`$state`) store for the visible
  columns: `active` keys + `$derived`-style getters `inactive`/`columns`;
  `toggle()` (refuses to hide the last column), `move(key, delta)` (clamped
  reorder), `reset()`. Seeds from `ConfigStore.activeColumns`, persists to a
  cookie via `utils/storage.ts` `cookieStorage(storageKey)` (default key
  `pat-filemanager`), and `sanitize()`s restored keys (drops unknown/duplicate).
  `ContentTable` reads columns from this store, not `ConfigStore`.
- `src/api/querystring.js` — `fetchQuerystringConfig()` (GET `@querystring`,
  replacing the legacy `indexOptionsUrl`) + `typeOptions()` flattening
  `indexes.portal_type.values` into `{value,label}` pairs. Advanced-filter
  helpers: `enabledIndexes()` (grouped index list), `operatorsForIndex()`,
  `widgetFor()`, `selectionValues()`, `hasValue()`.
- `ContentsStore` filter state: `searchableText` + `selectedTypes` +
  `extraCriteria` (`$state`), wired into `buildCriteria` in `load()` (search
  text trimmed; falls back to `config.portalTypes` when no type selected;
  `extraCriteria` appended to the query). New `applyFilters()`,
  `clearFilters()`, `hasActiveFilters` (all aware of `extraCriteria`).
- Components: `FilterBar.svelte` (debounced 300ms free-text search + portal_type
  multiselect popover sourced from `@querystring` + an advanced-filter popover
  hosting `QueryBuilder.svelte` + Clear), `QueryBuilder.svelte` (native rows of
  index/operation/value mirroring pat-structure's jQuery QueryString widget;
  emits `plone.app.querystring` `{i,o,v}` criteria; widgets: String, Date,
  DateRange, RelativeDate, MultipleSelection, Reference/RelativePath as text),
  `ColumnsConfig.svelte`
  (popover: toggle checkboxes, ↑/↓ reorder buttons + native HTML5 drag-reorder,
  Reset). Wired into `App.svelte` via a `.filemanager-toolbar`; `ColumnsStore`
  provided through `setContext("columns", …)`. Both pass `svelte-autofixer`.
- Tests: `src/stores/ColumnsStore.test.ts` (9), `src/api/querystring.test.js` (5),
  `ContentsStore.test.ts` extended with filter cases. Full filemanager suite:
  37 passing, 1 skipped (component DOM mount — needs ESM jest, see §10).

> Manual UI verification (popover behaviour, drag-reorder, debounced search,
> persistence across reload) is pending in the running dev server.

## 13. P3 deliverables (done)

Selection, clipboard, delete, ordering and set-default-page on top of the P2
listing. All stock restapi (copymove / content delete / OrderingMixin /
default_page), no pat-structure custom endpoints.

- `src/api/operations.js` — `pasteItems()` (POST `@move`/`@copy` to target),
  `deleteItem()`/`deleteItems()` (looped DELETE), `moveItem()` (PATCH container
  `{ordering:{obj_id, delta, subset_ids?}}` — covers top/bottom and relative
  DnD), `setDefaultPage()` (PATCH `{default_page}`), `objId()` url→id helper.
- `src/stores/ClipboardStore.svelte.ts` — runes cut/copy buffer (`op`, `items`,
  `sources`/`count`/`isEmpty`, `cut`/`copy`/`clear`). Pure client-side; the
  legacy `/cut` `/copy` JSON views are gone.
- `src/stores/SelectionStore.svelte.ts` — runes selection keyed by UID;
  `toggle`, `setPage`, `allSelected`, `clear`, and `selectAllInQuery()` which
  drives a paged UID-only sweep (`ContentsStore.fetchAllMatching`) and flips
  `mode` to `"all"`. `toSelected()` derives `{uid,url,id,title,isFolderish}`.
- `ContentsStore` gained mutation methods that all reload the listing:
  `fetchAllMatching()` (paged sweep, big `limit`), `paste(op, sources)`,
  `removeItems(urls)` (steps back a page if the current one empties),
  `moveTo(id, delta, subsetIds?)`, `makeDefaultPage(id)`, plus `currentIds`
  (visible-page ids, used as `subset_ids` for DnD).
- Components: `Toolbar.svelte` (selection count, Cut/Copy/Paste/Delete with a
  confirm, Clear selection, "Select all N in query" banner), `RowActionMenu.svelte`
  (Open/Edit links + Cut/Copy/Move-top/Move-bottom/Set-default-page; reorder
  disabled unless sorting by `getObjPositionInParent`). `ContentTable.svelte`
  wires the select-all header checkbox and lifts native HTML5 drag-reorder state;
  `ContentRow.svelte` wires the per-row checkbox, `is-selected`/`is-cut`/`dragging`
  classes, draggable rows and the action menu. `App.svelte` instantiates
  `SelectionStore`/`ClipboardStore` and provides them via `setContext`. All new
  components pass `svelte-autofixer`.
- Tests: `src/api/operations.test.js` (12), `src/stores/ClipboardStore.test.ts`
  (5), `src/stores/SelectionStore.test.ts` (8), `ContentsStore.test.ts` extended
  with the mutation methods. Full filemanager suite: 64 passing, 1 skipped
  (component DOM mount — needs ESM jest, see §10). A dev webpack build compiles
  the full component tree.

> Manual UI verification (checkbox/select-all, paste, delete confirm,
> drag-reorder persistence, set-default-page, all-in-query sweep) is pending in
> the running dev server.

> Note on rename: §9 found `@move` does not accept a renaming `id`, so rename
> stays out of P3 and is handled with P4 batch modals (looped move-in-place or a
> verified `@rename`). `set-default-page` assumes the container schema exposes a
> writable `default_page`; verify on a live instance (still flagged in §9).

## 14. P4 deliverables (done)

Batch modals (workflow, tags, properties, rename) + status messages on top of
the P3 selection layer. All stock restapi (`@workflow`, content `PATCH`,
`@vocabularies`), no pat-structure custom JSON views. Field semantics mirror
Volto's `Contents*Modal` components (the canonical Plone frontend).

- `src/api/workflow.js` — `fetchWorkflow()` (GET `@workflow`), `transitionItem()`
  (POST `@workflow/{transition}` with `{comment, include_children, effective,
  expires}`), `fetchTransitions()` (union of available transitions across the
  selection, deduped by id). **Recursion is server-side**: `include_children:
  true` walks descendants in one call (transition.py `recurse_transition`) — no
  client-side `@search` sweep, unlike the original §3 plan.
- `src/api/vocabularies.js` — `fetchVocabulary()` (GET `@vocabularies/{name}`,
  `b_size=-1` unbatched → `[{token,title}]`). Used for the language field.
- `src/api/operations.js` — added `patchItem()` / `patchItems()` (looped PATCH).
- `src/api/contents.js` — added `buildSubtreeCriteria()` (path criterion with no
  `::depth`, so the catalog path index matches the whole subtree) for the
  recursive-properties descendant walk.
- `src/stores/ModalStore.svelte.ts` — which modal is open + a shared `busy`
  flag (close is blocked while a batch op runs).
- `src/stores/StatusStore.svelte.ts` — dismissible `{kind,text}` messages
  (replaces Plone portal status messages); `info/success/warning/error`.
- `ContentsStore` batch methods, each looping the api, reloading, and returning
  a `{ok, failed[]}` summary: `applyWorkflow()`, `applyTags()` (Volto semantics:
  `subjects = unique(existing − remove + add)`), `applyProperties()` (recurses
  into folderish items via `fetchDescendantUrls()`), `renameItems()`. Per-item
  errors are collected rather than aborting the batch.
- `SelectionStore` now carries each item's `subjects` (and the all-in-query
  sweep fetches `Subject`) so the tags modal can compute add/remove client-side.
- Components: `BatchActionModal.svelte` (generic dialog host, backdrop /
  Escape close, switches on `modal.active`), `modals/WorkflowForm.svelte`,
  `modals/TagsForm.svelte`, `modals/PropertiesForm.svelte`,
  `modals/RenameForm.svelte`, `StatusMessages.svelte`. `utils/batch.ts`
  (`reportBatch`) turns a `{ok,failed}` summary into status lines. `Toolbar`
  gained State/Tags/Properties/Rename buttons; `App.svelte` provides the two new
  stores and renders `StatusMessages` + `BatchActionModal`. All pass
  `svelte-autofixer`.
- Tests: `src/api/workflow.test.js` (5), `src/api/vocabularies.test.js` (2),
  `operations.test.js` extended (patchItem/patchItems), `StatusStore.test.ts`
  (3), `ContentsStore.test.ts` extended (apply*/rename, incl. recursion +
  failure capture), `SelectionStore.test.ts` updated for `subjects`. Full
  filemanager suite: 83 passing, 1 skipped (component DOM mount — needs ESM
  jest, see §10). A dev webpack build compiles the full component tree.

> Manual UI verification (transition dropdown population, recursive workflow,
> tag add/remove, properties recursion, rename round-trip, status messages,
> Escape/backdrop close) is pending in the running dev server.

### Rename: how Volto does it, and why it is the weak spot of P4

§9 established there is **no** rename path in this stack: `@move`/`@copy` ignore
any id (copymove.py assigns the source id, collision-handled), the content
`PATCH` deserializer (dxcontent.py) only writes schema fields / ordering /
layout, and there is no `@rename` service in plone.restapi 10.0.0. We therefore
mirror **Volto's** approach (`ContentsRenameModal.jsx`): a per-item `PATCH {item}`
with `{id, title}`. `title` is a stock Dublin Core field and always works; the
`id` (short name) is the contentious part.

**Strong downside (multi-item rename via the Volto/PATCH-id approach):**

1. **Silent partial success.** As verified above, no installed package honours a
   PATCH `id` as a rename. Against this backend the `title` change succeeds while
   the `id` is silently ignored — the user is told "Renamed N items" but the URL
   never changed. There is no error to surface because the field is simply not in
   any schema. This is the most dangerous failure mode: it looks like it worked.
2. **Non-atomic, no rollback.** Renames are N independent PATCHes. A failure
   half-way (lock, permission, id collision) leaves the batch partially applied
   with no transactional boundary.
3. **No collision-safe ordering.** Sequential per-item renames cannot express a
   swap (a→b, b→a) or a shift (1→2, 2→3) without an intermediate-name dance;
   done naively they collide or clobber depending on iteration order.
4. **N round-trips.** One request and one transaction per item — slow for large
   selections and multiplies the partial-failure surface.

**Recommendation — fix this in plone.restapi, not in the pattern.** Add a
first-class, transactional rename to the backend and have the pattern call it:

- Add a dedicated **`@rename` service** (POST to the container) accepting a batch:
  `{ "items": [ {"source": <path|uid|url>, "new_id": "...", "new_title": "..."} ] }`.
  Implement it over `manage_renameObjects` inside a single transaction, ordering
  the renames collision-safely (rename through temporary ids when the target set
  intersects the current set, so swaps/shifts succeed). Return per-item
  `{source, target, new_id}` like `@copy`/`@move`, and surface real per-item
  errors (id-in-use, locked, unauthorized) instead of a silent no-op.
- Alternatively, extend the **content `PATCH` deserializer** to treat a top-level
  `id` as an explicit rename (validate, then `manage_renameObject`) so Volto's
  existing `{id, title}` PATCH actually renames — but this stays one-item,
  non-batch, and still non-atomic across a multi-select, so the dedicated
  `@rename` batch endpoint is preferred.
- Until either lands, treat short-name rename as **best-effort / verify on the
  live instance**: the P4 `RenameForm` will correctly update titles everywhere;
  the id change depends entirely on backend support. Consider hiding/disabling
  the short-name field (title-only rename) on deployments where `@rename` /
  PATCH-`id` is absent, to avoid the silent-no-op trap in (1).

This is the one P4 feature whose correctness is **not** guaranteed by the current
"pure restapi, no backend additions" lock; it is the strongest argument in the
whole pattern for a small, well-scoped plone.restapi addition.

## 15. Plone toolbar sync on in-app navigation (done)

In-app folder browsing (breadcrumb clicks + drilling into a folderish row) repoints
the listing without a page load, so the server-rendered **Plone toolbar** (edit
actions, workflow menu, add menu) would otherwise stay stuck on the original
context. pat-structure solves this by firing a jQuery event the toolbar listens
for; pat-filemanager now mirrors it exactly.

- **Emitter:** `ContentsStore.navigateTo()` — the single chokepoint for context
  changes (called from `Breadcrumbs.svelte` and `ColumnCell.svelte`) — fires
  `jQuery("body").trigger("structure-url-changed", [path])`, where `path` is the
  **portal-root-relative** path (strip `config.portalUrl` from the new context url,
  fall back to the url pathname).
- **Consumer (unchanged):** `src/pat/toolbar/toolbar.js:26` already listens on
  `body` for `structure-url-changed` and re-renders via
  `{data-portal-url}{path}/@@render-toolbar`. Same event name and `[path]` arg
  shape pat-structure emits (`structure/js/views/app.js:189,227`), so no toolbar
  change was needed.
- **Gotcha:** the store is a `.svelte.ts` runes module where `$` is reserved, so
  jQuery is imported as `jQuery`, not `$`.
- **Config dependency:** correct relative paths require `portal-url` to be passed
  to the pattern (parser arg / `ConfigStore.portalUrl`). When omitted it falls back
  to the initial context url, which only mis-derives paths when navigating *above*
  the start folder.
- **Test:** `ContentsStore.test.ts` asserts `navigateTo` fires `structure-url-changed`
  once with the portal-relative path. Full store suite green (27 in that file).
- **Scroll-to-top on context change:** `App.svelte` runs an `$effect` watching
  `contents.contextUrl`; when it changes (any `navigateTo` — breadcrumb, drill-in,
  or "up to parent") it `scrollIntoView`s the app root, so a deep scroll position
  from the previous listing doesn't leave the new folder's contents off-screen.
  Skipped on the initial render (a guard against the seed value).

## 16. What's left to implement

Everything through P7 is done: P5 deliverables in §17, P6 in §18, the toolbar
sync (§15), the post-P6 follow-ups (cookie persistence + reorder animations,
§19), **P7 – switchable views** (§20), the rearrange feature (§24), and the
link-integrity warning on delete (§25). All §5 parity + new-feature items are
ticked; the remaining work is live-instance / dev-server verification only.

**Carried-over verifications (pending a live instance, not code work).**
- `default_page` PATCH actually sets the container default page (§9/§13 flag).
- Short-name **rename** is a known weak spot — title-only is safe; `id` change is a
  silent no-op against current backends. Needs a plone.restapi `@rename` (§14).
- Manual UI verification of P2–P5 interactions and the §15 toolbar re-render, all
  pending in the running dev server.

## 17. P5 deliverables (done)

Multi-upload (button + drag/drop) and drag-into-folder on top of the P4 layer.
All stock restapi (`@tus-upload`, content POST, `@move`), no pat-structure
custom views.

- `src/api/upload.js` — `uploadFileTus()` (POST `@tus-upload` to open the upload,
  then chunked PATCH of `application/offset+octet-stream` bytes until the server
  reports the full `Upload-Length`; reads the new object url from the final PATCH
  `Location`), `uploadFilePost()` (fallback: single JSON POST with a base64
  primary field — `image` for `image/*` → `Image`, else `file` → `File`),
  `uploadFile()` (tus first, POST fallback on any tus error — a failed tus attempt
  creates no content, so the fallback is safe). Uses global `fetch` directly for
  tus (binary body + response-header reads the `request` wrapper can't do).
  `Upload-Metadata` is `key b64(value)` comma-joined, base64 over UTF-8 bytes.
- `src/stores/UploadStore.svelte.ts` — runes store: per-file `entries`
  (name/size/loaded/status), `active` flag, `progress` getter; `uploadFiles()`
  uploads sequentially to `contents.contextUrl`, updates progress via the
  `onProgress` callback, reloads the listing, and returns `{ok, failed[]}`.
  `clearFinished()`/`clear()`.
- `src/api/operations.js` (reused) + `ContentsStore.moveIntoFolder(targetUrl,
  sources)` — `@move` (cut semantics) the dragged sources into a folder, then
  reload.
- `src/utils/batch.ts` — added `reportUpload()` (success/failure status lines).
- Components: `UploadZone.svelte` wraps `ContentTable` (via a `children` snippet),
  handles external file drag/drop with a dragenter/leave depth counter (so the
  overlay only drops when leaving the zone), shows a "Drop files to upload"
  overlay + a live progress panel. `Toolbar.svelte` gained an **Upload** button
  driving a hidden `<input type="file" multiple>`. `App.svelte` instantiates
  `UploadStore`, provides it via `setContext`, and renders `<UploadZone>` around
  the table.
- **Drag-into-folder vs reorder coexistence** (`ContentTable`/`ContentGrid`): rows
  are always `draggable`. `dragIndex >= 0` marks an internal drag in progress.
  `ListInteractions` routes both kinds of drag through one set of row handlers
  (`onRowDragEnter`/`onRowDragOver`/`onRowDrop`): while an internal drag is active
  they drive reorder/move-into-folder; otherwise they handle **external file**
  drags. **Folder rows offer two drops via zones** (`isIntoZone` reads the
  dragover pointer position against the row/card rect — the central `INTO_BAND`
  fraction 0.3–0.7 along the **y** axis for the stacked table rows, the **x** axis
  for the side-by-side grid cards): the central band → `moveIntoFolder` (the whole
  selection if the dragged row is part of a multi-selection, else just that row) +
  clear selection; the edge bands → reorder, exactly like a non-folder row.
  Non-folder rows always reorder. Reorder only runs when
  `sortOn === getObjPositionInParent`. Two guards matter: the move-into decision
  keys off the dragged item's **id** (not `dragIndex`, which the edge-band reorder
  preview sets to the hovered index — so crossing the edge on the way in must not
  veto the centre); and `onDrop` decides the gesture from `dropIndex` (set only in
  the central band), not from which row the pointer happens to be over at release,
  so an edge-band drop between folders commits the reorder. Entering the central
  band snaps any live reorder preview back (`revertPreview`) so the listing rests
  behind the green move-into highlight. Folder/target highlight uses a
  `drop-target` class.
- **Move into the parent folder** (`ContentGrid` "up to parent" placeholder):
  when the current folder is below the portal root (`contents.canGoUp` /
  `parentUrl`), the grid renders a placeholder card whose
  `onParentDragEnter`/`onParentDragOver`/`onParentDragLeave`/`onParentDrop`
  handlers accept an internal drag (→ `moveIntoFolder(parentUrl, sources)` after a
  confirm) or an external file drag (→ upload into the parent). Its highlight
  (`parentDrop`) is re-affirmed on every `onParentDragOver`, because a `dragleave`
  fires whenever the pointer crosses onto the placeholder's child elements and
  would otherwise clear it. A plain click on the placeholder browses up.
- **File drop into a subfolder:** dragging external **files** over a folderish
  row claims the drop (`onRowDragOver` `preventDefault`s and sets `fileDropIndex`,
  highlighted with the same `drop-target` class); `onFileDrop` then
  `upload.uploadFiles(files, folder["@id"])` into that subfolder. It only
  `preventDefault`s — no `stopPropagation` — so the drop still bubbles to
  `UploadZone`, which checks `event.defaultPrevented` and uploads to the *current*
  folder only when no subfolder claimed it. Files dropped anywhere else fall
  through to `UploadZone` as before. The zone hides its "Drop files to upload"
  overlay while `fileDropIndex >= 0` so the subfolder highlight reads cleanly.
- Tests: `src/api/upload.test.js` (6 — tus open/patch/return, create-failure,
  missing-Location, POST File/Image fallback, tus→POST fallback;
  jsdom needs a `TextEncoder` polyfill from `util`), `src/stores/UploadStore.test.ts`
  (5 — sequential upload + reload, per-file failure capture, progress tracking,
  empty list, clearFinished), `ContentsStore.test.ts` extended with
  `moveIntoFolder`. Full filemanager suite: 97 passing, 1 skipped (component DOM
  mount — needs ESM jest, see §10). A dev webpack build compiles the full
  component tree.

> Manual UI verification (button upload, drag files onto the listing, progress
> panel, drag a row / multi-selection into a folder, tus vs POST-fallback on a
> live instance) is pending in the running dev server.

## 18. P6 deliverables (done)

Polish on top of the full P5 feature set. No behaviour change to the restapi
layer; the work is i18n, accessibility, docs, and a styling decision.

- **Styling — pure CSS (decision).** The earlier plan called for an SCSS port;
  the user decided on 2026-05-27 to keep `filemanager.css` as flat pure CSS. No
  `.scss`. The wrapper still imports `./filemanager.css` from `init()`.
- **i18n bridge.** New `src/utils/i18n.ts` exports `_t(msgid, keywords?)`,
  wrapping `core/i18n-wrapper` (the `widgets` domain, same catalog pat-structure
  uses; `${name}` placeholder interpolation). Every user-facing string in the
  components, the confirm/alert text, and the status-message templates in
  `utils/batch.ts` now go through `_t`. `reportBatch` signature changed: it now
  takes full translatable templates (`"Renamed ${count} items."`,
  `"Could not rename ${count} items: ${details}"`) instead of verb fragments, so
  the four modal callers were updated. (Note: the spec's earlier "format.ts is
  the i18n bridge point" was superseded by a dedicated `i18n.ts`.)
- **Accessibility.**
  - New reusable Svelte action `src/utils/dismiss.ts` (`use:dismiss={{enabled,
    onClose}}`): closes a popover on `Escape` or outside pointerdown, attached to
    the wrapper that holds both toggle and popover; listeners are bound only
    while open (cheap for the many per-row menus). Wired into `RowActionMenu`,
    `ColumnsConfig`, and the `FilterBar` type-filter.
  - `RowActionMenu` honours `role="menu"`: opens with focus on the first item,
    `↑`/`↓`/`Home`/`End` roving focus, `tabindex="-1"` on the menu container, and
    Escape/outside-dismiss returns focus to the toggle.
  - `BatchActionModal` got a focus trap (`Tab`/`Shift+Tab` cycle within the
    dialog), initial focus on open, and focus restoration to the trigger on
    close, via an `$effect` keyed on `modal.isOpen` (Escape/backdrop close were
    already present). (Superseded by the native `<dialog>` in §21.)
  - Keyboard alternatives to drag exist already and are documented: reorder via
    *Move to top/bottom*, move-into-folder via *Cut* → browse in → *Paste*.
- **README.** `src/pat/filemanager/README.md` — purpose, how-it-works, full
  options table (camelCase keys, defaults), column-key table, accessibility
  notes, and `data-pat-filemanager` usage examples. Follows the contentbrowser
  README front-matter convention.
- **Validation.** All touched components pass `svelte-autofixer` with no issues.
  Full filemanager jest suite still 97 passing, 1 skipped. `filemanager.css`
  unchanged in content (SCSS experiment reverted).

> Parity audit against §5 and manual UI verification (i18n catalog rendering,
> popover dismiss, modal focus trap, menu arrow-keys) remain pending on a live
> instance / running dev server — not code work.

## 19. Post-P6: cookie persistence + reorder animations (done)

Two follow-up changes after the P6 parity work. No new restapi calls.

- **Cookie persistence (replaces localStorage).** `src/utils/storage.ts`
  (`cookieStorage(prefix)` → a `KeyValueStore` of `get`/`set` over `js-cookie`,
  JSON-encoded, path `/`) now backs both the visible-column config
  (`ColumnsStore`) and the listing batch size (`ContentsStore`, key `batchSize`,
  restored in the constructor when a positive number is stored). This matches how
  legacy pat-structure persisted these, surviving reloads via a cookie rather than
  the patternslib `store.local` (localStorage) used during P2. `js-cookie.d.ts`
  is a local ambient type for the dependency.

- **Flip-animated reordering.** Drag-reordering the listing rows and the
  column-config list now animates with Svelte's built-in `animate:flip`
  (`svelte/animate`) — no library. Two constraints shaped the implementation:
  - `animate:flip` must sit on an element that is the **immediate child of a
    keyed `{#each}`**, and it is invalid on a component. `ContentRow.svelte` was
    therefore **removed** and its `<tr>` (checkbox, columns, row menu, drag
    handlers, `is-selected`/`is-cut`/`dragging`/`drop-target` classes) inlined
    into `ContentTable.svelte`'s keyed each, where the drag state already lived.
    This also dropped the `onDragStart`/`onDragEnter`/`onDragEnd`/`onDrop`
    prop-drilling. `ColumnsConfig.svelte`'s `<li>` (already a direct each child)
    got `animate:flip` directly.
  - The reorder used to `await this.load()`, which set `loading = true` and
    swapped the listing for the "Loading…" placeholder — tearing down the keyed
    rows, so flip never saw a *reorder* to animate. `ContentsStore.moveTo` now
    **reorders `items` optimistically** (`reorderLocally`, mirroring the server's
    `delta`/`top`/`bottom` semantics) so the rows flip immediately, then PATCHes
    and reconciles with a **silent reload** (`load({ silent: true })` skips the
    `loading` toggle, leaving the keyed rows mounted). On PATCH failure it does a
    full `load()` to restore server truth and rethrows. `load()` gained the
    `{ silent }` option; `objIdOf()` was factored out (shared by `currentIds` and
    `reorderLocally`).
  - Caveat: `move top`/`move bottom` from the row menu pass no `subset_ids`, so on
    a multi-page listing the optimistic move only reorders within the visible
    page; the silent reload then corrects it to the true folder-wide position. The
    row-drag reorder (relative, with `subset_ids`) is exact.

- Tests: `ContentsStore.test.ts` extended with optimistic-reorder, silent-reconcile
  (no `loading` toggle), and failure-rollback cases; `ColumnsStore.test.ts` moved
  to cookie-backed assertions. Full filemanager suite: 109 passing, 1 skipped
  (component DOM mount — needs ESM jest, see §10).

> Manual UI verification (row drag-reorder + column drag-reorder both flip
> smoothly, batch size / columns persist across reload) is pending in the running
> dev server.

## 20. P7: switchable views (table ⇄ grid) — DONE

Adds a user-switchable listing view: the current **table** plus a new **grid**
view for organizing photos (bigger previews, drag-reorder, all batch actions),
with the **miller-column** view (reusing `pat-contentbrowser`) left as a later
addition the architecture is shaped to accept. This ticks the one open item in
§5 ("Allow switching views for the listing"). The subsections below were the
plan; the deliverables (and the two deviations from it) are recorded in §20.9.

### 20.1 Key observation — most of the app is already view-independent

The batch layer does not depend on the table. `Toolbar.svelte`
(cut/copy/paste/delete/state/tags/properties/rename), `FilterBar`, `Pagination`,
`BatchActionModal`, `StatusMessages`, and `UploadZone` all operate on
`ContentsStore` / `SelectionStore` — they never touch `ContentTable`. A second
view therefore inherits **every batch action for free**. Likewise
`ContentsStore.load()` requests `metadata_fields: ["_all"]`, so `image_scales`
is delivered **regardless of which columns are visible** → grid previews work
even when the `image` column is hidden.

Only three things are genuinely table-bound (today inside `ContentTable.svelte`,
roughly lines 27–113): **rendering**, **selection-click logic** (plain / ctrl /
shift-range), and **drag** (reorder + move-into-folder + flip). Those are what
P7 must share between the two views.

### 20.2 The animate:flip constraint (carried from §19)

`animate:flip` must sit on the **immediate child of a keyed `{#each}`** and is
**invalid on a component** — exactly why §19 deleted `ContentRow` and inlined the
`<tr>`. Consequence: the grid **cannot** reuse a shared `<ContentItem>` component
for the animated card; it must inline its own card element. P7 therefore shares
the *interaction logic*, not the rendered element.

### 20.3 New / changed pieces

- **`src/stores/ViewStore.svelte.ts` (new).** Runes store: `mode =
  $state<"table" | "grid">(...)`, an `available` list (`["table", "grid"]`,
  designed so `"miller"` slots in later) and `setMode(mode)`. Persists to the
  existing `cookieStorage(storageKey)` under key `view` and restores in the
  constructor — same mechanism as batch size (`ContentsStore` ctor) and columns.
  Seed order: cookie → `config.defaultView` → `"table"`. Instantiated in
  `App.svelte`, provided via `setContext("view", …)`.

- **`src/stores/ListInteractions.svelte.ts` (new, extracted).** A runes class
  constructed with `(contents, selection, clipboard, upload?)` that owns the drag
  state (`dragIndex` / `dropIndex` / `fileDropIndex` / `anchorIndex`, `dragActive`,
  `canReorder`) and the handlers currently embedded in `ContentTable`: `onItemClick`
  (plain/ctrl/shift-range rules → `selectOnly`/`toggle`/`selectRange`),
  `onItemMouseDown` (suppress shift text-selection), `isCut`, `dragSources`,
  `onDragStart` / `onDragEnd` / `onDragEnter`, and `onDrop` (folder → `moveIntoFolder`;
  non-folder + `canReorder` → `moveTo`; else no-op). The unified row dispatchers
  `onRowDragEnter` / `onRowDragOver` / `onRowDrop` route internal vs external (file)
  drags, with `onFileDrop` uploading dropped files into a subfolder (see §17).
  Provided via `setContext("interactions", …)`. **Net testing gain:** this logic
  is untested today (component-embedded); as a class it becomes unit-testable.

- **`ContentTable.svelte` (refactor, behaviour-neutral).** Replace the local
  drag/selection state and handlers with the shared `ListInteractions` from
  context. The `<tr>` markup, sortable headers, select-all, and `animate:flip`
  stay. Verify the table is unchanged before building the grid.

- **`src/components/ContentGrid.svelte` (new view).** Keyed `{#each
  contents.items}` of **cards**, each the immediate each-child carrying
  `animate:flip` (mirrors the table's inlined `<tr>`). Per card:
  - **Bigger preview** via `thumbnailUrl` (see 20.4); folder/type placeholder for
    non-images. A folder card's title drills in via `contents.navigateTo` (reuse
    the `ColumnCell` title-click logic).
  - A **selection checkbox overlay** (photo-manager style, top-left), plus
    `is-selected` / `is-cut` / `dragging` / `drop-target` classes.
  - `review_state` badge + title caption.
  - `draggable`, wired to the **same** `ListInteractions` row dispatchers; while
    `dragActive` they drive reorder/move-into-folder, otherwise external **file**
    drags upload into a subfolder card or fall through to `UploadZone` (the §17
    coexistence rule).
  - **No `RowActionMenu`** (decided): no per-item menu in the grid. Reorder is by
    drag; cut/copy/delete/tag/rename/state come from the toolbar. Accepted
    reduction vs the table: per-item *move-top/bottom* and *set-as-default-page*
    are table-only.
  - **No sort control** (decided): the grid uses whatever sort is active,
    defaulting to manual `getObjPositionInParent` order — which is exactly what
    drag-organizing photos wants. (Switching to the table exposes column sort if
    needed.)
  - Loading / empty / error states mirror the table.

- **`src/components/ViewSwitcher.svelte` (new).** Table / Grid buttons bound to
  `ViewStore`, placed in the existing `.filemanager-toolbar` row.

- **`App.svelte` (wire-up).** Instantiate + provide `ViewStore` and
  `ListInteractions`; render the switcher; swap the view inside the existing
  `UploadZone` children snippet:
  ```
  <UploadZone>
    {#if view.mode === "grid"} <ContentGrid /> {:else} <ContentTable /> {/if}
  </UploadZone>
  ```
  Hide `ColumnsConfig` in grid mode (columns are table-only).

- **`ConfigStore` + `filemanager.js` (config).** Add a `default-view` parser arg
  and `defaultView` prop/field. **No parser default** and camelCase key on the
  data attribute (the §11 parser gotcha); the runtime default (`"table"`) lives
  in `App.svelte` props.

### 20.4 Preview scale resolution

`utils/format.ts` `thumbnailUrl(item, scale="thumb", field="image")` currently
falls back to the **full-size original** when the requested scale is absent —
fine for a 2.5rem table thumb, wrong for a grid that should show a large *scale*,
not the original. Extend it to take a **preferred-scale fallback chain** (e.g.
`["preview", "mini", "thumb"]`) and pick the first present scale, only falling
back to `download` if none exist. Table keeps requesting `"thumb"`.

### 20.5 Styling (pure CSS, per §18 decision — no SCSS)

Add to `filemanager.css`: `.filemanager-grid` (`display: grid;
grid-template-columns: repeat(auto-fill, minmax(…, 1fr))`), `.filemanager-card`,
card preview img, the checkbox overlay, and `is-selected` / `is-cut` / `dragging`
/ `drop-target` card states (reuse the existing `--filemanager-*` color vars),
plus the `ViewSwitcher` button styles.

### 20.6 Tests

- `src/stores/ViewStore.test.ts` — default, cookie restore, `setMode`
  persistence, `defaultView` seeding.
- `src/stores/ListInteractions.test.ts` — selection-click rules (plain / ctrl /
  shift-range), `dragSources` (single vs whole-selection), and `onDrop` branching
  (move-into-folder vs reorder vs no-op). This is the main correctness win.
- `ContentGrid.svelte` — `svelte-autofixer` + manual UI verification (component
  DOM tests remain skipped pending ESM jest, per §10).

### 20.7 Sequencing (each step shippable)

1. `ViewStore` + `ViewSwitcher` + `default-view` config + cookie persistence
   (table still the only rendered view).
2. Extract `ListInteractions`; refactor `ContentTable` onto it (behaviour-neutral;
   verify the table is unchanged).
3. Build `ContentGrid` + CSS + conditional render in `App`; extend `thumbnailUrl`.
4. Polish: hide `ColumnsConfig` in grid mode, grid keyboard a11y (card focus +
   space/enter to select), i18n strings, tests, README + this section updated to
   "done", tick §5.

### 20.8 Miller column (future, not P7)

`ViewStore.mode` is a string with an `available` list and `App` switches on it, so
adding `"miller"` later is a new value + a new view component that reuses
`pat-contentbrowser`'s miller-column UI — no rework of the view-switching or
interaction layers. Left out of P7 by decision; the design simply does not
preclude it.

## 20.9 P7 deliverables (done)

Built as planned (§20.3–20.7) with two deviations, both noted below.

- `src/stores/ViewStore.svelte.ts` — runes store: `mode` (`"table"|"grid"`),
  `available` list, `setMode()`; cookie-persisted under key `view` via
  `cookieStorage(storageKey)`; seed order cookie → `config.defaultView` →
  `"table"`, invalid values rejected. Provided via `setContext("view", …)`.
- `src/stores/ListInteractions.svelte.ts` — extracted runes class
  `(contents, selection, clipboard)` owning the drag state (`dragIndex`/
  `dropIndex`/`anchorIndex`, `dragActive`, `canReorder`) and the shared handlers
  (`onItemClick`, `onItemMouseDown`, `isCut`, `onDragStart`/`End`/`Enter`,
  `onDrop`). Provided via `setContext("interactions", …)`. **Now unit-tested**
  (`ListInteractions.test.ts`, 16 cases — selection-click rules, drag state,
  `onDrop` branching: move-into-folder single/whole-selection, reorder, the
  no-ops).
- `ContentTable.svelte` — refactored onto the shared `ListInteractions` from
  context (drops its local drag/selection state + `objId`/`clipboard` imports);
  `<tr>` markup, sortable headers, select-all, `animate:flip` unchanged.
- `src/components/ContentGrid.svelte` — keyed `{#each}` of cards (each the
  immediate each-child carrying `animate:flip`, per §20.2): preview via the
  `thumbnailUrl` scale chain (§20.4), checkbox overlay, `review_state` badge,
  navigable title (folder → `navigateTo`), same `ListInteractions` handlers,
  loading/empty/error states. No row menu, no sort control (both by decision,
  §20.3).
- `src/components/ViewSwitcher.svelte` — Table/Grid buttons bound to `ViewStore`,
  in the `.filemanager-toolbar`.
- `App.svelte` — instantiates/provides `ViewStore` + `ListInteractions`, renders
  the switcher, swaps `<ContentGrid>`/`<ContentTable>` inside `UploadZone`, hides
  `ColumnsConfig` in grid mode. `ConfigStore.defaultView` + `default-view` parser
  arg + `App` prop (`"table"` runtime default, per the §11 parser gotcha).
- `utils/format.ts` `thumbnailUrl(item, scale, field)` — `scale` now accepts a
  string **or fallback chain**; first present scale wins, else the original.
  Backward-compatible (table still passes `"thumb"`).
- `filemanager.css` — `.filemanager-grid`/`-card` (+ `is-selected`/`is-cut`/
  `dragging`/`drop-target`/`:focus-visible`), card preview/checkbox/title, and
  `.filemanager-viewswitcher` button styles. Pure CSS (§18).
- Tests: `ViewStore.test.ts` (7), `ListInteractions.test.ts` (16). Full
  filemanager suite **134 passing, 1 skipped** (component DOM mount — needs ESM
  jest, §10). `tsc --noEmit` clean for the new sources; a dev webpack build
  compiles the full tree; all touched components pass `svelte-autofixer`.

### Deviations from the §20.3 plan

1. **Grid a11y uses a `listbox`/`option`, not a bare clickable `<li>`.** A plain
   `<li>` with click + drag handlers fails `svelte-autofixer` a11y rules
   (`a11y_no_noninteractive_element_interactions`, then
   `a11y_no_noninteractive_tabindex`). The grid is therefore a
   `role="listbox" aria-multiselectable` `<ul>` of `role="option"
   aria-selected tabindex="0"` cards. This is the correct semantics for a
   multi-selectable grid, makes the card focusable, and passes the autofixer
   with **zero** suppressions (the checkbox overlay and title link nest cleanly).
2. **Added `ListInteractions.onItemKeydown` + `activate`, with the card as a
   single tab stop.** Each grid card is one focusable element; its checkbox and
   title link are `tabindex="-1"`, so **Tab** moves card→card (not into a card's
   controls). With a card focused, **Space** selects (modifier-aware) and
   **Enter** opens via `activate(item)` (folder → `navigateTo`; else
   `location.assign`) — keyboard users keep the "open" the title link used to
   provide. `onItemClick`/`onItemKeydown` share a private
   `applySelection(item, index, {range, toggle})`, so the table's click behaviour
   is unchanged (behaviour-neutral refactor). (The §20.7-step-4 plan said
   "space/enter to select"; split into Space=select / Enter=open so a single tab
   stop can still both select and open.)

## 21. Batch actions as native `<dialog>` modals (done)

The batch-action host upgrades from the P4/§18 hand-rolled `role="dialog"` div
(a focus-trapped overlay) to the **native `<dialog>` element** (`showModal()`).
No restapi or form changes; the four `modals/*Form.svelte` components are
untouched, and the store/component names are unchanged (`ModalStore`,
`BatchActionModal`).

- **`ModalStore` gains `toggle()`.** The only store change: `toggle(name)` opens
  the modal, or closes it if that same action is already open (a no-op while
  `busy`). `active`, `busy`, `isOpen`, `open`, `close` are unchanged; `toggle`
  drives the toolbar's new `aria-pressed`.
- **Native dialog wins us the a11y for free.** `BatchActionModal` keeps one
  always-mounted `<dialog>` and an `$effect` keyed on `modal.isOpen` calls
  `.showModal()` / `.close()`. The browser then moves focus inside on open,
  **traps Tab** within the dialog (so the §18 hand-rolled focus trap + manual
  focus move/restore + `svelte:window` Escape handler are all gone), renders a
  dimmed `::backdrop`, makes the rest of the page inert, and restores focus to
  the trigger on close. The `cancel` event is `preventDefault`-ed while
  `modal.busy`, and a backdrop click (target === dialog) closes it; `close`
  syncs the store when dismissed via Escape.
- **Toolbar.** State / Tags / Properties / Rename now call `modal.toggle()`
  (was `modal.open()`) and reflect the open action via `aria-pressed`.
- **`App.svelte`.** Because the `<dialog>` is always mounted and overlays via
  `::backdrop`, `BatchActionModal` no longer needs to sit last in the DOM; it's
  rendered right after the toolbar.
- **CSS.** Replaces the old `.filemanager-modal-backdrop` fixed-overlay div with
  native-dialog styling: `.filemanager-modal` sizes/centres the box (UA
  `margin:auto`), `[open]` flips it to a flex column so the header is fixed and
  the form scrolls (`max-height: calc(100vh - 4rem)`); `display` lives on
  `[open]` so closed dialogs keep the UA `display:none`; `::backdrop` dims the
  page. Opening animates with a short `filemanager-modal-in` keyframe (the
  hand-rolled overlay had no open animation).
- Validation: `BatchActionModal` passes `svelte-autofixer` with no issues; full
  filemanager jest suite green (16 suites, 137 passing, 1 skipped).

## 22. Post-P7 UI refinements (done)

Small follow-up tweaks to the upload feedback and the column-config entry point.
No restapi, store-API, or test changes.

- **Upload progress merged into the status block.** The per-file upload list
  moved out of `UploadZone` and into `StatusMessages.svelte`, so it renders
  inside the single `.filemanager-upload` block within `.filemanager-status`
  (right below the breadcrumbs) instead of a separate panel under the listing.
  The redundant `reportUpload()` status line is gone — `StatusMessages` derives
  its own summary header from the entries (`Uploading N…` / `Uploaded N.` /
  `Uploaded X of Y, Z failed`) and the per-file rows already show done/error.
  A `×` button in the block's top-right corner and `Escape` both dismiss it
  (only once `!upload.active`). `utils/batch.ts` keeps `reportBatch`;
  `reportUpload` was removed.
- **Column settings as a `⋮` header icon.** `ColumnsConfig` moved out of the
  toolbar (where §20 had placed it, hidden in grid mode) into the **table's
  actions-column header** (`ContentTable.svelte`): the toggle is now a 3-dots
  `⋮` icon button labelled `_t("Column settings")` (`aria-haspopup` /
  `aria-expanded` / `title`), and its popover opens toward the table
  (`right: 0`) so it doesn't run off the right edge. Because it lives in the
  table header it's table-only by construction — grid mode renders no columns —
  so the §20 `view.mode !== "grid"` guard in `App.svelte` is gone.

## 23. Drag & drop on sortablejs (done)

The hand-rolled native HTML5 reorder (the live `movePreview`/`animate:flip`
preview, the per-row `onDragStart`/`onInternalHover`/`onDrop` machinery, the
three-band folder-zone geometry, and the grid's wrap-marker measurement) is
replaced by **[sortablejs](https://github.com/SortableJS/Sortable)** — the same
library pat-contentbrowser uses for its selected-items reorder. sortablejs owns
the drag gesture and its animation; the filemanager keeps all the *decisions*.

- **`utils/sortable.ts` — a Svelte `use:` action.** `sortableList(node, {interactions})` calls `Sortable.create` on the listing container (table
  `<tbody>`, grid `<ul>`). `draggable: "[data-fm-item]"` so only listing items
  drag — the grid's "up to parent" placeholder and any loading/empty message
  rows are excluded. `filter: "a, button, input, label"` keeps links, buttons
  and the checkbox clickable. Because Svelte owns the listing via a keyed
  `{#each}`, `onEnd` **reverts sortablejs's DOM move** (re-inserting the dragged
  node before the sibling captured at `onStart`) *before* the controller mutates
  the model — the re-render then lays the rows out in committed order, so
  Svelte's view of the DOM never drifts from the real DOM.
- **`ListInteractions` drag hooks.** The action drives three methods:
  - `dragStart(index)` — snapshots the dragged row, its url, and (in
    manual-order mode) the server order for a relative-move commit. The index is
    sortablejs's **`oldDraggableIndex`** (counted over `[data-fm-item]` only), so
    the grid's non-draggable up-card doesn't offset it.
  - `dragMove(relatedIndex)` → `boolean` — the hover decision: over the parent
    placeholder, or over **any folder but the dragged item itself**, it returns
    `false` (sortablejs must not reorder-swap) and lights the target (`dropIndex`
    / `parentDrop`); otherwise it returns `canReorder` (reorder allowed only in
    manual-order mode).
  - `dragEnd(delta)` — commits: a parent move, a move-into-folder, or, in
    manual-order mode, `contents.moveTo(id, delta, subset)` where
    `delta = newDraggableIndex − oldDraggableIndex`.
- **Folders are *solid* drop targets (the fix for drag-into-folder).** The first
  cut copied the old §17 three-band geometry (central 0.3–0.7 = move-into, edges
  = reorder-around-the-folder). That broke drag-into-folder in practice —
  especially in the **vertical table**, where sortablejs swaps the dragged row
  with every row it crosses, so the folder slid out from under the pointer
  ("chasing") and you could never land in its central band. The fix: `dragMove`
  returns `false` for *any* hover over a folder, so sortablejs never swaps the
  dragged item with a folder — the folder stays put and the whole card/row is a
  reliable move-into target. Reordering past a folder still works by hovering the
  next non-folder item beyond it. Trade-off: you can no longer reorder an item to
  sit *between* a folder and its neighbour by aiming at the folder, and dropping
  one folder onto another moves it *into* that folder rather than reordering the
  two; reordering among non-folder items is unaffected. The band geometry
  (`relatedRect`/`INTO_BAND`) and the action's `axis` param were removed.
- **Move-into-folder & move-into-parent preserved (the hard requirement).**
  Move-into-folder runs entirely through sortablejs's `onMove` (folder
  highlight) + `onEnd`. The parent "up" card stays a native-DnD drop target
  (sortablejs uses native HTML5 DnD, so the card's `ondrag*` handlers still fire
  during an item drag); its handlers set `parentDrop`, `dragMove` suppresses any
  reorder while it's lit, and `dragEnd` commits the parent move. Multi-selection
  moves still work: `dragSources` uses the whole selection when the dragged row
  is part of it. All three gestures were verified end-to-end in a live Plone
  Classic listing (drag-into-folder in both table and grid, drag-into-parent in
  the grid).
- **External file drags (uploads) unchanged in spirit.** They never start
  sortablejs (no mousedown on a draggable), so the row/parent `on*Drag*`/`on*Drop`
  handlers are now **file-only** — they stand down while `dragActive` and
  otherwise route an OS file drop into the hovered subfolder / parent / current
  folder exactly as before.
- **CSS.** The live-preview marker rules (`.dragging` margins + `::before`/`::after` accent bars, `.wrapped-start`, `.reorder-after`, the table reorder
  gradient) are gone; sortablejs's drop placeholder is styled via
  `chosenClass: "dragging"` (the faded source) and `ghostClass: "filemanager-drag-ghost"` (an accent-outlined slot).
- **Trade-off — multi-row *block reorder* dropped.** The old code could drag a
  contiguous multi-selection as one block when **reordering**; the sortablejs
  baseline reorders a single row at a time (sortablejs's MultiDrag plugin would
  conflict with the app's own `SelectionStore`). Multi-selection move-into-folder
  and move-into-parent are unaffected. `ContentsStore.movePreview*` /
  `commitReorder*` are now unused by the UI (kept, still unit-tested, available
  if block reorder returns via MultiDrag).
- **Validation.** Full filemanager jest suite green (20 suites, 214 passing, 1
  skipped); `ListInteractions.test.ts` rewritten to the new
  `dragStart`/`dragMove`/`dragEnd` API; both views compile clean under the Svelte
  compiler; no new TypeScript errors. **Interactive drag in a real Plone listing
  is the recommended manual check** (native-DnD gestures can't be exercised by
  the jest unit layer).

## 24. Rearrange (done)

Full-folder sort via the restapi `OrderingMixin` `sort` deserializer — replaces
the legacy `/rearrange` custom Plone JSON view (§3).

- **`src/api/operations.js`** — added `rearrangeFolder({ containerUrl, sortOn,
  sortOrder })`: PATCHes the container with `{ sort: { on, order } }`, the
  single-call form from §9 that re-sorts the folder's `getObjPositionInParent`
  index in one request.
- **`ContentsStore.rearrange(sortOn, sortOrder)`** — calls `rearrangeFolder`,
  then switches the listing to manual-order mode (`sortOn =
  "getObjPositionInParent"`, `sortOrder = "ascending"`, `bStart = 0`) and
  reloads so the rearranged items appear at the top of page 1. After rearranging,
  drag-drop reorder starts from the new order.
- **`src/components/modals/RearrangeForm.svelte`** — a native-dialog form with
  a "Sort by" `<select>` (**Title** = `sortable_title`, **ID** = `id`) and an
  ascending/descending radio group. On submit calls `contents.rearrange`, shows
  a success status and closes the modal. _(Earlier iteration also offered
  Date created / modified / Publication date / Content type — trimmed to the
  two manual-organization cases that match how editors actually rearrange
  folders; the other indices remain available via column-sort in the table.)_
- **`BatchActionModal`** — wired in the `"rearrange"` case (title + `<RearrangeForm />`).
- **`Toolbar`** — a **Rearrange** button (`plone-rearrange` icon, always enabled,
  not gated on selection) that calls `modal.toggle("rearrange")`.
- Tests: `operations.test.js` extended with 2 `rearrangeFolder` cases;
  `ContentsStore.test.ts` extended with 2 `rearrange` cases (PATCH call, mode
  switch to manual order). Full filemanager suite: **20 suites, 217 passing,
  1 skipped**.

## 25. Link integrity on delete (done)

Warns the user before deleting items that are referenced from elsewhere in the
site. Uses plone.restapi's `@linkintegrity` service — no backend additions, no
pat-structure custom views.

- **`src/api/operations.js` — `checkLinkIntegrity(contextUrl, uids)`.** GET
  `{contextUrl}/@linkintegrity?uids=<uid>&uids=<uid>…` (one `uids` param per
  selected item). Returns an array of items; each entry carries the item's
  `title` / `@id` / `items_total` (recursive descendant count) and a `breaches`
  array of `{title, "@id", uid}` sources that reference it. Items with no
  inbound references are still returned (with `breaches: []`); the caller
  filters. `contextUrl` is the **portal root** (`config.portalUrl`) — the
  service runs portal-wide regardless of context.
- **`ModalStore` — typed `linkintegrity` modal with a data payload.** Added
  modal name `"linkintegrity"`, exported types `LinkIntegrityBreach` /
  `LinkIntegrityItem` / `LinkIntegrityData`, and a generic `data` field
  (`open(name, data?)` / `close()` / `toggle()` all manage it). The
  `LinkIntegrityData` payload carries `breaches[]`, `subItemsTotal` (sum of
  `items_total` across **all** selected items, not just those with breaches —
  so the "N subitems will also be deleted" warning is accurate), and an
  `onConfirm` callback the modal invokes when the user proceeds.
- **`Toolbar.svelte` — delete flow gains a pre-flight check.** The Delete
  button now (1) collects UIDs from the selection, (2) calls
  `checkLinkIntegrity` (errors are swallowed → fall through to plain confirm),
  (3) filters items with `breaches.length > 0`, (4) sums `items_total` across
  the full result for the subitem count. Branches:
  - **Breaches found** → `modal.open("linkintegrity", { breaches, subItemsTotal,
    onConfirm })`; `onConfirm` runs the actual delete (via the existing
    `progress.track` + `contents.removeItems`) only after the user clicks
    "Delete anyway".
  - **No breaches** → the original `window.confirm` ("Delete N items? This
    cannot be undone." / "…including N subitems…" when descendants exist) and
    delete proceed as before.
- **`src/components/modals/LinkIntegrityForm.svelte`.** Lists each referenced
  item with its title (linked, `target="_blank"`), recursive child count when
  `items_total > 0`, and a nested list of the sources that link to it.
  Footer: **Cancel** / **Delete anyway** (the destructive submit styled with
  the `filemanager-action-delete` accent). The submit button awaits
  `data.onConfirm()` under the standard `modal.busy` gate, surfaces errors
  through `StatusStore`, and closes the modal on success.
- **`BatchActionModal.svelte`.** Adds the `"linkintegrity"` case (title
  "Link integrity warning" + renders `<LinkIntegrityForm />`). Reused without
  changes: native `<dialog>` host, focus trap, Escape/backdrop close (§21).
- **Scope (today).** The warning fires on **delete only**. The pre-existing
  spec §4 hint about drag/move warnings is **not** implemented — move-into-folder
  via DnD or paste does not trigger a link-integrity prompt (a move within the
  same site does not break inbound links by URL anyway; it would only matter if
  the move changed the path-based references in source pages, which is a
  separate concern).
- **No new unit tests yet.** `checkLinkIntegrity` is straightforward URL
  assembly + a `request()` call; the delete-flow branching lives in
  `Toolbar.svelte` (component-level test, blocked by §10). Manual verification
  on a live Plone instance with cross-linked content is the recommended check.

## 26. Folder drop — recreate + upload, with preview & approval (done)

Dropping an OS **folder** (not just loose files) onto the listing, a subfolder
row, or the "up to parent" card recreates the folder tree in Plone and uploads
every nested file. Because a deep folder is a large, hard-to-undo bulk import,
the drop is **calculated and previewed**, and nothing is written until the user
approves. Plain file drops keep their prior behaviour (immediate upload, no
preview). All stock restapi (content `POST {@type: Folder}` + the existing
`@tus-upload`/POST-fallback `uploadFile`); no pat-structure custom views.

- **Why it was needed.** `event.dataTransfer.files` is a flat `FileList` that
  silently omits dropped directories — so before this, dragging a folder
  uploaded nothing (or only the loose files the browser happened to expose).

- **`src/utils/dropentries.ts`** — reads dropped directories via the
  (non-standard but universally shipped) `DataTransferItem.webkitGetAsEntry()` /
  `FileSystemEntry` API. `captureDropEntries(dataTransfer)` grabs the top-level
  entries **synchronously** during the drop event (the items list is only live
  then; the entry objects stay valid for the async walk). `entriesHaveDirectory`
  gates the folder vs flat path. `readDropManifest(entries)` recursively walks
  into a `DropManifest` — `files: {path[], file}[]`, `dirs[]` (relative folder
  paths recorded **parents-before-children**), `fileCount`/`folderCount`/
  `totalSize`/`hasDirectories`. Promisifies `FileEntry.file()` and **drains the
  paginated** `DirectoryReader.readEntries()` (call until an empty batch).
  Degrades safely: no entries API → `[]` → caller takes the flat path.

- **`src/api/upload.js` — `createFolder(parentUrl, {title, type="Folder"})`** —
  `POST {parentUrl} {@type, title}`; the caller reads the created object's real
  `@id` (so a Plone-normalised id never breaks child mapping).

- **`src/stores/UploadStore.svelte.ts` — `uploadTree(targetUrl, manifest,
  folderType)`** — creates folders parents-first, mapping each relative path to
  the created url (`urlByPath`, seeded `"" → targetUrl`); then uploads each file
  into its mapped folder url, reusing the same per-file `entries`/`onProgress`
  progress model as `uploadFiles` (so the StatusMessages upload panel just
  works). A folder-create failure pushes a synthetic **error entry** and orphans
  its descendants (those files error out too) without aborting the batch.
  Single `contents.load()` at the end. `uploadFiles` is unchanged.

- **`src/stores/FolderDropStore.svelte.ts` + `FolderDropPreview.svelte`** — the
  approval gate, modelled on `ConfirmStore`/`ConfirmDialog`. `preview(manifest,
  targetName): Promise<boolean>` opens a native `<dialog>` (Escape/backdrop =
  cancel) showing the summary (`{folders} folders, {files} files, {size}`) and an
  indented folder tree (each folder line shows its direct file count; loose
  root files shown as a "(this folder)" line), with Cancel / **Upload** buttons;
  resolves true on approve. A new preview supersedes a pending one (resolves it
  false), like `ConfirmStore.ask`.

- **Orchestration — `ListInteractions.handleExternalDrop(dataTransfer,
  targetUrl?)`** — the single entry point for every external drop. Captures
  entries + files synchronously (before the first `await`), then: no directory →
  today's `upload.uploadFiles`; directory → `readDropManifest` →
  `folderDrop.preview` → on approval `upload.uploadTree(target, manifest,
  config.folderType)`. `UploadZone.onDrop`, `onFileDrop` (subfolder row) and the
  external branch of `onParentDrop` all route through it, so the folder-vs-flat
  decision and the preview live in exactly one place.

- **Config.** New `folderType` option (parser arg `folder-type`, `ConfigStore`,
  default `"Folder"`) chooses the recreated container's portal type.

- **Tests.** `src/utils/dropentries.test.ts` (capture/skip-nulls, no-API
  fallback, nested walk with parents-first dirs + file paths, paginated reader
  drain, loose-root files), `UploadStore.test.ts` (uploadTree: parents-first
  creation with mapped parent urls, files into the right urls, single reload,
  custom folderType, folder-failure orphaning), `upload.test.js` (`createFolder`
  POST shape + custom type), `FolderDropStore.test.ts` (approve/cancel/supersede).
  Full filemanager suite green; a dev webpack build compiles the component tree.

> Manual UI verification (drag a real nested folder onto the listing / a
> subfolder / the parent card → preview counts/size/tree → Cancel writes
> nothing, Upload recreates the tree and uploads into the right subfolders;
> plain file drop still skips the preview; a non-default `folder-type` is
> honoured) is pending on the running dev server.
