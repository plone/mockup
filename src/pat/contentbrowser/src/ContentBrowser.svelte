<script>
    import utils from "@patternslib/patternslib/src/core/utils";
    import { getContext } from "svelte";
    import * as animateScroll from "svelte-scrollto";
    import { fly } from "svelte/transition";
    import _t from "../../../core/i18n-wrapper";
    import Upload from "../../upload/upload";
    import contentStore from "./ContentStore";
    import {
        clickOutside,
        get_items_from_uids,
        request,
        resolveIcon,
        updateRecentlyUsed,
    } from "./utils";
    import Favorites from "./Favorites.svelte";
    import RecentlyUsed from "./RecentlyUsed.svelte";

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
    const previewUids = getContext("previewUids");

    // initialize content browser store
    const contentItems = contentStore($config, pathCache);

    let showUpload = false;
    let previewItem = {};
    let keyboardNavInitialized = false;
    let shiftKey = false;

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    function updatePreview({ data = null, uuid = null, action = "show" }) {
        if (data && action == "show") {
            previewItem = data;
            $previewUids = [data.UID];
        } else if (uuid && action == "add" && $previewUids.indexOf(uuid) === -1) {
            if (
                $config.maximumSelectionSize > 0 &&
                $previewUids.length >= $config.maximumSelectionSize
            ) {
                // respect maximumSelectionSize
                return;
            }
            $previewUids = [...$previewUids, uuid]; // NOTE: $previewUids.push() is not a reactive change
        } else if (uuid && action == "remove" && $previewUids.indexOf(uuid) !== -1) {
            previewUids.update((n) => {
                n.splice(n.indexOf(uuid), 1);
                return n;
            });
        } else if (action == "clear") {
            previewItem = {};
            $previewUids = [];
        }
    }

    async function upload() {
        updatePreview({ action: "clear" });
        showUpload = true;
        await utils.timeout(1);
        const uploadEl = document.querySelector(".upload-wrapper");
        uploadEl.classList.add("pat-upload");
        const patUpload = new Upload(uploadEl, {
            baseUrl: $config.rootUrl,
            currentPath: $currentPath,
            relativePath: "@@fileUpload",
            allowPathSelection: false,
            hiddenInputContainer: ".upload-wrapper",
            success: (fileUpload, obj) => {
                contentItems.get({ path: $currentPath, updateCache: true });
            },
        });
    }

    function showPreview(item) {
        if ($config.mode == "search") {
            // one level search mode
            updatePreview({ data: item });
        } else if (item.is_folderish) {
            $previewUids = [item.UID];
            currentPath.set(item.path);
        } else {
            const pathParts = item.path.split("/");
            const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
            currentPath.set(folderPath || $config.rootPath);
            updatePreview({ data: item });
        }
        scrollToRight();
    }

    function changePath(item, e) {
        // always hide upload when changing path
        showUpload = false;

        // clear previous selection
        updatePreview({ action: "clear" });

        if (item === "/" || item === $config.rootPath) {
            // clicked "home" button
            currentPath.set($config.rootPath);
            return;
        }

        // show clicked item
        showPreview(item);
    }

    function clickItem(item, e) {
        if (!keyboardNavInitialized) {
            // if we've already clicked an element with the mouse
            // do not start over keyboardnav
            keyboardNavInitialized = true;
        }

        // check for multiselection
        const levelWrapper = e.currentTarget.closest(".levelItems");
        const prevSelection = levelWrapper.querySelectorAll(".selectedItem");

        if (prevSelection.length && $config.maximumSelectionSize != 1) {
            // check for pressed shift or ctrl/meta key for multiselection

            if (shiftKey || e?.shiftKey) {
                // iter through the wrapper children and select all
                // inbetween current selection and last preview
                let select = false;
                for (const el of levelWrapper.children) {
                    if ([item.UID, previewItem.UID].indexOf(el.dataset.uuid) !== -1) {
                        if (select) {
                            // stop selecting but make sure the last item is selected too
                            updatePreview({
                                uuid: el.dataset.uuid,
                                action: "add",
                            });
                            select = false;
                            continue;
                        }
                        // start selecting
                        select = true;
                    }
                    updatePreview({
                        uuid: el.dataset.uuid,
                        action: select ? "add" : "remove",
                    });
                }
            } else if (e?.metaKey || e?.ctrlKey) {
                // de/select multiple single items
                // NOTE: only for mouse click event
                updatePreview({
                    uuid: item.UID,
                    action: $previewUids.indexOf(item.UID) == -1 ? "add" : "remove",
                });
            } else {
                // unselect
                [...prevSelection].map((el) => el.classList.remove("selectedItem"));
                changePath(item, e);
            }
        } else {
            changePath(item, e);
        }

        e.currentTarget.focus(); // needed for keyboard navigation
        e.currentTarget.classList.add("selectedItem");
    }

    function initKeyboardNav() {
        // focus first element when showing contentbrowser
        if (keyboardNavInitialized) {
            return;
        }
        const possibleFocusEls = [
            ...document.querySelectorAll(".levelColumn .inPath"), // previously selected folder
            ...document.querySelectorAll(".levelColumn .selectedItem"), // previously selected item
        ];
        if(!possibleFocusEls.length && document.querySelector(".levelColumn .contentItem")) {
            possibleFocusEls.push(document.querySelector(".levelColumn .contentItem"));
        }
        if (possibleFocusEls.length) {
            keyboardNavInitialized = true;
            possibleFocusEls[0].focus();
        }
    }

    function keyboardNavigation(item, e) {
        const node = e.currentTarget;
        shiftKey = e.shiftKey;
        if (e.key == "Escape") {
            cancelSelection();
        }
        if (
            e.key == "ArrowDown" &&
            node?.nextElementSibling?.classList.contains("contentItem")
        ) {
            node.nextElementSibling.click();
        }
        if (
            e.key == "ArrowUp" &&
            node?.previousElementSibling?.classList.contains("contentItem")
        ) {
            node.previousElementSibling.click();
        }
        if (e.key == "ArrowRight") {
            const currCol = e.target.closest(".levelColumn");
            const nxtCol = currCol?.nextElementSibling;
            if (!nxtCol || !nxtCol.classList.contains("levelColumn")) {
                return;
            }
            nxtCol.querySelector(".contentItem")?.click();
        }
        if (e.key == "ArrowLeft") {
            const currCol = e.target.closest(".levelColumn");
            const prevCol = currCol?.previousElementSibling;
            if (!prevCol || !prevCol.classList.contains("levelColumn")) {
                return;
            }
            prevCol.querySelector(".inPath").click();
        }
        if (e.key == "Space") {
            // add item to selection (like metaKey + click)
            clickItem(item, e, true);
        }
        if (e.key == "Enter") {
            if (isSelectable(item)) {
                if ($config.maximumSelectionSize == 1) {
                    addItem(item);
                } else {
                    addSelectedItems();
                }
            }
        }
    }

    async function addItem(item) {
        if ($config.maximumSelectionSize == 1) {
            selectedItems.set([item]);
            selectedUids.set([item.UID]);
        } else {
            selectedItems.update((n) => [...n, item]);
            selectedUids.update(() => $selectedItems.map((x) => x.UID));
        }
        updateRecentlyUsed(item, $config);
        updatePreview({ action: "clear" });
        $showContentBrowser = false;
        keyboardNavInitialized = false;
    }

    async function addSelectedItems() {
        const previewItems = await get_items_from_uids($previewUids, $config);
        selectedItems.update((n) => {
            for (const it of previewItems) {
                if ($selectedUids.indexOf(it.UID) != -1) continue;
                n.push(it);
            }
            return n;
        });
        selectedUids.update(() => $selectedItems.map((x) => x.UID));
        updatePreview({ action: "clear" });
        $showContentBrowser = false;
        keyboardNavInitialized = false;
    }

    function selectRecentlyUsed(event) {
        addItem(event.detail.item);
    }

    async function selectFavorite(event) {
        const path = event.detail.item.path;
        const response = await request({
            vocabularyUrl: $config.vocabularyUrl,
            attributes: $config.attributes,
            levelInfoPath: path,
        });
        if (!response.total) {
            alert(`${path} not found!`);
            return;
        }
        const item = response.results[0];
        if (!item.path) {
            // fix for root
            item.path = $config.rootPath;
        }
        changePath(item);
    }

    function cancelSelection() {
        $showContentBrowser = false;
        keyboardNavInitialized = false;
        updatePreview({ action: "clear" });
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

    function itemInPath(item) {
        return $config.mode == "browse" && $currentPath.indexOf(item.path) != -1;
    }

    const filterItems = utils.debounce((e) => {
        contentItems.get({ path: $currentPath, searchTerm: e.target.value });
    }, 300);

    function loadMore(node) {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const path = node.dataset.levelPath;
                        const page = parseInt(node.dataset.levelNextPage);
                        contentItems.get({
                            loadMorePath: path,
                            page: page,
                        });
                    }
                }
            },
            { threshold: 0, root: null, margin: "0px" },
        );
        // defer observing
        window.setTimeout(() => {
            observer.observe(node);
        }, 500);
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

    $: {
        $previewUids;
    }
</script>

{#if $showContentBrowser}
    <div class="content-browser-position-wrapper">
        <nav
            class="content-browser"
            transition:fly={{ x: (vw / 100) * 94, opacity: 1 }}
            on:introend={() => {
                scrollToRight();
                initKeyboardNav();
            }}
            use:clickOutside
            on:click_outside={cancelSelection}
        >
            <div class="toolBar navbar">
                <div class="filter me-3">
                    <input type="text" name="filter" on:input={filterItems} />
                    <label for="filter"
                        ><svg use:resolveIcon={{ iconName: "search" }} /></label
                    >
                </div>
                <RecentlyUsed on:selectItem={selectRecentlyUsed} />
                <Favorites on:selectItem={selectFavorite} />
                {#if $config.uploadEnabled}
                    <div class="ms-2">
                        <button
                            type="button"
                            class="upload btn btn-outline-light btn-sm"
                            tabindex="0"
                            on:keydown={upload}
                            on:click={upload}
                            ><svg use:resolveIcon={{ iconName: "upload" }} />
                            {_t("upload to ${current_path}", {
                                current_path: $currentPath,
                            })}</button
                        >
                    </div>
                {/if}
                <button
                    class="btn btn-link text-white ms-auto"
                    tabindex="0"
                    on:click|preventDefault={() => cancelSelection()}
                    ><svg use:resolveIcon={{ iconName: "x-circle" }} /></button
                >
            </div>
            {#await $contentItems}
                <p>{_t("loading content items")}</p>
            {:then levels}
                <div class="levelColumns">
                    {#each levels as level, i (level.path)}
                        <div
                            class="levelColumn{i % 2 == 0 ? ' odd' : ' even'}"
                            in:fly|local={{ duration: 300 }}
                        >
                            <div class="levelToolbar">
                                {#if i == 0 && $config.mode == "browse"}
                                    <button
                                        type="button"
                                        class="btn btn-link btn-xs ps-0"
                                        tabindex="0"
                                        on:keydown={() => changePath($config.rootPath)}
                                        on:click={() => changePath($config.rootPath)}
                                        ><svg
                                            use:resolveIcon={{ iconName: "house" }}
                                        /></button
                                    >
                                {/if}
                                {#if level.selectable}
                                    <button
                                        class="btn btn-primary btn-xs"
                                        title="{level.displayPath}"
                                        disabled={!isSelectable(level)}
                                        on:click|preventDefault={() => addItem(level)}
                                    >
                                        {_t("select ${level_path}", {
                                            level_path: level.Title,
                                        })}
                                    </button>
                                {/if}
                                <div class="levelActions">
                                    {#if !level.gridView}
                                        <button
                                            class="btn btn-link btn-xs grid-view"
                                            on:click={() => (level.gridView = true)}
                                        >
                                            <svg
                                                use:resolveIcon={{ iconName: "grid" }}
                                            />
                                        </button>
                                    {:else}
                                        <button
                                            class="btn btn-link btn-xs grid-view"
                                            on:click={() => (level.gridView = false)}
                                        >
                                            <svg
                                                use:resolveIcon={{ iconName: "list" }}
                                            />
                                        </button>
                                    {/if}
                                </div>
                            </div>
                            <div class="levelItems">
                                {#each level.results || [] as item, n}
                                    <!-- svelte-ignore missing-declaration -->
                                    <div
                                        class="contentItem{n % 2 == 0
                                            ? ' odd'
                                            : ' even'}{itemInPath(item)
                                            ? ' inPath'
                                            : ''}{$previewUids.indexOf(item.UID) != -1
                                            ? ' selectedItem'
                                            : ''}{!isSelectable(item)
                                            ? ' text-muted'
                                            : ''}"
                                        role="button"
                                        tabindex={n}
                                        data-uuid={item.UID}
                                        on:keydown|preventDefault={(e) =>
                                            keyboardNavigation(item, e)}
                                        on:click={(e) => clickItem(item, e)}
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
                                            <div
                                                class="item-title"
                                                title="{item.portal_type}: {item.Title}"
                                            >
                                                <svg
                                                    use:resolveIcon={{
                                                        iconName: `contenttype/${item.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                                                    }}
                                                />
                                                {item.Title}
                                                {#if $config.mode == "search"}
                                                <br><span class="small">{item.path}</span>
                                                {/if}
                                            </div>
                                        {/if}
                                        {#if item.is_folderish && $config.mode == "browse"}
                                            <div class="browseSub">
                                                <svg
                                                    use:resolveIcon={{
                                                        iconName: "arrow-right-circle",
                                                    }}
                                                />
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                                {#if level.more}
                                    <div
                                        class="loadmore"
                                        data-level-path={level.path}
                                        data-level-next-page={parseInt(level.page) + 1}
                                        use:loadMore
                                    >
                                        <div class="spinner-border" role="status"></div>
                                    </div>
                                {/if}
                                {#if level.total == 0}
                                    <div class="contentItem">
                                        <p>{_t("no results found")}</p>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                    {#if previewItem?.UID && $previewUids.length == 1}
                        <div class="preview">
                            <div class="levelToolbar">
                                <button
                                    class="btn btn-primary btn-xs"
                                    disabled={!isSelectable(previewItem)}
                                    on:click|preventDefault={() => addItem(previewItem)}
                                    >{_t("select ${preview_path}", {
                                        preview_path: previewItem.path.split("/").pop(),
                                    })}</button
                                >
                            </div>
                            <div class="info">
                                {#if previewItem.getIcon}
                                    <div class="previewImage">
                                        <img
                                            src="{previewItem.getURL}/@@images/image/preview"
                                            alt={previewItem.Title}
                                        />
                                    </div>
                                {:else}
                                    <div class="previewIcon">
                                        <svg
                                            use:resolveIcon={{
                                                iconName: `contenttype/${previewItem.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                                            }}
                                        />
                                    </div>
                                {/if}
                                <h4>{previewItem.Title}</h4>
                                <p>{previewItem.Description}</p>
                            </div>
                        </div>
                    {/if}
                    {#if $previewUids.length > 1}
                        <div class="preview">
                            <div class="levelToolbar">
                                <button
                                    class="btn btn-primary btn-xs"
                                    on:click|preventDefault={addSelectedItems}
                                    >{_t("add selected items")}</button
                                >
                            </div>
                            <div class="info">
                                <svg
                                    use:resolveIcon={{
                                        iconName: "files",
                                    }}
                                />
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
    .btn-xs {
        --bs-btn-padding-y: 0.15rem;
        --bs-btn-padding-x: 0.5rem;
        --bs-btn-font-size: 0.75rem;
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
        justify-content: start;
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
        user-select: none;
    }

    .levelColumn {
        width: 320px;
        border-right: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
        display: flex;
        flex-direction: column;
    }

    .levelToolbar {
        width: 100%;
        height: 2.5rem;
        display: flex;
        justify-content: space-between;
        padding: 0.375rem;
        border-bottom: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
    }
    .levelToolbar > .levelActions {
        margin-left: auto;
    }
    .levelToolbar > button{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .levelItems {
        overflow-x: auto;
    }
    .contentItem {
        /* padding: 1rem 1rem; */
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 90%;
        min-height: 2rem;
    }
    .contentItem:focus-visible {
        outline: none;
    }
    .contentItem.even {
        background-color: rgba(var(--bs-secondary-bg-rgb), .4);
    }
    .contentItem.inPath,
    .contentItem:focus {
        background-color: rgba(var(--bs-primary-rgb), 0.15);
    }
    .contentItem.selectedItem {
        background-color: var(--bs-primary);
        color: var(--bs-body-bg);
    }
    .contentItem > * {
        padding: 0.5rem;
        white-space: nowrap;
        max-width: 450px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .contentItem > .browseSub {
        flex-shrink: 0;
    }

    .contentItem .grid-preview > img {
        width: 95px;
        height: 95px;
        object-fit: cover;
        float: left;
        margin-right: 1rem;
    }
    .preview {
        width: 320px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .preview .info {
        padding: 0.5rem;
        width: 100%;
        word-wrap: anywhere;
    }
    .preview .info .previewIcon {
        margin: 0 auto 1rem auto;
    }
    .preview .info .previewIcon svg {
        width: 50px !important;
        height: 50px !important;
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
    .loadmore {
        text-align: center;
        padding: 0.25rem 0;
    }
</style>
