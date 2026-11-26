import $ from "jquery";
import Pattern from "./backdrop";

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
        var keydown = $.Event("keydown");
        keydown.keyCode = 50;
        $(document).trigger(keydown);
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        keydown.keyCode = 27;
        $(document).trigger(keydown);
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
    });

    const n_handlers = (el, type) => ($._data(el, "events")?.[type] || []).length;

    it("does not add listeners when init is called again", function () {
        const backdrop = new Pattern($("<div></div>"));
        const n_keydown = n_handlers(document, "keydown");
        const n_click = n_handlers(backdrop.$backdrop[0], "click");
        backdrop.init();
        backdrop.init();
        expect(n_handlers(document, "keydown")).toEqual(n_keydown);
        expect(n_handlers(backdrop.$backdrop[0], "click")).toEqual(n_click);
    });

    it("removes its listeners on destroy", function () {
        const backdrop = new Pattern($("<div></div>"));
        const n_keydown = n_handlers(document, "keydown");
        backdrop.destroy();
        expect(n_handlers(document, "keydown")).toEqual(n_keydown - 1);
        expect(n_handlers(backdrop.$backdrop[0], "click")).toEqual(0);
        backdrop.show();
        const keydown = $.Event("keydown");
        keydown.keyCode = 27;
        $(document).trigger(keydown);
        expect(backdrop.$el.hasClass(backdrop.options.classActiveName)).toEqual(true);
    });
});
