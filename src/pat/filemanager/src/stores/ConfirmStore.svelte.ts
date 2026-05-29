// A single, app-wide confirmation prompt rendered as a native <dialog> (see
// ConfirmDialog.svelte). `ask()` opens the dialog and resolves to true/false
// when the user confirms or cancels — an awaitable replacement for the blocking
// window.confirm, consistent with the batch-action modal.

export interface ConfirmOptions {
    /** Label for the confirm button (defaults to a generic "OK"). */
    confirmLabel?: string;
    /** Render the confirm button as a destructive/danger action. */
    danger?: boolean;
}

export class ConfirmStore {
    message = $state<string | null>(null);
    confirmLabel = $state("");
    danger = $state(false);

    private resolver: ((ok: boolean) => void) | null = null;

    get isOpen(): boolean {
        return this.message !== null;
    }

    /** Open the prompt; resolves true on confirm, false on cancel/dismiss. */
    ask(message: string, options: ConfirmOptions = {}): Promise<boolean> {
        // A new prompt supersedes any still-pending one (cancel the old).
        this.resolver?.(false);
        this.message = message;
        this.confirmLabel = options.confirmLabel ?? "";
        this.danger = Boolean(options.danger);
        return new Promise<boolean>((resolve) => {
            this.resolver = resolve;
        });
    }

    private settle(ok: boolean): void {
        const resolve = this.resolver;
        this.resolver = null;
        this.message = null;
        resolve?.(ok);
    }

    confirm(): void {
        this.settle(true);
    }

    cancel(): void {
        this.settle(false);
    }
}
