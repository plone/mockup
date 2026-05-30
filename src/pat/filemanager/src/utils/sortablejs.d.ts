// Minimal ambient types for sortablejs (the package ships no declarations).
// Only the surface the filemanager's `sortableList` action touches is typed.
declare module "sortablejs" {
    export interface SortableEvent {
        item: HTMLElement;
        from: HTMLElement;
        to: HTMLElement;
        oldIndex?: number;
        newIndex?: number;
        // Index counted over only the elements matching `draggable` (so the
        // grid's non-draggable "up to parent" placeholder is excluded), which is
        // what maps to the model index in `data-fm-index`.
        oldDraggableIndex?: number;
        newDraggableIndex?: number;
    }

    export interface MoveEvent {
        related: HTMLElement;
        relatedRect: DOMRect;
        dragged: HTMLElement;
        draggedRect: DOMRect;
        willInsertAfter?: boolean;
    }

    export interface SortableOptions {
        draggable?: string;
        filter?: string;
        preventOnFilter?: boolean;
        handle?: string;
        chosenClass?: string;
        ghostClass?: string;
        dragClass?: string;
        animation?: number;
        sort?: boolean;
        onStart?: (event: SortableEvent) => void;
        onEnd?: (event: SortableEvent) => void;
        onMove?: (event: MoveEvent, originalEvent: Event) => boolean | number | void;
    }

    export default class Sortable {
        static create(el: HTMLElement, options?: SortableOptions): Sortable;
        option(name: string, value?: unknown): unknown;
        destroy(): void;
    }
}
