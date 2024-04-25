<script>
    import utils from "@patternslib/patternslib/src/core/utils";
    import { getContext } from "svelte";
    import * as animateScroll from "svelte-scrollto";
    import { fly } from "svelte/transition";
    import contentStore from "./ContentStore";
    import { clickOutside } from "./clickOutside";
    import { resolveIcon } from "./resolveIcon.js";
    import Upload from "../../upload/upload";

    // import Keydown from "svelte-keydown";

    animateScroll.setGlobalOptions({
        scrollX: true,
        container: ".levelColumns",
        duration: 500,
    });

    // get context stores
    const currentPath = getContext("currentPath");
    const config = getContext("config");
    const pathCache = getContext("pathCache");
    const showContentBrowser = getContext("showContentBrowser");
    const selectedItems = getContext("selectedItems");
    const selectedUids = getContext("selectedUids");

    // initialize content browser store
    const contentItems = contentStore($config, pathCache);

    let showUpload = false;
    let previewItem = { UID: "" };

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    async function upload() {
        previewItem = { UID: "" };
        showUpload = true;
        await utils.timeout(1);
        const uploadEl = document.querySelector(".upload-wrapper");
        uploadEl.classList.add("pat-upload");
        const patUpload = new Upload(uploadEl, {
            baseUrl: $config.base_url,
            currentPath: $currentPath,
            relativePath: "@@fileUpload",
            allowPathSelection: false,
            hiddenInputContainer: ".upload-wrapper",
            success: (fileUpload, obj) => {
                contentItems.get({ path: $currentPath, updateCache: true });
            },
        });
    }

    function changePath(item) {
        showUpload = false;
        if (item === "/") {
            currentPath.set(item);
            previewItem = { UID: "" };
        } else if ($config.mode == "search") {
            // one level search mode
            previewItem = item;
        } else if (item.is_folderish) {
            currentPath.set(item.path);
            previewItem = { UID: "" };
        } else {
            const pathParts = item.path.split("/");
            const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
            currentPath.set(folderPath);
            previewItem = item;
        }
        scrollToRight();
    }

    async function selectItem(item) {
        selectedItems.update((n) => [...n, item]);
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
        $showContentBrowser = false;
        previewItem = { UID: "" };
    }

    function cancelSelection() {
        $showContentBrowser = false;
        previewItem = { UID: "" };
    }

    function isSelectable(item) {
        return $selectedUids.indexOf(item.UID) === -1;
    }

    function scrollToRight() {
        const scrollContainer = document.querySelector(".levelColumns");
        if (scrollContainer) {
            animateScroll.scrollTo({
                // element: ".levelColumn:last-child",
                x: scrollContainer.scrollWidth + 100,
            });
        }
    }

    function loadMore(entries, observer) {
        entries.forEach(async (entry) => {
            if (entry.intersectionRatio === 0 || contentItems.loading) return;
            await contentItems.loadMore(entry.target.dataset.path, $currentPath);
        });
    }

    function itemInPath(item) {
        return $currentPath.indexOf(item.path) != -1;
    }

    function filterItems() {
        let timeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            contentItems.get({ path: $currentPath, searchTerm: this.value });
        }, 300);
    }

    $: {
        if ($showContentBrowser) {
            contentItems.get({ path: $currentPath });
        }
    }

    $: {
        $contentItems;
        scrollToRight();
    }
</script>

<!-- <Keydown paused={!$showContentBrowser} on:Escape={cancelSelection} /> -->

{#if $showContentBrowser}
    <div class="content-browser-position-wrapper">
        <nav
            class="content-browser"
            transition:fly={{ x: (vw / 100) * 94, opacity: 1 }}
            on:introend={() => scrollToRight()}
            use:clickOutside
            on:click_outside={cancelSelection}
        >
            <div class="toolBar navbar">
                <div class="filter">
                    <input type="text" name="filter" on:input={filterItems} />
                    <label for="filter"
                        ><svg use:resolveIcon={{ iconName: "search" }} /></label
                    >
                </div>
                {#if $config.uploadEnabled}
                    <button
                        type="button"
                        class="upload btn btn-secondary btn-sm"
                        tabindex="0"
                        on:keydown={upload}
                        on:click={upload}
                        ><svg use:resolveIcon={{ iconName: "upload" }} /> upload files to {$currentPath}</button
                    >
                {/if}
                <button
                    class="btn btn-link text-white"
                    tabindex="0"
                    on:click|preventDefault={() => cancelSelection()}
                    ><svg use:resolveIcon={{ iconName: "x-circle" }} /></button
                >
            </div>
            {#await $contentItems}
                <p>...loading content items</p>
            {:then levels}
                <div class="levelColumns">
                    {#each levels as level, i (level.path)}
                        <div
                            class="levelColumn{i % 2 == 0 ? ' odd' : ' even'}"
                            in:fly|local={{ duration: 300 }}
                        >
                            <div class="levelToolbar">
                                {#if i == 0 && level.selectable}
                                    <button
                                        type="button"
                                        class="btn btn-link btn-sm"
                                        tabindex="0"
                                        on:keydown={() => changePath("/")}
                                        on:click={() => changePath("/")}
                                        ><svg
                                            use:resolveIcon={{ iconName: "house" }}
                                        /></button
                                    >
                                {/if}
                                {#if i > 0 && level.selectable}
                                    <button
                                        class="btn btn-primary btn-sm"
                                        disabled={!isSelectable(level)}
                                        on:click|preventDefault={() => selectItem(level)}
                                    >
                                        select {level.path}
                                    </button>
                                {/if}
                                <div class="levelActions">
                                    {#if !level.gridView}
                                        <button
                                            class="btn btn-link btn-sm grid-view"
                                            on:click={() => (level.gridView = true)}
                                        >
                                            <svg
                                                use:resolveIcon={{ iconName: "grid" }}
                                            />
                                        </button>
                                    {:else}
                                        <button
                                            class="btn btn-link btn-sm grid-view"
                                            on:click={() => (level.gridView = false)}
                                        >
                                            <svg
                                                use:resolveIcon={{ iconName: "list" }}
                                            />
                                        </button>
                                    {/if}
                                </div>
                            </div>
                            {#each level.results || [] as item, n}
                                <div
                                    class="contentItem{n % 2 == 0
                                        ? ' odd'
                                        : ' even'}{itemInPath(item)
                                        ? ' inPath'
                                        : ''}{previewItem.UID === item.UID
                                        ? ' currentItem'
                                        : ''}{!isSelectable(item) ? ' text-muted' : ''}"
                                    role="button"
                                    tabindex="0"
                                    on:keydown={() => changePath(item)}
                                    on:click={() => changePath(item)}
                                >
                                    {#if level.gridView}
                                        <div class="grid-preview">
                                            {#if item.getIcon}
                                                <img
                                                    src={`${item.getURL}/@@images/image/thumb`}
                                                    alt={item.Title}
                                                />
                                            {:else}
                                                <svg
                                                    use:resolveIcon={{
                                                        iconName: `contenttype/${item.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                                                    }}
                                                />
                                            {/if}
                                            {item.Title}
                                        </div>
                                    {:else}
                                        <div title={item.portal_type}>
                                            <svg
                                                use:resolveIcon={{
                                                    iconName: `contenttype/${item.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                                                }}
                                            />
                                            {item.Title}
                                        </div>
                                    {/if}
                                    {#if item.is_folderish && $config.mode == "browse"}
                                        <svg
                                            use:resolveIcon={{
                                                iconName: "arrow-right-circle",
                                            }}
                                        />
                                    {/if}
                                </div>
                            {/each}
                            {#if level.total == 0}
                                <div class="contentItem">
                                    <p>no items found.</p>
                                </div>
                            {/if}
                        </div>
                    {/each}
                    {#if previewItem.UID}
                        <div class="preview">
                            <div class="levelToolbar">
                                <button
                                    class="btn btn-primary btn-sm"
                                    disabled={!isSelectable(previewItem)}
                                    on:click|preventDefault={() =>
                                        selectItem(previewItem)}
                                    >select "{previewItem.path.split("/").pop()}"</button
                                >
                            </div>
                            <div class="info">
                                {#if previewItem.portal_type === "Image"}
                                    <div>
                                        <img
                                            src="{previewItem.getURL}/@@images/image/preview"
                                            alt={previewItem.Title}
                                        />
                                    </div>
                                {/if}
                                <h4>{previewItem.Title}</h4>
                                <p>{previewItem.Description}</p>
                            </div>
                        </div>
                    {/if}
                    {#if showUpload}
                        <div class="upload-wrapper"></div>
                    {/if}
                </div>
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        </nav>
    </div>
{/if}

<style>
    .content-browser-position-wrapper {
        position: fixed;
        top: 0;
        right: 0;
        display: flex;
        justify-content: end;
        z-index: 1500;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.25);
    }
    .content-browser {
        height: 100vh;
        min-width: 550px;
        background-color: var(--bs-light-bg-subtle);
        border-left: var(--bs-border-style) var(--bs-border-width) #fff;
        z-index: 1500;
        display: flex;
        flex-direction: column;
    }

    .toolBar {
        background-color: var(--bs-primary);
        padding: 0.325rem 0.75rem;
        color: var(--bs-light);
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .toolBar > .upload {
        margin: 0 1rem 0 auto;
    }
    .toolBar :global(svg) {
        vertical-align: -0.125em;
    }
    .levelColumns {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        overflow: hidden;
        flex-grow: 3;
        border-left: var(--bs-border-style) var(--bs-border-color) var(--bs-border-width);
    }

    .levelColumn {
        min-width: 320px;
        overflow-x: auto;
        border-right: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
        /* border-top: 5px solid transparent; */
    }

    .levelToolbar {
        width: 100%;
        height: 2.8rem;
        display: flex;
        justify-content: space-between;
        padding: 0.375rem;
        border-bottom: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
    }
    .levelToolbar > .levelActions {
        margin-left: auto;
    }

    /* .levelColumn.even {
        border-top: 5px solid skyblue;
    } */

    /* .levelPath {
        background: #eee;
        padding: 0.5rem 1rem;
        height: 3rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    } */
    .contentItem {
        /* padding: 1rem 1rem; */
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 90%;
        min-height: 2rem;
        padding-right: 0.375rem;
    }
    .contentItem.even {
        background-color: var(--bs-secondary-bg);
    }
    .contentItem.inPath {
        background-color: rgba(var(--bs-primary-rgb), 0.15);
    }
    .contentItem.currentItem {
        background-color: var(--bs-primary);
        color: var(--bs-body-bg);
    }
    .contentItem > * {
        padding: 0.5rem;
        white-space: nowrap;
        max-width: 100%;
    }

    .contentItem .grid-preview > img {
        width: 95px;
        height: 95px;
        object-fit: cover;
        float: left;
        margin-right: 1rem;
    }
    .preview {
        min-width: 320px;
        max-width: 500px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .preview .info {
        padding: 0.5rem;
        width: 100%;
    }
    .preview h4 {
        font-size: 1.2 rem;
    }
    .preview img {
        max-width: 100%;
        max-width: 100%;
        margin-bottom: 0.5rem;
    }

    .upload-wrapper {
        padding: 1rem;
        width: 590px;
        overflow-x: auto;
    }
</style>
