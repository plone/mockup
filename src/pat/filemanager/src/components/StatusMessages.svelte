<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");
</script>

{#if status.messages.length}
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
    </div>
{/if}
