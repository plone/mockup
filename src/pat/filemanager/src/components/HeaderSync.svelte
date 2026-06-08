<script>
    import { getContext } from "svelte";
    import logger from "@patternslib/patternslib/src/core/logging";
    import { fetchContextHtml, swapContextHeader } from "../utils/header.ts";

    /** @type {import("../stores/ContentsStore.svelte").ContentsStore} */
    const contents = getContext("contents");
    /** @type {import("../stores/ConfigStore.svelte").ConfigStore} */
    const config = getContext("config");

    const log = logger.getLogger("pat-filemanager");

    // Renders nothing: a side-effect that transplants the server-rendered
    // `#content > header` of the current folder into the live page so the title,
    // byline and description track in-app navigation. The first run is skipped —
    // the server already rendered the header for the initial context — so we
    // don't refetch on load. A run counter + AbortController make fast
    // successive navigations "latest wins" (stale responses are dropped).
    // Plain (non-reactive) refs: mutating these must not re-trigger the effect.
    let first = true;
    let runId = 0;

    $effect(() => {
        const url = contents.contextUrl;
        if (first) {
            first = false;
            return;
        }
        const id = ++runId;
        const controller = new AbortController();

        fetchContextHtml(url, controller.signal)
            .then((html) => {
                if (id !== runId) return; // superseded by a newer navigation
                swapContextHeader(html, config.headerSelector);
            })
            .catch((e) => {
                if (e?.name === "AbortError") return;
                log.debug(`header sync failed for ${url}: ${e.message}`);
            });

        return () => controller.abort();
    });
</script>
