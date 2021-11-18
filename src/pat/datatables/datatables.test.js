import $ from "jquery";
import Pattern from "./datatables";
import utils from "@patternslib/patternslib/src/core/utils";

describe("datatables", function () {
    it("default behaviour", async function () {
        document.body.innerHTML = `
            <table class="pat-datatables">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Favorite music</th>
                  <th>Favorite place</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>a</td>
                  <td>b</td>
                  <td>c</td>
                </tr>
              </tbody>
            </table>`;

        const el = document.querySelector(".pat-datatables");
        new Pattern(el);
        await utils.timeout(1);

        console.log(el.outerHTML);

        //        var $el = $("<div></div>"),
        //            backdrop = new Pattern($el);
        //        expect($(".plone-backdrop", $el).length).toEqual(1);
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        //        backdrop.show();
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        //        backdrop.hide();
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        //        backdrop.show();
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        //        backdrop.$backdrop.trigger("click");
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        //        backdrop.show();
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        //        var keydown = $.Event("keydown");
        //        keydown.keyCode = 50;
        //        $(document).trigger(keydown);
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        //        keydown.keyCode = 27;
        //        $(document).trigger(keydown);
        //        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
    });
});
