<script>
    import { getContext, onMount, setContext } from "svelte";
    import { get_items_from_uids } from "./utils.js";
    import Sortable from "sortablejs";
    import _t from "../../../core/i18n-wrapper";
    import events from "@patternslib/patternslib/src/core/events";
    import plone_registry from "@plone/registry";

    let ref;
    let initializing = true;

    // get reactive context config
    const config = getContext("config");
    const fieldId = $config.fieldId;
    const selectedItemsNode = document.getElementById(fieldId);

    // get reactive context store
    const selectedItems = getContext("selectedItems");
    const selectedUids = getContext("selectedUids");

    // showContentBrowser reactive state
    const showContentBrowser = getContext("showContentBrowser");

    // get selectedItem component from registry.
    // the registry key can be customized with pattern_options
    // if an addon registers a custom component to a custom key
    const RegisteredSelectedItem = plone_registry.getComponent(
        $config.componentRegistryKeys?.selectedItem || "pat-contentbrowser.SelectedItem"
    );

    onMount(async () => {
        await initializeSelectedItemsStore();
        initializeSorting();
        initializing = false;
    });

    function unselectItem(i) {
        selectedItems.update((n) => {
            n.splice(i, 1);
            return n;
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
    }

    // use this function in "SelectedItem" component with
    // const unselectItem = getContext("unselectItem")
    setContext("unselectItem", unselectItem);

    async function initializeSelectedItemsStore() {
        const initialValue = $config.selection.length
            ? $config.selection
            : selectedItemsNode?.value
              ? selectedItemsNode.value.split($config.separator)
              : [];

        if (!initialValue.length) {
            return;
        }

        $selectedItems = await get_items_from_uids(initialValue, $config);
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
    }

    function initializeSorting() {
        if ($config.maximumSelectionSize !== 1 && $selectedItems.length > 1) {
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
        selectedItemsNode.value = node_val;
        selectedItemsNode.dispatchEvent(events.change_event());
    }

    function LoadSelectedItemComponent(node, props) {
        const component = new RegisteredSelectedItem.component({target: node, props: props});
    }

    $: {
        $selectedItems;
        if ($selectedItems.length || !initializing) {
            setNodeValue(selectedUidsFromSelectedItems());
            initializeSorting();
        }
    }
</script>

<div
    class="content-browser-selected-items-wrapper"
    style="width: {$config.width || 'auto'}"
    bind:this={ref}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="content-browser-selected-items"
         on:click={() => $showContentBrowser = $selectedItems.length ? false : true }>
        {#if $selectedItems}
            {#each $selectedItems as selItem, i (selItem.UID)}
                <div use:LoadSelectedItemComponent={{idx:i, item:selItem}} />
            {/each}
        {/if}
        {#if !$selectedItems}
            <p>{_t("loading selected items")}</p>
        {/if}
    </div>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
        class="btn btn-primary" href="#"
        style="border-radius:0 var(--bs-border-radius) var(--bs-border-radius) 0"
        on:click|preventDefault={() => ($showContentBrowser = true)}
        >{_t("Select")}</a
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
</style>
