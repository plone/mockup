<script>
    import { getContext } from "svelte";
    import { _t } from "../utils/i18n.ts";

    /** @type {import("../stores/ViewStore.svelte").ViewStore} */
    const view = getContext("view");

    // The range input works in integer positions (0..n-1); map them to the
    // store's discrete scale stages so the slider stays a thin presentation
    // layer over view.gridScale.
    const index = $derived(view.scales.indexOf(view.gridScale));
    const max = $derived(view.scales.length - 1);

    function onInput(event) {
        const pos = Number(event.currentTarget.value);
        view.setGridScale(view.scales[pos] ?? view.gridScale);
    }
</script>

<label class="filemanager-grid-size" title={_t("Image size")}>
    <span class="filemanager-grid-size-icon filemanager-grid-size-small" aria-hidden="true"
        >🌄</span
    >
    <input
        type="range"
        min="0"
        max={max}
        step="1"
        value={index}
        oninput={onInput}
        aria-label={_t("Image size")}
    />
    <span class="filemanager-grid-size-icon filemanager-grid-size-large" aria-hidden="true"
        >🌄</span
    >
</label>
