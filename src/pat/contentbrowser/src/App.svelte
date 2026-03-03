<script>
    import logger from "@patternslib/patternslib/src/core/logging";
    import { getContext } from "svelte";
    import { get } from "svelte/store";
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

    let {
        maxDepth,
        width,
        attributes,
        contextPath: contextPathProp,
        vocabularyUrl,
        mode = "browse",
        layout = "list",
        rootPath: rootPathProp = "",
        rootUrl = "",
        basePath = "",
        selectableTypes = [],
        browseableTypes = [],
        searchIndex = "SearchableText",
        maximumSelectionSize = -1,
        separator,
        selection = [],
        query = {},
        fieldId,
        upload,
        uploadAddImmediately = true,
        uploadAcceptedMimetypes,
        favorites,
        recentlyUsed,
        recentlyUsedKey,
        recentlyUsedMaxItems,
        bSize = 20,
        sortOn = "sortable_title",
        sortOrder = "ascending",
        componentRegistryKeys = {},
    } = $props();

    // Local mutable copies of the two props that may be reassigned locally
    let rootPath = $state(rootPathProp);
    let contextPath = $state(contextPathProp);

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

    if (!get(currentPath)) {
        let initialPath = "";
        if (basePath || rootPath) {
            // if root path is not above base path we start at rootPath
            initialPath = basePath.indexOf(rootPath) != 0 ? rootPath : basePath;
            if (
                rootPath &&
                initialPath != rootPath &&
                initialPath.indexOf(rootPath) == 0
            ) {
                // remove rootPath from $currentPath
                initialPath = initialPath.replace(rootPath, "");
            }
        } else {
            // no path available. try to determine path from vocabularyUrl
            const vocabPath = new URL(vocabularyUrl).pathname.split("/");
            initialPath =
                rootPath =
                contextPath =
                    vocabPath.slice(0, vocabPath.length - 1).join("/") || "/";
        }
        currentPath.set(initialPath);
    }

    const config = getContext("config");
    config.set({
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
        uploadAddImmediately: uploadAddImmediately,
        uploadAcceptedMimetypes: uploadAcceptedMimetypes,
        favorites: favorites,
        recentlyUsed: recentlyUsed,
        recentlyUsedKey: recentlyUsedKey,
        recentlyUsedMaxItems: recentlyUsedMaxItems,
        pageSize: bSize,
        sortOn: sortOn,
        sortOrder: sortOrder,
        componentRegistryKeys: componentRegistryKeys,
    });

    log.debug(`Initialized App<${fieldId}> with config`, config);
</script>

<ContentBrowser />
<SelectedItems />
