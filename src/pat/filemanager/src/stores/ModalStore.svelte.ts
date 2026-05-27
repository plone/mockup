// Tracks which batch-action modal (if any) is currently open, plus a shared
// busy flag so the modal host and forms can disable interaction while a batch
// operation runs. Pure UI state; the actual work lives on ContentsStore.

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

    /** Close the modal, unless a batch operation is still running. */
    close(): void {
        if (this.busy) return;
        this.active = null;
    }
}
