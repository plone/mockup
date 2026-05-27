<script>
    import { getContext, onMount } from "svelte";
    import { fetchVocabulary } from "../../api/vocabularies.js";
    import { reportBatch } from "../../utils/batch.ts";
    import { _t } from "../../utils/i18n.ts";

    /** @type {import("../../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");
    /** @type {import("../../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../../stores/SelectionStore.svelte").SelectionStore} */
    const selection = getContext("selection");
    /** @type {import("../../stores/ModalStore.svelte").ModalStore} */
    const modal = getContext("modal");
    /** @type {import("../../stores/StatusStore.svelte").StatusStore} */
    const status = getContext("status");

    const items = selection.items;
    const hasFolders = items.some((it) => it.isFolderish);

    let languages = $state([]);

    let effective = $state("");
    let expires = $state("");
    let rights = $state("");
    let creators = $state("");
    let contributors = $state("");
    let excludeFromNav = $state(""); // "", "true", "false"
    let language = $state("");
    let recursive = $state(false);

    onMount(async () => {
        try {
            languages = await fetchVocabulary(
                config.contextUrl,
                "plone.app.vocabularies.AvailableContentLanguages"
            );
        } catch {
            languages = [];
        }
    });

    function parseList(text) {
        return text
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }

    /** Only the fields the user actually filled in, so we never wipe values. */
    function collectProps() {
        const props = {};
        if (effective) props.effective = effective;
        if (expires) props.expires = expires;
        if (rights.trim()) props.rights = rights.trim();
        if (creators.trim()) props.creators = parseList(creators);
        if (contributors.trim()) props.contributors = parseList(contributors);
        if (excludeFromNav !== "") props.exclude_from_nav = excludeFromNav === "true";
        if (language) props.language = language;
        return props;
    }

    async function submit(event) {
        event.preventDefault();
        const props = collectProps();
        if (Object.keys(props).length === 0) {
            status.warning(_t("No property changes were specified."));
            return;
        }
        modal.busy = true;
        try {
            const result = await contents.applyProperties(items, props, recursive);
            reportBatch(
                status,
                result,
                "Updated properties on ${count} items.",
                "Could not update properties on ${count} items: ${details}"
            );
            selection.clear();
            modal.busy = false;
            modal.close();
        } catch (e) {
            modal.busy = false;
            status.error(e.message);
        }
    }
</script>

<form class="filemanager-modal-form" onsubmit={submit}>
    <p class="filemanager-modal-intro">
        {_t("Set properties on ${count} selected items. Empty fields are left unchanged.", {
            count: items.length,
        })}
    </p>

    <label class="filemanager-field">
        <span>{_t("Publishing date")}</span>
        <input type="datetime-local" bind:value={effective} />
    </label>

    <label class="filemanager-field">
        <span>{_t("Expiration date")}</span>
        <input type="datetime-local" bind:value={expires} />
    </label>

    <label class="filemanager-field">
        <span>{_t("Rights")}</span>
        <textarea bind:value={rights} rows="2"></textarea>
    </label>

    <label class="filemanager-field">
        <span>{_t("Creators")}</span>
        <input type="text" bind:value={creators} placeholder={_t("comma, separated")} />
    </label>

    <label class="filemanager-field">
        <span>{_t("Contributors")}</span>
        <input type="text" bind:value={contributors} placeholder={_t("comma, separated")} />
    </label>

    <label class="filemanager-field">
        <span>{_t("Exclude from navigation")}</span>
        <select bind:value={excludeFromNav}>
            <option value="">{_t("No change")}</option>
            <option value="true">{_t("Exclude")}</option>
            <option value="false">{_t("Include")}</option>
        </select>
    </label>

    <label class="filemanager-field">
        <span>{_t("Language")}</span>
        <select bind:value={language}>
            <option value="">{_t("No change")}</option>
            {#each languages as lang (lang.token)}
                <option value={lang.token}>{lang.title}</option>
            {/each}
        </select>
    </label>

    {#if hasFolders}
        <label class="filemanager-field filemanager-field-check">
            <input type="checkbox" bind:checked={recursive} />
            <span>{_t("Also apply to contained items (recursive)")}</span>
        </label>
    {/if}

    <footer class="filemanager-modal-actions">
        <button type="button" disabled={modal.busy} onclick={() => modal.close()}>
            {_t("Cancel")}
        </button>
        <button type="submit" class="filemanager-modal-submit" disabled={modal.busy}>
            {modal.busy ? _t("Saving…") : _t("Save")}
        </button>
    </footer>
</form>
