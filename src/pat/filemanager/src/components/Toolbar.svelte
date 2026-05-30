<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";
    import Icon from "./Icon.svelte";
    import SelectAll from "./SelectAll.svelte";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ClipboardStore.svelte").ClipboardStore} */
    const clipboard = getContext("clipboard");
    /** @type {import("../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../stores/UploadStore.svelte").UploadStore} */
    const upload = getContext("upload");
    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");

    let busy = $state(false);
    /** @type {HTMLInputElement} */
    let fileInput;

    async function onFilesPicked(event) {
        const files = Array.from(event.currentTarget.files || []);
        event.currentTarget.value = "";
        if (files.length === 0) return;
        await upload.uploadFiles(files);
    }

    const pageAllSelected = $derived(selection.allSelected(contents.items));
    const canSelectAllInQuery = $derived(
        selection.mode === "page" &&
            pageAllSelected &&
            contents.total > contents.items.length
    );

    function toClipboardItems() {
        return selection.items.map((it) => ({ url: it.url, title: it.title }));
    }

    function cut() {
        clipboard.cut(toClipboardItems());
        selection.clear();
    }

    function copy() {
        clipboard.copy(toClipboardItems());
        selection.clear();
    }

    async function run(action) {
        busy = true;
        try {
            await action();
        } finally {
            busy = false;
        }
    }

    function paste() {
        return run(async () => {
            const op = clipboard.op;
            const count = clipboard.count;
            // @copy / @move are single server requests, so the bar is
            // indeterminate (the client can't see per-item progress).
            const label =
                op === "cut"
                    ? _t("Moving ${count} items…", { count })
                    : _t("Copying ${count} items…", { count });
            await progress.track(
                label,
                () => contents.paste(op, clipboard.sources),
                { surface: "dialog" }
            );
            if (op === "cut") clipboard.clear();
        });
    }

    function remove() {
        const count = selection.count;
        const ok = window.confirm(
            _t("Delete ${count} items? This cannot be undone.", { count })
        );
        if (!ok) return;
        return run(async () => {
            await progress.track(
                _t("Deleting ${count} items…", { count }),
                (onProgress) => contents.removeItems(selection.urls, onProgress)
            );
            selection.clear();
        });
    }

    function selectAllInQuery() {
        return run(() => selection.selectAllInQuery());
    }
</script>

<!--
    Toolbar layout mirrors pat-structure: the selection cluster (count + manage)
    first, then Upload, then the main action group in the same order
    (Cut, Copy, Paste, Delete, Workflow/State, Tags, Properties, Rename), with
    Delete carrying the "danger" styling and the group rendered as one segmented
    button bar.
-->
<div class="filemanager-actions">
    <SelectAll />

    {#if canSelectAllInQuery}
        <button
            type="button"
            class="filemanager-action-selectall"
            disabled={busy || selection.sweeping}
            onclick={selectAllInQuery}
        >
            {_t("Select all ${count} in query", { count: contents.total })}
        </button>
    {:else if selection.mode === "all"}
        <span class="filemanager-allselected"
            >{_t("All ${count} in query selected", { count: selection.count })}</span
        >
    {/if}

    <button
        type="button"
        class="filemanager-action-upload"
        title={_t("Upload")}
        aria-label={_t("Upload")}
        disabled={busy || upload.active}
        onclick={() => fileInput.click()}
    >
        <Icon name="upload" />
        {_t("Upload")}
    </button>
    <input
        bind:this={fileInput}
        type="file"
        multiple
        class="filemanager-file-input"
        hidden
        onchange={onFilesPicked}
    />

    <div class="filemanager-action-group" role="group" aria-label={_t("Actions")}>
        <button
            type="button"
            title={_t("Cut")}
            aria-label={_t("Cut")}
            disabled={busy || selection.isEmpty}
            onclick={cut}
        >
            <Icon name="plone-cut" />
        </button>
        <button
            type="button"
            title={_t("Copy")}
            aria-label={_t("Copy")}
            disabled={busy || selection.isEmpty}
            onclick={copy}
        >
            <Icon name="plone-copy" />
        </button>
        <button
            type="button"
            title={clipboard.isEmpty
                ? _t("Paste")
                : _t("Paste (${count} ${op})", { count: clipboard.count, op: clipboard.op })}
            aria-label={_t("Paste")}
            disabled={busy || clipboard.isEmpty}
            onclick={paste}
        >
            <Icon name="plone-paste" />
        </button>
        <button
            type="button"
            class="filemanager-action-delete"
            title={_t("Delete")}
            aria-label={_t("Delete")}
            disabled={busy || selection.isEmpty}
            onclick={remove}
        >
            <Icon name="plone-delete" />
        </button>
        <button
            type="button"
            title={_t("State")}
            aria-label={_t("State")}
            aria-pressed={modal.active === "workflow"}
            disabled={busy || selection.isEmpty}
            onclick={() => modal.toggle("workflow")}
        >
            <Icon name="plone-lock" />
        </button>
        <button
            type="button"
            title={_t("Tags")}
            aria-label={_t("Tags")}
            aria-pressed={modal.active === "tags"}
            disabled={busy || selection.isEmpty}
            onclick={() => modal.toggle("tags")}
        >
            <Icon name="tags" />
        </button>
        <button
            type="button"
            title={_t("Properties")}
            aria-label={_t("Properties")}
            aria-pressed={modal.active === "properties"}
            disabled={busy || selection.isEmpty}
            onclick={() => modal.toggle("properties")}
        >
            <Icon name="plone-edit" />
        </button>
        <button
            type="button"
            title={_t("Rename")}
            aria-label={_t("Rename")}
            aria-pressed={modal.active === "rename"}
            disabled={busy || selection.isEmpty}
            onclick={() => modal.toggle("rename")}
        >
            <Icon name="plone-rename" />
        </button>
    </div>
</div>
