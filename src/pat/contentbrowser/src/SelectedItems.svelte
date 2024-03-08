<script>
    import utils from "@patternslib/patternslib/src/core/utils";
    import { onMount } from "svelte";
    import { selectedItems, selectedUids, showContentBrowser } from "./stores.js";
    import { flip } from "svelte/animate";
    import { request } from "./api.js";
    import { resolveIcon } from "./resolveIcon.js";

    export let maximumSelectionSize;
    export let selectedItemsNode;
    export let separator = ";";
    export let selection = []; // inject selected values (eg. TinyMCE)

    let ref;
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
        initializeSelectedItemsStore();
    });

    function unselectItem(i) {
        selectedItems.update((n) => {
            n.splice(i, 1);
            return n;
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
    }

    async function getSelectedItemsByUids(uids) {
        if (!uids) {
            return [];
        }
        let selectedItemsFromUids;
        selectedItemsFromUids = await request({ method: "GET", uids: uids });
        return await selectedItemsFromUids.results;
    }

    async function initializeSelectedItemsStore() {
        const initialValue = selection.length
            ? selection
            : selectedItemsNode?.value.split(separator);
        debugger;
        const selectedItemsFromUids = await getSelectedItemsByUids(initialValue);
        $selectedItems = selectedItemsFromUids;
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
        await utils.timeout(1);
        let Sortable = await import("sortablejs");
        Sortable = Sortable.default;
        Sortable.create(document.querySelector(".content-browser-selected-items"), {
            draggable: ".selected-item",
            onUpdate: (e) => {
                let sortedUuids = [];
                for (const el of e.target.children) {
                    sortedUuids.push(el.dataset["uuid"]);
                }
                setNodeValue(sortedUuids);
            },
        });
    }

    function selectedUidsFromSelectedItems() {
        let items = [];
        $selectedItems.forEach((item) => {
            items.push(item.UID);
        });
        return items;
    }

    function setNodeValue(selectedUids) {
        selectedItemsNode.value = selectedUids.join(separator);
    }

    $: {
        $selectedItems;
        if ($selectedItems.length) {
            setNodeValue(selectedUidsFromSelectedItems());
            event_dispatch("updateSelection", selectedUids);
        }
    }
</script>

<div class="content-browser-selected-items-wrapper" bind:this={ref}>
    <!-- {maxSelectionsize} -->
    <div
        class="content-browser-selected-items"
        tabindex="0"
        role="button"
        on:click={() => ($showContentBrowser = !$selectedItems.length)}
        on:keyup={() => ($showContentBrowser = !$selectedItems.length)}
    >
        {#if $selectedItems}
            {#each $selectedItems as selItem, i (selItem.UID)}
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
        {/if}
        {#if !$selectedItems}
            <p>loading selected items</p>
        {/if}
    </div>
    <button
        class="btn btn-primary"
        style="border-radius:0 var(--bs-border-radius) var(--bs-border-radius) 0"
        disabled={maximumSelectionSize > 0 &&
            $selectedItems.length >= maximumSelectionSize}
        on:click|preventDefault={() => ($showContentBrowser = true)}>add</button
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
