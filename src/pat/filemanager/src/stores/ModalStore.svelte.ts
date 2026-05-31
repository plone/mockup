// Tracks which batch-action modal (if any) is open, plus a shared busy flag so
// the modal host and forms can disable interaction while a batch operation
// runs. The modal is a native <dialog> opened over the listing; this is pure UI
// state, the actual work lives on ContentsStore.

export interface LinkIntegrityBreach {
    "@id": string;
    title: string;
    uid: string;
}

export interface LinkIntegrityItem {
    "@id": string;
    title: string;
    breaches: LinkIntegrityBreach[];
    items_total?: number;
}

export interface LinkIntegrityData {
    breaches: LinkIntegrityItem[];
    /** Sum of items_total across ALL selected items (not just those with breaches). */
    subItemsTotal: number;
    onConfirm: () => Promise<void>;
}

export type ModalName =
    | "workflow"
    | "tags"
    | "properties"
    | "rename"
    | "rearrange"
    | "linkintegrity";

export class ModalStore {
    active = $state<ModalName | null>(null);
    data = $state<unknown>(null);
    busy = $state(false);

    get isOpen(): boolean {
        return this.active !== null;
    }

    open(name: ModalName, data?: unknown): void {
        this.active = name;
        this.data = data ?? null;
    }

    /** Open the modal, or close it if the same action is already open. */
    toggle(name: ModalName): void {
        if (this.busy) return;
        if (this.active === name) {
            this.active = null;
            this.data = null;
        } else {
            this.active = name;
            this.data = null;
        }
    }

    /** Close the modal, unless a batch operation is still running. */
    close(): void {
        if (this.busy) return;
        this.active = null;
        this.data = null;
    }
}
