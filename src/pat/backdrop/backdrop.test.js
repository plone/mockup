import $ from "jquery";
import { event_listener_map } from "@patternslib/patternslib/src/core/events";
import Pattern from "./backdrop";

const press_key = (key) =>
    document.dispatchEvent(new KeyboardEvent("keydown", { key: key, bubbles: true }));

describe("Backdrop", function () {
    it("default behaviour", function () {
        var $el = $("<div></div>"),
            backdrop = new Pattern($el);
        expect($(".plone-backdrop", $el).length).toEqual(1);
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        backdrop.show();
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        backdrop.hide();
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        backdrop.show();
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        backdrop.$backdrop.trigger("click");
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        backdrop.show();
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        press_key("2");
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        press_key("Escape");
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
    });

    // Ids of this backdrop's listeners registered with add_event_listener.
    const registered_ids = (backdrop, el) =>
        [...(event_listener_map.get(el)?.keys() || [])].filter((id) =>
            id.startsWith(`${backdrop._event_ns}--`),
        );

    it("does not add listeners when init is called again", function () {
        const backdrop = new Pattern(document.createElement("div"));
        const hide_spy = jest.spyOn(backdrop, "hide");
        backdrop.init();
        backdrop.init();
        expect(registered_ids(backdrop, document).length).toEqual(1);

        backdrop.show();
        press_key("Escape");
        expect(hide_spy).toHaveBeenCalledTimes(1);

        backdrop.show();
        backdrop.$backdrop[0].click();
        expect(hide_spy).toHaveBeenCalledTimes(2);
    });

    it("removes its listeners on destroy", function () {
        const backdrop = new Pattern(document.createElement("div"));
        expect(registered_ids(backdrop, document).length).toEqual(1);
        backdrop.destroy();
        expect(registered_ids(backdrop, document).length).toEqual(0);

        backdrop.show();
        press_key("Escape");
        expect(backdrop.$el.hasClass(backdrop.options.classActiveName)).toEqual(true);
        backdrop.$backdrop[0].click();
        expect(backdrop.$el.hasClass(backdrop.options.classActiveName)).toEqual(true);
    });
});
