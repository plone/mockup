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
        formatDate,
        get_items_from_uids,
        iconTag,
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
    let searchTerm = null;
    let gridView = ($config.layout || "list") === "grid";
    let defaultConfigMode = $config.mode;

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
        scrollToRight();
        showUpload = true;
        await utils.timeout(1);
        const uploadEl = document.querySelector(".upload-wrapper");
        uploadEl.classList.add("pat-upload");
        let validation_errors = false;

        const patUpload = new Upload(uploadEl, {
            baseUrl: $config.rootUrl,
            currentPath: $currentPath,
            relativePath: "@@fileUpload",
            allowPathSelection: false,
            hiddenInputContainer: ".upload-wrapper",
            maxFiles:
                $config.maximumSelectionSize > 0 ? $config.maximumSelectionSize : null,
            acceptedFiles: $config.uploadAcceptedMimetypes,
            success: (fileupload, obj) => {
                if ($config.maximumSelectionSize == 1) {
                    // remove currently selected item and save the uid of the uploaded item
                    selectedItems.set([]);
                    $previewUids = [obj.UID];
                } else {
                    // in multiselect mode we add the uploaded item to the previous selection
                    updatePreview({ uuid: obj.UID, action: "add" });
                }
            },
            error(file, message) {
                validation_errors = true;
                // see dropzone.js docs for message structure
                if (file.previewElement) {
                    file.previewElement.classList.add("dz-error");
                    if (typeof message !== "string" && message.error) {
                        message = message.error;
                    }
                    for (let node of file.previewElement.querySelectorAll(
                        "[data-dz-errormessage]",
                    )) {
                        node.textContent = message;
                    }
                }
            },
            queuecomplete: (fileUpload, obj) => {
                if (validation_errors) {
                    // there was an error uploading one or more files
                    return;
                }
                if ($config.uploadAddImmediately) {
                    addSelectedItems();
                } else {
                    // refresh current path to show uploaded items
                    contentItems.get({ path: $currentPath, updateCache: true });
                }
                showUpload = false;
            },
        });
    }

    function isBrowseable(item) {
        return (
            item.is_folderish &&
            (!$config.browseableTypes.length ||
                $config.browseableTypes.indexOf(item.portal_type) != -1)
        );
    }

    function isSelectable(item) {
        return (
            $selectedUids.indexOf(item.UID) === -1 &&
            (!$config.selectableTypes.length ||
                $config.selectableTypes.indexOf(item.portal_type) != -1)
        );
    }

    function showPreview(item) {
        if ($config.mode == "browse") {
            $previewUids = [item.UID];

            if (isBrowseable(item)) {
                // show folder
                currentPath.set(item.path);
            } else {
                // show non folderish preview
                const pathParts = item.path.split("/");
                const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
                currentPath.set(folderPath || "/");
                updatePreview({ data: item });
            }
        } else {
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
        let prevSelection = levelWrapper.querySelectorAll(".selectedItem");

        if (prevSelection.length && $config.maximumSelectionSize != 1) {
            // check for pressed shift or ctrl/meta key for multiselection
            if (shiftKey || e?.shiftKey) {
                // iter through the wrapper children and select all
                // inbetween current selection and last preview
                let select = false;
                for (const el of levelWrapper.children) {
                    if ([item.UID, $previewUids[0]].indexOf(el.dataset.uuid) !== -1) {
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
                shiftKey = false;
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
        if (
            !possibleFocusEls.length &&
            document.querySelector(".levelColumn .contentItem")
        ) {
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
            closeBrowser();
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
        closeBrowser();
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
        closeBrowser();
    }

    function selectRecentlyUsed(event) {
        addItem(event.detail.item);
    }

    function itemId(item) {
        return item.path?.split("/").pop() || "- no id -";
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

    function closeBrowser() {
        // hide levelfilter and clear all filters
        filterLevel("");
        // clear search
        searchTerm = null;
        $config.mode = defaultConfigMode;
        $showContentBrowser = false;
        keyboardNavInitialized = false;
        updatePreview({ action: "clear" });
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
        const item_path = item.path.split("/");
        const curr_path = $currentPath.split("/");
        let in_path = true;
        for (const idx in item_path) {
            // check path parts to be equal
            in_path = in_path && item_path[idx] === curr_path[idx];
        }
        return in_path;
    }

    const searchItemsKeyup = utils.debounce(async (e) => {
        await searchItems(e.target.value);
    }, 300);

    async function searchItems(val) {
        searchTerm = val;
        if (defaultConfigMode === "browse") {
            // switching to search mode in global search if configured as "browse" mode
            $config.mode = searchTerm !== "" ? "search" : "browse";
        }
        await contentItems.get({
            path: $currentPath,
            searchTerm: searchTerm,
            mode: $config.mode,
        });
        updatePreview({ action: "clear" });
        if (!val) {
            scrollToRight();
        }
    }

    const filterLevelKeyup = utils.debounce(async (e) => {
        await filterLevel(e.target.value);
    }, 300);

    const filterLevel = async (val) => {
        if (val !== "") {
            updatePreview({ action: "clear" });
        } else {
            scrollToRight();
        }
        await contentItems.get({
            path: $currentPath,
            searchTerm: val,
            updateCache: true,
        });
    };

    function loadMore(node) {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        contentItems.get({
                            loadMorePath: node.dataset.levelPath,
                            page: +node.dataset.levelNextPage,
                            searchTerm: node.dataset.searchTerm,
                        });
                    }
                }
            },
            { threshold: 0, root: null, margin: "0px" },
        );
        // defer observing
        window.setTimeout(() => {
            observer.observe(node);
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
            on:click_outside={closeBrowser}
        >
            <div class="toolBar navbar">
                <div class="input-group w-auto">
                    <input
                        type="text"
                        name="filter"
                        class="form-control form-control-sm"
                        value={searchTerm}
                        on:input={searchItemsKeyup}
                    />
                    {#if searchTerm}
                        <button
                            class="btn btn-light btn-sm"
                            type="button"
                            on:click|preventDefault={() => searchItems("")}
                            ><svg use:resolveIcon={{ iconName: "x" }} /></button
                        >
                    {/if}
                </div>
                <RecentlyUsed on:selectItem={selectRecentlyUsed} />
                <Favorites on:selectItem={selectFavorite} />
                {#if $config.uploadEnabled && $config.mode == "browse"}
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
                    on:click|preventDefault={() => closeBrowser()}
                    ><svg use:resolveIcon={{ iconName: "x-circle" }} /></button
                >
            </div>
            {#await $contentItems}
                <p>{_t("loading content items")}</p>
            {:then levels}
                <div class="levelColumns">
                    {#each levels as level, i (level.path)}
                        {#if $previewUids.length < 2 || !$previewUids.includes(level.UID)}
                            <div
                                class="levelColumn{i % 2 == 0 ? ' odd' : ' even'} {i ===
                                levels.length - 1
                                    ? 'active'
                                    : ''}"
                                in:fly|local={{ duration: 500 }}
                            >
                                <div class="levelToolbar">
                                    {#if i == 0 && $config.mode == "browse"}
                                        <button
                                            type="button"
                                            class="btn btn-link btn-xs ps-0"
                                            tabindex="0"
                                            on:keydown={() =>
                                                changePath($config.rootPath)}
                                            on:click={() => changePath($config.rootPath)}
                                            ><svg
                                                use:resolveIcon={{ iconName: "house" }}
                                            /></button
                                        >
                                    {/if}
                                    {#if i == levels.length - 1}
                                        {#if level.selectable && !level.showFilter && !previewItem.UID}
                                            <button
                                                class="btn btn-xs btn-outline-primary d-flex align-items-center"
                                                title={_t("select ${level_path}", {
                                                    level_path:
                                                        level.Title || itemId(level),
                                                })}
                                                disabled={!isSelectable(level)}
                                                on:click|preventDefault={() =>
                                                    addItem(level)}
                                                ><svg
                                                    use:resolveIcon={{
                                                        iconName: "plus",
                                                    }}
                                                />
                                                <span class="select-button-ellipsis"
                                                    >{level.Title || itemId(level)}</span
                                                ></button
                                            >
                                        {/if}
                                        <div class="levelActions">
                                            {#if $config.mode !== "search"}
                                                {#if level.searchTerm || level.showFilter}
                                                    <input
                                                        type="text"
                                                        name="levelFilter"
                                                        class="form-control form-control-sm"
                                                        value={level.searchTerm || ""}
                                                        on:input={filterLevelKeyup}
                                                    />
                                                    <button
                                                        class="btn btn-link btn-xs level-filter"
                                                        title={_t("clear filter")}
                                                        on:click|preventDefault={() => {
                                                            filterLevel("");
                                                            level.showFilter = false;
                                                        }}
                                                    >
                                                        <svg
                                                            use:resolveIcon={{
                                                                iconName: "x",
                                                            }}
                                                        /></button
                                                    >
                                                {:else}
                                                    <button
                                                        class="btn btn-link btn-xs level-filter"
                                                        title={_t("level filter")}
                                                        on:click|preventDefault={() =>
                                                            (level.showFilter = true)}
                                                    >
                                                        <svg
                                                            use:resolveIcon={{
                                                                iconName: "filter",
                                                            }}
                                                        /></button
                                                    >
                                                {/if}
                                            {/if}
                                            {#if !gridView}
                                                <button
                                                    class="btn btn-link btn-xs grid-view"
                                                    title={_t("grid view")}
                                                    on:click={() => (gridView = true)}
                                                >
                                                    <svg
                                                        use:resolveIcon={{
                                                            iconName: "grid",
                                                        }}
                                                    />
                                                </button>
                                            {:else}
                                                <button
                                                    class="btn btn-link btn-xs grid-view"
                                                    title={_t("list view")}
                                                    on:click={() => (gridView = false)}
                                                >
                                                    <svg
                                                        use:resolveIcon={{
                                                            iconName: "list",
                                                        }}
                                                    />
                                                </button>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>
                                <div class="levelItems">
                                    {#each level.results || [] as item, n}
                                        <!-- svelte-ignore missing-declaration -->
                                        <div
                                            class="contentItem{n % 2 == 0
                                                ? ' odd'
                                                : ' even'}{itemInPath(item)
                                                ? ' inPath'
                                                : ''}{$previewUids.indexOf(item.UID) !=
                                            -1
                                                ? ' selectedItem'
                                                : ''}{!isSelectable(item) &&
                                            !isBrowseable(item)
                                                ? ' text-body-tertiary'
                                                : ''}"
                                            role="button"
                                            tabindex={n}
                                            data-uuid={item.UID}
                                            on:keydown|preventDefault={(e) =>
                                                keyboardNavigation(item, e)}
                                            on:click={(e) => clickItem(item, e)}
                                        >
                                            <div
                                                class={gridView
                                                    ? "grid-preview"
                                                    : "item-title"}
                                                title="{item.path}: {item.Title ||
                                                    itemId(item)}"
                                            >
                                                {#if gridView && item.getIcon}
                                                    <img
                                                        src={`${item.getURL}/@@images/image/thumb`}
                                                        alt={item.Title || itemId(item)}
                                                    />
                                                {:else}
                                                    {#await iconTag(`contenttype/${item.portal_type
                                                            .toLowerCase()
                                                            .replace(/\.| /g, "-")}`)}
                                                        ...
                                                    {:then iconHTML}
                                                        <span class="plone-icon">
                                                            {@html iconHTML}
                                                        </span>
                                                    {/await}
                                                {/if}
                                                <span
                                                    class={!item.Title ? "id-only" : ""}
                                                    >{item.Title || itemId(item)}</span
                                                >
                                                {#if $config.mode == "search"}
                                                    <br /><span class="small"
                                                        >{item.path}</span
                                                    >
                                                {/if}
                                            </div>
                                            {#if isBrowseable(item) && $config.mode == "browse"}
                                                <div class="browseSub">
                                                    <svg
                                                        use:resolveIcon={{
                                                            iconName:
                                                                "arrow-right-circle",
                                                        }}
                                                    />
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                    {#if level.load_more}
                                        <div
                                            class="loadmore"
                                            data-level-path={level.path}
                                            data-search-term={searchTerm ||
                                                level.searchTerm}
                                            data-level-next-page={+level.page + 1}
                                            use:loadMore
                                        >
                                            <div
                                                class="spinner-border"
                                                role="status"
                                            ></div>
                                        </div>
                                    {/if}
                                    {#if level.total == 0}
                                        <div class="contentItem">
                                            <p>{_t("no results found")}</p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    {/each}
                    {#if previewItem?.UID && $previewUids.length == 1}
                        <div class="preview" in:fly|local={{ duration: 500 }}>
                            <div class="levelToolbar">
                                <div class="selectLevel me-3">
                                    {#if isSelectable(previewItem)}
                                        <button
                                            class="btn btn-xs btn-outline-primary d-flex align-items-center"
                                            title={_t("select ${preview_path}", {
                                                preview_path: previewItem.Title,
                                            })}
                                            on:click|preventDefault={() =>
                                                addItem(previewItem)}
                                            ><svg
                                                use:resolveIcon={{ iconName: "plus" }}
                                            />
                                            <span class="select-button-ellipsis"
                                                >{previewItem.Title}</span
                                            >
                                        </button>
                                    {/if}
                                </div>
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
                                <dl>
                                    <dt>{_t("Id")}</dt>
                                    <dd>{itemId(previewItem)}</dd>
                                    <dt>{_t("Title")}</dt>
                                    <dd>{previewItem.Title}</dd>
                                    {#if previewItem.Description}
                                        <dt>{_t("Description")}</dt>
                                        <dd
                                            class="text-truncate"
                                            title={previewItem.Description}
                                        >
                                            {previewItem.Description}
                                        </dd>
                                    {/if}
                                    {#if previewItem.created}
                                        <dt>{_t("created")}</dt>
                                        <dd>
                                            <time datetime={previewItem.created}
                                                >{formatDate(previewItem.created)}</time
                                            >
                                        </dd>
                                    {/if}
                                    {#if previewItem.modified}
                                        <dt>{_t("modified")}</dt>
                                        <dd>
                                            <time datetime={previewItem.modified}
                                                >{formatDate(previewItem.modified)}</time
                                            >
                                        </dd>
                                    {/if}
                                    {#if previewItem.review_state}
                                        <dt>{_t("review_state")}</dt>
                                        <dd>{previewItem.review_state}</dd>
                                    {/if}
                                </dl>
                            </div>
                        </div>
                    {/if}
                    {#if $previewUids.length > 1}
                        <div class="preview" in:fly|local={{ duration: 500 }}>
                            <div class="levelToolbar">
                                <button
                                    class="btn btn-xs btn-outline-primary d-flex align-items-center"
                                    title={_t("add selected items")}
                                    on:click|preventDefault={addSelectedItems}
                                    ><svg use:resolveIcon={{ iconName: "plus" }} />
                                    <span class="select-button-ellipsis"
                                        >{_t("add selected items")}</span
                                    >
                                </button>
                            </div>
                            <div class="info">
                                <svg
                                    use:resolveIcon={{
                                        iconName: "files",
                                    }}
                                />
                                <span class=""
                                    >{_t("${item_count} items selected", {
                                        item_count: $previewUids.length,
                                    })}</span
                                >
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
        min-width: 450px;
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
        overflow-y: hidden;
        overflow-x: auto;
        flex-grow: 3;
        border-left: var(--bs-border-style) var(--bs-border-color) var(--bs-border-width);
        user-select: none;
    }

    .levelColumn {
        width: 320px;
        background: rgba(var(--bs-secondary-bg-rgb), 0.55);
        border-right: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        flex-shrink: 0;
    }
    .levelColumn.active {
        background: var(--bs-body-bg);
        border-left: var(--bs-border-style) var(--bs-border-width) var(--bs-primary);
        margin-left: -1px;
    }
    .levelToolbar {
        width: 100%;
        min-height: 2.5rem;
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
        padding: 0.375rem;
        border-bottom: var(--bs-border-style) var(--bs-border-width)
            var(--bs-border-color);
    }
    .levelToolbar > .levelActions {
        margin-left: auto;
        display: flex;
    }
    .levelToolbar > button {
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
        background-color: rgba(var(--bs-secondary-bg-rgb), 0.4);
    }
    .contentItem.inPath,
    .contentItem.selectedItem {
        background-color: rgba(var(--bs-primary-rgb), 0.15);
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
    .contentItem .plone-icon {
        display: inline-block;
    }
    .contentItem .grid-preview > img {
        width: 95px;
        height: 95px;
        object-fit: cover;
        float: left;
        margin-right: 1rem;
    }
    .contentItem .id-only {
        font-style: italic;
    }
    .preview {
        width: 320px;
        flex-shrink: 0;
        min-height: 300px;
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
    .preview img {
        max-width: 100%;
        height: auto;
        margin-bottom: 0.5rem;
    }

    .upload-wrapper {
        padding: 1rem;
        width: 540px;
        overflow-x: auto;
        flex-shrink: 0;
    }
    .loadmore {
        text-align: center;
        padding: 0.25rem 0;
    }

    .select-button-ellipsis {
        white-space: nowrap;
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>
