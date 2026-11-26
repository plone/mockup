import $ from "jquery";
import ConfigRegistry from "./registry--implementation";

// The modal imports jquery-form for $.fn.ajaxSubmit; the tests below set
// their own $.fn.ajaxSubmit instead.
jest.mock("jquery-form", () => ({}));

// The edit form of a record with a dict value, as plone.app.registry and the
// multi widget of plone.app.z3cform render it.
const edit_form = (rows = 1) => `
    <html><body>
      <div id="content">
        <h1>Edit record</h1>
        <form action="http://localhost/plone/portal_registry/edit/a.record" method="post">
          <div class="multi-widget">
            ${'<div class="row multi-widget-row"><input type="text" name="key" /></div>'.repeat(rows)}
            <div class="formControls multi-widget-buttons">
              <button type="submit" name="form.widgets.value.buttons.add" value="Add">Add</button>
              <button type="submit" name="form.widgets.value.buttons.remove" value="Remove selected">Remove selected</button>
            </div>
          </div>
          <div class="formControls">
            <button type="submit" name="form.buttons.save" value="Save">Save</button>
            <button type="submit" name="form.buttons.cancel" value="Cancel">Cancel</button>
          </div>
        </form>
      </div>
    </body></html>`;

describe("Registry control panel", () => {
    let submits;

    // Click an element and wait for an event of the modal. The modal emits
    // its events with jQuery on the edit link. They do not reach native
    // event listeners, like those of events.await_event.
    const click_and_await = (el, event_name) => {
        const done = new Promise((resolve) =>
            $(".recordsEditLink").one(`${event_name}.plone-modal.patterns`, resolve),
        );
        el.click();
        return done;
    };
    const modal = () => document.querySelector(".modal");
    const in_body = (name) => document.querySelector(`.modal-body [name="${name}"]`);
    const in_footer = (name) => document.querySelector(`.modal-footer [name="${name}"]`);

    const open = () =>
        click_and_await(document.querySelector(".recordsEditLink"), "shown");

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="pat-registry">
              <div id="searchrow">
                <form id="registry-filter"><input name="q" /></form>
              </div>
              <div id="recordsContainer">
                <div id="recordsTable">
                  <a class="recordsEditLink"
                     href="http://localhost/plone/portal_registry/edit/a.record">a.record</a>
                </div>
              </div>
            </div>`;
        // The modal loads the edit form. Like a request, answer later.
        jest.spyOn($, "ajax").mockImplementation(() => {
            const deferred = $.Deferred();
            setTimeout(() => deferred.resolve(edit_form(), "success", {}));
            return deferred.promise({ abort: () => {} });
        });
        // Each submit is answered with a form with one more row.
        submits = [];
        $.fn.ajaxSubmit = jest.fn(function (options) {
            submits.push(Object.keys(options.data)[0]);
            options.success(edit_form(submits.length + 1), "success", {}, this);
        });
        new ConfigRegistry(document.querySelector(".pat-registry")).loadModals();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        delete $.fn.ajaxSubmit;
        document.body.innerHTML = "";
    });

    it("does not mark the edit links as another pattern", () => {
        const link = document.querySelector(".recordsEditLink");
        expect(link.classList.contains("pat-modal")).toBe(false);
        expect(link.classList.contains("pat-plone-modal")).toBe(false);
    });

    it("leaves the buttons of a multi widget in the form", async () => {
        await open();
        expect(in_footer("form.buttons.save")).not.toBeNull();
        expect(in_footer("form.buttons.cancel")).not.toBeNull();
        expect(in_footer("form.widgets.value.buttons.add")).toBeNull();
        expect(in_footer("form.widgets.value.buttons.remove")).toBeNull();
        expect($(in_body("form.widgets.value.buttons.add")).is(":hidden")).toBe(false);
    });

    it("keeps the modal open when a multi widget button is used", async () => {
        const filter = jest.fn((e) => e.preventDefault());
        $("#registry-filter").on("submit", filter);

        await open();
        await click_and_await(in_body("form.widgets.value.buttons.add"), "afterDraw");

        expect(submits).toEqual(["form.widgets.value.buttons.add"]);
        expect(modal()).not.toBeNull();
        // the answer is shown in the modal
        expect(document.querySelectorAll(".modal-body .multi-widget-row").length).toBe(
            2,
        );
        // the record is not saved, so the listing is not loaded again
        expect(filter).not.toHaveBeenCalled();

        // and again, on the form which was drawn anew
        await click_and_await(in_body("form.widgets.value.buttons.add"), "afterDraw");
        expect(submits.length).toBe(2);
        expect(document.querySelectorAll(".modal-body .multi-widget-row").length).toBe(
            3,
        );
    });

    it("closes the modal and loads the listing again on save", async () => {
        const filter = jest.fn((e) => e.preventDefault());
        $("#registry-filter").on("submit", filter);

        await open();
        await click_and_await(in_footer("form.buttons.save"), "hidden");

        expect(submits).toEqual(["form.buttons.save"]);
        expect(modal()).toBeNull();
        expect(filter).toHaveBeenCalledTimes(1);
    });
});
