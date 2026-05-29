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
</script>

{#if contents.loading}
    <p class="filemanager-message">{_t("Loading…")}</p>
{:else if contents.error}
    <p class="filemanager-message filemanager-error">{contents.error.message}</p>
{:else if contents.items.length === 0}
    <p class="filemanager-message">{_t("No items in this folder.")}</p>
{:else}
    <ul
        class="filemanager-grid"
        role="listbox"
        aria-multiselectable="true"
        aria-label={_t("Folder contents")}
    >
        {#each contents.items as item, index (item.UID || item["@id"])}
            {@const thumb = thumbnailUrl(item, PREVIEW_SCALES)}
            <li
                class="filemanager-card"
                role="option"
                aria-selected={selection.isSelected(item)}
                class:is-folder={item.is_folderish}
                class:is-selected={selection.isSelected(item)}
                class:is-cut={interactions.isCut(item)}
                class:dragging={interactions.dragIndex === index}
                class:drop-target={interactions.dropIndex === index}
                draggable="true"
                tabindex="0"
                animate:flip={{ duration: 200 }}
                onclick={(e) => interactions.onItemClick(e, item, index)}
                onkeydown={(e) => interactions.onItemKeydown(e, item, index)}
                onmousedown={(e) => interactions.onItemMouseDown(e)}
                ondragstart={() => interactions.onDragStart(index)}
                ondragenter={() => interactions.dragActive && interactions.onDragEnter(index)}
                ondragover={(e) => interactions.dragActive && e.preventDefault()}
                ondragend={() => interactions.onDragEnd()}
                ondrop={(e) => {
                    if (!interactions.dragActive) return;
                    e.preventDefault();
                    interactions.onDrop(index);
                }}
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
            </li>
        {/each}
    </ul>
{/if}
