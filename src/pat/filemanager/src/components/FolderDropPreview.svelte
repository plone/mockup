<script>
    import { getContext } from "svelte";
    import { formatSize } from "../utils/format.ts";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/FolderDropStore.svelte").FolderDropStore} */
    const folderDrop = getContext("folderDrop");

    /** @type {HTMLDialogElement | undefined} */
    let dialog = $state();

    // Drive the native <dialog> from store state — showModal() gives us the
    // backdrop, focus trap/restore and Escape handling (mirrors ConfirmDialog).
    $effect(() => {
        if (!dialog) return;
        if (folderDrop.isOpen && !dialog.open) dialog.showModal();
        else if (!folderDrop.isOpen && dialog.open) dialog.close();
    });

    // Native dismissal (Escape / backdrop) counts as cancel.
    function onClose() {
        if (folderDrop.isOpen) folderDrop.cancel();
    }

    function onClick(event) {
        if (event.target === dialog) folderDrop.cancel();
    }

    // Build the displayed tree: a row per folder (indented by depth, with its
    // direct file count) plus a leading row for any loose files dropped at the
    // root that go straight into the target folder.
    const rows = $derived.by(() => {
        const m = folderDrop.manifest;
        if (!m) return [];
        const filesByPath = new Map();
        for (const f of m.files) {
            const key = f.path.join("/");
            filesByPath.set(key, (filesByPath.get(key) || 0) + 1);
        }
        const list = [];
        const looseRoot = filesByPath.get("") || 0;
        if (looseRoot > 0) {
            list.push({ depth: 0, name: _t("(this folder)"), files: looseRoot, root: true });
        }
        for (const dir of m.dirs) {
            const segs = dir.split("/");
            list.push({
                depth: segs.length - 1,
                name: segs[segs.length - 1],
                files: filesByPath.get(dir) || 0,
                root: false,
            });
        }
        return list;
    });

    const summary = $derived.by(() => {
        const m = folderDrop.manifest;
        if (!m) return "";
        return _t("${folders} folders, ${files} files, ${size}", {
            folders: m.folderCount,
            files: m.fileCount,
            size: formatSize(m.totalSize),
        });
    });
</script>

<dialog
    bind:this={dialog}
    class="filemanager-modal filemanager-folderdrop"
    aria-label={_t("Confirm folder upload")}
    onclose={onClose}
    onclick={onClick}
>
    {#if folderDrop.isOpen}
        <h2 class="filemanager-folderdrop-title">
            {_t('Upload folder into "${target}"?', { target: folderDrop.targetName })}
        </h2>
        <p class="filemanager-folderdrop-summary">{summary}</p>
        <ul class="filemanager-folderdrop-tree">
            {#each rows as row, i (i)}
                <li
                    class="filemanager-folderdrop-row"
                    class:is-root={row.root}
                    style="--depth: {row.depth}"
                >
                    <span class="filemanager-folderdrop-name">{row.name}</span>
                    {#if row.files > 0}
                        <span class="filemanager-folderdrop-count">
                            {_t("${count} files", { count: row.files })}
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
        <div class="filemanager-folderdrop-actions">
            <button type="button" onclick={() => folderDrop.cancel()}>
                {_t("Cancel")}
            </button>
            <!-- svelte-ignore a11y_autofocus -->
            <button
                type="button"
                class="filemanager-folderdrop-ok"
                autofocus
                onclick={() => folderDrop.approve()}
            >
                {_t("Upload")}
            </button>
        </div>
    {/if}
</dialog>
