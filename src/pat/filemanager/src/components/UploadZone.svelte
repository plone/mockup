<script>
    import { getContext } from "svelte";
    import { formatSize } from "../utils/format.ts";
    import { reportUpload } from "../utils/batch.ts";
    import { _t } from "../utils/i18n.ts";

    /** @type {{ children?: import("svelte").Snippet }} */
    let { children } = $props();

    /** @type {import("../stores/UploadStore.svelte").UploadStore} */
    const upload = getContext("upload");
    /** @type {import("../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    // dragenter/dragleave fire for every child element, so count nesting depth
    // and only drop the overlay when we've left the zone entirely.
    let dragDepth = $state(0);
    const dragActive = $derived(dragDepth > 0);

    function hasFiles(event) {
        const types = event.dataTransfer?.types;
        return types && Array.from(types).includes("Files");
    }

    function onDragEnter(event) {
        if (!hasFiles(event)) return;
        event.preventDefault();
        dragDepth += 1;
    }

    function onDragOver(event) {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    }

    function onDragLeave(event) {
        if (!hasFiles(event)) return;
        dragDepth = Math.max(0, dragDepth - 1);
    }

    async function onDrop(event) {
        if (!hasFiles(event)) return;
        event.preventDefault();
        dragDepth = 0;
        const files = Array.from(event.dataTransfer.files);
        if (files.length === 0) return;
        const result = await upload.uploadFiles(files);
        reportUpload(status, result);
    }
</script>

<div
    class="filemanager-uploadzone"
    class:drag-active={dragActive}
    role="region"
    aria-label={_t("Folder contents — drop files to upload")}
    ondragenter={onDragEnter}
    ondragover={onDragOver}
    ondragleave={onDragLeave}
    ondrop={onDrop}
>
    {@render children?.()}

    {#if dragActive}
        <div class="filemanager-upload-overlay">{_t("Drop files to upload")}</div>
    {/if}

    {#if upload.entries.length > 0}
        <div class="filemanager-upload-panel">
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
            {#if !upload.active}
                <button
                    type="button"
                    class="filemanager-upload-clear"
                    onclick={() => upload.clearFinished()}
                >
                    {_t("Clear")}
                </button>
            {/if}
        </div>
    {/if}
</div>
