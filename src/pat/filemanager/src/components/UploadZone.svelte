<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {{ children?: import("svelte").Snippet }} */
    let { children } = $props();

    /** @type {import("../stores/UploadStore.svelte").UploadStore} */
    const upload = getContext("upload");

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
        await upload.uploadFiles(files);
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
</div>
