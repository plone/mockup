<script>
    import { getContext, tick } from "svelte";
    import WorkflowForm from "./modals/WorkflowForm.svelte";
    import TagsForm from "./modals/TagsForm.svelte";
    import PropertiesForm from "./modals/PropertiesForm.svelte";
    import RenameForm from "./modals/RenameForm.svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");

    const TITLES = {
        workflow: _t("Change workflow state"),
        tags: _t("Edit tags"),
        properties: _t("Edit properties"),
        rename: _t("Rename items"),
    };

    /** @type {HTMLElement | undefined} */
    let dialog = $state();
    /** @type {Element | null} */
    let lastFocused = null;

    // Move focus into the dialog on open and restore it to the trigger on close,
    // so keyboard and screen-reader users aren't dropped back at the page top.
    $effect(() => {
        if (modal.isOpen) {
            lastFocused = document.activeElement;
            tick().then(focusFirst);
        } else if (lastFocused) {
            /** @type {HTMLElement} */ (lastFocused).focus?.();
            lastFocused = null;
        }
    });

    function focusables() {
        if (!dialog) return [];
        const selector =
            'a[href], button:not([disabled]), input:not([disabled]),' +
            ' select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return /** @type {HTMLElement[]} */ (
            [...dialog.querySelectorAll(selector)].filter(
                (el) => /** @type {HTMLElement} */ (el).offsetParent !== null
            )
        );
    }

    function focusFirst() {
        const list = focusables();
        (list[0] || dialog)?.focus();
    }

    function onKeydown(event) {
        if (event.key === "Escape") modal.close();
    }

    // Keep Tab focus inside the dialog (basic focus trap).
    function onDialogKeydown(event) {
        if (event.key !== "Tab") return;
        const list = focusables();
        if (list.length === 0) {
            event.preventDefault();
            return;
        }
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
</script>

<svelte:window onkeydown={onKeydown} />

{#if modal.isOpen}
    <div
        class="filemanager-modal-backdrop"
        role="presentation"
        onclick={(e) => {
            if (e.target === e.currentTarget) modal.close();
        }}
    >
        <div
            bind:this={dialog}
            class="filemanager-modal"
            role="dialog"
            aria-modal="true"
            aria-label={TITLES[modal.active]}
            tabindex="-1"
            onkeydown={onDialogKeydown}
        >
            <header class="filemanager-modal-header">
                <h2>{TITLES[modal.active]}</h2>
                <button
                    type="button"
                    class="filemanager-modal-close"
                    aria-label={_t("Close")}
                    disabled={modal.busy}
                    onclick={() => modal.close()}
                >
                    ×
                </button>
            </header>
            {#if modal.active === "workflow"}
                <WorkflowForm />
            {:else if modal.active === "tags"}
                <TagsForm />
            {:else if modal.active === "properties"}
                <PropertiesForm />
            {:else if modal.active === "rename"}
                <RenameForm />
            {/if}
        </div>
    </div>
{/if}
