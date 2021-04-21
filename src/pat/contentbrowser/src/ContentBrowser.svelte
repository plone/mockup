<!-- <svelte:options tag="miller-columns-browser" /> -->
<script>
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import {
        currentPath,
        config,
        selectedItems,
        selectedUids,
        showContentBrowser,
    } from "./stores.js";
    import contentStore from "./ContentStore";
    import { config_unsubscribe } from "./ContentStore";
    import { clickOutside } from "./clickOutside";
    import { fly } from "svelte/transition";
    import * as animateScroll from "svelte-scrollto";
    import Keydown from "svelte-keydown";

    animateScroll.setGlobalOptions({
        scrollX: true,
        container: ".levelColumns",
        duration: 500,
    });

    export let maxDepth;
    export let basePath;
    export let attributes;
    export let vocabularyUrl;
    export const contentItems = contentStore();

    let previewItem = { UID: "" };

    let vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    // let vh = Math.max(
    //     document.documentElement.clientHeight || 0,
    //     window.innerHeight || 0
    // );
    let breakPoint = ["xs", 0];

    function getBreakPoint() {
        vw = Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
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

    onMount(async () => {
        $config.maxDepth = maxDepth;
        $config.basePath = basePath;
        $config.vocabularyUrl = vocabularyUrl;
        $config.attributes = attributes;
        breakPoint = getBreakPoint();
        //contentItems.get($currentPath);
    });

    function changePath(item) {
        if (item === "/") {
            currentPath.set(item);
            previewItem = { UID: "" };
        } else if (item.is_folderish) {
            currentPath.set(item.path);
            previewItem = { UID: "" };
        } else {
            const pathParts = item.path.split("/");
            const folderPath = pathParts
                .slice(0, pathParts.length - 1)
                .join("/");
            currentPath.set(folderPath);
            previewItem = item;
        }
        scrollToRight();
    }

    function selectItem(item) {
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

    function itemInPath(item) {
        const inPath = $currentPath.indexOf(item.path) != -1;
        return inPath;
    }

    $: {
        if ($config.vocabularyUrl) {
            contentItems.get($currentPath);
        }
    }

    $: {
        $contentItems;
        scrollToRight();
    }

    onDestroy(config_unsubscribe);
</script>

<Keydown paused={!$showContentBrowser} on:Escape={cancelSelection} />
{#if $showContentBrowser}
    <div class="content-browser-position-wrapper">
        <nav
            class="content-browser"
            transition:fly={{ x: (vw / 100) * 94, opacity: 1 }}
            on:introend={() => scrollToRight()}
            use:clickOutside
            on:click_outside={cancelSelection}
        >
            <div class="toolBar">
                <svg
                    class="homeAction bi bi-house"
                    on:click={() => changePath("/")}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                    />
                </svg>
                <span class="path">{$currentPath}</span>
                <button
                    class="btn btn-secondary btn-sm"
                    on:click={() => cancelSelection()}>cancel</button
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
                            <div class="levelPath">{level.path}</div>
                            {#each level.results as item, n}
                                <div
                                    class="contentItem{n % 2 == 0
                                        ? ' odd'
                                        : ' even'}{itemInPath(item)
                                        ? ' inPath'
                                        : ''}{previewItem.UID === item.UID
                                        ? ' currentItem'
                                        : ''}"
                                    role="button"
                                    on:click={() => changePath(item)}
                                >
                                    <div title={item.portal_type}>
                                        {item.Title}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                    {#if previewItem.UID}
                        <div class="preview">
                            <h4>{previewItem.Title}</h4>
                            <p>{previewItem.Description}</p>
                            {#if previewItem.portal_type === "Image"}
                                <div>
                                    <img
                                        src="{previewItem.getURL}/@@images/image/preview"
                                        alt={previewItem.Title}
                                    />
                                </div>
                            {/if}
                            <button
                                class="btn btn-primary btn-lg"
                                on:click={() => selectItem(previewItem)}
                                disabled={!isSelectable(previewItem)}
                                >select</button
                            >
                        </div>
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
        z-index: 1500;
        /* width: 95vw; */
        height: 100vh;
    }
    .content-browser {
        height: 99vh;
        /* padding: 1rem; */
        width: 95%;
        background-color: #eee;
        z-index: 1500;
        display: flex;
        flex-direction: column;
    }

    .toolBar {
        background-color: lightskyblue;
        padding: 0.5rem 1rem;
        color: #333;
        font-size: 1.2rem;
        width: 100%;
        height: 2.1em;
        display: flex;
        justify-content: space-between;
    }
    .toolBar > .path {
        padding: 0 1.5rem;
        line-height: 1em;
        overflow: hidden;
    }
    .homeAction {
        width: 1em;
        height: 1em;
        vertical-align: -0.125em;
    }

    .levelColumns {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        overflow-x: auto;
        flex-grow: 3;
    }

    .levelColumn {
        min-width: 320px;
        /* border-top: 5px solid transparent; */
    }
    /* .levelColumn.even {
        border-top: 5px solid skyblue;
    } */

    .levelPath {
        background: #eee;
        padding: 0.5rem 1rem;
        height: 3rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .contentItem {
        /* padding: 1rem 1rem; */
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        border-right: 1px solid #ddd;
        font-size: 90%;
        background-color: #fff;
        height: 3rem;
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
    }
    .contentItem.even {
        background-color: aliceblue;
    }
    .contentItem.inPath {
        border-right: 3px solid lightskyblue;
    }
    .contentItem.currentItem {
        border-top: 3px dashed lightskyblue;
        border-bottom: 3px dashed lightskyblue;
    }
    .contentItem > * {
        padding: 0.5rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100%;
    }

    .preview {
        min-width: 320px;
        max-width: 500px;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
    .preview button {
        width: 100%;
    }

    @media screen and (min-width: 800px) {
        .content-browser {
            width: 700px;
        }
    }
    @media screen and (min-width: 1000px) {
        .content-browser {
            width: 900px;
        }
    }
    @media screen and (min-width: 1200px) {
        .content-browser {
            width: 1100px;
        }
    }
</style>
