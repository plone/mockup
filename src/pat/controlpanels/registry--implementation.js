import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "../../core/utils";
import Modal from "../modal/modal";
import Base from "@patternslib/patternslib/src/core/base";


export default class ConfigRegistry {
    constructor(el){
        this.el = el;
    }
    loadModals() {
        $(".recordsEditLink").each(function () {
            var $el = $(this);
            var options = {
                actionOptions: {
                    onSuccess: function (modal) {
                        modal.hide();
                        $("#searchrow form#registry-filter").trigger("submit");
                    },
                },
            };
            $el.addClass("pat-modal");
            let modal_obj = new Modal($el, options);
        });
    }

    init(){
        var self = this;
        self.loadModals();
        $("#recordsContainer").on(
            "click",
            "[type='reset']",
            function () {
                document.querySelector('#searchrow input[name="q"]').value = "";
                document.querySelector("#searchrow form#registry-filter button[type='submit']").click();
            }
        );
        /* ajax retrieval of paging */
        $("#recordsContainer").on(
            "click",
            "nav.pagination a, div.listingBar a",
            function () {
                var $el = $(this);
                utils.loading.show();
                $("#recordsContainer").load(
                    $el.attr("href") + " #recordsTable",
                    function () {
                        /* scan registry */
                        registry.scan($("#recordsTable"));
                        self.loadModals();
                        utils.loading.hide();
                    }
                );
                return false;
            }
        );

        /* ajax form submission */
        $("#recordsContainer").on("submit", "#searchrow form", function (e) {
            var $el = $(this);
            utils.loading.show();
            $("#recordsContainer").load(
                $("body").attr("data-base-url") +
                    "?" +
                    $el.serialize() +
                    " #recordsTable",
                function () {
                    $("#spinner").hide();
                    $('#searchrow input[name="q"]').trigger("keypress");
                    registry.scan($("#recordsTable"));
                    self.loadModals();
                    utils.loading.hide();
                }
            );
            e.preventDefault();
            return false;
        });

        /* force submit on select change */
        $("#recordsContainer").on("change", "#searchrow select", function () {
            $("#searchrow form#registry-filter").trigger("submit");
        });

        /* some init */
        $('#searchrow input[name="q"]').trigger("keypress");

    }
};

