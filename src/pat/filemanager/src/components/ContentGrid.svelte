<script>
    import { getContext } from "svelte";
    import { flip } from "svelte/animate";
    import { thumbnailUrl } from "../utils/format.ts";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../stores/ListInteractions.svelte").ListInteractions} */
    const interactions = getContext("interactions");
    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");

    // Bigger previews than the table thumb: prefer a large scale, fall back to
    // smaller ones (and finally the original, handled inside thumbnailUrl).
    const PREVIEW_SCALES = ["preview", "mini", "thumb"];

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
    <p class="filemanager-message">{_t("Loading…")}</p>
{:else if contents.error}
    <p class="filemanager-message filemanager-error">{contents.error.message}</p>
{:else}
    <ul
        class="filemanager-grid"
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
                    <span class="filemanager-card-icon" aria-hidden="true">↰</span>
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
            {@const thumb = thumbnailUrl(item, PREVIEW_SCALES)}
            {@const folderTask = progress.folderTask(item["@id"])}
            <li
                class="filemanager-card"
                role="option"
                aria-selected={selection.isSelected(item)}
                class:is-folder={item.is_folderish}
                class:is-selected={selection.isSelected(item)}
                class:is-cut={interactions.isCut(item)}
                class:dragging={interactions.dragIndex === index}
                class:is-busy={folderTask}
                class:drop-target={interactions.dropIndex === index ||
                    interactions.fileDropIndex === index}
                draggable="true"
                tabindex="0"
                animate:flip={{ duration: 200 }}
                onclick={(e) => interactions.onItemClick(e, item, index)}
                onkeydown={(e) => interactions.onItemKeydown(e, item, index)}
                onmousedown={(e) => interactions.onItemMouseDown(e)}
                ondragstart={() => interactions.onDragStart(index)}
                ondragenter={(e) => interactions.onRowDragEnter(e, index)}
                ondragover={(e) => interactions.onRowDragOver(e, index, "x")}
                ondragend={() => interactions.onDragEnd()}
                ondrop={(e) => interactions.onRowDrop(e, index)}
            >
                <label class="filemanager-card-select">
                    <input
                        type="checkbox"
                        tabindex="-1"
                        checked={selection.isSelected(item)}
                        onchange={() => selection.toggle(item)}
                        aria-label={_t("Select ${name}", { name: item.Title || item["@id"] })}
                    />
                </label>

                {#if item.review_state}
                    <span
                        class="filemanager-card-status state-{item.review_state}"
                        title={item.review_state}
                        aria-label={_t("Status: ${state}", { state: item.review_state })}
                    ></span>
                {/if}

                <div class="filemanager-card-preview">
                    {#if thumb}
                        <img src={thumb} alt={item.Title || ""} loading="lazy" />
                    {:else}
                        <span class="filemanager-card-icon" aria-hidden="true">
                            {item.is_folderish ? "📁" : "📄"}
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
