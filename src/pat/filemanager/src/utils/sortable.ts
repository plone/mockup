import Sortable from "sortablejs";
import type { SortableEvent, MoveEvent } from "sortablejs";
import type { ListInteractions } from "../stores/ListInteractions.svelte";

export interface SortableParams {
    interactions: ListInteractions;
}

/**
 * Svelte action that turns the listing container (table `<tbody>` / grid `<ul>`)
 * into a sortablejs list. sortablejs owns the drag gesture and its animation;
 * all the decisions — reorder vs move-into-folder vs move-into-parent — live in
 * the shared `ListInteractions` controller, which this action drives through
 * three hooks:
 *
 *  - `dragStart(index)` when a drag begins,
 *  - `dragMove(relatedIndex)` on each hover (returns whether sortablejs may
 *    reorder-swap; a folder hover holds the list still and highlights it as a
 *    move-into target),
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
        onMove(evt: MoveEvent) {
            const relIndexRaw = Number(evt.related?.dataset?.fmIndex);
            const relIndex = Number.isInteger(relIndexRaw) ? relIndexRaw : -1;
            return interactions.dragMove(relIndex);
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
