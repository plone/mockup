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
    import Breadcrumbs from "./components/Breadcrumbs.svelte";
    import Toolbar from "./components/Toolbar.svelte";
    import FilterBar from "./components/FilterBar.svelte";
    import ColumnsConfig from "./components/ColumnsConfig.svelte";
    import ContentTable from "./components/ContentTable.svelte";
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
    });
    const contents = new ContentsStore(config, storageKey);
    const columns = new ColumnsStore(config, storageKey);
    const selection = new SelectionStore(contents);
    const clipboard = new ClipboardStore();
    const modal = new ModalStore();
    const status = new StatusStore();
    const upload = new UploadStore(contents);

    setContext("config", config);
    setContext("contents", contents);
    setContext("columns", columns);
    setContext("selection", selection);
    setContext("clipboard", clipboard);
    setContext("modal", modal);
    setContext("status", status);
    setContext("upload", upload);

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
        <ColumnsConfig />
    </div>
    <Toolbar />
    <UploadZone>
        <ContentTable />
    </UploadZone>
    <Pagination />
    <BatchActionModal />
</div>
