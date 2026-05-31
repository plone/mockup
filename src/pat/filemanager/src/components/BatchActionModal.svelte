<script>
    import { getContext } from "svelte";
    import WorkflowForm from "./modals/WorkflowForm.svelte";
    import TagsForm from "./modals/TagsForm.svelte";
    import PropertiesForm from "./modals/PropertiesForm.svelte";
    import RenameForm from "./modals/RenameForm.svelte";
    import RearrangeForm from "./modals/RearrangeForm.svelte";
    import LinkIntegrityForm from "./modals/LinkIntegrityForm.svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");

    const TITLES = {
        workflow: _t("Change workflow state"),
        tags: _t("Edit tags"),
        properties: _t("Edit properties"),
        rename: _t("Rename items"),
        rearrange: _t("Rearrange folder contents"),
        linkintegrity: _t("Link integrity warning"),
    };

    /** @type {HTMLDialogElement | undefined} */
    let dialog = $state();

    // Drive the native <dialog> from store state. showModal() gives us the
    // backdrop, focus move/restore, focus trap and Escape handling for free.
    $effect(() => {
        if (!dialog) return;
        if (modal.isOpen && !dialog.open) dialog.showModal();
        else if (!modal.isOpen && dialog.open) dialog.close();
    });

    // Escape fires `cancel` before `close`; block it while a batch op runs.
    function onCancel(event) {
        if (modal.busy) event.preventDefault();
    }

    // Sync the store when the dialog is dismissed natively (Escape).
    function onClose() {
        if (modal.isOpen) modal.close();
    }

    // Close on backdrop click (a click whose target is the dialog box itself).
    function onClick(event) {
        if (event.target === dialog) modal.close();
    }
</script>

<dialog
    bind:this={dialog}
    class="filemanager-modal"
    aria-label={modal.active ? TITLES[modal.active] : undefined}
    oncancel={onCancel}
    onclose={onClose}
    onclick={onClick}
>
    {#if modal.active}
        <header class="filemanager-modal-header">
            <h2 class="filemanager-modal-title">{TITLES[modal.active]}</h2>
            <button
                type="button"
                class="filemanager-modal-close"
                aria-label={_t("Close")}
                disabled={modal.busy}
                onclick={() => modal.close()}
            >&times;</button>
        </header>
        {#if modal.active === "workflow"}
            <WorkflowForm />
        {:else if modal.active === "tags"}
            <TagsForm />
        {:else if modal.active === "properties"}
            <PropertiesForm />
        {:else if modal.active === "rename"}
            <RenameForm />
        {:else if modal.active === "rearrange"}
            <RearrangeForm />
        {:else if modal.active === "linkintegrity"}
            <LinkIntegrityForm />
        {/if}
    {/if}
</dialog>
