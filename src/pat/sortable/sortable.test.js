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
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("elements exists", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".pat-sortable").length).toEqual(1);
        expect(document.querySelectorAll(".pat-sortable li").length).toEqual(3);
    });

    it("change order", async function () {

        registry.scan(document.body);
        await utils.timeout(1);

        const getTableCells = () => Array.from(document.querySelectorAll(".pat-sortable li"));

        const createBubbledEvent = (type, props = {}) => {
          const event = new Event(type, { bubbles: true });
          Object.assign(event, props);
          return event;
        };

        const el = document.querySelector(".pat-sortable");

        expect(getTableCells().map(cell => cell.textContent)).toEqual([
          "One",
          "Two",
          "Three",
        ]);

        const tableCells = getTableCells();
        const startingNode = tableCells[0];
        const endingNode = tableCells[2];

        startingNode.dispatchEvent(
          createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
          createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );

        console.log(el.outerHTML);

        expect(getTableCells().map(cell => cell.textContent)).toEqual([
          "Three",
          "Two",
          "One",
        ]);

    });

//    it("adds class on drag start", async function () {
//        // TODO: don't get it to run.
//        // See: https://github.com/SortableJS/sortablejs/issues/735#issuecomment-290439229
//
//        registry.scan(document.body);
//        await utils.timeout(1);
//
//        var todrag = document.querySelectorAll(".pat-sortable li")[0];
//        var todrop = document.querySelectorAll(".pat-sortable li")[2];
//
//        var start = $(todrag).offset();
//        var end = $(todrop).offset();
//
//        var mousedown = new Event("mousedown", { cancelable: true, bubbles: true });
//        var dragstart = new Event("dragstart", { cancelable: true, bubbles: true });
//
//        mousedown.clientX = dragstart.clientX = start.left + 1;
//        mousedown.clientY = dragstart.clientY = start.top + 1;
//        mousedown.screnX = dragstart.screenX = start.left + 5;
//        mousedown.screnY = dragstart.screenY = start.left + 95;
//
//        var drag = new Event("drag", { cancelable: true, bubbles: true });
//        var dragover = new Event("dragover", { cancelable: true, bubbles: true });
//        var drop = new Event("drop", { cancelable: true, bubbles: true });
//        var mouseup = new Event("mouseup", { cancelable: true, bubbles: true });
//
//        drag.clientX = dragover.clientX = drop.clientX = mouseup.clientX = end.left + 1; // prettier-ignore
//        drag.clientY = dragover.clientY = drop.clientY = mouseup.clientY = end.top + 1; // prettier-ignore
//        drag.screenX = dragover.screenX = drop.screenX = mouseup.screenX = end.left + 5; // prettier-ignore
//        drag.screenY = dragover.screenY = drop.screenY = mouseup.screenY = end.left + 95; // prettier-ignore
//
//        const el = document.querySelector(".pat-sortable");
//        //        var todrag = $(todrag)[0];
//        //        var todrop = $(todrop)[0];
//
//        todrag.dispatchEvent(dragstart);
//        await utils.timeout(1);
//        todrag.dispatchEvent(drag);
//        await utils.timeout(1);
//
//        console.log(el.outerHTML);
//        expect($(todrag).hasClass("item-dragging")).toEqual(true);
//        expect(document.querySelectorAll(".item-dragging").length).toEqual(1);
//
//        todrop.dispatchEvent(dragover);
//        await utils.timeout(1);
//        todrag.dispatchEvent(drop);
//        await utils.timeout(1);
//        todrag.dispatchEvent(mouseup);
//        await utils.timeout(1);
//        console.log(el.outerHTML);
//    });
});

//https://www.freecodecamp.org/news/how-to-write-better-tests-for-drag-and-drop-operations-in-the-browser-f9a131f0b281/
//
//Wo komme ich nicht weiter ?
//- Die Events um das drag-and-drop zu simulieren funktonieren nicht bzw. sind falsch
