<script>
    import { getContext, onMount } from "svelte";
    import { fetchQuerystringConfig, typeOptions } from "../api/querystring.js";
    import { _t } from "../utils/i18n.ts";
    import { dismiss } from "../utils/dismiss.ts";
    import QueryBuilder from "./QueryBuilder.svelte";

    /** @type {import("../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");

    let text = $state(contents.searchableText);
    let types = $state([]);
    let qsConfig = $state(null);
    let typesOpen = $state(false);
    let queryOpen = $state(false);
    let debounce;

    onMount(async () => {
        try {
            qsConfig = await fetchQuerystringConfig(config.contextUrl);
            types = typeOptions(qsConfig);
        } catch {
            qsConfig = null;
            types = [];
        }
    });

    function onInput(event) {
        text = event.currentTarget.value;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            contents.applyFilters({ searchableText: text });
        }, 300);
    }

    function toggleType(value) {
        const next = contents.selectedTypes.includes(value)
            ? contents.selectedTypes.filter((v) => v !== value)
            : [...contents.selectedTypes, value];
        contents.applyFilters({ selectedTypes: next });
    }

    function applyQuery(criteria) {
        contents.applyFilters({ extraCriteria: criteria });
    }

    function clearAll() {
        text = "";
        clearTimeout(debounce);
        contents.clearFilters();
    }
</script>

<div class="filemanager-filterbar">
    <input
        type="search"
        class="filemanager-search"
        placeholder={_t("Search…")}
        value={text}
        oninput={onInput}
        aria-label={_t("Search")}
    />

    {#if types.length}
        <div
            class="filemanager-typefilter"
            use:dismiss={{ enabled: typesOpen, onClose: () => (typesOpen = false) }}
        >
            <button type="button" onclick={() => (typesOpen = !typesOpen)}>
                {contents.selectedTypes.length
                    ? _t("Type (${count})", { count: contents.selectedTypes.length })
                    : _t("Type")}
            </button>
            {#if typesOpen}
                <div class="filemanager-typefilter-popover" role="group" aria-label={_t("Filter by type")}>
                    {#each types as option (option.value)}
                        <label>
                            <input
                                type="checkbox"
                                checked={contents.selectedTypes.includes(option.value)}
                                onchange={() => toggleType(option.value)}
                            />
                            {option.label}
                        </label>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}

    {#if qsConfig}
        <div
            class="filemanager-queryfilter"
            use:dismiss={{ enabled: queryOpen, onClose: () => (queryOpen = false) }}
        >
            <button type="button" onclick={() => (queryOpen = !queryOpen)}>
                {contents.extraCriteria.length
                    ? _t("Filter (${count})", { count: contents.extraCriteria.length })
                    : _t("Filter")}
            </button>
            {#if queryOpen}
                <div class="filemanager-queryfilter-popover" role="group" aria-label={_t("Advanced filter")}>
                    <QueryBuilder
                        config={qsConfig}
                        criteria={contents.extraCriteria}
                        onApply={applyQuery}
                    />
                </div>
            {/if}
        </div>
    {/if}

    {#if contents.hasActiveFilters}
        <button type="button" class="filemanager-filter-clear" onclick={clearAll}>{_t("Clear")}</button>
    {/if}
</div>
