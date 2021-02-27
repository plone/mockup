import $ from "jquery";
import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "patternslib/src/core/base";

export default Base.extend({
    name: "datatables",
    trigger: ".pat-datatables",
    parser: "mockup",
    table: null,

    defaults: {
        // Default values for attributes
    },

    async init() {
        import("datatables.net-bs/css/dataTables.bootstrap.css");
        import("datatables.net-buttons-bs/css/buttons.bootstrap.min.css");
        import("datatables.net-colreorder-bs/css/colReorder.bootstrap.min.css");
        import("datatables.net-rowreorder-bs/css/rowReorder.bootstrap.min.css");
        import("datatables.net-select-bs/css/select.bootstrap.min.css");
        import("datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css"); // prettier-ignore
        import("datatables.net-fixedcolumns-bs/css/fixedColumns.bootstrap.min.css"); // prettier-ignore

        await import("datatables.net");
        await import("datatables.net-bs");
        await import("datatables.net-buttons");
        await import("datatables.net-buttons-bs");
        await import("datatables.net-buttons/js/buttons.colVis");
        await import("datatables.net-buttons/js/buttons.html5");
        await import("datatables.net-buttons/js/buttons.print");
        await import("datatables.net-colreorder");
        await import("datatables.net-colreorder-bs");
        await import("datatables.net-fixedcolumns");
        await import("datatables.net-fixedcolumns-bs");
        await import("datatables.net-fixedheader");
        await import("datatables.net-fixedheader-bs");
        await import("datatables.net-rowreorder");
        await import("datatables.net-rowreorder-bs");
        await import("datatables.net-select");
        await import("datatables.net-select-bs");

        $(this.el).DataTable(this.options);
    },
});
