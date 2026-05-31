<script>
    import { getContext } from "svelte";
    import { _t } from "../../utils/i18n.ts";

    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");

    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    /** @type {import("../../stores/ModalStore.svelte").LinkIntegrityData} */
    const data = $derived(/** @type {any} */ (modal.data));

    async function confirm() {
        modal.busy = true;
        try {
            await data.onConfirm();
            modal.close();
        } catch (e) {
            status.error(e?.message ?? String(e));
        } finally {
            modal.busy = false;
        }
    }
</script>

<form
    class="filemanager-modal-form"
    onsubmit={(e) => { e.preventDefault(); confirm(); }}
>
    <p class="filemanager-modal-intro">
        {_t("The following items have incoming links. Deleting them may break those links.")}
        {#if (data?.subItemsTotal ?? 0) > 0}
            {_t("${subItemsTotal} subitems will also be permanently deleted.", { subItemsTotal: data.subItemsTotal })}
        {/if}
    </p>
    <ul class="filemanager-integrity-list">
        {#each data?.breaches ?? [] as item (item["@id"])}
            <li class="filemanager-integrity-item">
                <a
                    href={item["@id"]}
                    class="filemanager-integrity-target"
                    target="_blank"
                    rel="noopener"
                >{item.title || item["@id"]}</a>
                {#if (item.items_total ?? 0) > 0}
                    <span class="filemanager-integrity-count">
                        {_t("(contains ${n} items)", { n: item.items_total })}
                    </span>
                {/if}
                <span class="filemanager-integrity-label">{_t("is referenced by:")}</span>
                <ul class="filemanager-integrity-sources">
                    {#each item.breaches as source (source["@id"])}
                        <li>
                            <a href={source["@id"]} target="_blank" rel="noopener">
                                {source.title || source["@id"]}
                            </a>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>
    <footer class="filemanager-modal-actions">
        <button
            type="button"
            disabled={modal.busy}
            onclick={() => modal.close()}
        >{_t("Cancel")}</button>
        <button
            type="submit"
            class="filemanager-modal-submit filemanager-action-delete"
            disabled={modal.busy}
        >
            {modal.busy ? _t("Deleting…") : _t("Delete anyway")}
        </button>
    </footer>
</form>
