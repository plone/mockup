<script>
    import _t, { translate_plone as _tp } from "../../../core/i18n-wrapper";
    import { getContext } from "svelte";
    import { reviewStateColor } from "./utils";

    // reviewState: workflow state id of the item.
    let { reviewState = "" } = $props();

    // pattern option "unmarkedReviewStates"
    const config = getContext("config");

    const color = $derived(reviewStateColor(reviewState, $config?.unmarkedReviewStates));
    const label = $derived(color ? `${_t("review_state")}: ${_tp(reviewState)}` : "");
</script>

{#if color}
    <span
        class="state-indicator"
        style:--state-color={color}
        role="img"
        aria-label={label}
        title={label}
    ></span>
{/if}

<style>
    /* A dot in the color of the workflow state. The color never stands alone:
       the state name is in the title and the accessible name.
       States without a theme color get a neutral ring. */
    .state-indicator {
        display: inline-block;
        position: relative;
        flex-shrink: 0;
        width: 0.6em;
        height: 0.6em;
        margin-inline-end: var(--state-indicator-gap, 0.4em);
        border-radius: 50%;
        vertical-align: 0.05em;
        background-color: var(--state-color, transparent);
        border: 1px solid
            color-mix(
                in srgb,
                var(--state-color, var(--bs-secondary-color, #6c757d)) 70%,
                var(--bs-emphasis-color, #000)
            );
    }
    /* a larger area for the tooltip than the dot itself */
    .state-indicator::after {
        content: "";
        position: absolute;
        inset: -0.5em;
    }
</style>
