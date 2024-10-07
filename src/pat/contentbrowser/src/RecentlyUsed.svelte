<script>
    import { resolveIcon, recentlyUsedItems } from "./utils";
    import _t from "../../../core/i18n-wrapper";
    import { createEventDispatcher, getContext } from "svelte";

    const config = getContext("config");
    const items = recentlyUsedItems(true, $config);
    const dispatch = createEventDispatcher();

    function select(item) {
        dispatch("selectItem", {
            item: item,
        });
    }
</script>

{#if $config.recentlyUsed && items.length}
    <div class="recentlyUsed dropdown ms-2">
        <button
            type="button"
            class="recentlyUsed dropdown-toggle btn btn-outline-light btn-sm"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <svg use:resolveIcon={{ iconName: "grid-fill" }} />
            {_t("Recently Used")}
        </button>
        <ul class="dropdown-menu">
            {#each items.reverse() as recentlyUsed}
                <li>
                    <a
                        href={recentlyUsed.getURL}
                        on:click|preventDefault={() => select(recentlyUsed)}
                        class="dropdown-item"
                    >
                        <svg
                            use:resolveIcon={{
                                iconName: `contenttype/${recentlyUsed?.portal_type.toLowerCase().replace(/\.| /g, "-")}`,
                            }}
                        />
                        {recentlyUsed.Title}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}
