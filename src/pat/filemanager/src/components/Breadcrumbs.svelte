<script>
    import { getContext } from "svelte";
    import { fetchBreadcrumbs } from "../api/breadcrumbs.js";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");

    let items = $state([]);
    let root = $state(null);

    // Refetch the trail whenever the browsed folder changes (drill-down or a
    // breadcrumb jump), so the crumbs always mirror the current listing.
    $effect(() => {
        const url = contents.contextUrl;
        let cancelled = false;
        fetchBreadcrumbs(url)
            .then((data) => {
                if (cancelled) return;
                items = data.items;
                root = data.root;
            })
            .catch(() => {
                if (!cancelled) items = [];
            });
        return () => {
            cancelled = true;
        };
    });

    function navigate(event, url) {
        event.preventDefault();
        selection.clear();
        contents.navigateTo(url);
    }
</script>

<nav class="filemanager-breadcrumbs" aria-label={_t("Breadcrumbs")}>
    <ol>
        <li>
            <a
                href={root || config.portalUrl}
                onclick={(e) => navigate(e, root || config.portalUrl)}>{_t("Home")}</a
            >
        </li>
        {#each items as crumb, i (crumb["@id"])}
            <li class:active={i === items.length - 1}>
                <a href={crumb["@id"]} onclick={(e) => navigate(e, crumb["@id"])}>
                    {crumb.title}
                </a>
            </li>
        {/each}
    </ol>
</nav>
