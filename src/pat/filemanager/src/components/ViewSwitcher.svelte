<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ViewStore.svelte").ViewStore} */
    const view = getContext("view");

    const labels = {
        table: _t("Table"),
        grid: _t("Grid"),
    };
</script>

<div class="filemanager-viewswitcher" role="group" aria-label={_t("Switch view")}>
    {#each view.available as mode (mode)}
        <button
            type="button"
            class="filemanager-view-button"
            class:active={view.mode === mode}
            aria-pressed={view.mode === mode}
            onclick={() => view.setMode(mode)}
        >
            {labels[mode] || mode}
        </button>
    {/each}
</div>
