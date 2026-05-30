<script>
    // Resolve a Plone icon name to its SVG markup the same way pat-structure
    // does (via core utils.resolveIcon → the @@iconresolver view, with a
    // bootstrap-icons fallback). Results are cached in resolveIcon's own
    // ICON_CACHE, so repeated names cost nothing. The markup is trusted Plone
    // icon SVG, so rendering it with {@html} mirrors pat-structure's button view.
    import utils from "../../../../core/utils";

    /** @type {{ name: string }} */
    let { name } = $props();

    const svg = $derived(Promise.resolve(utils.resolveIcon(name)));
</script>

<!-- Always render the (fixed-size) container so it reserves its final footprint
     immediately. The SVG fills that box once resolveIcon settles, so the icon
     fades in without shifting the surrounding layout. -->
<span class="filemanager-icon" aria-hidden="true">
    {#await svg then markup}
        {#if markup}{@html markup}{/if}
    {/await}
</span>
