<!-- <svelte:options tag="miller-columns-browser" /> -->
<script>
    import { onMount } from "svelte";
    import { selectedItems, selectedUids, showContentBrowser } from "./stores.js";
    import { flip } from "svelte/animate";
    import { request } from "./api.js";

    export let maxSelectionsize;
    export let selectedItemsNode;

    onMount(async () => {
        readSelectedItemsFromInput();
        selectedItemsNode.addEventListener("change", readSelectedItemsFromInput);
    });

    function unselectItem(i) {
        selectedItems.update((n) => {
            n.splice(i, 1);
            return n;
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID))
        if (!$selectedItems.length) {
            writeSelectedItemsUidsToInput();
        }
    }

    async function readSelectedItemsFromInput() {
        const uidsFromNode = selectedItemsNode.value.split(";");
        selectedUids.set(uidsFromNode);
        selectedItems.set(await getSelectedItemsByUids(uidsFromNode))
    }

    async function getSelectedItemsByUids(uids) {
        let selectedItemsFromUids = {results: []};
        selectedItemsFromUids = await request({method:"GET", uids:uids});
        return selectedItemsFromUids.results;
    }

    function writeSelectedItemsUidsToInput() {
        // const uids = $selectedItems.map((x) => x.UID);
        selectedItemsNode.value = $selectedUids.join(";");
    }

    $: {
        $selectedItems;
        if ($selectedItems.length) {
            writeSelectedItemsUidsToInput();
        }
    }

</script>


<div class="content-browser-selected-items-wrapper">
{$selectedUids}
    <button
        class="btn btn-primary"
        disabled="{$selectedItems.length >= maxSelectionsize}"
        on:click={() => ($showContentBrowser = true)}>add</button>

    <ul class="content-browser-selected-items">
        {#if $selectedItems}
            {#each $selectedItems as selItem, i (selItem.UID)}
                <li class="selected-item" animate:flip={{ duration: 500 }}>
                    <button class="btn btn-sm btn-danger"
                        on:click={() => unselectItem(i)}
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                            />
                        </svg></button
                    >
                    <span class="item-title">{selItem.Title}</span>
                    {#if selItem.getURL && (selItem.getIcon || selItem.portal_type === "Image")}<img
                            src="{selItem.getURL}/@@images/image/mini"
                            alt={selItem.Title}
                        />{/if}
                </li>
            {/each}
        {/if}
        {#if !$selectedItems}
            <p>loading selected items</p>
        {/if}
    </ul>
</div>

<style>

    .content-browser-selected-items {
        list-style: none;
        padding-left: 0;
        background-color: #eee;
        border-radius: 0.3rem;
        min-height: 2rem;
        padding: 0.5rem;
    }
    .content-browser-selected-items li {
        border-radius: 0.3rem;
        background-color: #fff;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .content-browser-selected-items li > * {
        margin-right: 0.5rem;
        display: block;
    }
    .content-browser-selected-items li .item-title {
        flex-grow: 3;
    }
    .content-browser-selected-items li > img {
        object-fit: cover;
        width: 128px;
        height: 128px;
    }

</style>
