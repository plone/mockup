import $ from "jquery";
import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";
import utils from "@patternslib/patternslib/src/core/utils";

export default Base.extend({
    name: "datatables",
    trigger: ".pat-datatables",
    parser: "mockup",
    table: null,

    defaults: {
        // Default values for attributes
    },

    async init() {
        import("datatables.net-bs5/css/dataTables.bootstrap5.min.css");
        import("datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css");
        import("datatables.net-colreorder-bs5/css/colReorder.bootstrap5.min.css");
        import("datatables.net-rowreorder-bs5/css/rowReorder.bootstrap5.min.css");
        import("datatables.net-select-bs5/css/select.bootstrap5.min.css");
        import("datatables.net-fixedheader-bs5/css/fixedHeader.bootstrap5.min.css"); // prettier-ignore
        import("datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css"); // prettier-ignore

        await import("datatables.net");
        await import("datatables.net-bs5");
        await import("datatables.net-buttons");
        await import("datatables.net-buttons-bs5");
        await import("datatables.net-buttons/js/buttons.colVis");
        await import("datatables.net-buttons/js/buttons.html5");
        await import("datatables.net-buttons/js/buttons.print");
        await import("datatables.net-colreorder");
        await import("datatables.net-colreorder-bs5");
        await import("datatables.net-fixedcolumns");
        await import("datatables.net-fixedcolumns-bs5");
        await import("datatables.net-fixedheader");
        await import("datatables.net-fixedheader-bs5");
        await import("datatables.net-rowreorder");
        await import("datatables.net-rowreorder-bs5");
        await import("datatables.net-select");
        await import("datatables.net-select-bs5");

        await utils.timeout(1);

        $(this.el).DataTable(this.options);
    },
});
