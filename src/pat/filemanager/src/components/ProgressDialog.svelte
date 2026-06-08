<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");

    /** @type {HTMLDialogElement | undefined} */
    let dialog = $state();

    // Self-closing: the dialog opens while copy/paste tasks are running and
    // closes itself as soon as they all finish (mirrors BatchActionModal's
    // store-driven open/close, but with no user dismissal — it's purely a
    // progress indicator). showModal() gives the backdrop + focus trap.
    $effect(() => {
        if (!dialog) return;
        const open = progress.dialogTasks.length > 0;
        if (open && !dialog.open) dialog.showModal();
        else if (!open && dialog.open) dialog.close();
    });

    // A progress dialog can't be dismissed by the user; swallow the Escape
    // cancel so it stays up until the operation completes.
    function onCancel(event) {
        event.preventDefault();
    }
</script>

<dialog
    bind:this={dialog}
    class="filemanager-modal filemanager-progress-dialog"
    aria-label={_t("Operation in progress")}
    oncancel={onCancel}
>
    <ul class="filemanager-progress-list">
        {#each progress.dialogTasks as task (task.id)}
            <li class="filemanager-progress-item">
                <span class="filemanager-progress-label">{task.label}</span>
                {#if task.total > 0}
                    <progress
                        max={task.total}
                        value={task.current}
                        aria-label={task.label}
                    ></progress>
                    <span class="filemanager-progress-count">
                        {task.current} / {task.total}
                    </span>
                {:else}
                    <progress aria-label={task.label}></progress>
                {/if}
            </li>
        {/each}
    </ul>
</dialog>
