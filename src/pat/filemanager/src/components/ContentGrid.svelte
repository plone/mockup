<script>
    import { getContext } from "svelte";
    import { thumbnailUrl } from "../utils/format.ts";
    import { sortableList } from "../utils/sortable.ts";
    import { _t } from "../utils/i18n.ts";
    import Icon from "./Icon.svelte";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ListInteractions.svelte").ListInteractions} */
    const interactions = getContext("interactions");
    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");
    /** @type {import("../stores/ViewStore.svelte").ViewStore} */
    const view = getContext("view");

    // Bigger previews than the table thumb: prefer a large scale, fall back to
    // smaller ones (and finally the original, handled inside thumbnailUrl). At
    // the largest zoom level the cards are sized to Plone's 600px "teaser"
    // scale, so request it there to show images at their native size.
    const previewScales = $derived(
        view.gridScale === "xl"
            ? ["teaser", "preview", "mini", "thumb"]
            : ["preview", "mini", "thumb"]
    );

    // Folderish cards drill into the folder in-app; everything else keeps the
    // plain link so the object opens normally (mirrors ColumnCell).
    function onTitleClick(event, item) {
        if (!item.is_folderish) return;
        event.preventDefault();
        selection.clear();
        contents.navigateTo(item["@id"]);
    }

    // Browse up into the parent container (the "up to parent" placeholder card).
    function goUp(event) {
        event.preventDefault();
        if (!contents.parentUrl) return;
        selection.clear();
        contents.navigateTo(contents.parentUrl);
    }
</script>

{#if contents.loading}
    <ul
        class="filemanager-grid grid-size-{view.gridScale} filemanager-grid-skeleton"
        aria-busy="true"
        aria-label={_t("Loading…")}
    >
        {#each { length: contents.placeholderCount } as _, i (i)}
            <li class="filemanager-card filemanager-card-skeleton" aria-hidden="true">
                <span class="filemanager-card-preview filemanager-skeleton"></span>
                <span class="filemanager-card-title filemanager-skeleton"></span>
            </li>
        {/each}
    </ul>
{:else if contents.error}
    <p class="filemanager-message filemanager-error">{contents.error.message}</p>
{:else}
    <ul
        use:sortableList={{ interactions }}
        class="filemanager-grid grid-size-{view.gridScale}"
        class:can-reorder={interactions.canReorder}
        role="listbox"
        aria-multiselectable="true"
        aria-label={_t("Folder contents")}
    >
        {#if contents.parentUrl}
            {@const parentTask = progress.folderTask(contents.parentUrl)}
            <li
                class="filemanager-card filemanager-card-up"
                class:drop-target={interactions.parentDrop}
                class:is-busy={parentTask}
                ondragenter={(e) => interactions.onParentDragEnter(e)}
                ondragover={(e) => interactions.onParentDragOver(e)}
                ondragleave={() => interactions.onParentDragLeave()}
                ondrop={(e) => interactions.onParentDrop(e)}
            >
                <a
                    class="filemanager-card-preview filemanager-card-up-link"
                    href={contents.parentUrl}
                    aria-label={_t("Up to parent folder")}
                    onclick={goUp}
                >
                        <span class="filemanager-card-icon" aria-hidden="true">
                            <Icon name="arrow-90deg-left" />
                        </span>
                </a>
                <span class="filemanager-card-title">{_t("Up to parent")}</span>

                {#if parentTask}
                    <div class="filemanager-card-progress" title={parentTask.label}>
                        <span class="filemanager-card-progress-label">
                            {parentTask.label}
                        </span>
                        <progress aria-label={parentTask.label}></progress>
                    </div>
                {/if}
            </li>
        {/if}

        {#each contents.items as item, index (item.UID || item["@id"])}
            {@const thumb = thumbnailUrl(item, previewScales)}
            {@const folderTask = progress.folderTask(item["@id"])}
            <li
                class="filemanager-card"
                role="option"
                aria-selected={selection.isSelected(item)}
                class:is-folder={item.is_folderish}
                class:is-selected={selection.isSelected(item)}
                class:is-cut={interactions.isCut(item)}
                class:is-busy={folderTask}
                class:drop-target={interactions.dropIndex === index ||
                    interactions.fileDropIndex === index}
                data-fm-item
                data-fm-index={index}
                tabindex="0"
                onclick={(e) => interactions.onCardClick(e, item, index)}
                onkeydown={(e) => interactions.onItemKeydown(e, item, index)}
                onmousedown={(e) => interactions.onItemMouseDown(e)}
                ondragenter={(e) => interactions.onRowDragEnter(e, index)}
                ondragover={(e) => interactions.onRowDragOver(e, index)}
                ondrop={(e) => interactions.onRowDrop(e, index)}
            >
                <label
                    class="filemanager-card-select"
                    class:is-checked={selection.isSelected(item)}
                >
                    <input
                        type="checkbox"
                        tabindex="-1"
                        checked={selection.isSelected(item)}
                        onchange={() => selection.toggle(item)}
                        aria-label={_t("Select ${name}", { name: item.Title || item["@id"] })}
                    />
                    <Icon
                        name={selection.isSelected(item)
                            ? "check-circle-fill"
                            : "circle"}
                    />
                </label>

                <div class="filemanager-card-preview">
                    {#if thumb}
                        <img src={thumb} alt={item.Title || ""} loading="lazy" />
                    {:else}
                        <span class="filemanager-card-icon" aria-hidden="true">
                            <Icon name={`contenttype/${(item.portal_type ?? "document").toLowerCase().replace(/\.| /g, "-")}`} />
                        </span>
                    {/if}
                </div>

                <a
                    class="filemanager-card-title"
                    href={item["@id"]}
                    tabindex="-1"
                    onclick={(e) => onTitleClick(e, item)}
                >
                    {item.Title || item.id || item["@id"]}
                </a>

                {#if folderTask}
                    <div class="filemanager-card-progress" title={folderTask.label}>
                        <span class="filemanager-card-progress-label">
                            {folderTask.label}
                        </span>
                        <progress aria-label={folderTask.label}></progress>
                    </div>
                {/if}
            </li>
        {/each}
    </ul>

    {#if contents.items.length === 0}
        <p class="filemanager-message">{_t("No items in this folder.")}</p>
    {/if}
{/if}
