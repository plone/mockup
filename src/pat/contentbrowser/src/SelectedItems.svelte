<script>
    import { getContext, onMount, setContext } from "svelte";
    import { get_items_from_uids } from "./utils.js";
    import Sortable from "sortablejs";
    import _t from "../../../core/i18n-wrapper";
    import events from "@patternslib/patternslib/src/core/events";
    import plone_registry from "@plone/registry";

    let ref;
    let initializing = true;
    let RegisteredSelectedItem;

    // get reactive context config
    const config = getContext("config");
    const fieldId = $config.fieldId;
    const selectedItemsNode = document.getElementById(fieldId);

    // get reactive context store
    const selectedItems = getContext("selectedItems");
    const selectedUids = getContext("selectedUids");

    // showContentBrowser reactive state
    const showContentBrowser = getContext("showContentBrowser");

    onMount(async () => {
        await initializeSelectedItemsStore();
        initializeSorting();
        initializing = false;
    });

    async function getSelectedItemComponent() {
        // get selectedItem component from registry.
        // the registry key can be customized with pattern_options
        // if an addon registers a custom component to a custom key
        if ($config.componentRegistryKeys?.selectedItem) {
            RegisteredSelectedItem = plone_registry.getComponent(
                $config.componentRegistryKeys.selectedItem,
            );
        }
        // fallback if no custom component was registered
        // or no valid component in registry
        if (!RegisteredSelectedItem?.component) {
            RegisteredSelectedItem = plone_registry.getComponent(
                "pat-contentbrowser.SelectedItem",
            );
        }
    }

    function unselectItem(uid) {
        selectedItems.update((n) => {
            return n.filter((x) => x.UID !== uid);
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
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
                    draggable: "> div",
                    animation: 200,
                    onUpdate: (e) => {
                        let sortedUuids = [];
                        e.target.querySelectorAll(".selected-item").forEach((el) => {
                            sortedUuids.push(el.dataset["uuid"]);
                        });
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
        const component = new RegisteredSelectedItem.component({
            target: node,
            props: props,
        });
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
    <div
        class="content-browser-selected-items"
        on:click={() => ($showContentBrowser = $selectedItems.length ? false : true)}
    >
        {#if $selectedItems}
            {#await getSelectedItemComponent() then}
                {#each $selectedItems as selItem, i (selItem.UID)}
                    <div use:LoadSelectedItemComponent={{ item: selItem, unselectItem: unselectItem }} />
                {/each}
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        {/if}
        {#if !$selectedItems}
            <p>{_t("loading selected items")}</p>
        {/if}
    </div>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
        class="btn btn-primary"
        href="#"
        style="border-radius:0 var(--bs-border-radius) var(--bs-border-radius) 0"
        on:click|preventDefault={() => ($showContentBrowser = true)}>{$config.uploadEnabled ? _t("Select or Upload") : _t("Select")}</a
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
