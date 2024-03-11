<script>
    import { onMount } from "svelte";
    import { selectedUids, showContentBrowser, selectedItemsMap } from "./stores.js";
    import { flip } from "svelte/animate";
    import { request } from "./api.js";
    import { resolveIcon } from "./resolveIcon.js";
    import ContentBrowser from "./ContentBrowser.svelte";

    export let maximumSelectionSize;
    export let selectedItemsNode;
    export let contentBrowserWrapperNode;
    export let separator = ";";
    export let selection = []; // inject selected values (eg. TinyMCE)

    // ContentBrowseroptions
    export let maxDepth;
    export let basePath = "";
    export let attributes;
    export let vocabularyUrl;

    let ref;
    // store current fieldId
    const fieldId = selectedItemsNode.getAttribute("id");

    function event_dispatch(name, detail) {
        const event = new CustomEvent(name, {
            detail: {
                content: detail,
            },
            bubbles: true,
        });
        document.dispatchEvent(event);
    }

    onMount(async () => {
        await initializeSelectedItemsStore();
        console.log(fieldId);
        console.log($selectedItemsMap);
    });

    function unselectItem(i) {
        $selectedItemsMap.splice(fieldId, i);
        selectedUids.update(() => $selectedItemsMap.get(fieldId).map((x) => x.UID));
    }

    async function getSelectedItemsUids(uids) {
        if (!uids) {
            return [];
        }
        let selectedItemsFromUids;
        selectedItemsFromUids = await request({
            method: "GET",
            vocabularyUrl: vocabularyUrl,
            attributes: attributes,
            uids: uids,
        });
        return await selectedItemsFromUids.results;
    }

    async function initializeSelectedItemsStore() {
        const initialValue = selection.length
            ? selection
            : selectedItemsNode?.value
              ? selectedItemsNode.value.split(separator)
              : [];

        console.log(`Initializing ${JSON.stringify(initialValue)} for ${fieldId}`);

        if (!initialValue.length) {
            $selectedItemsMap.set(fieldId, []);
            return;
        }

        const selectedItemsUids = await getSelectedItemsUids(initialValue);
        $selectedItemsMap.set(fieldId, selectedItemsUids);
        selectedUids.update(() => selectedItemsUids.map((x) => x.UID));

        if (maximumSelectionSize !== 1) {
            let Sortable = (await import("sortablejs")).default;
            Sortable.create(document.querySelector(".content-browser-selected-items"), {
                draggable: ".selected-item",
                animation: 200,
                onUpdate: (e) => {
                    let sortedUuids = [];
                    for (const el of e.target.children) {
                        sortedUuids.push(el.dataset["uuid"]);
                    }
                    setNodeValue(sortedUuids);
                },
            });
        }
    }

    function selectedUidsFromSelectedItems() {
        let items = [];
        $selectedItemsMap.get(fieldId).forEach((item) => {
            items.push(item.UID);
        });
        return items;
    }

    function setNodeValue(selectedUids) {
        const node_val = selectedUids.join(separator);
        console.log(`set value of ${fieldId} to ${node_val}`);
        selectedItemsNode.value = node_val;
    }

    function openContentBrowser() {
        const component = new ContentBrowser({
            target: contentBrowserWrapperNode,
            props: {
                maxDepth: maxDepth,
                basePath: basePath,
                attributes: attributes,
                vocabularyUrl: vocabularyUrl,
                fieldId: fieldId,
            },
        });
        $showContentBrowser = true;
    }

    $: {
        $selectedItemsMap.get(fieldId);
        if ($selectedItemsMap.get(fieldId)) {
            setNodeValue(selectedUidsFromSelectedItems());
            event_dispatch("updateSelection", selectedUids);
        }
    }
</script>

<div class="content-browser-selected-items-wrapper" bind:this={ref}>
    <!-- {maxSelectionsize} -->
    <div class="content-browser-selected-items">
        {#each $selectedItemsMap.get(fieldId) || [] as selItem, i (selItem.UID)}
            <div
                class="selected-item"
                animate:flip={{ duration: 500 }}
                data-uuid={selItem.UID}
            >
                <div class="item-info">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <button
                        class="btn btn-link btn-sm link-secondary"
                        on:click={() => unselectItem(i)}
                        ><svg use:resolveIcon={{ iconName: "x-circle" }} /></button
                    >
                    <div>
                        <span class="item-title">{selItem.Title}</span><br />
                        <span class="small">{selItem.path}</span>
                    </div>
                </div>
                {#if selItem.getURL && (selItem.getIcon || selItem.portal_type === "Image")}<img
                        src="{selItem.getURL}/@@images/image/mini"
                        alt={selItem.Title}
                    />{/if}
            </div>
        {/each}
        {#if !$selectedItemsMap.get(fieldId)}
            <p>loading selected items</p>
        {/if}
    </div>
    <button
        class="btn btn-primary"
        style="border-radius:0 var(--bs-border-radius) var(--bs-border-radius) 0"
        disabled={maximumSelectionSize > 0 &&
            ($selectedItemsMap.get(fieldId)?.length || 0) >= maximumSelectionSize}
        on:click|preventDefault={openContentBrowser}
        >{#if maximumSelectionSize == 1}choose{:else}add{/if}</button
    >
</div>

<style>
    .content-browser-selected-items-wrapper {
        display: flex;
        align-items: start;
    }
    .content-browser-selected-items {
        list-style: none;
        background-color: var(--bs-body-bg);
        border-radius: var(--bs-border-radius) 0 0 var(--bs-border-radius);
        border: var(--bs-border-style) var(--bs-border-color) var(--bs-border-width);
        min-height: 2.4rem;
        padding: 0.5rem 0.5rem 0 0.5rem;
        flex: 1 1 auto;
    }
    .content-browser-selected-items .selected-item {
        border-radius: var(--bs-border-radius);
        background-color: var(--bs-tertiary-bg);
        border: var(--bs-border-style) var(--bs-border-color) var(--bs-border-width);
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        flex-wrap: nowrap;
        align-items: start;
        justify-content: space-between;
        cursor: move;
    }
    .content-browser-selected-items .selected-item > * {
        margin-right: 0.5rem;
        display: block;
    }
    .content-browser-selected-items .selected-item button {
        cursor: pointer;
        padding: 0 0.375rem 0.374rem 0;
    }
    .content-browser-selected-items .selected-item .item-info {
        display: flex;
        align-items: start;
    }
    .content-browser-selected-items .selected-item > img {
        object-fit: cover;
        width: 95px;
        height: 95px;
    }
</style>
