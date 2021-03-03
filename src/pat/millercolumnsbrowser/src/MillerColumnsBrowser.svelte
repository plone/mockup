<!-- <svelte:options tag="miller-columns-browser" /> -->

<script>
  import { onMount } from "svelte";
  import { onDestroy } from 'svelte';
  // import RelatedItem from "./relateditem/RelatedItem.svelte";
  import { currentPath, config } from "./stores.js";
  import millerColumnsStore from "./millerColumnsStore";
  import { config_unsubscribe } from "./millerColumnsStore";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";

  export let maxDepth = 2;
  export let basePath = "/Plone";
  // export let attr_string = "UID, Title, portal_type, path, getURL, getIcon, is_folderish, review_state";
  export let attributes = [];
  export let vocabularyUrl = "http://localhost:8080/Plone/@@getVocabulary";
  //url = 'http://localhost:8081/Plone13/@@getVocabulary?name=plone.app.vocabularies.Catalog&field=relatedItems&query={"criteria":[{"i":"path","o":"plone.app.querystring.operation.string.path","v":"/Plone::1"}],"sort_on":"getObjPositionInParent","sort_order":"ascending"}&attributes=["UID","Title","portal_type","path","getURL","getIcon","is_folderish","review_state"]&batch={"page":1,"size":10}';
  // console.log(url);
  //       http://localhost:8080/Plone13/@@getVocabulary?name=plone.app.vocabularies.Catalog&field=relatedItems&query={"criteria":[{"i":"path","o":"plone.app.querystring.operation.string.path","v":"/Plone13/::1"}],"sort_on":"getObjPositionInParent","sort_order":"ascending"}&attributes=["UID","Title","portal_type","path","getURL","getIcon","is_folderish","review_state"]&batch={"page":1,"size":10}
  const relatedItems = millerColumnsStore();

  onMount(async () => {
    console.log("onMount: vocabularyUrl", vocabularyUrl);
    $config.maxDepth = maxDepth;
    $config.basePath = basePath;
    $config.vocabularyUrl = vocabularyUrl;
    $config.attributes = attributes;
    relatedItems.get($currentPath);
  });

  function changePath(p) {
    console.log("change path to: ", p);
    currentPath.set(p);
  }

  $: {
    // vocabQuery = `{"criteria":[{"i":"path","o":"plone.app.querystring.operation.string.path","v":"${$currentPath}::1"}],"sort_on":"getObjPositionInParent","sort_order":"ascending"}`;
    // url = vocabularyUrl + vocabQuery + attributesParam; // + batchParam;
    if($config.vocabularyUrl) {
    console.log("vocabularyUrl", vocabularyUrl);
      console.log("currentPath changed: ", $currentPath);
      relatedItems.get($currentPath);
    }
  }

  onDestroy(config_unsubscribe);
</script>
{maxDepth}
{$currentPath}
<h2>Content Browser Prototype</h2>
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
{#await $relatedItems}
  <p>...waiting</p>
{:then levels}
  <div class="levelColumns row">
    {#each levels as level, i (level.path)}
      <div
        class="col levelColumn{i % 2 == 0 ? ' odd' : ' even'}"
        in:fly|local={{ duration: 1000 }}
      >
        <div class="levelPath">{level.path}</div>
        {#each level.results as item, n}
          <div class="row relatedItem{n % 2 == 0 ? ' odd' : ' even'}">
            <div class="col-5" title={item.portal_type}>{item.Title}</div>
            {#if item.portal_type === "Image"}
            <div class="col">
                <img
                  src="{item.getURL}/@@images/image/tile"
                  alt={item.Title}
                />
            </div>
            {/if}
            {#if item.is_folderish}
            <div class="col">
              <svg on:click={() => changePath(item.path)}
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
            {/if}
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
    <div class="preview">

    </div>
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  /* h2 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  } */

  .toolBar {
    background-color: lightskyblue;
    padding: 0.5rem 1rem;
    color: #333;
    font-size: 1.8rem;
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
  }

  .levelColumn {
    /* min-width: 200px; */
    border-top: 5px solid transparent;
  }
  .levelColumn.even {
    border-top: 5px solid skyblue;
  }

  .levelPath {
    background: #eee;
    padding: 0.5rem 1rem;
  }
  .relatedItem {
    /* padding: 1rem 1rem; */
    /* display: flex; */
    /* align-items: baseline; */
    /* justify-content: space-between; */
    border-right: 1px solid #ddd;
    /* border-left: 1px solid #ddd; */
  }

  .relatedItem.even {
    background-color: aliceblue;
  }
  .relatedItem > * {
    padding: 1rem;
  }
  .relatedItem > div > svg,
  .relatedItem > div> img {
    /* padding: 0; */
    margin: auto 0;
  }

  .relatedItem > div > img{
    object-fit: cover;
    width: 32px;
    height: 32px;
  }

  .preview{
    border: 1px solid lightskyblue;
    min-width: 200px;
    min-height: 400px;
  }
  /* #selected_items > * {
    margin-bottom: 1rem;
    display: block;
  } */
</style>
