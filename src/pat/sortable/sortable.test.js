import "./sortable";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Sortable", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <ul class="pat-sortable">
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
            </ul>
        `;

        this.$el = $(".pat-autotoc");
    });

    afterEach(function () {
        this.$el.remove();
    });

    it("elements exists", function (done) {
        registry.scan(document.body);
        utils.timeout(1);

        expect(document.querySelectorAll(".pat-sortable").length).toEqual(1);
        expect(document.querySelectorAll(".pat-sortable li").length).toEqual(3);

        done();
    });

    it("adds class on drag start", function (done) {
        // TODO: don't get it to run.
        // See: https://github.com/SortableJS/sortablejs/issues/735#issuecomment-290439229

        registry.scan(document.body);
        utils.timeout(1);

        var todrag = document.querySelectorAll(".pat-sortable li")[0];
        var todrop = document.querySelectorAll(".pat-sortable li")[2];

        var start = $(todrag).offset();
        var end = $(todrop).offset();

        var mousedown = new Event("mousedown", { cancelable: true });
        var dragstart = new Event("dragstart", { cancelable: true });

        mousedown.clientX = dragstart.clientX = start.left + 1;
        mousedown.clientY = dragstart.clientY = start.top + 1;
        mousedown.screnX = dragstart.screenX = start.left + 5;
        mousedown.screnY = dragstart.screenY = start.left + 95;

        var drag = new Event("drag", { cancelable: true });
        var dragover = new Event("dragover", { cancelable: true });
        var drop = new Event("drop", { cancelable: true });
        var mouseup = new Event("mouseup", { cancelable: true });

        drag.clientX = dragover.clientX = drop.clientX = mouseup.clientX = end.left + 1; // prettier-ignore
        drag.clientY = dragover.clientY = drop.clientY = mouseup.clientY = end.top + 1; // prettier-ignore
        drag.screenX = dragover.screenX = drop.screenX = mouseup.screenX = end.left + 5; // prettier-ignore
        drag.screenY = dragover.screenY = drop.screenY = mouseup.screenY = end.left + 95; // prettier-ignore

        var el = this.$el;
//        var todrag = $(todrag)[0];
//        var todrop = $(todrop)[0];

        setTimeout(
            function () {
                todrag.dispatchEvent(dragstart);
                setTimeout(
                    function () {
                        todrag.dispatchEvent(drag);
                        setTimeout(
                            function () {
                                todrop.dispatchEvent(dragover);
                                setTimeout(
                                    function () {
                                        todrag.dispatchEvent(drop);
                                        setTimeout(
                                            function () {
                                                todrag.dispatchEvent(mouseup);
                                                setTimeout(function () {}, 50);
                                                console.log(el.outerHTML);
                                                expect($(todrag).hasClass('item-dragging')).toEqual(true);
                                                expect(document.querySelectorAll(".item-dragging").length).toEqual(1);
                                                done();
                                            }.bind(this),
                                            50
                                        );
                                    }.bind(this),
                                    50
                                );
                            }.bind(this),
                            50
                        );
                    }.bind(this),
                    50
                );
            }.bind(this),
            50
        );
//        done();
    });

});
