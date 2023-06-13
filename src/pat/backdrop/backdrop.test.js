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
});
