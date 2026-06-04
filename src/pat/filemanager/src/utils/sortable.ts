import Sortable from "sortablejs";
import type { SortableEvent, MoveEvent } from "sortablejs";
import type { ListInteractions } from "../stores/ListInteractions.svelte";

export interface SortableParams {
    interactions: ListInteractions;
}

// Where the pointer sits over a hovered folder, which decides the drop gesture:
// `before`/`after` reorder the listing, `into` moves the dragged item inside.
export type DropZone = "before" | "into" | "after";

// The thin edge bands that mean "reorder before/after this folder"; the wide
// middle band (everything between) means "move into the folder".
const EDGE_FRACTION = 0.25;

/** The pointer coordinate along the listing's flow axis (Y for the table's
 *  stacked rows, X for the grid's side-by-side cards), or null if unavailable. */
function pointerCoord(event: Event, vertical: boolean): number | null {
    const point = event as MouseEvent & { touches?: TouchList };
    const touch = point.touches?.[0];
    const value = vertical
        ? touch?.clientY ?? point.clientY
        : touch?.clientX ?? point.clientX;
    return Number.isFinite(value) ? value : null;
}

/** Split the hovered folder into before / into / after along the flow axis. */
function folderZone(evt: MoveEvent, originalEvent: Event, vertical: boolean): DropZone {
    const rect = evt.relatedRect;
    const pointer = pointerCoord(originalEvent, vertical);
    if (!rect || pointer === null) return "into";
    const start = vertical ? rect.top : rect.left;
    const size = vertical ? rect.height : rect.width;
    if (size <= 0) return "into";
    const frac = (pointer - start) / size;
    if (frac < EDGE_FRACTION) return "before";
    if (frac > 1 - EDGE_FRACTION) return "after";
    return "into";
}

/**
 * Svelte action that turns the listing container (table `<tbody>` / grid `<ul>`)
 * into a sortablejs list. sortablejs owns the drag gesture and its animation;
 * all the decisions — reorder vs move-into-folder vs move-into-parent — live in
 * the shared `ListInteractions` controller, which this action drives through
 * three hooks:
 *
 *  - `dragStart(index)` when a drag begins,
 *  - `dragMove(relatedIndex, zone)` on each hover (returns whether sortablejs
 *    may reorder-swap; a folder is split into three drop zones — a thin edge
 *    `before` and `after` it reorder, while the large middle `into` zone holds
 *    the list still and highlights the folder as a move-into target),
 *  - `dragEnd(delta)` on drop, which commits the reorder or move.
 *
 * Because Svelte owns the listing via a keyed `{#each}`, the action reverts
 * sortablejs's DOM move in `onEnd` before the controller mutates the model — the
 * re-render then lays the rows out in their committed order, so Svelte's view of
 * the DOM never drifts from the real DOM.
 */
export function sortableList(node: HTMLElement, params: SortableParams) {
    let interactions = params.interactions;
    // The dragged element's original next sibling, captured at drag start, so
    // the DOM can be restored to the order Svelte still believes in.
    let origNextSibling: Node | null = null;
    // The table stacks rows vertically; the grid flows cards horizontally. This
    // picks which axis splits a hovered folder into its before/into/after zones.
    const vertical = node.tagName === "TBODY";

    const sortable = Sortable.create(node, {
        // Only listing items drag; the grid's "up to parent" placeholder and any
        // loading/empty message rows lack the marker and stay put.
        draggable: "[data-fm-item]",
        // Links, buttons, the checkbox and its label keep their own behaviour
        // (matching ListInteractions.isInteractive); a drag starts anywhere else.
        filter: "a, button, input, label",
        preventOnFilter: false,
        // Reuse the existing dragged-item styling.
        chosenClass: "dragging",
        ghostClass: "filemanager-drag-ghost",
        animation: 150,
        onStart(evt: SortableEvent) {
            origNextSibling = evt.item.nextSibling;
            // Draggable index, so the grid's non-draggable "up to parent"
            // placeholder doesn't shift the model index by one.
            interactions.dragStart(evt.oldDraggableIndex ?? -1);
        },
        onMove(evt: MoveEvent, originalEvent: Event) {
            const relIndexRaw = Number(evt.related?.dataset?.fmIndex);
            const relIndex = Number.isInteger(relIndexRaw) ? relIndexRaw : -1;
            return interactions.dragMove(relIndex, folderZone(evt, originalEvent, vertical));
        },
        onEnd(evt: SortableEvent) {
            const delta = (evt.newDraggableIndex ?? 0) - (evt.oldDraggableIndex ?? 0);
            // Undo sortablejs's DOM move so Svelte stays the source of truth; the
            // model mutation in dragEnd re-renders the list in the new order.
            if (evt.item && evt.from) {
                evt.from.insertBefore(evt.item, origNextSibling);
            }
            origNextSibling = null;
            void interactions.dragEnd(delta);
        },
    });

    return {
        update(next: SortableParams) {
            interactions = next.interactions;
        },
        destroy() {
            sortable.destroy();
        },
    };
}
