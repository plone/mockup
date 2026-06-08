// Transient status messages (the replacement for Plone's portal status
// messages). Batch operations push a success/warning/error line here and the
// StatusMessages component renders them; entries are dismissible.

export type StatusKind = "info" | "success" | "warning" | "error";

export interface StatusMessage {
    id: number;
    kind: StatusKind;
    text: string;
}

export class StatusStore {
    messages = $state<StatusMessage[]>([]);
    private seq = 0;

    add(kind: StatusKind, text: string): void {
        this.seq += 1;
        this.messages = [...this.messages, { id: this.seq, kind, text }];
    }

    info(text: string): void {
        this.add("info", text);
    }
    success(text: string): void {
        this.add("success", text);
    }
    warning(text: string): void {
        this.add("warning", text);
    }
    error(text: string): void {
        this.add("error", text);
    }

    dismiss(id: number): void {
        this.messages = this.messages.filter((m) => m.id !== id);
    }

    clear(): void {
        this.messages = [];
    }
}
