import type { Action } from "svelte/action";

interface DismissParams {
    /** Only listen while the popover is open. */
    enabled: boolean;
    /** Called on Escape or a pointer/focus event outside the node. */
    onClose: () => void;
}

/**
 * Svelte action: close a popover when the user presses Escape or interacts
 * outside the node. Attach to the *wrapper* that contains both the toggle and
 * the popover, so activating the toggle counts as "inside".
 *
 * Listeners are only bound while `enabled` is true (popover open), so closed
 * popovers — of which there can be many, one per table row — cost nothing.
 */
export const dismiss: Action<HTMLElement, DismissParams> = (node, params) => {
    let { enabled, onClose } = params;

    function onKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.stopPropagation();
            onClose();
        }
    }

    function onPointerDown(event: Event) {
        if (!node.contains(event.target as Node)) onClose();
    }

    function activate() {
        document.addEventListener("keydown", onKeydown, true);
        document.addEventListener("pointerdown", onPointerDown, true);
    }

    function deactivate() {
        document.removeEventListener("keydown", onKeydown, true);
        document.removeEventListener("pointerdown", onPointerDown, true);
    }

    if (enabled) activate();

    return {
        update(next: DismissParams) {
            const wasEnabled = enabled;
            enabled = next.enabled;
            onClose = next.onClose;
            if (enabled && !wasEnabled) activate();
            else if (!enabled && wasEnabled) deactivate();
        },
        destroy: deactivate,
    };
};
