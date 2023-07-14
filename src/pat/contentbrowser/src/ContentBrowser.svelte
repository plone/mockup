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
    import {resolveIcon} from './resolveIcon.js';
    import contentStore from "./ContentStore";
    import { config_unsubscribe } from "./ContentStore";
    import { clickOutside } from "./clickOutside";
    import { fly } from "svelte/transition";
    import * as animateScroll from "svelte-scrollto";
    // import Keydown from "svelte-keydown";

    animateScroll.setGlobalOptions({
        scrollX: true,
        container: ".levelColumns",
        duration: 500,
    });

    export let maxDepth;
    export let basePath = '';
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

    async function upload() {
            const options = {
                uploadMultiple: false,
                maxFiles: 1,
                showTitle: false,
            }
            const PatternUpload = (await import("../../upload/upload")).default;
            const uploadEl = document.querySelector('.uploadify-me');
            uploadEl.classList.add("pat-upload");
            this.upload_pattern_instance = new PatternUpload(uploadEl, options);
            debugger
            uploadEl.addEventListener("uploadAllCompleted", function () {
                debugger
                // function (evt, data) {
                //     if (self.linkTypes.image) {
                //         self.linkTypes.image.set(data.data.UID);
                //         $(
                //             "#" + $("#tinylink-image", self.modal.$modal).data("navref")
                //         ).trigger("click");
                //     } else {
                //         self.linkTypes.internal.set(data.data.UID);
                //         $(
                //             "#" +
                //                 $("#tinylink-internal", self.modal.$modal).data("navref")
                //         ).trigger("click");
                //     }
                // }.bind(self)

            });
                // var patUpload = self.$upload.data().patternUpload;
                // if (patUpload.dropzone.files.length > 0) {
                //     patUpload.processUpload();
                //     // eslint-disable-next-line no-unused-vars
                //     self.$upload.on("uploadAllCompleted", function (evt, data) {
                //         var counter = 0;
                //         var checkUpload = function () {
                //             if (counter < 5 && !self.linkTypes[self.linkType].value()) {
                //                 counter += 1;
                //                 setTimeout(checkUpload, 100);
                //                 return;
                //             } else {
                //                 var href = self.getLinkUrl();
                //                 self.updateImage(href);
                //                 self.hide();
                //             }
                //         };
                //         checkUpload();
                //     });
                // }
            // self.$upload.on(
            //     "uploadAllCompleted",
            //     function (evt, data) {
            //         if (self.linkTypes.image) {
            //             self.linkTypes.image.set(data.data.UID);
            //             $(
            //                 "#" + $("#tinylink-image", self.modal.$modal).data("navref")
            //             ).trigger("click");
            //         } else {
            //             self.linkTypes.internal.set(data.data.UID);
            //             $(
            //                 "#" +
            //                     $("#tinylink-internal", self.modal.$modal).data("navref")
            //             ).trigger("click");
            //         }
            //     }.bind(self)
            // );
    }

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

    function filterItems() {
        console.log($contentItems, this.value)
        let timeoutId;
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            contentItems.get($currentPath, this.value);
        }, 300)
    }

    $: {
        if ($config.vocabularyUrl) {
            contentItems.get($currentPath);
            // contentItems.set([])
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
            <div class="toolBar">
                <button
                    type="button"
                    class="toolbarAction"
                    tabindex="0"
                    on:keydown={() => changePath("/")}
                    on:click={() => changePath("/")}
                ><svg use:resolveIcon={{iconName: 'house'}} /></button>
                <span class="path">{$currentPath}</span>
                <div class="filter">
                    <label for="filter">filter</label> <input type="text" name="filter" on:input={filterItems}>
                </div>
                <button
                    type="button"
                    class="toolbarAction"
                    tabindex="0"
                    on:keydown={upload}
                    on:click={upload}
                ><svg use:resolveIcon={{iconName: 'upload'}} /></button>
                <button
                    class="btn btn-secondary btn-sm"
                    tabindex="0"
                    on:click={() => cancelSelection()}>cancel</button
                >
            </div>
            <input type="text" name="upload" style="display:none" />
            <div class="uploadify-me">

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
                            <!-- <div class="levelPath">{level.path}</div> -->
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
                                    tabindex="0"
                                    on:keydown={() => changePath(item)}
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
    .toolBar > .filter {
        line-height: 1em;
    }
    .toolBar :global(svg){
        width: 1.5rem;
        height: 1.5rem;
        vertical-align: -0.125em;
    }
    .toolbarAction {
        background-color: transparent;
        border: none;
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
