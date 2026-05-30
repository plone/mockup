<script>
    import { onMount, setContext } from "svelte";
    import logger from "@patternslib/patternslib/src/core/logging";
    import { ConfigStore } from "./stores/ConfigStore.svelte.ts";
    import { ContentsStore } from "./stores/ContentsStore.svelte.ts";
    import { ColumnsStore } from "./stores/ColumnsStore.svelte.ts";
    import { SelectionStore } from "./stores/SelectionStore.svelte.ts";
    import { ClipboardStore } from "./stores/ClipboardStore.svelte.ts";
    import { ModalStore } from "./stores/ModalStore.svelte.ts";
    import { ConfirmStore } from "./stores/ConfirmStore.svelte.ts";
    import { StatusStore } from "./stores/StatusStore.svelte.ts";
    import { ProgressStore } from "./stores/ProgressStore.svelte.ts";
    import { UploadStore } from "./stores/UploadStore.svelte.ts";
    import { ViewStore } from "./stores/ViewStore.svelte.ts";
    import { ListInteractions } from "./stores/ListInteractions.svelte.ts";
    import Breadcrumbs from "./components/Breadcrumbs.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import FilterBar from "./components/FilterBar.svelte";
    import ViewSwitcher from "./components/ViewSwitcher.svelte";
    import ContentTable from "./components/ContentTable.svelte";
    import ContentGrid from "./components/ContentGrid.svelte";
    import UploadZone from "./components/UploadZone.svelte";
    import Pagination from "./components/Pagination.svelte";
    import StatusMessages from "./components/StatusMessages.svelte";
    import BatchActionModal from "./components/BatchActionModal.svelte";
    import ConfirmDialog from "./components/ConfirmDialog.svelte";
    import ProgressDialog from "./components/ProgressDialog.svelte";

    let {
        contextUrl,
        portalUrl = "",
        contextPath = "",
        activeColumns = [],
        availableColumns = [],
        portalTypes = [],
        searchIndex = "SearchableText",
        defaultBatchSize = 25,
        sortOn = "getObjPositionInParent",
        sortOrder = "ascending",
        defaultView = "table",
        storageKey = "pat-filemanager",
    } = $props();

    const log = logger.getLogger("pat-filemanager");

    const config = new ConfigStore({
        contextUrl,
        portalUrl,
        contextPath,
        activeColumns,
        availableColumns,
        portalTypes,
        searchIndex,
        defaultBatchSize: Number(defaultBatchSize) || 25,
        sortOn,
        sortOrder,
        defaultView,
    });
    const contents = new ContentsStore(config, storageKey);
    const columns = new ColumnsStore(config, storageKey);
    const selection = new SelectionStore(contents);
    const clipboard = new ClipboardStore();
    const modal = new ModalStore();
    const confirm = new ConfirmStore();
    const status = new StatusStore();
    const progress = new ProgressStore();
    const upload = new UploadStore(contents);
    const view = new ViewStore(config, storageKey);
    const interactions = new ListInteractions(
        contents,
        selection,
        clipboard,
        upload,
        confirm,
        progress
    );

    setContext("config", config);
    setContext("contents", contents);
    setContext("columns", columns);
    setContext("selection", selection);
    setContext("clipboard", clipboard);
    setContext("modal", modal);
    setContext("confirm", confirm);
    setContext("status", status);
    setContext("progress", progress);
    setContext("upload", upload);
    setContext("view", view);
    setContext("interactions", interactions);

    log.debug("Initialized pat-filemanager", config);

    onMount(() => {
        contents.load();
    });

    // Browsing into a folder (or up, or via a breadcrumb) all funnel through
    // contents.navigateTo, which re-points contextUrl. When it changes, scroll
    // the app back to the top so a deep scroll position from the previous
    // listing doesn't leave the new folder's contents starting off-screen.
    let appEl;
    let lastContext = contents.contextUrl;
    $effect(() => {
        const ctx = contents.contextUrl;
        if (ctx === lastContext) return;
        lastContext = ctx;
        appEl?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
</script>

<div class="pat-filemanager-app" bind:this={appEl}>
    <StatusMessages />
    <div class="filemanager-toolbar">
        <ViewSwitcher />
    </div>
    <div class="filemanager-actionbar">
        <Toolbar />
        <FilterBar />
    </div>
    <Breadcrumbs />
    <BatchActionModal />
    <ConfirmDialog />
    <ProgressDialog />
    <UploadZone>
        {#if view.mode === "grid"}
            <ContentGrid />
        {:else}
            <ContentTable />
        {/if}
    </UploadZone>
    <Pagination />
</div>
