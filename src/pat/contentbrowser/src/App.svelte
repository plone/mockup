<script>
    import logger from "@patternslib/patternslib/src/core/logging";
    import { getContext } from "svelte";
    import ContentBrowser from "./ContentBrowser.svelte";
    import SelectedItems from "./SelectedItems.svelte";
    import {
        setConfig,
        setCurrentPath,
        setPathCache,
        setSelectedItems,
        setSelectedUids,
        setShowContentBrowser,
    } from "./stores";

    export let maxDepth;
    export let attributes;
    export let contextPath;
    export let vocabularyUrl;
    export let mode = "browse";
    export let basePath = "";
    export let selectableTypes = [];
    export let maximumSelectionSize = -1;
    export let separator;
    export let selection = [];
    export let query = {};
    export let fieldId;
    export let upload;
    export let recentlyUsed;
    export let recentlyUsedKey;
    export let bSize = 20;

    const log = logger.getLogger("pat-contentbrowser");

    // initialize context stores
    setCurrentPath();
    setConfig();
    setPathCache();
    setSelectedItems();
    setShowContentBrowser();
    setSelectedUids();

    // initially set current path
    const currentPath = getContext("currentPath");

    if (!$currentPath) {
        $currentPath = basePath || "/";
    }

    // base_url information
    const base_url = document.body.getAttribute("data-portal-url");

    let config = getContext("config");
    $config = {
        mode: mode,
        attributes: attributes,
        contextPath: contextPath,
        vocabularyUrl: vocabularyUrl,
        maxDepth: maxDepth,
        basePath: basePath,
        selectableTypes: selectableTypes,
        maximumSelectionSize: maximumSelectionSize,
        separator: separator,
        selection: selection,
        query: query,
        fieldId: fieldId,
        uploadEnabled: upload,
        recentlyUsed: recentlyUsed,
        recentlyUsedKey: recentlyUsedKey,
        base_url: base_url,
        pageSize: bSize,
    };

    log.debug(`Initialized App<${fieldId}> with config ${JSON.stringify($config)}`);
</script>

<ContentBrowser />
<SelectedItems />
