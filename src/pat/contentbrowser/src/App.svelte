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
        setPreviewUids,
        setShowContentBrowser,
    } from "./stores";

    export let maxDepth;
    export let width;
    export let attributes;
    export let contextPath;
    export let vocabularyUrl;
    export let mode = "browse";
    export let layout = "list";
    export let rootPath = "";
    export let rootUrl = "";
    export let basePath = "";
    export let selectableTypes = [];
    export let browseableTypes = ["Folder", "LIF", "LRF"];
    export let searchIndex = "SearchableText";
    export let maximumSelectionSize = -1;
    export let separator;
    export let selection = [];
    export let query = {};
    export let fieldId;
    export let upload;
    export let favorites;
    export let recentlyUsed;
    export let recentlyUsedKey;
    export let recentlyUsedMaxItems;
    export let bSize = 20;
    export let componentRegistryKeys = {};

    const log = logger.getLogger("pat-contentbrowser");

    // initialize context stores
    setCurrentPath();
    setConfig();
    setPathCache();
    setSelectedItems();
    setShowContentBrowser();
    setSelectedUids();
    setPreviewUids();

    // initially set current path
    const currentPath = getContext("currentPath");

    if (!$currentPath) {
        if (basePath || rootPath) {
            // if root path is not above base path we start at rootPath
            $currentPath = basePath.indexOf(rootPath) != 0 ? rootPath : basePath;
            if (
                rootPath &&
                $currentPath != rootPath &&
                $currentPath.indexOf(rootPath) == 0
            ) {
                // remove rootPath from $currentPath
                $currentPath = $currentPath.replace(rootPath, "");
            }
        } else {
            // no path available. try to determine path from vocabularyUrl
            const vocabPath = new URL(vocabularyUrl).pathname.split("/");
            rootPath =
                contextPath =
                $currentPath =
                    vocabPath.slice(0, vocabPath.length - 1).join("/") || "/";
        }
    }

    let config = getContext("config");
    $config = {
        mode: mode,
        layout: layout,
        attributes: attributes,
        contextPath: contextPath,
        vocabularyUrl: vocabularyUrl,
        width: width,
        maxDepth: maxDepth,
        rootPath: rootPath,
        rootUrl: rootUrl,
        basePath: basePath,
        selectableTypes: selectableTypes,
        browseableTypes: browseableTypes,
        searchIndex: searchIndex,
        maximumSelectionSize: maximumSelectionSize,
        separator: separator,
        selection: selection,
        query: query,
        fieldId: fieldId,
        uploadEnabled: upload,
        favorites: favorites,
        recentlyUsed: recentlyUsed,
        recentlyUsedKey: recentlyUsedKey,
        recentlyUsedMaxItems: recentlyUsedMaxItems,
        pageSize: bSize,
        componentRegistryKeys: componentRegistryKeys,
    };

    log.debug(`Initialized App<${fieldId}> with config`, $config);
</script>

<ContentBrowser />
<SelectedItems />
