<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");

    // A tri-state select-all/deselect control: selects the whole page when
    // nothing is selected and resets the selection (clears an all-in-query
    // selection too) otherwise. Doubles as the "N selected" indicator.
    const pageAllSelected = $derived(selection.allSelected(contents.items));
    const someSelected = $derived(contents.items.some((it) => selection.isSelected(it)));

    function toggleAll() {
        if (someSelected) selection.clear();
        else selection.setPage(contents.items, true);
    }
</script>

<label class="filemanager-grid-selectall">
    <input
        type="checkbox"
        checked={pageAllSelected}
        indeterminate={someSelected && !pageAllSelected}
        disabled={contents.items.length === 0}
        onchange={toggleAll}
        aria-label={someSelected ? _t("Deselect all") : _t("Select all on this page")}
    />
    {#if someSelected}
        {_t("${count} selected", { count: selection.count })}
    {:else}
        {_t("Select all")}
    {/if}
</label>
