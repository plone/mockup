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
    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");

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

    // Drag a column header onto another to reorder the visible columns (the
    // ColumnsConfig popover offers the same via keyboard). `dragColKey` is the
    // header being dragged, `dropColKey` the one currently hovered.
    let dragColKey = $state(null);
    let dropColKey = $state(null);

    function onColDragStart(key) {
        dragColKey = key;
    }

    function onColDragEnter(key) {
        if (dragColKey && key !== dragColKey) dropColKey = key;
    }

    function onColDragOver(event) {
        if (dragColKey) event.preventDefault();
    }

    function onColDrop(targetKey) {
        if (dragColKey && dragColKey !== targetKey) {
            const from = columnsStore.active.indexOf(dragColKey);
            const to = columnsStore.active.indexOf(targetKey);
            if (from >= 0 && to >= 0) columnsStore.move(dragColKey, to - from);
        }
        dragColKey = null;
        dropColKey = null;
    }

    function onColDragEnd() {
        dragColKey = null;
        dropColKey = null;
    }
</script>

<table class="filemanager-table" class:can-reorder={interactions.canReorder}>
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
                <th
                    class="filemanager-header filemanager-header-{column.type}"
                    class:col-dragging={dragColKey === column.key}
                    class:col-drop-target={dropColKey === column.key}
                    draggable="true"
                    ondragstart={() => onColDragStart(column.key)}
                    ondragenter={() => onColDragEnter(column.key)}
                    ondragover={onColDragOver}
                    ondrop={() => onColDrop(column.key)}
                    ondragend={onColDragEnd}
                >
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
                {@const folderTask = progress.folderTask(item["@id"])}
                <tr
                    class="filemanager-row"
                    class:is-folder={item.is_folderish}
                    class:is-selected={selection.isSelected(item)}
                    class:is-cut={interactions.isCut(item)}
                    class:dragging={interactions.dragIndex === index}
                    class:is-busy={folderTask}
                    class:drop-target={interactions.dropIndex === index ||
                        interactions.fileDropIndex === index}
                    draggable="true"
                    animate:flip={{ duration: 200 }}
                    onclick={(e) => interactions.onItemClick(e, item, index)}
                    onmousedown={(e) => interactions.onItemMouseDown(e)}
                    ondragstart={() => interactions.onDragStart(index)}
                    ondragenter={(e) => interactions.onRowDragEnter(e, index)}
                    ondragover={(e) => interactions.onRowDragOver(e, index)}
                    ondragend={() => interactions.onDragEnd()}
                    ondrop={(e) => interactions.onRowDrop(e, index)}
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
                        {#if folderTask}
                            <div class="filemanager-row-progress" title={folderTask.label}>
                                <span class="filemanager-row-progress-label">
                                    {folderTask.label}
                                </span>
                                <progress aria-label={folderTask.label}></progress>
                            </div>
                        {/if}
                    </td>
                </tr>
            {/each}
        {/if}
    </tbody>
</table>
