<script>
    import { getContext } from "svelte";
    import ContentBrowser from "./ContentBrowser.svelte";
    import SelectedItems from "./SelectedItems.svelte";
    import {
        setConfig,
        setSelectedItems,
        setSelectedUids,
        setShowContentBrowser,
    } from "./stores";

    export let maxDepth;
    export let basePath = "";
    export let selectableTypes = [];
    export let maximumSelectionSize = -1;
    export let attributes;
    export let separator;
    export let selection = [];
    export let vocabularyUrl;
    export let fieldId;
    export let upload;

    // initialize context stores
    setConfig();
    setSelectedItems();
    setShowContentBrowser();
    setSelectedUids();

    let config = getContext("config");
    $config = {
        maxDepth: maxDepth,
        basePath: basePath,
        selectableTypes: selectableTypes,
        maximumSelectionSize: maximumSelectionSize,
        attributes: attributes,
        separator: separator,
        selection: selection,
        vocabularyUrl: vocabularyUrl,
        fieldId: fieldId,
        uploadEnabled: upload,
    }

    console.log(`Initialized App<${fieldId}> with config ${JSON.stringify($config)}`);
</script>

<ContentBrowser />
<SelectedItems />
