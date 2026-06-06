<script>
    import { getContext } from "svelte";
    import { formatDate, formatSize, thumbnailUrl, isExpired, isIneffective } from "../utils/format.ts";
    import Icon from "./Icon.svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {{ item: Record<string, any>, column: import("../stores/ConfigStore.svelte").ColumnDef }} */
    let { item, column } = $props();

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");

    const field = $derived(column.field || column.key);
    const value = $derived(item[field]);
    const thumb = $derived(column.type === "image" ? thumbnailUrl(item) : null);
    const tags = $derived(
        column.type === "tags" && Array.isArray(value) ? value : []
    );
    const typeIcon = $derived(
        `contenttype/${(item.portal_type ?? "document").toLowerCase().replace(/\.| /g, "-")}`
    );
    const ineffective = $derived(isIneffective(item));
    const expired = $derived(isExpired(item));
    // File/Image (and any configured view-action type) open at /view, not the
    // raw-content object URL. Folderish titles drill in-app (onTitleClick).
    const openUrl = $derived(contents.config.viewUrl(item));

    // Folderish titles drill into the folder in-app; everything else keeps the
    // plain link so the object opens normally.
    function onTitleClick(event) {
        if (!item.is_folderish) return;
        event.preventDefault();
        selection.clear();
        contents.navigateTo(item["@id"]);
    }
</script>

{#if column.type === "title"}
    <a class="filemanager-title" href={openUrl} onclick={onTitleClick}>
        <Icon name={typeIcon} />
        {value || item.id || item["@id"]}
        {#if item.exclude_from_nav}
            <span class="filemanager-nav-excluded" title={_t("Excluded from navigation")} aria-label={_t("Excluded from navigation")}>
                <Icon name="eye-slash" />
            </span>
        {/if}
        {#if ineffective}
            <span class="filemanager-badge filemanager-badge-ineffective" title={_t("Publishing date is in the future")}>
                {_t("Before publishing date")}
            </span>
        {/if}
        {#if expired}
            <span class="filemanager-badge filemanager-badge-expired" title={_t("Expiration date has passed")}>
                {_t("Expired")}
            </span>
        {/if}
        {#if item.is_working_copy}
            <span class="filemanager-badge filemanager-badge-working-copy" title={_t("This is a working copy")}>
                {_t("Working copy")}
            </span>
        {/if}
    </a>
{:else if column.type === "image"}
    {#if thumb}
        <img class="filemanager-thumb" src={thumb} alt={item.Title || ""} loading="lazy" />
    {:else}
        <span class="filemanager-thumb-placeholder" aria-hidden="true"></span>
    {/if}
{:else if column.type === "date"}
    {formatDate(value)}
{:else if column.type === "state"}
    {#if value}
        <span class="filemanager-state state-{value}">{value}</span>
    {/if}
{:else if column.type === "tags"}
    {#each tags as tag (tag)}
        <span class="filemanager-tag">{tag}</span>
    {/each}
{:else if column.key === "getObjSize"}
    {formatSize(value)}
{:else}
    {value ?? ""}
{/if}
