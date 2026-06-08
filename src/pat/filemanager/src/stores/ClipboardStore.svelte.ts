// Client-side cut/copy buffer. The legacy /cut and /copy JSON views are gone;
// instead the clipboard just records what was marked and which operation, and
// the paste later issues a stock @move / @copy into the target folder.

export type ClipboardOp = "cut" | "copy";

export interface ClipboardItem {
    url: string;
    title: string;
}

export class ClipboardStore {
    op = $state<ClipboardOp | null>(null);
    items = $state<ClipboardItem[]>([]);

    get isEmpty(): boolean {
        return this.items.length === 0;
    }

    get count(): number {
        return this.items.length;
    }

    get sources(): string[] {
        return this.items.map((it) => it.url);
    }

    cut(items: ClipboardItem[]): void {
        this.op = "cut";
        this.items = [...items];
    }

    copy(items: ClipboardItem[]): void {
        this.op = "copy";
        this.items = [...items];
    }

    clear(): void {
        this.op = null;
        this.items = [];
    }
}
