<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ConfirmStore.svelte").ConfirmStore} */
    const confirm = getContext("confirm");

    /** @type {HTMLDialogElement | undefined} */
    let dialog = $state();

    // Drive the native <dialog> from store state — showModal() gives us the
    // backdrop, focus trap/restore and Escape handling (mirrors BatchActionModal).
    $effect(() => {
        if (!dialog) return;
        if (confirm.isOpen && !dialog.open) dialog.showModal();
        else if (!confirm.isOpen && dialog.open) dialog.close();
    });

    // Native dismissal (Escape / backdrop) counts as cancel.
    function onClose() {
        if (confirm.isOpen) confirm.cancel();
    }

    function onClick(event) {
        if (event.target === dialog) confirm.cancel();
    }
</script>

<dialog
    bind:this={dialog}
    class="filemanager-modal filemanager-confirm"
    aria-label={confirm.message ?? undefined}
    onclose={onClose}
    onclick={onClick}
>
    {#if confirm.isOpen}
        <p class="filemanager-confirm-message">{confirm.message}</p>
        <div class="filemanager-confirm-actions">
            <button type="button" onclick={() => confirm.cancel()}>
                {_t("Cancel")}
            </button>
            <!-- svelte-ignore a11y_autofocus -->
            <button
                type="button"
                class="filemanager-confirm-ok"
                class:filemanager-action-delete={confirm.danger}
                autofocus
                onclick={() => confirm.confirm()}
            >
                {confirm.confirmLabel || _t("OK")}
            </button>
        </div>
    {/if}
</dialog>
