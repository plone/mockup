import type { DropManifest } from "../utils/dropentries";

// The approval gate for a folder drop. A dropped folder can mean a large,
// hard-to-undo bulk import, so `preview()` opens a dialog showing what *would*
// be created/uploaded and resolves true/false on the user's decision — an
// awaitable approval, mirroring ConfirmStore but carrying the full manifest.
// FolderDropPreview.svelte renders the open state.

export class FolderDropStore {
    manifest = $state<DropManifest | null>(null);
    /** Display name of the container the folder would be created in. */
    targetName = $state("");

    private resolver: ((ok: boolean) => void) | null = null;

    get isOpen(): boolean {
        return this.manifest !== null;
    }

    /** Open the preview; resolves true on approve, false on cancel/dismiss. */
    preview(manifest: DropManifest, targetName: string): Promise<boolean> {
        // A new preview supersedes any still-pending one (cancel the old).
        this.resolver?.(false);
        this.manifest = manifest;
        this.targetName = targetName;
        return new Promise<boolean>((resolve) => {
            this.resolver = resolve;
        });
    }

    private settle(ok: boolean): void {
        const resolve = this.resolver;
        this.resolver = null;
        this.manifest = null;
        this.targetName = "";
        resolve?.(ok);
    }

    approve(): void {
        this.settle(true);
    }

    cancel(): void {
        this.settle(false);
    }
}
