<!-- <svelte:options tag="miller-columns-browser" /> -->
<script>
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    // import RelatedItem from "./relateditem/RelatedItem.svelte";
    import { currentPath, config, selectedItems } from "./stores.js";
    import contentStore from "./ContentStore";
    import { config_unsubscribe } from "./ContentStore";
    import { fly } from "svelte/transition";
    //import { flip } from "svelte/animate";
    import * as animateScroll from "svelte-scrollto";

    animateScroll.setGlobalOptions({
        scrollX: true,
        container: ".levelColumns",
        duration: 1500,
    });
    export let maxDepth = 2;
    export let basePath = "/Plone";
    export let attributes = [];
    export let vocabularyUrl = "http://localhost:8080/Plone/@@getVocabulary";
    export let selectedItemsNode;
    let previewItem = { UID: "" };
    let showContentBrowser = false;
    const contentItems = contentStore();

    let vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    let vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );
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
        console.log("onMount: vocabularyUrl", vocabularyUrl);
        $config.maxDepth = maxDepth;
        $config.basePath = basePath;
        $config.vocabularyUrl = vocabularyUrl;
        $config.attributes = attributes;
        breakPoint = getBreakPoint();
        contentItems.get($currentPath);
        readSelectedItemsFromInput();
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
        showContentBrowser = false;
        previewItem = { UID: "" };
    }

    function unselectItem(i) {
        selectedItems.update((n) => {
            n.splice(i, 1);
            return n;
        });
    }

    function readSelectedItemsFromInput() {
        //debugger
        console.log(selectedItemsNode.value.split(";"));
        const uidsFromNode = selectedItemsNode.value.split(";");
        // FIXME: resolve UID's to items
        selectedItems.update(() => uidsFromNode);
    }

    function scrollToRight() {
        const scrollContainer = document.querySelector(".levelColumns");
        if (scrollContainer) {
            animateScroll.scrollTo({
                // element: ".levelColumn:last-child",
                x: (scrollContainer.scrollWidth + 100),
            });
        }
    }

    function itemInPath(item) {
        const inPath = $currentPath.indexOf(item.path) != -1;
        return inPath;
    }

    $: {
        if ($config.vocabularyUrl) {
            console.log("currentPath has changed: ", $currentPath);
            contentItems.get($currentPath);
        }
    }

    $: {
        if ($selectedItems.length) {
            const uids = $selectedItems.map((x) => x.UID);
            selectedItemsNode.value = uids.join(";");
        }
    }

    $: {
        $contentItems;
        scrollToRight();
    }

    onDestroy(config_unsubscribe);
</script>

<div class="content-browser-wrapper">
    {#if showContentBrowser}
        <nav
            class="content-browser"
            transition:fly={{ x: (vw / 100) * 94, opacity: 1 }}
            on:introend={() => scrollToRight()}
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
                </svg> <span class="path">{$currentPath}</span>
            </div>
            {#await $contentItems}
                <p>...waiting</p>
            {:then levels}
                <div class="levelColumns">
                    {#each levels as level, i (level.path)}
                        <div
                            class="levelColumn{i % 2 == 0 ? ' odd' : ' even'}"
                            in:fly|local={{ duration: 1000 }}
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
                                    <!-- {#if item.portal_type === "Image"}
                            <div class="col-1">
                                <img
                                    src="{item.getURL}/@@images/image/tile"
                                    alt={item.Title}
                                />
                            </div>
                        {/if} -->
                                    <!-- {#if item.is_folderish}
                            <div class="col-1">
                                <svg
                                    on:click={() => changePath(item)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-arrow-right-circle-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                                    />
                                </svg>
                            </div>
                        {/if} -->
                                </div>
                                <!-- <RelatedItem
          title={item.Title}
          path={item.path}
          url={item.getURL}
          is_folderish={item.is_folderish}
          portal_type={item.portal_type}
          uid={item.UID}
        /> -->
                            {/each}
                        </div>
                    {/each}
                    {#if previewItem.UID}
                        <div class="preview">
                            <h4>{previewItem.Title}</h4>
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
                                >select</button
                            >
                        </div>
                    {/if}
                </div>
            {:catch error}
                <p style="color: red">{error.message}</p>
            {/await}
        </nav>
    {/if}

    <ul class="content-browser-selected-items">
        {#each $selectedItems as selItem, i}
            <li>
                <button on:click={() => unselectItem(i)}
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                        />
                        <path
                            fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                    </svg></button
                >
                <span class="item-title">{selItem.Title}</span>
                {#if selItem.getURL && (selItem.getIcon || selItem.portal_type === "Image")}<img
                        src="{selItem.getURL}/@@images/image/mini"
                        alt={selItem.Title}
                    />{/if}
            </li>
        {/each}
    </ul>
    <button class="btn btn-primary" on:click={() => (showContentBrowser = true)}
        >add</button
    >
    <!-- {vw} / {vh} -->
</div>

<style>
    /* .content-browser-wrapper {
        position: relative;
    } */

    .content-browser {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        padding: 1rem;
        width: 96%;
        background-color: #eee;
        z-index: 100;
    }

    .toolBar {
        background-color: lightskyblue;
        padding: 0.5rem 1rem;
        color: #333;
        font-size: 1.2rem;
        overflow: hidden;
        width: 100%;
        height: 2.1em;
    }
    .toolBar > .path {
        padding: 0 1.5rem;
        line-height: 1em;
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
        overflow-x: scroll;
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
    }
    .contentItem {
        /* padding: 1rem 1rem; */
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        border-right: 1px solid #ddd;
        /* border-left: 1px solid #ddd; */
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
        padding: 1rem;
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

    .content-browser-selected-items {
        list-style: none;
        padding-left: 0;
    }
    .content-browser-selected-items li {
        border-radius: 0.3rem;
        background-color: #eee;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
    }
    .content-browser-selected-items li > * {
        margin-right: 0.5rem;
        display: block;
    }
    .content-browser-selected-items li .item-title {
        flex-grow: 3;
    }
    .content-browser-selected-items li > img {
        object-fit: cover;
        width: 128px;
        height: 128px;
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
    /* #selected_items > * {
    margin-bottom: 1rem;
    display: block;
  } */
</style>
