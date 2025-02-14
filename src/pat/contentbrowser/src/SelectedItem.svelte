<script>
    import { getContext } from "svelte";
    import { resolveIcon } from "./utils";

    // item data
    export let item;

    // parent method to remove selected item from list
    const unselectItem = getContext("unselectItem");

</script>

<div class="selected-item border border-secondary-subtle rounded p-2 mb-1 bg-body-tertiary" data-uuid={item.UID}>
    <div class="item-info">
        <!-- svelte-ignore a11y-missing-attribute -->
        <button
            class="btn btn-link btn-sm link-secondary"
            on:click|preventDefault={() => unselectItem(item.UID)}
            ><svg use:resolveIcon={{ iconName: "x-circle" }} /></button
        >
        <div>
            <span class="item-title">{item.Title}</span><br />
            <span class="small">{item.path}</span>
        </div>
    </div>
    {#if item.getURL && (item.getIcon || item.portal_type === "Image")}<img
            src="{item.getURL}/@@images/image/mini"
            alt={item.Title}
        />{/if}
</div>

<style>
    .selected-item {
        display: flex;
        flex-wrap: nowrap;
        align-items: start;
        justify-content: space-between;
        cursor: move;
    }
    .selected-item > * {
        margin-right: 0.5rem;
        display: block;
    }
    .selected-item button {
        cursor: pointer;
        padding: 0 0.375rem 0.374rem 0;
    }
    .selected-item .item-info {
        display: flex;
        align-items: start;
    }
    .selected-item > img {
        object-fit: cover;
        width: 95px;
        height: 95px;
    }
</style>
