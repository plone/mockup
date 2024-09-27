<script>
    import { resolveIcon } from "./utils";
    import _t from "../../../core/i18n-wrapper";
    import { createEventDispatcher, getContext } from "svelte";

    const config = getContext("config");
    const dispatch = createEventDispatcher();

    function select(item) {
        dispatch("selectItem", {
            item: item,
        });
    }
</script>

{#if $config?.favorites}
<div class="favorites dropdown dropdown-menu-end ms-2">
    <button
        type="button"
        class="favorites dropdown-toggle btn btn-outline-light btn-sm"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
        <svg use:resolveIcon={{ iconName: "star-fill" }} />
        {_t("Favorites")}
    </button>
    <ul class="dropdown-menu">
        {#each $config.favorites as favorite}
        <li>
            <a class="dropdown-item" href="{favorite.path}" on:click|preventDefault={() => select(favorite)}>{favorite.title}</a>
        </li>
        {/each}
    </ul>
</div>
{/if}
