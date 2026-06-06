<script>
    import { getContext } from "svelte";
    import { _t, _tp } from "../../utils/i18n.ts";

    /** @type {import("../../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    // Sort fields available for a full-folder rearrange. These mirror the
    // catalog indices pat-structure offers (plone.app.content `get_indexes`),
    // which restapi's OrderingMixin resort accepts for `sort.on` (it runs the
    // same `catalog(sort_on=…)` query). Labels are Plone field labels living in
    // the "plone" i18n domain, so translate via _tp (like the server's own
    // PloneMessageFactory) — _t (widgets) lacks several of them.
    const SORT_FIELDS = [
        { value: "sortable_title", label: _tp("Title") },
        { value: "id", label: _tp("ID") },
        { value: "created", label: _tp("Created on") },
        { value: "modified", label: _tp("Last modified") },
        { value: "effective", label: _tp("Publication date") },
        { value: "expires", label: _tp("Expiration date") },
        { value: "review_state", label: _tp("Review state") },
        { value: "Type", label: _tp("Type") },
        { value: "Creator", label: _tp("Creator") },
        { value: "Subject", label: _tp("Tags") },
    ];

    let sortOn = $state("sortable_title");
    let sortOrder = $state("ascending");

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
            {#each SORT_FIELDS as field (field.value)}
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
