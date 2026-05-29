<script>
    import { untrack } from "svelte";
    import {
        enabledIndexes,
        operatorsForIndex,
        widgetFor,
        selectionValues,
        hasValue,
    } from "../api/querystring.js";
    import { _t } from "../utils/i18n.ts";

    /**
     * Native query-builder mirroring pat-structure's QueryString widget: rows of
     * index / operation / value that serialise to plone.app.querystring
     * `{i, o, v}` criteria. Emits the complete criteria via `onApply` on change.
     *
     * @type {{
     *   config: { indexes: object },
     *   criteria?: Array<{ i: string, o: string, v?: unknown }>,
     *   onApply: (criteria: Array<{ i: string, o: string, v?: unknown }>) => void,
     * }}
     */
    let { config, criteria = [], onApply } = $props();

    const indexes = $derived(enabledIndexes(config));
    // Group the index options for <optgroup> rendering (Text / Dates / Metadata).
    const grouped = $derived(
        indexes.reduce((acc, idx) => {
            (acc[idx.group] ||= []).push(idx);
            return acc;
        }, /** @type {Record<string, typeof indexes>} */ ({})),
    );

    // Seed rows from the incoming criteria so reopening the popover shows the
    // active query. Each row carries its derived widget for value editing.
    let rows = $state(
        untrack(() => criteria.map((c) => ({ i: c.i, o: c.o, v: c.v ?? "" }))),
    );

    function defaultValue(widget) {
        if (widget === "DateRangeWidget") return ["", ""];
        if (widget === "MultipleSelectionWidget") return [];
        return "";
    }

    function emit() {
        const complete = rows.filter(
            (r) => r.i && r.o && hasValue(widgetFor(config, r.i, r.o), r.v),
        );
        onApply(complete.map((r) => ({ i: r.i, o: r.o, v: r.v })));
    }

    function addRow() {
        rows = [...rows, { i: "", o: "", v: "" }];
    }

    function removeRow(index) {
        rows = rows.filter((_, i) => i !== index);
        emit();
    }

    function onIndexChange(index, value) {
        const ops = operatorsForIndex(config, value);
        const o = ops[0]?.value || "";
        rows[index] = { i: value, o, v: defaultValue(o ? ops[0].widget : null) };
        emit();
    }

    function onOperatorChange(index, value) {
        rows[index] = {
            ...rows[index],
            o: value,
            v: defaultValue(widgetFor(config, rows[index].i, value)),
        };
        emit();
    }
</script>

<div class="filemanager-querybuilder">
    {#if rows.length === 0}
        <p class="filemanager-querybuilder-empty">{_t("No filters yet.")}</p>
    {/if}

    {#each rows as row, index (index)}
        {@const operators = operatorsForIndex(config, row.i)}
        {@const widget = widgetFor(config, row.i, row.o)}
        <div class="filemanager-querybuilder-row">
            <select
                class="filemanager-querybuilder-index"
                aria-label={_t("Criteria")}
                value={row.i}
                onchange={(e) => onIndexChange(index, e.currentTarget.value)}
            >
                <option value="">{_t("Select criteria")}</option>
                {#each Object.entries(grouped) as [group, options] (group)}
                    <optgroup label={group}>
                        {#each options as option (option.value)}
                            <option value={option.value}>{option.title}</option>
                        {/each}
                    </optgroup>
                {/each}
            </select>

            {#if row.i}
                <select
                    class="filemanager-querybuilder-operator"
                    aria-label={_t("Operator")}
                    value={row.o}
                    onchange={(e) => onOperatorChange(index, e.currentTarget.value)}
                >
                    {#each operators as op (op.value)}
                        <option value={op.value}>{op.title}</option>
                    {/each}
                </select>
            {/if}

            {#if widget === "StringWidget"}
                <input
                    type="text"
                    class="filemanager-querybuilder-value"
                    bind:value={row.v}
                    onchange={emit}
                    aria-label={_t("Value")}
                />
            {:else if widget === "DateWidget"}
                <input
                    type="date"
                    class="filemanager-querybuilder-value"
                    bind:value={row.v}
                    onchange={emit}
                    aria-label={_t("Value")}
                />
            {:else if widget === "DateRangeWidget"}
                <span class="filemanager-querybuilder-range">
                    <input type="date" bind:value={row.v[0]} onchange={emit} aria-label={_t("From")} />
                    <span>{_t("to")}</span>
                    <input type="date" bind:value={row.v[1]} onchange={emit} aria-label={_t("To")} />
                </span>
            {:else if widget === "RelativeDateWidget"}
                <span class="filemanager-querybuilder-relativedate">
                    <input
                        type="number"
                        class="filemanager-querybuilder-value"
                        bind:value={row.v}
                        onchange={emit}
                        aria-label={_t("Value")}
                    />
                    <span>{_t("days")}</span>
                </span>
            {:else if widget === "MultipleSelectionWidget"}
                <select
                    multiple
                    class="filemanager-querybuilder-value filemanager-querybuilder-multi"
                    bind:value={row.v}
                    onchange={emit}
                    aria-label={_t("Value")}
                >
                    {#each selectionValues(config, row.i) as option (option.value)}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            {:else if widget === "ReferenceWidget" || widget === "RelativePathWidget"}
                <input
                    type="text"
                    class="filemanager-querybuilder-value"
                    placeholder={_t("Path")}
                    bind:value={row.v}
                    onchange={emit}
                    aria-label={_t("Path")}
                />
            {/if}

            <button
                type="button"
                class="filemanager-querybuilder-remove"
                onclick={() => removeRow(index)}
                aria-label={_t("Remove criteria")}
            >×</button>
        </div>
    {/each}

    <button type="button" class="filemanager-querybuilder-add" onclick={addRow}>
        {_t("Add criteria")}
    </button>
</div>
