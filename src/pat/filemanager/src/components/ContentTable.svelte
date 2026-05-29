<script>
    import { getContext } from "svelte";
    import { flip } from "svelte/animate";
    import ColumnCell from "./ColumnCell.svelte";
    import ColumnsConfig from "./ColumnsConfig.svelte";
    import RowActionMenu from "./RowActionMenu.svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/ColumnsStore.svelte").ColumnsStore} */
    const columnsStore = getContext("columns");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ListInteractions.svelte").ListInteractions} */
    const interactions = getContext("interactions");

    const columns = $derived(columnsStore.columns);
    const colSpan = $derived(columns.length + 2);
    const pageAllSelected = $derived(selection.allSelected(contents.items));

    function sortIndicator(column) {
        if (!column.sortIndex || contents.sortOn !== column.sortIndex) return "";
        return contents.sortOrder === "ascending" ? " ▲" : " ▼";
    }

    function toggleAll(event) {
        selection.setPage(contents.items, event.currentTarget.checked);
    }
</script>

<table class="filemanager-table">
    <thead>
        <tr>
            <th class="filemanager-select">
                <input
                    type="checkbox"
                    checked={pageAllSelected}
                    disabled={contents.items.length === 0}
                    onchange={toggleAll}
                    aria-label={_t("Select all on this page")}
                />
            </th>
            {#each columns as column (column.key)}
                <th class="filemanager-header filemanager-header-{column.type}">
                    {#if column.sortIndex}
                        <button
                            type="button"
                            class="filemanager-sort"
                            class:active={contents.sortOn === column.sortIndex}
                            onclick={() => contents.sortBy(column.sortIndex)}
                        >
                            {column.label}{sortIndicator(column)}
                        </button>
                    {:else}
                        {column.label}
                    {/if}
                </th>
            {/each}
            <th class="filemanager-actions-col">
                <ColumnsConfig />
            </th>
        </tr>
    </thead>
    <tbody>
        {#if contents.loading}
            <tr>
                <td class="filemanager-message" colspan={colSpan}>{_t("Loading…")}</td>
            </tr>
        {:else if contents.error}
            <tr>
                <td class="filemanager-message filemanager-error" colspan={colSpan}>
                    {contents.error.message}
                </td>
            </tr>
        {:else if contents.items.length === 0}
            <tr>
                <td class="filemanager-message" colspan={colSpan}>{_t("No items in this folder.")}</td>
            </tr>
        {:else}
            {#each contents.items as item, index (item.UID || item["@id"])}
                <tr
                    class="filemanager-row"
                    class:is-folder={item.is_folderish}
                    class:is-selected={selection.isSelected(item)}
                    class:is-cut={interactions.isCut(item)}
                    class:dragging={interactions.dragIndex === index}
                    class:drop-target={interactions.dropIndex === index}
                    draggable="true"
                    animate:flip={{ duration: 200 }}
                    onclick={(e) => interactions.onItemClick(e, item, index)}
                    onmousedown={(e) => interactions.onItemMouseDown(e)}
                    ondragstart={() => interactions.onDragStart(index)}
                    ondragenter={() => interactions.dragActive && interactions.onDragEnter(index)}
                    ondragover={(e) => interactions.dragActive && e.preventDefault()}
                    ondragend={() => interactions.onDragEnd()}
                    ondrop={(e) => {
                        if (!interactions.dragActive) return;
                        e.preventDefault();
                        interactions.onDrop(index);
                    }}
                >
                    <td class="filemanager-select">
                        <input
                            type="checkbox"
                            checked={selection.isSelected(item)}
                            onchange={() => selection.toggle(item)}
                            aria-label={_t("Select ${name}", { name: item.Title || item["@id"] })}
                        />
                    </td>
                    {#each columns as column (column.key)}
                        <td class="filemanager-cell filemanager-cell-{column.type}">
                            <ColumnCell {item} {column} />
                        </td>
                    {/each}
                    <td class="filemanager-actions-col">
                        <RowActionMenu {item} {index} />
                    </td>
                </tr>
            {/each}
        {/if}
    </tbody>
</table>
