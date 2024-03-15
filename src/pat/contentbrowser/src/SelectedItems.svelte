<script>
    import { getContext, onMount } from "svelte";
    import { flip } from "svelte/animate";
    import { request } from "./api.js";
    import { resolveIcon } from "./resolveIcon.js";

    let ref;
    let initializing = true;

    // get reactive context config
    const config = getContext("config");
    const fieldId = $config.fieldId;
    const selectedItemsNode = document.getElementById(fieldId);

    console.log(`${fieldId} get context config: ${JSON.stringify($config)}`);

    // get reactive context store
    const selectedItems = getContext("selectedItems");
    const selectedUids = getContext("selectedUids");

    console.log(`${fieldId} initialized reactive context store`);

    // showContentBrowser reactive state
    const showContentBrowser = getContext("showContentBrowser");

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
        console.log(`${fieldId} start onMount()`);
        await initializeSelectedItemsStore();
        console.log(
            `${fieldId} end onMount(). $selectedItems: ${JSON.stringify($selectedItems)}`,
        );
        initializing = false;
    });

    function unselectItem(i) {
        selectedItems.update((n) => {
            n.splice(i, 1);
            return n;
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
        console.log(`Unselected i=${i}, new value: ${JSON.stringify($selectedUids)}`);
    }

    async function getSelectedItemsUids(uids) {
        console.log(`${fieldId} getSelectedItemsUids ${uids}`);
        if (!uids) {
            return [];
        }
        const selectedItemsFromUids = await request({
            method: "GET",
            vocabularyUrl: $config.vocabularyUrl,
            attributes: $config.attributes,
            uids: uids,
        });
        return (await selectedItemsFromUids?.results) || [];
    }

    async function initializeSelectedItemsStore() {
        const initialValue = $config.selection.length
            ? $config.selection
            : selectedItemsNode?.value
              ? selectedItemsNode.value.split($config.separator)
              : [];

        if (!initialValue.length) {
            return;
        }

        const selectedItemsUids = await getSelectedItemsUids(initialValue);
        $selectedItems = selectedItemsUids;
        selectedUids.update(() => selectedItemsUids.map((x) => x.UID));

        if ($config.maximumSelectionSize !== 1 && $selectedItems.length > 1) {
            let Sortable = (await import("sortablejs")).default;
            Sortable.create(
                selectedItemsNode.previousSibling.querySelector(
                    ".content-browser-selected-items",
                ),
                {
                    draggable: ".selected-item",
                    animation: 200,
                    onUpdate: (e) => {
                        let sortedUuids = [];
                        for (const el of e.target.children) {
                            sortedUuids.push(el.dataset["uuid"]);
                        }
                        setNodeValue(sortedUuids);
                    },
                },
            );
        }
    }

    function selectedUidsFromSelectedItems() {
        let items = [];
        $selectedItems.forEach((item) => {
            items.push(item.UID);
        });
        return items;
    }

    function setNodeValue(selectedUids) {
        const node_val = selectedUids.join($config.separator);
        console.log(`set value of ${fieldId} to ${node_val}`);
        selectedItemsNode.value = node_val;
    }

    $: {
        $selectedItems;
        console.log(
            `${fieldId} reactive change in $selectedItems: ${JSON.stringify($selectedItems)}`,
        );
        if ($selectedItems.length || !initializing) {
            setNodeValue(selectedUidsFromSelectedItems());
            event_dispatch("updateSelection", selectedUids);
        }
    }
</script>

<div class="content-browser-selected-items-wrapper" bind:this={ref}>
    <!-- {maxSelectionsize} -->
    <div class="content-browser-selected-items">
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
        disabled={$config.maximumSelectionSize > 0 &&
            ($selectedItems.length || 0) >= $config.maximumSelectionSize}
        on:click|preventDefault={() => ($showContentBrowser = true)}
        >{#if config.maximumSelectionSize == 1}choose{:else}add{/if}</button
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
