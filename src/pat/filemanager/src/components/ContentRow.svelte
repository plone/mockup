<script>
    import { getContext } from "svelte";
    import ColumnCell from "./ColumnCell.svelte";
    import RowActionMenu from "./RowActionMenu.svelte";
    import { _t } from "../utils/i18n.ts";

    /**
     * @type {{
     *   item: Record<string, any>,
     *   index: number,
     *   canReorder?: boolean,
     *   dragActive?: boolean,
     *   dragging?: boolean,
     *   isDropTarget?: boolean,
     *   onDragStart?: (index: number) => void,
     *   onDragEnter?: (index: number) => void,
     *   onDragEnd?: () => void,
     *   onDrop?: (index: number) => void,
     * }}
     */
    let {
        item,
        index,
        canReorder = false,
        dragActive = false,
        dragging = false,
        isDropTarget = false,
        onDragStart = () => {},
        onDragEnter = () => {},
        onDragEnd = () => {},
        onDrop = () => {},
    } = $props();

    /** @type {import("../stores/ColumnsStore.svelte").ColumnsStore} */
    const columnsStore = getContext("columns");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ClipboardStore.svelte").ClipboardStore} */
    const clipboard = getContext("clipboard");

    const columns = $derived(columnsStore.columns);
    const selected = $derived(selection.isSelected(item));
    const cut = $derived(clipboard.op === "cut" && clipboard.sources.includes(item["@id"]));
</script>

<tr
    class="filemanager-row"
    class:is-folder={item.is_folderish}
    class:is-selected={selected}
    class:is-cut={cut}
    class:dragging
    class:drop-target={isDropTarget}
    draggable="true"
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
            checked={selected}
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
