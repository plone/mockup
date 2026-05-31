<script>
    import { getContext } from "svelte";
    import { _t } from "../../utils/i18n.ts";

    /** @type {import("../../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    // Sort fields available for a full-folder rearrange. These mirror the
    // catalog indices plone.restapi's OrderingMixin accepts for `sort.on`.
    const SORT_FIELDS = [
        { value: "sortable_title", label: _t("Title") },
        { value: "id", label: _t("ID") },
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
