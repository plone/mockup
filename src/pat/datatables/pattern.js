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
        await import("datatables.net");
        await import("datatables.net-bs");
        await import("datatables.net-buttons");
        await import("datatables.net-buttons-colvis");
        await import("datatables.net-buttons-flash");
        await import("datatables.net-buttons-html5");
        await import("datatables.net-buttons-print");
        await import("datatables.net-buttons-bs");
        await import("datatables.net-colreorder");
        await import("datatables.net-rowreorder");
        await import("datatables.net-fixedcolumns");
        await import("datatables.net-fixedheader");
        await import("datatables.net-select");

        this.$el.DataTable(this.options);
    },
});
