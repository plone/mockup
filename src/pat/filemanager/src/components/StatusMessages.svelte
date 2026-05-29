<script>
    import { getContext } from "svelte";
    import { formatSize } from "../utils/format.ts";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");
    /** @type {import("../stores/UploadStore.svelte").UploadStore} */
    const upload = getContext("upload");

    const uploadDone = $derived(
        upload.entries.filter((e) => e.status === "done").length
    );
    const uploadFailed = $derived(
        upload.entries.filter((e) => e.status === "error").length
    );
    const uploadSummary = $derived.by(() => {
        const total = upload.entries.length;
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

    function onKeydown(event) {
        if (event.key === "Escape" && !upload.active && upload.entries.length > 0) {
            upload.clearFinished();
        }
    }
</script>

<svelte:window onkeydown={onKeydown} />

{#if status.messages.length || upload.entries.length}
    <div class="filemanager-status" role="status" aria-live="polite">
        {#each status.messages as message (message.id)}
            <div class="filemanager-status-message is-{message.kind}">
                <span class="filemanager-status-text">{message.text}</span>
                <button
                    type="button"
                    class="filemanager-status-dismiss"
                    aria-label={_t("Dismiss message")}
                    onclick={() => status.dismiss(message.id)}
                >
                    ×
                </button>
            </div>
        {/each}

        {#if upload.entries.length}
            <div class="filemanager-upload">
                {#if !upload.active}
                    <button
                        type="button"
                        class="filemanager-upload-close"
                        aria-label={_t("Close")}
                        onclick={() => upload.clearFinished()}
                    >
                        ×
                    </button>
                {/if}
                <p
                    class="filemanager-upload-summary"
                    class:is-active={upload.active}
                    class:is-error={uploadFailed > 0}
                >
                    {uploadSummary}
                </p>
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
            </div>
        {/if}
    </div>
{/if}
