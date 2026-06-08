<script>
    import { getContext, tick } from "svelte";
    import { objId } from "../api/operations.js";
    import { _t } from "../utils/i18n.ts";
    import { dismiss } from "../utils/dismiss.ts";

    /** @type {{ item: Record<string, any>, index: number }} */
    let { item, index } = $props();

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/ClipboardStore.svelte").ClipboardStore} */
    const clipboard = getContext("clipboard");

    let open = $state(false);
    /** @type {HTMLButtonElement | undefined} */
    let toggle = $state();
    /** @type {HTMLElement | undefined} */
    let popover = $state();

    const url = $derived(item["@id"]);
    // Open targets /view for File/Image; Edit stays on the bare object URL.
    const openUrl = $derived(contents.config.viewUrl(item));
    const id = $derived(objId(url));
    const title = $derived(item.Title || id);
    const canReorder = $derived(contents.isManualOrder);
    const isFirst = $derived(index === 0);
    const isLast = $derived(index === contents.items.length - 1);

    function close() {
        open = false;
    }

    // Close and hand focus back to the toggle (Escape / outside dismiss).
    function closeAndRefocus() {
        const wasOpen = open;
        open = false;
        if (wasOpen) toggle?.focus();
    }

    // Move focus to the first enabled item when the menu opens (ARIA menu pattern).
    async function onToggle() {
        open = !open;
        if (!open) return;
        await tick();
        focusItem(0);
    }

    function items() {
        return popover
            ? /** @type {HTMLElement[]} */ (
                  [...popover.querySelectorAll('[role="menuitem"]')].filter(
                      (el) => !(/** @type {HTMLButtonElement} */ (el).disabled)
                  )
              )
            : [];
    }

    function focusItem(index) {
        const list = items();
        if (list.length === 0) return;
        const wrapped = (index + list.length) % list.length;
        list[wrapped].focus();
    }

    // Roving focus with the arrow keys, Home/End — honouring role="menu".
    function onMenuKeydown(event) {
        const list = items();
        const current = list.indexOf(/** @type {HTMLElement} */ (document.activeElement));
        if (event.key === "ArrowDown") {
            event.preventDefault();
            focusItem(current + 1);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            focusItem(current - 1);
        } else if (event.key === "Home") {
            event.preventDefault();
            focusItem(0);
        } else if (event.key === "End") {
            event.preventDefault();
            focusItem(list.length - 1);
        }
    }

    function cut() {
        clipboard.cut([{ url, title }]);
        close();
    }

    function copy() {
        clipboard.copy([{ url, title }]);
        close();
    }

    // Single-step reorder within the visible page — the keyboard equivalent of
    // dragging a row up/down. Relative moves need the page's server order as the
    // subset (see ContentsStore.moveTo / OrderingMixin).
    async function moveUp() {
        close();
        await contents.moveTo(id, -1, contents.currentIds);
    }

    async function moveDown() {
        close();
        await contents.moveTo(id, 1, contents.currentIds);
    }

    async function moveTop() {
        close();
        await contents.moveTo(id, "top");
    }

    async function moveBottom() {
        close();
        await contents.moveTo(id, "bottom");
    }

    async function setDefault() {
        close();
        await contents.makeDefaultPage(id);
    }
</script>

<div class="filemanager-rowmenu" use:dismiss={{ enabled: open, onClose: closeAndRefocus }}>
    <button
        bind:this={toggle}
        type="button"
        class="filemanager-rowmenu-toggle"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={_t("Actions for ${name}", { name: title })}
        onclick={onToggle}
    >
        ⋮
    </button>

    {#if open}
        <div
            bind:this={popover}
            class="filemanager-rowmenu-popover"
            role="menu"
            tabindex="-1"
            onkeydown={onMenuKeydown}
        >
            <a role="menuitem" href={openUrl} title={_t("Open")} onclick={close}>{_t("Open")}</a>
            <a role="menuitem" href="{url}/edit" title={_t("Edit")} onclick={close}>{_t("Edit")}</a>
            <button type="button" role="menuitem" title={_t("Cut")} onclick={cut}>{_t("Cut")}</button>
            <button type="button" role="menuitem" title={_t("Copy")} onclick={copy}>{_t("Copy")}</button>
            <button type="button" role="menuitem" title={_t("Move up")} disabled={!canReorder || isFirst} onclick={moveUp}>
                {_t("Move up")}
            </button>
            <button type="button" role="menuitem" title={_t("Move down")} disabled={!canReorder || isLast} onclick={moveDown}>
                {_t("Move down")}
            </button>
            <button type="button" role="menuitem" title={_t("Move to top")} disabled={!canReorder || isFirst} onclick={moveTop}>
                {_t("Move to top")}
            </button>
            <button type="button" role="menuitem" title={_t("Move to bottom")} disabled={!canReorder || isLast} onclick={moveBottom}>
                {_t("Move to bottom")}
            </button>
            <button type="button" role="menuitem" title={_t("Set as default page")} onclick={setDefault}>
                {_t("Set as default page")}
            </button>
        </div>
    {/if}
</div>
