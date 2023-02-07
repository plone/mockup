import Sortable from "./sortable";
import events from "@patternslib/patternslib/src/core/events";

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

    it("pattern is initialized", async function () {
        const instance = new Sortable(document.querySelector(".pat-sortable"));
        await events.await_pattern_init(instance);

        const items = document.querySelectorAll(".pat-sortable li");

        const md_event = events.mousedown_event();
        md_event.button = 0; // sortablejs only works for left mouse button.

        items[0].dispatchEvent(md_event);

        expect(items[0].classList.contains("item-dragging")).toEqual(true);
        expect(items[0].getAttribute("draggable")).toEqual("true");

        items[0].dispatchEvent(events.mouseup_event());

        expect(items[0].classList.contains("item-dragging")).toEqual(false);
        expect(items[0].getAttribute("draggable")).toEqual("false");
    });
});
