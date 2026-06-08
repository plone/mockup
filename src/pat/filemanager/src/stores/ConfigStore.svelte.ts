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
    /** Portal type created for folders recreated from an OS folder drop. */
    folderType?: string;
    /**
     * Portal types whose object URL serves the raw content (e.g. File, Image
     * download/display) so opening them in a listing must append `/view` to
     * reach the Plone view page. Mirrors the registry record
     * `plone.types_use_view_action_in_listings` (default ['File', 'Image']),
     * which is the canonical source but only readable with cmf.ManagePortal —
     * so it is passed in / defaulted here, the way legacy pat-structure did.
     */
    viewActionTypes?: string[];
    /** CSS selector of the page header to sync on in-app navigation. */
    headerSelector?: string;
}

/** Plone default for plone.types_use_view_action_in_listings. */
const DEFAULT_VIEW_ACTION_TYPES = ["File", "Image"];

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
    folderType: string;
    viewActionTypes: string[];
    headerSelector: string;

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
        this.folderType = opts.folderType || "Folder";
        this.viewActionTypes = opts.viewActionTypes?.length
            ? opts.viewActionTypes
            : DEFAULT_VIEW_ACTION_TYPES;
        this.headerSelector = opts.headerSelector || "#content > header";
    }

    column(key: string): ColumnDef {
        return COLUMN_DEFS[key] || { key, label: key, type: "text" };
    }

    /**
     * The URL to open an item from the listing. Types in `viewActionTypes`
     * (File/Image by default) serve their raw content at the object URL, so
     * `/view` is appended to land on the Plone view page instead. Mirrors the
     * `listing_view.pt` / contextnavigation `get_view_url` logic server-side.
     */
    viewUrl(item: { "@id": string; portal_type?: string }): string {
        const url = item["@id"];
        if (item.portal_type && this.viewActionTypes.includes(item.portal_type)) {
            return `${url}/view`;
        }
        return url;
    }
}
