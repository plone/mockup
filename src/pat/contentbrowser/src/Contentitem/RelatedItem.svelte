<!-- <svelte:options tag="related-item" /> -->

<script>
  // import { createEventDispatcher } from 'svelte';
  import { currentPath } from "../stores";

  // const dispatch = createEventDispatcher();

  export let title = "Related Item";
  export let portal_type = "Document";
  export let is_folderish = undefined;
  export let path = "";
  export let url = "";
  //   {
  //   UID: "79f01c49712d47c0977f8c35b949af7a",
  //   Title: "Demo",
  //   portal_type: "Folder",
  //   path: "/de/demo",
  //   getURL: "https://demo.plone.org/de/demo",
  //   getIcon: null,
  //   is_folderish: true,
  //   review_state: "published"
  // }

  function changeDir() {
    console.log("change dir: " + path);
    currentPath.update(() => path);
  }
</script>

<div class="relatedItem">
  {#if is_folderish}
    <button on:click={changeDir}>>></button>
  {/if}
  <div title={portal_type}>{title}</div>
  {#if portal_type === "Image"}
    <div><img src="{url}/@@images/image/thumb" alt={title} /></div>
  {/if}
</div>

<style src="./related-item.css">
</style>
