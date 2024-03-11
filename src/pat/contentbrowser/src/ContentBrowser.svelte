<script>
    import utils from "@patternslib/patternslib/src/core/utils";
    import { onDestroy, onMount } from "svelte";
    import * as animateScroll from "svelte-scrollto";
    import { fly } from "svelte/transition";
    import contentStore, { config_unsubscribe } from "./ContentStore";
    import { clickOutside } from "./clickOutside";
    import { resolveIcon } from "./resolveIcon.js";
    import Upload from "../../upload/upload";

    import {
        config,
        currentPath,
        selectedItemsMap,
        selectedUids,
        showContentBrowser,
    } from "./stores.js";
    // import Keydown from "svelte-keydown";

    animateScroll.setGlobalOptions({
        scrollX: true,
        container: ".levelColumns",
        duration: 500,
    });

    export let maxDepth;
    export let basePath = "";
    export let attributes;
    export let vocabularyUrl;
    export let fieldId;
    export const contentItems = contentStore();

    let showUpload = false;
    let previewItem = { UID: "" };
    let currentLevelData = {};

    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    // let vh = Math.max(
    //     document.documentElement.clientHeight || 0,
    //     window.innerHeight || 0
    // );
    let breakPoint = ["xs", 0];

    function getBreakPoint() {
        vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        //vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        if (vw >= 576) {
            breakPoint = ["sm", 576];
        } else if (vw >= 768) {
            breakPoint = ["md", 768];
        } else if (vw >= 992) {
            breakPoint = ["lg", 992];
        } else if (vw >= 1200) {
            breakPoint = ["xl", 1200];
        } else if (vw >= 1400) {
            breakPoint = ["xxl", 1400];
        }
        return breakPoint;
    }

    onMount(() => {
        $config.maxDepth = maxDepth;
        $config.basePath = basePath;
        $config.vocabularyUrl = vocabularyUrl;
        $config.attributes = attributes;
        breakPoint = getBreakPoint();
        console.log(fieldId);
        console.log($config);
        //contentItems.get($currentPath);
    });

    async function upload() {
        showUpload = true;
        await utils.timeout(1);
        const uploadEl = document.querySelector(".upload-wrapper");
        uploadEl.classList.add("pat-upload");
        const patUpload = new Upload(uploadEl, {
            currentPath: $currentPath,
            allowPathSelection: false,
            hiddenInputContainer: ".upload-wrapper",
            success: () => {
                debugger;
            },
        });
    }

    function changePath(item) {
        showUpload = false;
        currentLevelData = {};
        if (item === "/") {
            currentPath.set(item);
            previewItem = { UID: "" };
        } else if (item.is_folderish) {
            currentPath.set(item.path);
            previewItem = { UID: "" };
            currentLevelData = {
                UID: item.UID,
                Title: item.Title,
            };
        } else {
            const pathParts = item.path.split("/");
            const folderPath = pathParts.slice(0, pathParts.length - 1).join("/");
            currentPath.set(folderPath);
            previewItem = item;
        }
        scrollToRight();
    }

    async function selectItem(item) {
        console.log(`add ${JSON.stringify(item)} to ${fieldId}`);
        $selectedItemsMap.push(fieldId, item);
        selectedUids.update(() => $selectedItemsMap.get(fieldId).map((x) => x.UID));
        $showContentBrowser = false;
        previewItem = { UID: "" };
        console.log($selectedItemsMap.get(fieldId));
        console.log($selectedUids);
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

    function itemInPath(item) {
        const inPath = $currentPath.indexOf(item.path) != -1;
        return inPath;
    }

    function filterItems() {
        console.log($contentItems, this.value);
        let timeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            contentItems.get($currentPath, this.value);
        }, 300);
    }

    $: {
        if ($config.vocabularyUrl) {
            contentItems.get($currentPath, null, currentLevelData);
        }
    }

    $: {
        $contentItems;
        scrollToRight();
    }

    onDestroy(config_unsubscribe);
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
                <button
                    type="button"
                    class="toolbarAction"
                    tabindex="0"
                    on:keydown={() => changePath("/")}
                    on:click={() => changePath("/")}
                    ><svg use:resolveIcon={{ iconName: "house" }} /></button
                ><span class="path">{$currentPath}</span>
                <div class="filter">
                    <input type="text" name="filter" on:input={filterItems} />
                    <label for="filter"
                        ><svg use:resolveIcon={{ iconName: "search" }} /></label
                    >
                </div>
                <button
                    type="button"
                    class="upload btn btn-secondary btn-sm"
                    tabindex="0"
                    on:keydown={upload}
                    on:click={upload}
                    ><svg use:resolveIcon={{ iconName: "upload" }} /> upload</button
                >
                <button
                    class="btn btn-link text-white"
                    tabindex="0"
                    on:click={() => cancelSelection()}
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
                                {#if i > 0 && level?.UID}
                                    <button
                                        class="btn btn-primary btn-sm"
                                        disabled={!isSelectable(level)}
                                        on:click={() => selectItem(level)}
                                    >
                                        select
                                    </button>
                                {/if}
                                <div class="levelActions">
                                    <button class="btn btn-link btn-sm grid-view">
                                        <svg use:resolveIcon={{ iconName: "grid" }} />
                                    </button>
                                </div>
                            </div>
                            {#each level.results as item, n}
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
                                    <div title={item.portal_type}>
                                        <svg
                                            use:resolveIcon={{
                                                iconName: `contenttype/${item.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                                            }}
                                        />
                                        {item.Title}
                                    </div>
                                    {#if item.is_folderish}
                                        <svg
                                            use:resolveIcon={{
                                                iconName: "arrow-right-circle",
                                            }}
                                        />
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/each}
                    {#if previewItem.UID}
                        <div class="preview">
                            <div class="levelToolbar">
                                <button
                                    class="btn btn-primary btn-sm"
                                    disabled={!isSelectable(previewItem)}
                                    on:click={() => selectItem(previewItem)}
                                    >select</button
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
        height: 99vh;
        /* padding: 1rem; */
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
    .toolBar > .path {
        padding-right: 1.5rem;
    }
    .toolBar > .filter {
        margin-left: auto;
    }
    .toolBar > .upload {
        margin: 0 1rem 0 2rem;
    }
    .toolBar :global(svg) {
        vertical-align: -0.125em;
    }
    .toolbarAction {
        color: var(--bs-light);
        background-color: transparent;
        border: none;
    }

    .levelColumns {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        overflow-x: auto;
        flex-grow: 3;
        border-left: var(--bs-border-style) var(--bs-border-color) var(--bs-border-width);
    }

    .levelColumn {
        min-width: 320px;
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
    }
</style>
