# Upstream `@plone/client` gaps blocking a full filemanager migration

pat-filemanager adopted `@plone/client` (aurora, `2.0.0-alpha.4`) for the
standard restapi calls (breadcrumbs, copy/move, delete, reorder, folder create).
Four small wrapper gaps keep the rest of the data layer on our native-fetch
`request()`. Each is a contained fix in `plone/aurora` → `packages/client`; the
restapi endpoints already support the behaviour and the zod schemas mostly
already declare the fields. Once these land in a released `@plone/client`, the
matching `src/api/*` internals can move over (leaving only tus custom).

Status references the source as read on `plone/aurora@main`.

---

## 1. `querystringSearch` — forward sort/batch/scope (unblocks the **listing**)

`packages/client/src/restapi/querystring-search/get.ts` forwards only
`{ query }` and hits the site root, even though `querystringSearchDataSchema`
already declares `b_start`/`b_size`/`limit`/`sort_on`/`sort_order`/`fullobjects`.
The filemanager listing needs server-side sort + batch + `metadata_fields`, and
folder-scoping so the context UID is auto-excluded.

```ts
// validation/querystring-search.ts — add the two missing fields
export const querystringSearchDataSchema = z.object({
  b_start: z.string().optional(),
  b_size: z.string().optional(),
  limit: z.string().optional(),
  sort_on: z.string().optional(),
  sort_order: z.string().optional(),
  fullobjects: z.boolean().optional(),
  metadata_fields: z.array(z.string()).optional(),   // NEW
  path: z.string().optional(),                        // NEW (context scope)
  query: z.array(query),
  post: z.boolean().optional(),
});

// restapi/querystring-search/get.ts — validate & forward the full args
export async function querystringSearch(this: PloneClient, args: QuerystringSearchArgs) {
  const { post, path, ...rest } = args;
  const validated = querystringSearchDataSchema.parse(args);
  const { post: _p, path: _pa, query, ...extra } = validated;
  const endpoint = `${path ?? ''}/@querystring-search`;
  if (post) {
    return apiRequest('post', endpoint, { data: { query, ...extra }, config: this.config });
  }
  const params = { query: encodeURIComponent(JSON.stringify({ query })), ...extra };
  return apiRequest('get', endpoint, { config: this.config, params });
}
```

Filemanager follow-up: `src/api/contents.js` `searchContents()` → `querystringSearch`.

---

## 2. `createWorkflow` — arbitrary transition (unblocks **workflow** batch action)

`packages/client/src/restapi/workflow/create.ts` hardcodes
`${path}/@workflow/publish`, so only "publish" is reachable. The filemanager
applies any transition (publish/retract/submit/reject/…) with an optional
comment and `include_children` recursion.

```ts
export const createWorkflowArgsSchema = z.object({
  path: z.string(),
  transition: z.string(),                 // NEW — required
  data: createWorkflowDataSchema.optional(), // already carries { comment?, include_children? }
});

export async function createWorkflow(this: PloneClient, { path, transition, data }: CreateWorkflowArgs) {
  const validated = createWorkflowArgsSchema.parse({ path, transition, data });
  const workflowPath = `${validated.path}/@workflow/${validated.transition}`;  // was: /publish
  return apiRequest('post', workflowPath, { data: validated.data, config: this.config });
}
```

(Confirm `createWorkflowDataSchema` includes `include_children`; add it if not.)
Filemanager follow-up: `src/api/workflow.js` `transitionItem()` → `createWorkflow`.

---

## 3. `updateContent` — allow `sort` + `default_page` (unblocks **rearrange** + **set-default-page**)

`packages/client/src/validation/content.ts` `updateContentDataSchema` is a
`.partial()` allowlist with `ordering` but no `sort`/`default_page`, so those
PATCH bodies are silently stripped. Both are stock OrderingMixin / default_page
deserializers on the server.

```ts
// add to updateContentDataSchema
sort: z.object({
  on: z.string(),
  order: z.enum(['ascending', 'descending']),
}).optional(),
default_page: z.string().nullable().optional(),
```

Filemanager follow-up: `src/api/operations.js` `rearrangeFolder()` and
`setDefaultPage()` → `updateContent`.

---

## 4. `getLinkintegrity` — context path + multiple uids (unblocks **link-integrity on delete**)

`packages/client/src/restapi/linkintegrity/get.ts` GETs the root
`/@linkintegrity` with a single `uids` string. The filemanager checks several
UIDs against a context.

```ts
const getLinkintegrityArgsSchema = z.object({
  path: z.string().optional(),
  uids: z.union([z.string(), z.array(z.string())]),
});

export async function getLinkintegrity(this: PloneClient, { path, uids }: GetLinkintegrityArgs) {
  const validated = getLinkintegrityArgsSchema.parse({ path, uids });
  const endpoint = `${validated.path ?? ''}/@linkintegrity`;
  return apiRequest('get', endpoint, { config: this.config, params: { uids: validated.uids } });
}
```

Caveat: the client's axios `paramsSerializer` uses
`arrayFormat: 'colon-list-separator'` (`uids=a:b`), whereas restapi
`@linkintegrity` expects **repeated** `uids` params. Either pass a serializer
override for this call or document that callers join appropriately — flag this in
the PR. Filemanager follow-up: `src/api/operations.js` `checkLinkIntegrity()`.

---

## Out of scope (larger): tus resumable upload

`@plone/client` has no `@tus-upload` service. The filemanager keeps
`src/api/upload.js` (`uploadFileTus` + base64 POST fallback) custom regardless.
Adding a tus service to the client is a separate, larger proposal — note it, but
it is not one of the trivial wrapper PRs above.
