import $ from "jquery";
import utils from "../../core/utils";
import Modal from "../modal/modal--implementation";

export default class ConfigRegistry {
    constructor(el) {
        this.el = el;
    }
    loadModals() {
        // The buttons of a multi widget (add, remove) are form controls,
        // too. They change the form and do not save the record: leave them
        // in the form and show the answer in the modal.
        const multi_widget_buttons = ".multi-widget-buttons";
        const form_controls = `.formControls:not(${multi_widget_buttons})`;
        $(".recordsEditLink").each(function () {
            var $el = $(this);
            var options = {
                buttons: `${form_controls} > input[type="submit"], ${form_controls} > button`,
                actions: {
                    [`${multi_widget_buttons} > input[type="submit"], ${multi_widget_buttons} > button`]:
                        {
                            displayInModal: true,
                            onSuccess: null,
                        },
                },
                actionOptions: {
                    displayInModal: false,
                    reloadWindowOnClose: false,
                    // eslint-disable-next-line no-unused-vars
                    onSuccess: function (modal) {
                        $("#searchrow form#registry-filter").trigger("submit");
                    },
                },
            };
            new Modal($el, options);
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
