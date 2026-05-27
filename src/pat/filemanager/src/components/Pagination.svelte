<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");

    const batchSizes = [10, 25, 50, 100];

    const rangeStart = $derived(contents.total === 0 ? 0 : contents.bStart + 1);
    const rangeEnd = $derived(Math.min(contents.bStart + contents.bSize, contents.total));
</script>

<div class="filemanager-pagination">
    <span class="filemanager-range">
        {rangeStart}–{rangeEnd} of {contents.total}
    </span>

    <div class="filemanager-pager">
        <button
            type="button"
            disabled={contents.currentPage <= 1 || contents.loading}
            onclick={() => contents.goToPage(contents.currentPage - 1)}
        >
            {_t("Previous")}
        </button>
        <span class="filemanager-page"
            >{_t("Page ${current} / ${total}", {
                current: contents.currentPage,
                total: contents.pageCount,
            })}</span
        >
        <button
            type="button"
            disabled={contents.currentPage >= contents.pageCount || contents.loading}
            onclick={() => contents.goToPage(contents.currentPage + 1)}
        >
            {_t("Next")}
        </button>
    </div>

    <label class="filemanager-batchsize">
        {_t("Per page")}
        <select
            value={contents.bSize}
            onchange={(e) => contents.setBatchSize(Number(e.currentTarget.value))}
        >
            {#each batchSizes as size (size)}
                <option value={size}>{size}</option>
            {/each}
        </select>
    </label>
</div>
