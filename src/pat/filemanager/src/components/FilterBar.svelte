<script>
    import { getContext, onMount } from "svelte";
    import { fetchQuerystringConfig } from "../api/querystring.js";
    import { _t } from "../utils/i18n.ts";
    import { dismiss } from "../utils/dismiss.ts";
    import QueryBuilder from "./QueryBuilder.svelte";
    import GridSizeSlider from "./GridSizeSlider.svelte";
    import Icon from "./Icon.svelte";

    /** @type {import("../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/ViewStore.svelte").ViewStore} */
    const view = getContext("view");

    let text = $state(contents.searchableText);
    let qsConfig = $state(null);
    let queryOpen = $state(false);
    let debounce;

    onMount(async () => {
        try {
            qsConfig = await fetchQuerystringConfig(config.contextUrl);
        } catch {
            qsConfig = null;
        }
    });

    function onInput(event) {
        text = event.currentTarget.value;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            contents.applyFilters({ searchableText: text });
        }, 300);
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
    {#if view.mode === "grid"}
        <GridSizeSlider />
    {/if}

    <div class="filemanager-search-group">
        <input
            type="search"
            class="filemanager-search"
            placeholder={_t("Search…")}
            value={text}
            oninput={onInput}
            aria-label={_t("Search")}
        />

        {#if qsConfig}
            <div
                class="filemanager-queryfilter"
                use:dismiss={{ enabled: queryOpen, onClose: () => (queryOpen = false) }}
            >
                <button
                    type="button"
                    class="filemanager-queryfilter-toggle"
                    class:has-filter={contents.extraCriteria.length}
                    onclick={() => (queryOpen = !queryOpen)}
                >
                    <Icon name="filter" />
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
    </div>

    {#if !contents.isManualOrder}
        <button
            type="button"
            class="filemanager-sort-reset"
            title={_t("Notice: Drag and drop reordering is disabled when viewing the contents sorted by a column.")}
            onclick={() => contents.resetSort()}
        >
            <Icon name="arrow-counterclockwise" />
            {_t("Reset column sorting")}
        </button>
    {/if}

    {#if contents.hasActiveFilters}
        <button type="button" class="filemanager-filter-clear" onclick={clearAll}>{_t("Clear")}</button>
    {/if}
</div>
