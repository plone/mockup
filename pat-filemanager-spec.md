# Spec: `pat-filemanager` — Svelte rewrite of pat-structure

A modern, Backbone-free reimplementation of the Plone mockup `pat-structure`
folder-contents management UI, built on Svelte 5 runes and talking only to
plone.restapi.

## Decisions (locked)

- **Pattern name:** `pat-filemanager` (trigger `.pat-filemanager`, dir `src/pat/filemanager/`)
- **State management:** runes in `.svelte.ts` store classes (`$state`/`$derived`), provided to components via `setContext`
- **Grid / drag & drop:** custom Svelte table + native HTML5 drag-and-drop (no DataTables, no DnD library)
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
      ContentTable.svelte     # table shell, header, select-all, DnD container
      ContentRow.svelte       # one row: checkbox, image col, columns, row menu
      ColumnCell.svelte       # renders a value by column type (date/state/tags/image)
      RowActionMenu.svelte    # open/edit/cut/copy/paste/move-top/bottom/default-page
      Pagination.svelte       # batch size + page nav
      ColumnsConfig.svelte    # toggle + drag-reorder columns popover
      FilterBar.svelte        # text search + querystring criteria
      UploadZone.svelte       # multi-upload button + drag/drop to listing
      BatchActionModal.svelte # generic modal host for workflow/tags/properties/rename
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
| `/rearrange` (sort folder) | `PATCH {folder}` `{sort_order_field, reversed}` via ordering, or per-item `{ordering:{obj_id, delta}}` |
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
- **Customizable batch size:** `b_size` bound to `ContentsStore`, persisted via patternslib `utils.storage` (localStorage), replacing cookies.
- **Image column / preview:** new `image` column type rendering a thumbnail scale, driven by `image_scales` metadata.
- **Drag-into-folder:** native DnD action; drop on a folderish row → `@move` selected sources into that folder.
- **Multi-upload via drag/drop onto listing:** `UploadZone` overlay on `ContentTable`; drop files → `@tus-upload` to the current folder.
- **Select "current batch" vs "all in query":** `SelectionStore` tracks a mode; "all" runs a UID-only `@querystring-search` sweep (paged loop, like the legacy `selectAll`).
- **Persistent reorder:** ordering PATCH against the catalog `getObjPositionInParent`.

## 5. Feature parity checklist (from pat-structure)

- [x] Batched listing on content
- [x] Customizable batch size
- [x] Drag / drop sorting (persistent, catalog-index based)
- [x] Visible columns configuration (toggle + reorder + persist)
- [x] Select items: current batch or all-in-query
- [x] Multi-upload button (P5 — `@tus-upload` + plain-POST fallback)
- [x] Batch actions: cut, copy, paste, delete (P3); rename, tagging (P4)
- [x] Workflow status (with optional recursive application) (P4)
- [x] Edit properties (with optional recursive): publication date, expiration date, copyright/rights, creators, contributors, exclude_from_nav, language (P4)
- [x] Search + querystring filter (free-text + portal_type; further criteria later)
- [x] Image preview in item listing (P1 — `image` column type, `thumbnailUrl`)
- [x] Per-item actions: move to top, move to bottom, cut, copy, set as default page
- [x] Breadcrumbs (with in-app folder browsing; syncs the Plone toolbar — §15; no add-new menu — adding content is out of scope)
- [x] Status messages (P4)

New features:

- [x] Drag into folder (single or multiple selected items) (P5)
- [x] Multi-upload directly to listing via drag/drop (P5)
- [x] Column visual (non-persistent) sort applied over whole result set (P1)
- [x] Date columns sort by real date (P1 — catalog date index)
- [x] New `image` column (P1)

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
  reorder), `reset()`. Seeds from `ConfigStore.activeColumns`, persists to
  localStorage via patternslib `store.local(storageKey)` (default key
  `pat-filemanager`), and `sanitize()`s restored keys (drops unknown/duplicate).
  `ContentTable`/`ContentRow` now read columns from this store, not `ConfigStore`.
- `src/api/querystring.js` — `fetchQuerystringConfig()` (GET `@querystring`,
  replacing the legacy `indexOptionsUrl`) + `typeOptions()` flattening
  `indexes.portal_type.values` into `{value,label}` pairs.
- `ContentsStore` filter state: `searchableText` + `selectedTypes` (`$state`),
  wired into `buildCriteria` in `load()` (search text trimmed; falls back to
  `config.portalTypes` when no type selected). New `applyFilters()`,
  `clearFilters()`, `hasActiveFilters`.
- Components: `FilterBar.svelte` (debounced 300ms free-text search + portal_type
  multiselect popover sourced from `@querystring` + Clear), `ColumnsConfig.svelte`
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

## 16. What's left to implement

Everything through P6 plus the toolbar sync (§15) is done (P5 deliverables in
§17, P6 in §18). Remaining is live-instance verification only.

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
- **Drag-into-folder vs reorder coexistence** (`ContentTable`/`ContentRow`): rows
  are always `draggable`. `dragIndex >= 0` marks an internal drag in progress;
  rows only `preventDefault`/claim the drop while an internal drag is active, so
  external **file** drags fall through to `UploadZone`. Dropping a row onto a
  **folderish** row (≠ itself) → `moveIntoFolder` (the whole selection if the
  dragged row is part of a multi-selection, else just that row) + clear
  selection; dropping onto a **non-folder** row → reorder (only when
  `sortOn === getObjPositionInParent`). Trade-off: you can't reorder *onto* a
  folder row (it always means move-into) — reorder relative to folders is done by
  dropping on neighbouring non-folder rows. Folder drop target is highlighted via
  a `drop-target` class.
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
    already present).
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
