<script>
    import { getContext } from "svelte";
    import { formatSize } from "../utils/format.ts";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/UploadStore.svelte").UploadStore} */
    const upload = getContext("upload");

    /** @type {HTMLDialogElement | undefined} */
    let dialog = $state();

    const uploadDone = $derived(
        upload.entries.filter((e) => e.status === "done").length
    );
    const uploadFailed = $derived(
        upload.entries.filter((e) => e.status === "error").length
    );

    // The list is "pending" while we have nothing to show yet but work is under
    // way: the dropped tree is still being read, or uploads have started but the
    // first entries haven't been pushed. That's when the loading indicator runs.
    const pending = $derived(upload.busy && upload.entries.length === 0);

    const summary = $derived.by(() => {
        const total = upload.entries.length;
        if (upload.preparing) return _t("Reading dropped files…");
        if (upload.active && total === 0) return _t("Starting upload…");
        if (upload.active) {
            return _t("Uploading ${count} files…", { count: total });
        }
        if (uploadFailed > 0) {
            return _t("Uploaded ${done} of ${total} files, ${failed} failed.", {
                done: uploadDone,
                total,
                failed: uploadFailed,
            });
        }
        return _t("Uploaded ${count} files.", { count: uploadDone });
    });

    // Open while anything upload-related is happening or its result still stands;
    // showModal() gives the backdrop + focus trap (mirrors the other dialogs).
    $effect(() => {
        if (!dialog) return;
        const open = upload.busy || upload.entries.length > 0;
        if (open && !dialog.open) dialog.showModal();
        else if (!open && dialog.open) dialog.close();
    });

    // Escape fires `cancel` before `close`; block dismissal while uploads run so
    // the dialog stays up until the batch finishes.
    function onCancel(event) {
        if (upload.busy) event.preventDefault();
    }

    // Native dismissal (Escape) when finished: drop the result and let it close.
    function onClose() {
        if (!upload.busy) upload.clearFinished();
    }

    // Backdrop click closes only once the batch is done.
    function onClick(event) {
        if (event.target === dialog && !upload.busy) upload.clearFinished();
    }
</script>

<dialog
    bind:this={dialog}
    class="filemanager-modal filemanager-upload-dialog"
    aria-label={_t("File upload")}
    oncancel={onCancel}
    onclose={onClose}
    onclick={onClick}
>
    <header class="filemanager-modal-header">
        <h2
            class="filemanager-modal-title filemanager-upload-summary"
            class:is-active={upload.busy}
            class:is-error={uploadFailed > 0}
            aria-live="polite"
        >
            {summary}
        </h2>
        {#if !upload.busy}
            <button
                type="button"
                class="filemanager-modal-close"
                title={_t("Close")}
                aria-label={_t("Close")}
                onclick={() => upload.clearFinished()}
            >&times;</button>
        {/if}
    </header>

    <div class="filemanager-modal-form filemanager-upload">
        {#if pending}
            <div class="filemanager-upload-loading">
                <progress aria-label={summary}></progress>
                <span class="filemanager-upload-loading-text">{summary}</span>
            </div>
        {:else}
            <ul class="filemanager-upload-list">
                {#each upload.entries as entry (entry.id)}
                    <li class="filemanager-upload-item is-{entry.status}">
                        <span class="filemanager-upload-name">{entry.name}</span>
                        {#if entry.status === "error"}
                            <span class="filemanager-upload-error">{entry.error}</span>
                        {:else if entry.status === "done"}
                            <span class="filemanager-upload-done">{_t("done")}</span>
                        {:else}
                            <progress
                                max={entry.size || 1}
                                value={entry.loaded}
                                aria-label={_t("Uploading ${name}", { name: entry.name })}
                            ></progress>
                            <span class="filemanager-upload-size">
                                {formatSize(entry.loaded)} / {formatSize(entry.size)}
                            </span>
                        {/if}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</dialog>
