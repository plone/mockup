<script>
    import { getContext } from "svelte";
    import { flip } from "svelte/animate";
    import ColumnCell from "./ColumnCell.svelte";
    import RowActionMenu from "./RowActionMenu.svelte";
    import { objId } from "../api/operations.js";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/ColumnsStore.svelte").ColumnsStore} */
    const columnsStore = getContext("columns");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ClipboardStore.svelte").ClipboardStore} */
    const clipboard = getContext("clipboard");

    const columns = $derived(columnsStore.columns);
    const colSpan = $derived(columns.length + 2);
    const pageAllSelected = $derived(selection.allSelected(contents.items));
    const canReorder = $derived(contents.sortOn === "getObjPositionInParent");

    // Native HTML5 drag state. `dragIndex` is the row being dragged (>= 0 means
    // an internal drag is in progress, so rows claim the drop instead of letting
    // it bubble to the upload zone); `dropIndex` is the folderish row currently
    // highlighted as a move-into target.
    let dragIndex = $state(-1);
    let dropIndex = $state(-1);

    // Anchor row for shift-click range selection.
    let anchorIndex = $state(-1);

    const dragActive = $derived(dragIndex >= 0);

    // Clicks on these controls (links, buttons, the checkbox, the row menu)
    // keep their own behaviour and must not trigger row selection.
    function isInteractive(target) {
        return target.closest("a, button, input, label");
    }

    function onRowClick(event, item, index) {
        if (isInteractive(event.target)) return;
        if (event.shiftKey && anchorIndex >= 0) {
            selection.selectRange(contents.items, anchorIndex, index);
        } else if (event.ctrlKey || event.metaKey) {
            selection.toggle(item);
            anchorIndex = index;
        } else {
            selection.selectOnly(item);
            anchorIndex = index;
        }
    }

    // Stop shift-click from highlighting cell text while range-selecting.
    function onRowMouseDown(event) {
        if (event.shiftKey && !isInteractive(event.target)) {
            event.preventDefault();
        }
    }

    function isCut(item) {
        return clipboard.op === "cut" && clipboard.sources.includes(item["@id"]);
    }

    function sortIndicator(column) {
        if (!column.sortIndex || contents.sortOn !== column.sortIndex) return "";
        return contents.sortOrder === "ascending" ? " ▲" : " ▼";
    }

    function toggleAll(event) {
        selection.setPage(contents.items, event.currentTarget.checked);
    }

    function onDragStart(index) {
        dragIndex = index;
    }

    function onDragEnd() {
        dragIndex = -1;
        dropIndex = -1;
    }

    function onDragEnter(index) {
        const target = contents.items[index];
        dropIndex = target?.is_folderish && index !== dragIndex ? index : -1;
    }

    // The urls to move when dragging a row: the whole selection if the dragged
    // row is part of a multi-selection, otherwise just that row.
    function dragSources(dragged) {
        if (selection.isSelected(dragged) && selection.count > 1) {
            return selection.urls;
        }
        return [dragged["@id"]];
    }

    async function onDrop(index) {
        const from = dragIndex;
        dragIndex = -1;
        dropIndex = -1;
        if (from < 0) return;
        const target = contents.items[index];
        const dragged = contents.items[from];
        // Dropping onto a folderish row (other than itself) moves into it.
        if (target?.is_folderish && index !== from) {
            await contents.moveIntoFolder(target["@id"], dragSources(dragged));
            selection.clear();
            return;
        }
        // Otherwise reorder, when the listing is in manual-order mode.
        if (from === index || !canReorder) return;
        await contents.moveTo(objId(dragged["@id"]), index - from, contents.currentIds);
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
            <th class="filemanager-actions-col" aria-label={_t("Actions")}></th>
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
                    class:is-cut={isCut(item)}
                    class:dragging={dragIndex === index}
                    class:drop-target={dropIndex === index}
                    draggable="true"
                    animate:flip={{ duration: 200 }}
                    onclick={(e) => onRowClick(e, item, index)}
                    onmousedown={onRowMouseDown}
                    ondragstart={() => onDragStart(index)}
                    ondragenter={() => dragActive && onDragEnter(index)}
                    ondragover={(e) => dragActive && e.preventDefault()}
                    ondragend={() => onDragEnd()}
                    ondrop={(e) => {
                        if (!dragActive) return;
                        e.preventDefault();
                        onDrop(index);
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
