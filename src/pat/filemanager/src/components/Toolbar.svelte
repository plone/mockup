<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

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
            await contents.paste(clipboard.op, clipboard.sources);
            if (clipboard.op === "cut") clipboard.clear();
        });
    }

    function remove() {
        const count = selection.count;
        const ok = window.confirm(
            _t("Delete ${count} items? This cannot be undone.", { count })
        );
        if (!ok) return;
        return run(async () => {
            await contents.removeItems(selection.urls);
            selection.clear();
        });
    }

    function selectAllInQuery() {
        return run(() => selection.selectAllInQuery());
    }
</script>

<div class="filemanager-actions">
    <button
        type="button"
        class="filemanager-action-upload"
        disabled={busy || upload.active}
        onclick={() => fileInput.click()}
    >
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

    <span class="filemanager-selcount">
        {_t("${count} selected", { count: selection.count })}
    </span>

    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={cut}
    >
        {_t("Cut")}
    </button>
    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={copy}
    >
        {_t("Copy")}
    </button>
    <button
        type="button"
        disabled={busy || clipboard.isEmpty}
        onclick={paste}
    >
        {clipboard.isEmpty
            ? _t("Paste")
            : _t("Paste (${count} ${op})", { count: clipboard.count, op: clipboard.op })}
    </button>
    <button
        type="button"
        class="filemanager-action-delete"
        disabled={busy || selection.isEmpty}
        onclick={remove}
    >
        {_t("Delete")}
    </button>

    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={() => modal.open("workflow")}
    >
        {_t("State")}
    </button>
    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={() => modal.open("tags")}
    >
        {_t("Tags")}
    </button>
    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={() => modal.open("properties")}
    >
        {_t("Properties")}
    </button>
    <button
        type="button"
        disabled={busy || selection.isEmpty}
        onclick={() => modal.open("rename")}
    >
        {_t("Rename")}
    </button>

    {#if selection.count > 0}
        <button
            type="button"
            class="filemanager-action-clear"
            disabled={busy}
            onclick={() => selection.clear()}
        >
            {_t("Clear selection")}
        </button>
    {/if}

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
</div>
