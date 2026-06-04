<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");
    /** @type {import("../stores/ProgressStore.svelte").ProgressStore} */
    const progress = getContext("progress");
</script>

{#if status.messages.length || progress.statusTasks.length}
    <div class="filemanager-status" role="status" aria-live="polite">
        {#each status.messages as message (message.id)}
            <div class="filemanager-status-message is-{message.kind}">
                <span class="filemanager-status-text">{message.text}</span>
                <button
                    type="button"
                    class="filemanager-status-dismiss"
                    aria-label={_t("Dismiss message")}
                    onclick={() => status.dismiss(message.id)}
                >
                    ×
                </button>
            </div>
        {/each}

        {#if progress.statusTasks.length}
            <div class="filemanager-progress">
                <ul class="filemanager-progress-list">
                    {#each progress.statusTasks as task (task.id)}
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
            </div>
        {/if}
    </div>
{/if}
