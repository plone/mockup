import $ from "jquery";
import utils from "../../core/utils";

export default class ConfigRegistry {
    constructor(el) {
        this.el = el;
    }
    loadModals() {
        const dialog = this.el.querySelector("#record_edit_modal");
        $(dialog.parentNode).on("patterns-injected-scanned", () => {
            // Clicking on an edit link would pat-inject the contents into the
            // dialog and show it.
            dialog.showModal();
        });
    }

    init() {
        var self = this;
        self.loadModals();
        $("#recordsContainer").on("click", "[type='reset']", function () {
            document.querySelector('#searchrow input[name="q"]').value = "";
            document
                .querySelector("#searchrow form#registry-filter button[type='submit']")
                .click();
        });
        /* ajax retrieval of paging */
        $("#recordsContainer").on("click", ".pagination a, .listingBar a", function (e) {
            e.preventDefault();
            var $el = $(this);
            utils.loading.show();
            $("#recordsTable").load(
                $el.attr("href") + " #recordsTable > *",
                function () {
                    self.loadModals();
                    utils.loading.hide();
                }
            );
        });

        /* ajax form submission */
        $("#recordsContainer").on("submit", "#searchrow form", function (e) {
            e.preventDefault();
            var $el = $(this);
            utils.loading.show();
            $("#recordsTable").load(
                $("body").attr("data-base-url") +
                    "?" +
                    $el.serialize() +
                    " #recordsTable > *",
                function () {
                    self.loadModals();
                    utils.loading.hide();
                }
            );
        });

        /* force submit on select change */
        $("#recordsContainer").on("change", "#searchrow select", function () {
            $("#searchrow form#registry-filter").trigger("submit");
        });
    }
}
