// Tracks which batch-action modal (if any) is open, plus a shared busy flag so
// the modal host and forms can disable interaction while a batch operation
// runs. The modal is a native <dialog> opened over the listing; this is pure UI
// state, the actual work lives on ContentsStore.

export type ModalName = "workflow" | "tags" | "properties" | "rename";

export class ModalStore {
    active = $state<ModalName | null>(null);
    busy = $state(false);

    get isOpen(): boolean {
        return this.active !== null;
    }

    open(name: ModalName): void {
        this.active = name;
    }

    /** Open the modal, or close it if the same action is already open. */
    toggle(name: ModalName): void {
        if (this.busy) return;
        this.active = this.active === name ? null : name;
    }

    /** Close the modal, unless a batch operation is still running. */
    close(): void {
        if (this.busy) return;
        this.active = null;
    }
}
