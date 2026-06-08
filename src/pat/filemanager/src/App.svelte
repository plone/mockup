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
    import { FolderDropStore } from "./stores/FolderDropStore.svelte.ts";
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
    import FolderDropPreview from "./components/FolderDropPreview.svelte";
    import ProgressDialog from "./components/ProgressDialog.svelte";
    import UploadDialog from "./components/UploadDialog.svelte";
    import HeaderSync from "./components/HeaderSync.svelte";

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
        folderType = "Folder",
        viewActionTypes = [],
        headerSelector = "#content > header",
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
        folderType,
        viewActionTypes,
        headerSelector,
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
    const folderDrop = new FolderDropStore();
    const view = new ViewStore(config, storageKey);
    const interactions = new ListInteractions(
        contents,
        selection,
        clipboard,
        upload,
        confirm,
        progress,
        folderDrop
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
    setContext("folderDrop", folderDrop);
    setContext("view", view);
    setContext("interactions", interactions);

    log.debug("Initialized pat-filemanager", config);

    // The "view suffix" is the part of the initial page URL that comes after
    // the context path — e.g. "/folder_contents". Pushed URLs reuse it so that
    // reloading a deep-navigated URL still loads the correct Plone view.
    const initialCtxPath = new URL(contents.contextUrl).pathname.replace(/\/+$/, "");
    const viewSuffix =
        window.location.pathname.startsWith(initialCtxPath)
            ? window.location.pathname.slice(initialCtxPath.length)
            : "";

    // Stamp the initial history entry with state so popstate fires correctly
    // even on the very first back-navigation away from the initial folder.
    history.replaceState({ contextUrl: contents.contextUrl }, "");

    let isRestoringHistory = false;

    onMount(() => {
        contents.load();

        function onPopState(event) {
            const ctx = event.state?.contextUrl;
            if (ctx && ctx !== contents.contextUrl) {
                isRestoringHistory = true;
                contents.navigateTo(ctx).finally(() => {
                    isRestoringHistory = false;
                });
            }
        }
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
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
        if (!isRestoringHistory) {
            const ctxPath = new URL(ctx).pathname.replace(/\/+$/, "");
            history.pushState({ contextUrl: ctx }, "", ctxPath + viewSuffix);
        }
    });
</script>

<div class="pat-filemanager-app" bind:this={appEl}>
    <HeaderSync />
    <StatusMessages />
    <div class="filemanager-stickybar">
        <div class="filemanager-actionbar">
            <Toolbar />
            <FilterBar />
            <ViewSwitcher />
        </div>
    </div>
    <Breadcrumbs />
    <BatchActionModal />
    <ConfirmDialog />
    <FolderDropPreview />
    <ProgressDialog />
    <UploadDialog />
    <UploadZone>
        {#if view.mode === "grid"}
            <ContentGrid />
        {:else}
            <ContentTable />
        {/if}
    </UploadZone>
    <Pagination />
</div>
