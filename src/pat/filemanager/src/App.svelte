<script>
    import { onMount, setContext } from "svelte";
    import logger from "@patternslib/patternslib/src/core/logging";
    import { ConfigStore } from "./stores/ConfigStore.svelte.ts";
    import { ContentsStore } from "./stores/ContentsStore.svelte.ts";
    import { ColumnsStore } from "./stores/ColumnsStore.svelte.ts";
    import { SelectionStore } from "./stores/SelectionStore.svelte.ts";
    import { ClipboardStore } from "./stores/ClipboardStore.svelte.ts";
    import { ModalStore } from "./stores/ModalStore.svelte.ts";
    import { StatusStore } from "./stores/StatusStore.svelte.ts";
    import { UploadStore } from "./stores/UploadStore.svelte.ts";
    import { ViewStore } from "./stores/ViewStore.svelte.ts";
    import { ListInteractions } from "./stores/ListInteractions.svelte.ts";
    import Breadcrumbs from "./components/Breadcrumbs.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import FilterBar from "./components/FilterBar.svelte";
    import ViewSwitcher from "./components/ViewSwitcher.svelte";
    import ColumnsConfig from "./components/ColumnsConfig.svelte";
    import ContentTable from "./components/ContentTable.svelte";
    import ContentGrid from "./components/ContentGrid.svelte";
    import UploadZone from "./components/UploadZone.svelte";
    import Pagination from "./components/Pagination.svelte";
    import StatusMessages from "./components/StatusMessages.svelte";
    import BatchActionModal from "./components/BatchActionModal.svelte";

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
    const status = new StatusStore();
    const upload = new UploadStore(contents);
    const view = new ViewStore(config, storageKey);
    const interactions = new ListInteractions(contents, selection, clipboard);

    setContext("config", config);
    setContext("contents", contents);
    setContext("columns", columns);
    setContext("selection", selection);
    setContext("clipboard", clipboard);
    setContext("modal", modal);
    setContext("status", status);
    setContext("upload", upload);
    setContext("view", view);
    setContext("interactions", interactions);

    log.debug("Initialized pat-filemanager", config);

    onMount(() => {
        contents.load();
    });
</script>

<div class="pat-filemanager-app">
    <Breadcrumbs />
    <StatusMessages />
    <div class="filemanager-toolbar">
        <FilterBar />
        <ViewSwitcher />
        <ColumnsConfig />
    </div>
    <Toolbar />
    <BatchActionModal />
    <UploadZone>
        {#if view.mode === "grid"}
            <ContentGrid />
        {:else}
            <ContentTable />
        {/if}
    </UploadZone>
    <Pagination />
</div>
