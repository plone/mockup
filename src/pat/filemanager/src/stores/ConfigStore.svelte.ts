// Immutable configuration for a pat-filemanager instance, derived from the
// pattern options (parser args). Lives in a .svelte.ts module so the rest of
// the store layer can share a single typed shape; it holds no reactive state.

export type ColumnType = "title" | "text" | "date" | "state" | "tags" | "image";

export interface ColumnDef {
    /** active-columns key (also the catalog metadata field, unless `field` set) */
    key: string;
    /** human label (i18n applied at render time) */
    label: string;
    /** catalog metadata column to read off each item (defaults to `key`) */
    field?: string;
    /** catalog index to sort on; omit for non-sortable columns */
    sortIndex?: string;
    type: ColumnType;
}

export const COLUMN_DEFS: Record<string, ColumnDef> = {
    image: { key: "image", label: "Preview", field: "image_scales", type: "image" },
    Title: { key: "Title", label: "Title", sortIndex: "sortable_title", type: "title" },
    portal_type: { key: "portal_type", label: "Type", sortIndex: "portal_type", type: "text" },
    review_state: { key: "review_state", label: "State", sortIndex: "review_state", type: "state" },
    ModificationDate: { key: "ModificationDate", label: "Modified", sortIndex: "modified", type: "date" },
    CreationDate: { key: "CreationDate", label: "Created", sortIndex: "created", type: "date" },
    EffectiveDate: { key: "EffectiveDate", label: "Published", sortIndex: "effective", type: "date" },
    ExpirationDate: { key: "ExpirationDate", label: "Expires", sortIndex: "expires", type: "date" },
    Subject: { key: "Subject", label: "Tags", type: "tags" },
    getObjSize: { key: "getObjSize", label: "Size", type: "text" },
};

const DEFAULT_ACTIVE = ["image", "Title", "review_state", "ModificationDate"];
const DEFAULT_AVAILABLE = Object.keys(COLUMN_DEFS);

export interface ConfigOptions {
    contextUrl: string;
    portalUrl?: string;
    contextPath?: string;
    activeColumns?: string[];
    availableColumns?: string[];
    portalTypes?: string[];
    searchIndex?: string;
    defaultBatchSize?: number;
    sortOn?: string;
    sortOrder?: "ascending" | "descending";
    defaultView?: string;
}

export class ConfigStore {
    contextUrl: string;
    portalUrl: string;
    contextPath: string;
    activeColumns: string[];
    availableColumns: string[];
    portalTypes: string[];
    searchIndex: string;
    defaultBatchSize: number;
    sortOn: string;
    sortOrder: "ascending" | "descending";
    defaultView: string;

    constructor(opts: ConfigOptions) {
        this.contextUrl = opts.contextUrl.replace(/\/+$/, "");
        this.portalUrl = (opts.portalUrl || this.contextUrl).replace(/\/+$/, "");
        this.contextPath = opts.contextPath || new URL(this.contextUrl).pathname.replace(/\/+$/, "");
        this.activeColumns = opts.activeColumns?.length ? opts.activeColumns : DEFAULT_ACTIVE;
        this.availableColumns = opts.availableColumns?.length
            ? opts.availableColumns
            : DEFAULT_AVAILABLE;
        this.portalTypes = opts.portalTypes || [];
        this.searchIndex = opts.searchIndex || "SearchableText";
        this.defaultBatchSize = opts.defaultBatchSize || 25;
        this.sortOn = opts.sortOn || "getObjPositionInParent";
        this.sortOrder = opts.sortOrder || "ascending";
        this.defaultView = opts.defaultView || "table";
    }

    column(key: string): ColumnDef {
        return COLUMN_DEFS[key] || { key, label: key, type: "text" };
    }
}
