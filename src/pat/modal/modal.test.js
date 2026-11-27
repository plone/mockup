import "./modal";
import "../select2/select2";
import "../formunloadalert/formunloadalert";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import { event_listener_map } from "@patternslib/patternslib/src/core/events";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Modal", function () {
    const registry_scan = async () => {
        registry.scan(document.body);
        await utils.timeout(2);
    };

    const press_escape = () =>
        document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
    const is_open = (instance) =>
        document.contains(instance.$modal[0]) && instance.$modal.hasClass("show");
    const n_handlers = (el, type) => ($._data(el, "events")?.[type] || []).length;
    // Ids of listeners registered with add_event_listener.
    const registered_ids = (el, prefix = "") =>
        [...(event_listener_map.get(el)?.keys() || [])].filter((id) =>
            id.startsWith(prefix),
        );
    const stacked_fixture = (second_options = "backdrop: #body20") => `
          <div id="body20">
            <a class="pat-plone-modal" id="open-first" href="#target-first"
               data-pat-plone-modal="backdrop: #body20">First</a>
            <div id="target-first" style="display:none;">First</div>
            <a class="pat-plone-modal" id="open-second" href="#target-second"
               data-pat-plone-modal='${second_options}'>Second</a>
            <div id="target-second" style="display:none;">Second</div>
          </div>`;
    const modal_of = (selector) => document.querySelector(selector)["pattern-plone-modal"];
    const open_stacked = async () => {
        const first = modal_of("#open-first");
        const second = modal_of("#open-second");
        document.querySelector("#open-first").click();
        await utils.timeout(1);
        document.querySelector("#open-second").click();
        await utils.timeout(1);
        return { first, second };
    };

    const mockJQueryAjax = () => {
        $.ajax.fail = jest.fn().mockImplementation(() => {
            return Promise.resolve("404");
        });
        $.ajax.always = jest.fn().mockImplementation(() => {
            return Promise.resolve("done");
        });
        $.ajax = jest.fn().mockImplementation((params) => {
            let fakeResponse = "404";
            if (params.url === "modal-form.html") {
                fakeResponse = `
                    <html>
                    <head></head>
                    <body>
                    <div id="content">
                    <h1>Modal with Form</h1>
                    <p>This modal contains a form.</p>
                    <form method="POST" action="/modal-submit.html">
                      <label for="name">Name:</label><input type="text" name="name" />
                      <div class="formControls">
                        <input type="submit" class="btn btn-primary" value="Submit" name="save" />
                      </div>
                    </form>
                    </body>
                    </html>`;
            }
            return {
                done: () => {
                    return {
                        fail: () => {
                            return {
                                always: () => {
                                    return fakeResponse;
                                },
                            };
                        },
                    };
                },
            };
        });
    };

    beforeEach(function () {
        mockJQueryAjax();

        document.body.innerHTML = `
          <div id="body1">
            <a class="pat-plone-modal" href="#target"
               data-pat-plone-modal="backdrop: #body1">
                Open
            </a>
            <div id="target" style="display:none;">Target</div>
          </div>
          <div id="body2">
            <a class="pat-plone-modal" />
          </div>
          <div id="body3">
            <a href="modal-form.html" class="pat-plone-modal" >Foo</a>
          </div>`;

        registry_scan();
    });

    afterEach(function () {
        document.body.innerHTML = "";
        $.ajax.mockClear();
    });

    it("1 - default behaviour", async function () {
        const $el = $("#body1");
        expect($(".modal-wrapper", $el).length).toEqual(0);
        expect($el.hasClass("backdrop-active")).toEqual(false);
        expect($(".modal-backdrop", $el).length).toEqual(0);
        expect($(".modal", $el).length).toEqual(0);

        $("a.pat-plone-modal", $el).trigger("click");
        await utils.timeout(1);

        expect($(".modal-backdrop", $el).length).toEqual(1);
        expect($el.hasClass("backdrop-active")).toEqual(true);
        expect($(".modal-wrapper", $el).is(":visible")).toEqual(true);
        expect($(".modal", $el).length).toEqual(1);
        expect($(".modal .modal-header", $el).length).toEqual(1);
        expect($(".modal .modal-body", $el).length).toEqual(1);
        expect($(".modal .modal-footer", $el).length).toEqual(1);

        press_escape();
        expect($el.hasClass("backdrop-active")).toEqual(false);
        expect($(".modal", $el).length).toEqual(0);
    });

    it("1.1 - keeps the modal open when an internal click removes its target", async () => {
        $("#body1 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const modal = document.querySelector("#body1 .modal");
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML = "<svg><path></path></svg>";
        modal.querySelector(".modal-body").append(button);
        button.addEventListener("click", () => button.remove());
        button.querySelector("path").dispatchEvent(
            new MouseEvent("click", { bubbles: true }),
        );
        expect(button.isConnected).toBe(false);
        expect(modal.isConnected).toBe(true);

        // A genuine backdrop click must still dismiss the modal.
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.2 - does not register the close on click handler twice", async () => {
        const $trigger = $("#body1 a.pat-plone-modal");
        $trigger.trigger("click");
        await utils.timeout(1);
        const instance = $trigger.data("pattern-plone-modal");
        const modal = document.querySelector("#body1 .modal");

        // Activating the focus trap again on the same modal element must
        // replace the close on click handler, not add a second one.
        instance.activateFocusTrap();

        const spy_hide = jest.spyOn(instance, "hide");
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(spy_hide).toHaveBeenCalledTimes(1);
    });

    it("1.2.1 - hides the modal only once per close", async () => {
        const $trigger = $("#body1 a.pat-plone-modal");
        $trigger.trigger("click");
        await utils.timeout(1);
        const instance = $trigger.data("pattern-plone-modal");
        const modal = document.querySelector("#body1 .modal");

        const spy_hide = jest.spyOn(instance, "hide");
        let hide_count = 0;
        let hidden_count = 0;
        $trigger.on("hide.plone-modal.patterns", () => hide_count++);
        $trigger.on("hidden.plone-modal.patterns", () => hidden_count++);

        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
        expect(spy_hide).toHaveBeenCalledTimes(1);
        expect(hide_count).toBe(1);
        expect(hidden_count).toBe(1);
    });

    it("1.3 - keeps the modal open when a drag starts inside the modal and ends outside", async () => {
        $("#body1 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const wrapper = document.querySelector("#body1 .modal-wrapper");
        const modal = document.querySelector("#body1 .modal");
        const body = modal.querySelector(".modal-body");

        // E.g. selecting text inside the modal and releasing the mouse
        // button on the backdrop area results in a click on the backdrop.
        body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // Same, but when the click ends up on the wrapper itself.
        body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        wrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // A click which starts and ends outside the modal still closes it.
        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.4 - keeps the modal open when a drag starts outside the modal and ends inside", async () => {
        $("#body1 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const wrapper = document.querySelector("#body1 .modal-wrapper");
        const modal = document.querySelector("#body1 .modal");
        const body = modal.querySelector(".modal-body");

        // Pressing the mouse button on the backdrop area and releasing it
        // inside the modal results in a click on the common ancestor.
        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        body.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // Same, but starting on the wrapper itself.
        wrapper.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        body.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        wrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // A click which starts and ends outside the modal still closes it.
        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.5 - keeps the modal open on inside clicks with loadLinksWithinModal: false", async () => {
        document.body.innerHTML = `
          <div id="body4">
            <a class="pat-plone-modal" href="#target4"
               data-pat-plone-modal="backdrop: #body4; loadLinksWithinModal: false">
                Open
            </a>
            <div id="target4" style="display:none;">Target</div>
          </div>`;
        await registry_scan();
        $("#body4 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const wrapper = document.querySelector("#body4 .modal-wrapper");
        const modal = document.querySelector("#body4 .modal");
        const body = modal.querySelector(".modal-body");

        // A click inside the modal neither closes it nor is it canceled.
        body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        body.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        const not_canceled = body.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true }),
        );
        expect(not_canceled).toBe(true);
        expect(modal.isConnected).toBe(true);

        // A drag from inside the modal to the backdrop area keeps it open.
        body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // A click on the wrapper still closes the modal.
        wrapper.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        wrapper.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        wrapper.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.6 - closes the modal on a backdrop click with loadLinksWithinModal: false", async () => {
        document.body.innerHTML = `
          <div id="body4">
            <a class="pat-plone-modal" href="#target4"
               data-pat-plone-modal="backdrop: #body4; loadLinksWithinModal: false">
                Open
            </a>
            <div id="target4" style="display:none;">Target</div>
          </div>`;
        await registry_scan();
        $("#body4 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const modal = document.querySelector("#body4 .modal");

        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.7 - keeps the modal open on jQuery triggered clicks from within it with loadLinksWithinModal: false", async () => {
        document.body.innerHTML = `
          <div id="body4">
            <a class="pat-plone-modal" href="#target4"
               data-pat-plone-modal="backdrop: #body4; loadLinksWithinModal: false">
                Open
            </a>
            <div id="target4" style="display:none;">
              <form>
                <input name="q" />
                <button type="submit">Go</button>
              </form>
            </div>
          </div>`;
        await registry_scan();
        $("#body4 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const wrapper = document.querySelector("#body4 .modal-wrapper");
        const modal = document.querySelector("#body4 .modal");
        const input = modal.querySelector("input[name=q]");
        const button = modal.querySelector("button[type=submit]");

        let native_clicks = 0;
        button.addEventListener("click", (e) => {
            native_clicks++;
            // Do not submit the form in the test environment.
            e.preventDefault();
        });

        // The modal's Enter key handler triggers a jQuery click on the
        // first submit button of the form.
        input.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
        );
        expect(native_clicks).toBe(1);
        expect(modal.isConnected).toBe(true);

        // A jQuery triggered click on the wrapper still closes the modal.
        $(wrapper).trigger("click");
        expect(modal.isConnected).toBe(false);
    });

    it("1.8 - keeps the modal open on a drag from a control which stops mousedown propagation", async () => {
        $("#body1 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const modal = document.querySelector("#body1 .modal");
        const control = document.createElement("div");
        modal.querySelector(".modal-body").append(control);
        control.addEventListener("mousedown", (e) => e.stopPropagation());
        control.addEventListener("mouseup", (e) => e.stopPropagation());

        // A drag from the control to the backdrop area keeps the modal open.
        control.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // A drag from the backdrop area to the control keeps it open, too.
        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        control.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);

        // A click on the backdrop area still closes the modal.
        modal.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(false);
    });

    it("1.9 - keeps the modal open on a drag from a pat-select2 tag remove button", async () => {
        document.body.innerHTML = `
          <div id="body5">
            <a class="pat-plone-modal" href="#target5"
               data-pat-plone-modal="backdrop: #body5">
                Open
            </a>
            <div id="target5" style="display:none;">
              <input class="pat-select2"
                     data-pat-select2="tags: Red,Yellow,Blue"
                     value="Yellow" />
            </div>
          </div>`;
        // Only scan the trigger. The modal initializes the cloned content.
        registry.scan(document.querySelector("#body5 a.pat-plone-modal"));
        await utils.timeout(2);
        $("#body5 a.pat-plone-modal").trigger("click");
        await utils.timeout(10);
        const modal = document.querySelector("#body5 .modal");
        const remove = modal.querySelector(".select2-search-choice-close");
        expect(remove).not.toBe(null);

        // select2 cancels mousedown on the tag remove button with
        // stopPropagation. A drag from there to the backdrop area must not
        // close the modal.
        remove.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(modal.isConnected).toBe(true);
    });

    it("1.10 - submits with the first submit button on enter", async () => {
        document.body.innerHTML = `
          <div id="body10">
            <a class="pat-plone-modal" href="#target10"
               data-pat-plone-modal="backdrop: #body10">Open</a>
            <div id="target10" style="display:none;">
              <form>
                <input name="q" />
                <button type="button" name="other">Other</button>
                <button type="reset" name="reset">Reset</button>
                <button name="go">Go</button>
              </form>
            </div>
          </div>`;
        await registry_scan();
        $("#body10 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const form = document.querySelector("#body10 .modal form");

        const clicked = [];
        form.addEventListener("click", (e) => {
            clicked.push(e.target.name);
            // Do not submit the form in the test environment.
            e.preventDefault();
        });

        form.querySelector("input[name=q]").dispatchEvent(
            new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
        );
        // A button without a type is a submit button. Buttons of the type
        // button or reset are not.
        expect(clicked).toEqual(["go"]);
    });

    it("1.11 - submits with a button outside of a multi widget on enter", async () => {
        document.body.innerHTML = `
          <div id="body11">
            <a class="pat-plone-modal" href="#target11"
               data-pat-plone-modal="backdrop: #body11">Open</a>
            <div id="target11" style="display:none;">
              <form>
                <input name="q" />
                <div class="multi-widget-buttons">
                  <button type="submit" name="add">Add</button>
                </div>
                <button type="submit" name="save">Save</button>
              </form>
              <form>
                <input name="q" />
                <div class="multi-widget-buttons">
                  <button type="submit" name="add">Add</button>
                </div>
              </form>
            </div>
          </div>`;
        await registry_scan();
        $("#body11 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);
        const [form1, form2] = document.querySelectorAll("#body11 .modal form");

        const clicked = [];
        for (const form of [form1, form2]) {
            form.addEventListener("click", (e) => {
                clicked.push(e.target.name);
                // Do not submit the form in the test environment.
                e.preventDefault();
            });
        }
        const enter = () =>
            new KeyboardEvent("keydown", { key: "Enter", bubbles: true });

        form1.querySelector("input[name=q]").dispatchEvent(enter());
        expect(clicked).toEqual(["save"]);

        // Without other submit buttons, the multi widget button is used.
        form2.querySelector("input[name=q]").dispatchEvent(enter());
        expect(clicked).toEqual(["save", "add"]);
    });

    it("1.12 - places only the submit buttons of the form controls in the footer", async () => {
        document.body.innerHTML = `
          <div id="body12">
            <a class="pat-plone-modal" href="#target12"
               data-pat-plone-modal="backdrop: #body12">Open</a>
            <div id="target12" style="display:none;">
              <form>
                <div class="formControls">
                  <input type="submit" name="input_submit" value="Save" />
                  <button type="submit" name="submit">Submit</button>
                  <button name="no_type">No type</button>
                  <button type="button" name="button">Button</button>
                  <button type="reset" name="reset">Reset</button>
                </div>
              </form>
            </div>
          </div>`;
        await registry_scan();
        $("#body12 a.pat-plone-modal").trigger("click");
        await utils.timeout(1);

        const names = (selector) =>
            [...document.querySelectorAll(selector)].map((el) => el.name);
        expect(names("#body12 .modal-footer .pattern-modal-buttons > *")).toEqual([
            "input_submit",
            "submit",
            "no_type",
        ]);
        // Buttons which do not submit the form stay in the form.
        expect(names("#body12 .modal-body .formControls > :not([style*=none])")).toEqual(
            ["button", "reset"],
        );
    });

    it("1.13 - hides the backdrop when a non-visible modal is in the page", async () => {
        document.body.innerHTML = `
          <div id="body13">
            <a class="pat-plone-modal" href="#target13"
               data-pat-plone-modal="backdrop: #body13">Open</a>
            <div id="target13" style="display:none;">Target</div>
          </div>
          <div class="modal fade" id="other-modal"></div>`;
        await registry_scan();

        const backdrop_host = document.querySelector("#body13");
        document.querySelector("#body13 a.pat-plone-modal").click();
        await utils.timeout(1);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);
        expect(document.body.classList.contains("modal-open")).toEqual(true);

        document.querySelector("#body13 .modal-header > .modal-close").click();
        await utils.timeout(1);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(false);
        expect(document.body.classList.contains("modal-open")).toEqual(false);
    });

    it("1.14 - resets the hide confirmation also when another modal is open", async () => {
        document.body.innerHTML = `
          <div id="body14">
            <a class="pat-plone-modal" href="#target14"
               data-pat-plone-modal="backdrop: #body14">Open</a>
            <div id="target14" style="display:none;">Target</div>
          </div>
          <div class="modal show" id="other-modal"></div>`;
        await registry_scan();

        const trigger_el = document.querySelector("#body14 a.pat-plone-modal");
        const instance = $(trigger_el).data("patternPloneModal");
        const confirm_spy = jest.spyOn(window, "confirm").mockReturnValue(true);

        trigger_el.click();
        await utils.timeout(1);
        instance._suppressHide = "There are unsaved changes.";
        instance.hide();
        expect(confirm_spy).toHaveBeenCalledTimes(1);
        expect(instance._suppressHide).toBeUndefined();

        // The confirmation does not carry over to the next close.
        trigger_el.click();
        await utils.timeout(1);
        instance.hide();
        expect(confirm_spy).toHaveBeenCalledTimes(1);

        confirm_spy.mockRestore();
    });

    it("1.15 - hides each backdrop with stacked modals on different backdrop elements", async () => {
        document.body.innerHTML = `
          <div id="body15">
            <a class="pat-plone-modal" id="open-inner" href="#target15-inner"
               data-pat-plone-modal="backdrop: #body15">Inner</a>
            <div id="target15-inner" style="display:none;">Inner</div>
          </div>
          <a class="pat-plone-modal" id="open-outer" href="#target15-outer"
             data-pat-plone-modal="backdrop: body">Outer</a>
          <div id="target15-outer" style="display:none;">Outer</div>`;
        await registry_scan();

        const inner_host = document.querySelector("#body15");
        const outer_host = document.body;
        const inner = $("#open-inner").data("patternPloneModal");
        const outer = $("#open-outer").data("patternPloneModal");

        document.querySelector("#open-inner").click();
        await utils.timeout(1);
        document.querySelector("#open-outer").click();
        await utils.timeout(1);
        expect(inner_host.classList.contains("backdrop-active")).toEqual(true);
        expect(outer_host.classList.contains("backdrop-active")).toEqual(true);

        // The inner modal is still open and keeps its own backdrop.
        outer.hide();
        expect(outer_host.classList.contains("backdrop-active")).toEqual(false);
        expect(inner_host.classList.contains("backdrop-active")).toEqual(true);
        expect(document.body.classList.contains("modal-open")).toEqual(true);

        inner.hide();
        expect(inner_host.classList.contains("backdrop-active")).toEqual(false);
        expect(document.body.classList.contains("modal-open")).toEqual(false);
    });

    it("1.16 - keeps a shared backdrop while another modal on it is open", async () => {
        document.body.innerHTML = `
          <div id="body16">
            <a class="pat-plone-modal" id="open-first" href="#target16-first"
               data-pat-plone-modal="backdrop: #body16">First</a>
            <div id="target16-first" style="display:none;">First</div>
            <a class="pat-plone-modal" id="open-second" href="#target16-second"
               data-pat-plone-modal="backdrop: #body16">Second</a>
            <div id="target16-second" style="display:none;">Second</div>
          </div>`;
        await registry_scan();

        const backdrop_host = document.querySelector("#body16");
        const first = $("#open-first").data("patternPloneModal");
        const second = $("#open-second").data("patternPloneModal");

        document.querySelector("#open-first").click();
        await utils.timeout(1);
        document.querySelector("#open-second").click();
        await utils.timeout(1);

        second.hide();
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);
        expect(document.body.classList.contains("modal-open")).toEqual(true);

        first.hide();
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(false);
        expect(document.body.classList.contains("modal-open")).toEqual(false);
    });

    it("1.17 - ESC closes only the topmost modal", async () => {
        document.body.innerHTML = stacked_fixture();
        await registry_scan();
        const { first, second } = await open_stacked();
        const backdrop_host = document.querySelector("#body20");

        press_escape();
        expect(is_open(second)).toEqual(false);
        expect(is_open(first)).toEqual(true);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);

        press_escape();
        expect(is_open(first)).toEqual(false);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(false);
        expect(document.body.classList.contains("modal-open")).toEqual(false);
    });

    it("1.18 - a backdrop click closes only the topmost modal", async () => {
        document.body.innerHTML = stacked_fixture();
        await registry_scan();
        const { first, second } = await open_stacked();

        second.$wrapper[0].click();
        expect(is_open(second)).toEqual(false);
        expect(is_open(first)).toEqual(true);
    });

    it("1.19 - does not leak listeners when opening and closing", async () => {
        document.body.innerHTML = stacked_fixture();
        await registry_scan();
        const backdrop_host = document.querySelector("#body20");
        const count = () => [
            n_handlers(document, "keydown"),
            n_handlers(window.parent, "resize"),
            n_handlers(backdrop_host, "hidden"),
            registered_ids(document).length,
            registered_ids(window.parent).length,
        ];

        // The first cycle may set up listeners that are kept for the
        // lifetime of the pattern.
        document.querySelector("#open-first").click();
        await utils.timeout(1);
        press_escape();
        const before = count();

        for (let i = 0; i < 5; i++) {
            document.querySelector("#open-first").click();
            await utils.timeout(1);
            press_escape();
        }
        expect(count()).toEqual(before);
    });

    it("1.19.1 - registers its ESC and resize listeners only while open", async () => {
        document.body.innerHTML = stacked_fixture();
        await registry_scan();
        const first = modal_of("#open-first");
        const prefix = `${first._event_ns}--`;

        document.querySelector("#open-first").click();
        await utils.timeout(1);
        expect(registered_ids(document, prefix)).toEqual([`${prefix}keydown`]);
        expect(registered_ids(window.parent, prefix)).toContain(`${prefix}resize`);

        press_escape();
        expect(registered_ids(document, prefix)).toEqual([]);
        expect(registered_ids(window.parent, prefix)).toEqual([]);
    });

    it("1.20 - a programmatically hidden lower modal does not affect the topmost", async () => {
        document.body.innerHTML = stacked_fixture();
        await registry_scan();
        const { first, second } = await open_stacked();
        const backdrop_host = document.querySelector("#body20");

        first.hide();
        expect(is_open(second)).toEqual(true);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);

        press_escape();
        expect(is_open(second)).toEqual(false);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(false);
    });

    it("1.21 - ESC does nothing when the topmost modal has closeOnEsc: false", async () => {
        document.body.innerHTML = stacked_fixture(
            '{"backdrop": "#body20", "backdropOptions": {"closeOnEsc": false}}',
        );
        await registry_scan();
        const { first, second } = await open_stacked();

        press_escape();
        expect(is_open(second)).toEqual(true);
        expect(is_open(first)).toEqual(true);
    });

    it("1.22 - ESC while an ajax modal loads", async () => {
        // Resolve the request only after ESC was pressed.
        const request = $.Deferred();
        $.ajax = jest.fn(() => request);
        document.body.innerHTML = `
          <a class="pat-plone-modal" id="open22" href="modal22.html">Open</a>`;
        await registry_scan();
        const trigger_el = document.querySelector("#open22");
        const instance = trigger_el["pattern-plone-modal"];

        trigger_el.click();
        expect(() => press_escape()).not.toThrow();
        request.resolve(
            "<html><body><div id='content'><h1>Loaded</h1></div></body></html>",
            "success",
            {},
        );
        await utils.timeout(1);
        expect(is_open(instance)).toEqual(true);
        expect(document.body.classList.contains("backdrop-active")).toEqual(true);

        press_escape();
        expect(is_open(instance)).toEqual(false);
        expect(document.body.classList.contains("backdrop-active")).toEqual(false);
    });

    it("1.22.1 - ESC while a stacked ajax modal loads keeps the modal below", async () => {
        const request = $.Deferred();
        $.ajax = jest.fn(() => request);
        document.body.innerHTML = `
          <div id="body22">
            <a class="pat-plone-modal" id="open-first" href="#target-first"
               data-pat-plone-modal="backdrop: #body22">First</a>
            <div id="target-first" style="display:none;">First</div>
            <a class="pat-plone-modal" id="open-second" href="modal22.html"
               data-pat-plone-modal="backdrop: #body22">Second</a>
          </div>`;
        await registry_scan();
        const first = modal_of("#open-first");
        const second = modal_of("#open-second");
        const backdrop_host = document.querySelector("#body22");
        document.querySelector("#open-first").click();
        await utils.timeout(1);

        // The second modal is loading.
        document.querySelector("#open-second").click();
        press_escape();
        expect(is_open(first)).toEqual(true);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);

        request.resolve(
            "<html><body><div id='content'><h1>Loaded</h1></div></body></html>",
            "success",
            {},
        );
        await utils.timeout(1);
        expect(is_open(second)).toEqual(true);

        press_escape();
        expect(is_open(second)).toEqual(false);
        expect(is_open(first)).toEqual(true);
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);
    });

    it("1.22.2 - hiding the modal below a loading ajax modal keeps the backdrop", async () => {
        const request = $.Deferred();
        $.ajax = jest.fn(() => request);
        document.body.innerHTML = `
          <div id="body22">
            <a class="pat-plone-modal" id="open-first" href="#target-first"
               data-pat-plone-modal="backdrop: #body22">First</a>
            <div id="target-first" style="display:none;">First</div>
            <a class="pat-plone-modal" id="open-second" href="modal22.html"
               data-pat-plone-modal="backdrop: #body22">Second</a>
          </div>`;
        await registry_scan();
        const first = modal_of("#open-first");
        const backdrop_host = document.querySelector("#body22");
        document.querySelector("#open-first").click();
        await utils.timeout(1);

        document.querySelector("#open-second").click();
        first.hide();
        expect(backdrop_host.classList.contains("backdrop-active")).toEqual(true);
    });

    describe("1.22.3 - a failed ajax load", () => {
        const fail_loading = async (options = "") => {
            const request = $.Deferred();
            request.abort = jest.fn();
            $.ajax = jest.fn(() => request);
            document.body.innerHTML = `
              <a class="pat-plone-modal" id="open22" href="modal22.html"
                 data-pat-plone-modal='${options}'>Open</a>`;
            await registry_scan();
            const trigger_el = document.querySelector("#open22");
            const hidden_spy = jest.fn();
            // The modal emits its events with jQuery.
            $(trigger_el).on("hidden.plone-modal.patterns", hidden_spy);
            trigger_el.click();
            request.reject({ status: 500 }, "error", "Internal Server Error");
            await utils.timeout(1);
            return hidden_spy;
        };
        let alert_spy;
        beforeEach(() => {
            alert_spy = jest.spyOn(window, "alert").mockImplementation(() => {});
        });
        afterEach(() => {
            alert_spy.mockRestore();
            delete window.modal_load_error;
        });

        it("1.22.3.1 - alerts once and closes the modal once", async () => {
            const hidden_spy = await fail_loading();
            expect(alert_spy).toHaveBeenCalledTimes(1);
            expect(hidden_spy).toHaveBeenCalledTimes(1);
            expect(document.body.classList.contains("backdrop-active")).toEqual(false);
            expect(document.querySelectorAll(".modal-wrapper").length).toEqual(0);
        });

        it("1.22.3.2 - closes the modal also when onError handles the error", async () => {
            window.modal_load_error = jest.fn();
            const hidden_spy = await fail_loading(
                '{"actionOptions": {"onError": "modal_load_error"}}',
            );
            expect(window.modal_load_error).toHaveBeenCalledTimes(1);
            expect(alert_spy).not.toHaveBeenCalled();
            expect(hidden_spy).toHaveBeenCalledTimes(1);
            expect(document.body.classList.contains("backdrop-active")).toEqual(false);
        });

        // Hide the modal while it is loading. Like jQuery, the request
        // fails with "abort" right away when it is aborted.
        const hide_while_loading = async (options = "") => {
            const request = $.Deferred();
            request.abort = jest.fn(() =>
                request.reject({ status: 0 }, "abort", "abort"),
            );
            $.ajax = jest.fn(() => request);
            document.body.innerHTML = `
              <a class="pat-plone-modal" id="open22" href="modal22.html"
                 data-pat-plone-modal='${options}'>Open</a>`;
            await registry_scan();
            const trigger_el = document.querySelector("#open22");
            const instance = trigger_el["pattern-plone-modal"];
            const hidden_spy = jest.fn();
            const error_spy = jest.fn();
            $(trigger_el).on("hidden.plone-modal.patterns", hidden_spy);
            $(trigger_el).on("linkActionError.plone-modal.patterns", error_spy);
            trigger_el.click();
            instance.hide();
            await utils.timeout(1);
            expect(request.abort).toHaveBeenCalledTimes(1);
            return { hidden_spy, error_spy };
        };

        it("1.22.3.3 - hiding while loading does not alert", async () => {
            const { hidden_spy, error_spy } = await hide_while_loading();
            expect(alert_spy).not.toHaveBeenCalled();
            expect(error_spy).not.toHaveBeenCalled();
            expect(hidden_spy).toHaveBeenCalledTimes(1);
            expect(document.body.classList.contains("backdrop-active")).toEqual(false);
        });

        it("1.22.3.4 - hiding while loading does not call onError", async () => {
            window.modal_load_error = jest.fn();
            const { hidden_spy } = await hide_while_loading(
                '{"actionOptions": {"onError": "modal_load_error"}}',
            );
            expect(window.modal_load_error).not.toHaveBeenCalled();
            expect(hidden_spy).toHaveBeenCalledTimes(1);
        });
    });

    describe("1.23 - with pat-formunloadalert", () => {
        const default_message =
            "Discard changes? If you click OK, any changes you have made will be lost.";
        let confirm_spy;
        let instance;

        const open_modal = async () => {
            document.body.innerHTML = `
              <div id="body30">
                <a class="pat-plone-modal" id="open30" href="#target30"
                   data-pat-plone-modal="backdrop: #body30">Open</a>
                <div id="target30" style="display:none;">
                  <form class="pat-formunloadalert">
                    <input name="title" />
                    <button type="submit">Save</button>
                  </form>
                </div>
              </div>`;
            await registry_scan();
            instance = modal_of("#open30");
            document.querySelector("#open30").click();
            await utils.timeout(1);
        };
        const change_form = () =>
            instance.$modal[0]
                .querySelector("input[name=title]")
                .dispatchEvent(new Event("change", { bubbles: true }));

        beforeEach(() => {
            confirm_spy = jest.spyOn(window, "confirm");
        });
        afterEach(() => {
            confirm_spy.mockRestore();
        });

        it("1.23.1 - asks before closing a modal with a changed form", async () => {
            confirm_spy.mockReturnValue(false);
            await open_modal();
            change_form();

            instance.hide();
            expect(confirm_spy).toHaveBeenCalledTimes(1);
            expect(confirm_spy).toHaveBeenCalledWith(default_message);
            expect(is_open(instance)).toEqual(true);
        });

        it("1.23.2 - does not guard the page after the modal closed", async () => {
            confirm_spy.mockReturnValue(true);
            await open_modal();
            change_form();

            instance.hide();
            expect(is_open(instance)).toEqual(false);
            const ev = new Event("beforeunload", { cancelable: true });
            window.dispatchEvent(ev);
            expect(ev.defaultPrevented).toEqual(false);
        });

        it("1.23.2.1 - guards the page while the modal with a changed form is open", async () => {
            await open_modal();
            change_form();

            const ev = new Event("beforeunload", { cancelable: true });
            window.dispatchEvent(ev);
            expect(ev.defaultPrevented).toEqual(true);
            expect(confirm_spy).not.toHaveBeenCalled();
            expect(is_open(instance)).toEqual(true);
        });

        it("1.23.3 - keeps the backdrop when closing by backdrop click is cancelled", async () => {
            confirm_spy.mockReturnValue(false);
            await open_modal();
            change_form();

            instance.$wrapper[0].click();
            expect(confirm_spy).toHaveBeenCalledTimes(1);
            expect(is_open(instance)).toEqual(true);
            expect(
                document.querySelector("#body30").classList.contains("backdrop-active"),
            ).toEqual(true);
        });

        it("1.23.4 - does not ask after the form was submitted", async () => {
            await open_modal();
            change_form();
            const form = instance.$modal[0].querySelector("form");
            // Do not let jsdom try to navigate.
            form.addEventListener("submit", (e) => e.preventDefault());
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

            instance.hide();
            expect(confirm_spy).not.toHaveBeenCalled();
            expect(is_open(instance)).toEqual(false);
        });

        it("1.23.5 - does not ask for an unchanged form", async () => {
            await open_modal();

            instance.hide();
            expect(confirm_spy).not.toHaveBeenCalled();
            expect(is_open(instance)).toEqual(false);
        });
    });

    it("2 - customize modal on show event", () => {
        const $el = $("#body1");

        $("a.pat-plone-modal", $el)
            .on("show.plone-modal.patterns", function () {
                var modal = $(this).data("pattern-plone-modal");
                $(".modal-header", modal.$modal).prepend($("<h3>New Title</h3>"));
            })
            .trigger("click");

        expect($(".modal .modal-header h3", $el).text()).toEqual("New Title");
    });

    it("3 - load modal content via ajax", () => {
        $("#body2 a.pat-plone-modal")
            .on("show.plone-modal.patterns", function () {
                expect(document.querySelectorAll(".modal-body").length).toEqual(1);
            })
            .trigger("click");
    });

    it("4 - redirects to base urls", function () {
        $("#body2 a.pat-plone-modal")
            .on("show.plone-modal.patterns", function () {
                var modal = $(this).data("pattern-plone-modal");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><head><base href="testurl1"></base></head></html>'
                    )
                ).toEqual("testurl1");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><head><base href="testurl2" /></head></html>'
                    )
                ).toEqual("testurl2");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><body data-base-url="testurl3" rubbish="discarded"></body></html>'
                    )
                ).toEqual("testurl3");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><body data-view-url="testurl4" rubbish="discarded"></body></html>'
                    )
                ).toEqual("testurl4");
            })
            .trigger("click");
    });

    it("5 - handles forms and form submits", function () {
        $("#body3 a.pat-plone-modal")
            .on("show.plone-modal.patterns", async function () {
                await utils.timeout(1);
                var $input = $(".pattern-modal-buttons").find("input");
                expect($input.length).toEqual(1);
                $input.trigger("click");
            })
            .on("formActionSuccess.plone-modal.patterns", async function () {
                await utils.timeout(1);
                expect($(".modal").length).toEqual(1);
                var title = $(".modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
            })
            .trigger("click");
    });

    it("6 - handles form submits with enter key", function () {
        $('<a href="modal-form.html" class="pat-plone-modal" >Foo</a>')
            .on("show.plone-modal.patterns", async function () {
                await utils.timeout(1);
                var event = $.Event("keydown");
                event.which = event.keyCode = 13;
                $(".modal form").trigger(event);
            })
            .on("formActionSuccess.plone-modal.patterns", async function () {
                var title = $(".modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
            })
            .trigger("click");
    });

    describe("7 - modal positioning (findPosition) ", function () {
        //
        // -- CHANGE POSITION ONLY ----------------------------------------------
        //
        it("7.1 - position: center middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .trigger("click");
        });
        it("7.2 - position: left middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.3 - position: right middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.4 - position: center top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .trigger("click");
        });
        it("7.5 - position: center bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .trigger("click");
        });
        it("7.6 - position: left top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.7 - position: left bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.8 - position: right top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.9 - position: right bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });

        //
        // -- NON-ZERO MARGIN ---------------------------------------------------
        //
        it("7.10 - position: center middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .trigger("click");
        });
        it("7.11 - position: left middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .trigger("click");
        });
        it("7.12 - position: right middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.13 - position: center top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .trigger("click");
        });
        it("7.14 - position: center bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .trigger("click");
        });
        it("7.15 - position: left top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .trigger("click");
        });
        it("7.16 - position: left bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .trigger("click");
        });
        it("7.17 - position: right top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.18 - position: right bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });

        //
        // -- WRAPPER SMALLER THAN MODAL ----------------------------------------
        //
        it("7.19 - position: center middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.20 - position: left middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.21 - position: right middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.22 - position: center top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.23 - position: center bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.24 - position: left top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.25 - position: left bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .trigger("click");
        });
        it("7.26 - position: right top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
        it("7.27 - position: right bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $("#body2 a.pat-plone-modal")
                .on("show.plone-modal.patterns", function () {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .trigger("click");
        });
    });
});
