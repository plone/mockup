<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";
    import { dismiss } from "../utils/dismiss.ts";

    /** @type {import("../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../stores/ColumnsStore.svelte").ColumnsStore} */
    const columns = getContext("columns");

    let open = $state(false);
    let dragKey = $state(null);

    const activeDefs = $derived(columns.active.map((key) => config.column(key)));
    const inactiveDefs = $derived(columns.inactive.map((key) => config.column(key)));

    function onDrop(targetKey) {
        if (!dragKey || dragKey === targetKey) return;
        const from = columns.active.indexOf(dragKey);
        const to = columns.active.indexOf(targetKey);
        if (from < 0 || to < 0) return;
        columns.move(dragKey, to - from);
        dragKey = null;
    }
</script>

<div class="filemanager-columns-config" use:dismiss={{ enabled: open, onClose: () => (open = false) }}>
    <button type="button" class="filemanager-columns-toggle" onclick={() => (open = !open)}>
        {_t("Columns")}
    </button>

    {#if open}
        <div class="filemanager-columns-popover" role="group" aria-label={_t("Configure columns")}>
            <p class="filemanager-columns-heading">{_t("Visible columns")}</p>
            <ul class="filemanager-columns-list">
                {#each activeDefs as column, i (column.key)}
                    <li
                        class="filemanager-columns-item"
                        class:dragging={dragKey === column.key}
                        draggable="true"
                        ondragstart={() => (dragKey = column.key)}
                        ondragover={(e) => e.preventDefault()}
                        ondrop={() => onDrop(column.key)}
                        ondragend={() => (dragKey = null)}
                    >
                        <label>
                            <input
                                type="checkbox"
                                checked
                                disabled={columns.active.length <= 1}
                                onchange={() => columns.toggle(column.key)}
                            />
                            {column.label}
                        </label>
                        <span class="filemanager-columns-reorder">
                            <button
                                type="button"
                                aria-label={_t("Move ${name} up", { name: column.label })}
                                disabled={i === 0}
                                onclick={() => columns.move(column.key, -1)}>↑</button
                            >
                            <button
                                type="button"
                                aria-label={_t("Move ${name} down", { name: column.label })}
                                disabled={i === activeDefs.length - 1}
                                onclick={() => columns.move(column.key, 1)}>↓</button
                            >
                        </span>
                    </li>
                {/each}
            </ul>

            {#if inactiveDefs.length}
                <p class="filemanager-columns-heading">{_t("Hidden columns")}</p>
                <ul class="filemanager-columns-list">
                    {#each inactiveDefs as column (column.key)}
                        <li class="filemanager-columns-item">
                            <label>
                                <input
                                    type="checkbox"
                                    onchange={() => columns.toggle(column.key)}
                                />
                                {column.label}
                            </label>
                        </li>
                    {/each}
                </ul>
            {/if}

            <div class="filemanager-columns-actions">
                <button type="button" onclick={() => columns.reset()}>{_t("Reset")}</button>
                <button type="button" onclick={() => (open = false)}>{_t("Done")}</button>
            </div>
        </div>
    {/if}
</div>
