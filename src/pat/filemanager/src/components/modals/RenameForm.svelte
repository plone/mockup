<script>
    import { getContext } from "svelte";
    import { reportBatch } from "../../utils/batch.ts";
    import { _t } from "../../utils/i18n.ts";

    /** @type {import("../../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    // Editable per-item rows, seeded from the current short name + title.
    let rows = $state(
        selection.items.map((it) => ({
            url: it.url,
            id: it.id,
            title: it.title,
            origId: it.id,
            origTitle: it.title,
        }))
    );

    async function submit(event) {
        event.preventDefault();
        const renames = rows
            .filter((r) => r.id !== r.origId || r.title !== r.origTitle)
            .map((r) => ({ url: r.url, id: r.id, title: r.title }));
        if (renames.length === 0) {
            status.warning(_t("No names were changed."));
            return;
        }
        modal.busy = true;
        try {
            const result = await contents.renameItems(renames);
            reportBatch(
                status,
                result,
                "Renamed ${count} items.",
                "Could not rename ${count} items: ${details}"
            );
            selection.clear();
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
        {_t("Edit the title and short name (URL segment) of each item.")}
    </p>

    <div class="filemanager-rename-grid">
        {#each rows as row (row.url)}
            <div class="filemanager-rename-row">
                <label class="filemanager-field">
                    <span>{_t("Title")}</span>
                    <input type="text" bind:value={row.title} />
                </label>
                <label class="filemanager-field">
                    <span>{_t("Short name")}</span>
                    <input type="text" bind:value={row.id} />
                </label>
            </div>
        {/each}
    </div>

    <footer class="filemanager-modal-actions">
        <button type="button" disabled={modal.busy} onclick={() => modal.close()}>
            {_t("Cancel")}
        </button>
        <button type="submit" class="filemanager-modal-submit" disabled={modal.busy}>
            {modal.busy ? _t("Renaming…") : _t("Rename")}
        </button>
    </footer>
</form>
