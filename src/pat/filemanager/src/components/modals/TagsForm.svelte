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
    /** @type {import("../../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");

    const items = selection.items;

    const currentTags = [
        ...new Set(items.flatMap((it) => it.subjects || [])),
    ].sort();

    let addText = $state("");
    let removeSet = $state([]);

    function parseTags(text) {
        return [
            ...new Set(
                text
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
            ),
        ];
    }

    async function submit(event) {
        event.preventDefault();
        const add = parseTags(addText);
        const remove = removeSet;
        if (add.length === 0 && remove.length === 0) {
            status.warning(_t("No tag changes were specified."));
            return;
        }
        modal.busy = true;
        try {
            const result = await progress.track(
                _t("Updating tags on ${count} items…", { count: items.length }),
                (onProgress) => contents.applyTags(items, { add, remove }, onProgress)
            );
            reportBatch(
                status,
                result,
                "Updated tags on ${count} items.",
                "Could not update tags on ${count} items: ${details}"
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
        {_t("Add or remove tags on ${count} selected items.", { count: items.length })}
    </p>

    <label class="filemanager-field">
        <span>{_t("Tags to add")}</span>
        <input
            type="text"
            bind:value={addText}
            placeholder={_t("comma, separated, tags")}
        />
    </label>

    {#if currentTags.length}
        <fieldset class="filemanager-field">
            <legend>{_t("Tags to remove")}</legend>
            {#each currentTags as tag (tag)}
                <label class="filemanager-field-check">
                    <input
                        type="checkbox"
                        value={tag}
                        bind:group={removeSet}
                    />
                    <span>{tag}</span>
                </label>
            {/each}
        </fieldset>
    {/if}

    <footer class="filemanager-modal-actions">
        <button type="button" disabled={modal.busy} onclick={() => modal.close()}>
            {_t("Cancel")}
        </button>
        <button
            type="submit"
            class="filemanager-modal-submit"
            disabled={modal.busy}
        >
            {modal.busy ? _t("Saving…") : _t("Save")}
        </button>
    </footer>
</form>
