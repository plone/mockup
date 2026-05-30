<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";
    import Icon from "./Icon.svelte";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");

    const batchSizes = [10, 25, 50, 100];

    const rangeStart = $derived(contents.total === 0 ? 0 : contents.bStart + 1);
    const rangeEnd = $derived(Math.min(contents.bStart + contents.bSize, contents.total));

    let paginationEl;

    // Scroll the whole app back to the top after paging or resizing the batch,
    // so the new page's first row starts in view instead of mid-listing (mirrors
    // App.svelte's scroll-to-top on folder navigation).
    function scrollToTop() {
        paginationEl
            ?.closest(".pat-filemanager-app")
            ?.scrollIntoView({ block: "start", behavior: "smooth" });
    }

    function goToPage(page) {
        contents.goToPage(page);
        scrollToTop();
    }

    function changeBatchSize(size) {
        contents.setBatchSize(size);
        scrollToTop();
    }
</script>

<div class="filemanager-pagination" bind:this={paginationEl}>
    <span class="filemanager-range">
        {rangeStart}–{rangeEnd} of {contents.total}
    </span>

    <div class="filemanager-pager">
        <button
            type="button"
            class="filemanager-pager-button"
            title={_t("Previous")}
            aria-label={_t("Previous")}
            disabled={contents.currentPage <= 1 || contents.loading}
            onclick={() => goToPage(contents.currentPage - 1)}
        >
            <Icon name="chevron-left" />
        </button>
        <span class="filemanager-page"
            >{_t("Page ${current} / ${total}", {
                current: contents.currentPage,
                total: contents.pageCount,
            })}</span
        >
        <button
            type="button"
            class="filemanager-pager-button"
            title={_t("Next")}
            aria-label={_t("Next")}
            disabled={contents.currentPage >= contents.pageCount || contents.loading}
            onclick={() => goToPage(contents.currentPage + 1)}
        >
            <Icon name="chevron-right" />
        </button>
    </div>

    <div class="filemanager-batchsize" role="group" aria-label={_t("Per page")}>
        {#each batchSizes as size (size)}
            <button
                type="button"
                class="filemanager-batchsize-button"
                class:active={contents.bSize === size}
                aria-pressed={contents.bSize === size}
                disabled={contents.loading}
                onclick={() => changeBatchSize(size)}
            >
                {size}
            </button>
        {/each}
    </div>
</div>
