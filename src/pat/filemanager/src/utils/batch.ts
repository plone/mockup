import type { BatchResult } from "../stores/ContentsStore.svelte";
import type { StatusStore } from "../stores/StatusStore.svelte";
import { _t } from "./i18n.ts";

/**
 * Push success / failure status lines for a finished batch operation.
 *
 * @param status   the StatusStore to report into
 * @param result   the {ok, failed} summary from a ContentsStore batch method
 * @param done     translated success template with a `${count}` placeholder
 * @param action   translated failure template with `${count}`/`${details}`
 */
export function reportBatch(
    status: StatusStore,
    result: BatchResult,
    done: string,
    action: string
): void {
    if (result.ok > 0) {
        status.success(_t(done, { count: result.ok }));
    }
    if (result.failed.length) {
        const n = result.failed.length;
        const details = result.failed.map((f) => `${f.title} (${f.error})`).join("; ");
        status.error(_t(action, { count: n, details }));
    }
}
