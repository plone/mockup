<script>
    import { getContext, onMount } from "svelte";
    import { fetchTransitions } from "../../api/workflow.js";
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
    const hasFolders = items.some((it) => it.isFolderish);

    let loading = $state(true);
    let loadError = $state("");
    let transitions = $state([]);

    let transition = $state("");
    let comment = $state("");
    let includeChildren = $state(false);

    onMount(async () => {
        try {
            transitions = await fetchTransitions(items.map((it) => it.url));
        } catch (e) {
            loadError = e.message;
        } finally {
            loading = false;
        }
    });

    async function submit(event) {
        event.preventDefault();
        if (!transition) return;
        modal.busy = true;
        try {
            const result = await progress.track(
                _t("Changing the state of ${count} items…", { count: items.length }),
                (onProgress) =>
                    contents.applyWorkflow(
                        items,
                        { transition, comment, includeChildren },
                        onProgress
                    )
            );
            reportBatch(
                status,
                result,
                "Changed the state of ${count} items.",
                "Could not change the state of ${count} items: ${details}"
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
        {_t("Apply a transition to ${count} selected items.", { count: items.length })}
    </p>

    {#if loading}
        <p class="filemanager-modal-loading">{_t("Loading available transitions…")}</p>
    {:else if loadError}
        <p class="filemanager-modal-error">{loadError}</p>
    {:else if transitions.length === 0}
        <p class="filemanager-modal-error">
            {_t("No transitions are available for the selected items.")}
        </p>
    {:else}
        <label class="filemanager-field">
            <span>{_t("Transition")}</span>
            <select bind:value={transition} required>
                <option value="" disabled>{_t("Select a transition…")}</option>
                {#each transitions as t (t.id)}
                    <option value={t.id}>{t.title}</option>
                {/each}
            </select>
        </label>

        <label class="filemanager-field">
            <span>{_t("Comment")}</span>
            <textarea bind:value={comment} rows="3"></textarea>
        </label>

        {#if hasFolders}
            <label class="filemanager-field filemanager-field-check">
                <input type="checkbox" bind:checked={includeChildren} />
                <span>{_t("Also apply to contained items (recursive)")}</span>
            </label>
        {/if}
    {/if}

    <footer class="filemanager-modal-actions">
        <button type="button" disabled={modal.busy} onclick={() => modal.close()}>
            {_t("Cancel")}
        </button>
        <button
            type="submit"
            class="filemanager-modal-submit"
            disabled={modal.busy || loading || !transition}
        >
            {modal.busy ? _t("Applying…") : _t("Apply")}
        </button>
    </footer>
</form>
