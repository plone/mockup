<script>
    import { getContext, onMount } from "svelte";
    import { _t } from "../../utils/i18n.ts";
    import { fetchQuerystringConfig } from "../../api/querystring.js";

    /** @type {import("../../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    // Which fields a folder can be rearranged by is driven by plone.app.querystring's
    // canonical `sortable` flag, exposed by @querystring as `sortable_indexes`
    // (registryreader.mapSortableIndexes). This is the principled source for
    // "sensible sort indexes": non-sortable indexes such as Tags (Subject, a
    // KeywordIndex) and Type (portal_type) are flagged sortable=False and so are
    // excluded automatically — unlike pat-structure, which offers every catalog
    // index minus a noise blocklist with no sortability check. restapi's
    // OrderingMixin resort runs catalog(sort_on=key), which accepts exactly these
    // indexes. Titles come server-translated, so no client-side i18n is needed —
    // except two technical labels we relabel for clarity.
    const LABEL_OVERRIDES = {
        sortable_title: _t("Title"),
        getId: _t("ID"),
    };

    // getObjPositionInParent is the current manual order — rearranging by it is a
    // no-op, so drop it from the options.
    const EXCLUDED = ["getObjPositionInParent"];

    const FALLBACK = [
        { value: "sortable_title", label: _t("Title") },
        { value: "getId", label: _t("ID") },
    ];

    let fields = $state(FALLBACK);
    let sortOn = $state("sortable_title");
    let sortOrder = $state("ascending");

    onMount(async () => {
        try {
            const cfg = await fetchQuerystringConfig(config.contextUrl);
            const sortable = cfg.sortable_indexes || {};
            const opts = Object.entries(sortable)
                .filter(([key]) => !EXCLUDED.includes(key))
                .map(([value, meta]) => ({
                    value,
                    label: LABEL_OVERRIDES[value] || meta?.title || value,
                }));
            if (opts.length) fields = opts;
        } catch {
            // Keep the FALLBACK options if @querystring is unavailable.
        }
    });

    async function submit(event) {
        event.preventDefault();
        modal.busy = true;
        try {
            await contents.rearrange(sortOn, sortOrder);
            status.success(_t("Folder contents have been rearranged."));
            modal.busy = false;
            modal.close();
        } catch (e) {
            modal.busy = false;
            status.error(e.message);
        }
    }
</script>

<form class="filemanager-modal-form" onsubmit={submit}>
    <p class="filemanager-modal-intro">
        {_t("Sort all items in this folder by a chosen criterion. The new order becomes the manual (drag-and-drop) order.")}
    </p>

    <label class="filemanager-field">
        <span>{_t("Sort by")}</span>
        <select bind:value={sortOn}>
            {#each fields as field (field.value)}
                <option value={field.value}>{field.label}</option>
            {/each}
        </select>
    </label>

    <fieldset class="filemanager-field">
        <legend>{_t("Order")}</legend>
        <label class="filemanager-field-radio">
            <input type="radio" bind:group={sortOrder} value="ascending" />
            <span>{_t("Ascending (A → Z, oldest first)")}</span>
        </label>
        <label class="filemanager-field-radio">
            <input type="radio" bind:group={sortOrder} value="descending" />
            <span>{_t("Descending (Z → A, newest first)")}</span>
        </label>
    </fieldset>

    <footer class="filemanager-modal-actions">
        <button type="button" disabled={modal.busy} onclick={() => modal.close()}>
            {_t("Cancel")}
        </button>
        <button type="submit" class="filemanager-modal-submit" disabled={modal.busy}>
            {modal.busy ? _t("Rearranging…") : _t("Rearrange")}
        </button>
    </footer>
</form>
