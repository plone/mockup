import $ from "jquery";
import Modal from "./modal--implementation";

// handleFormAction imports jquery-form for $.fn.ajaxSubmit; the tests below
// set their own $.fn.ajaxSubmit instead.
jest.mock("jquery-form", () => ({}));

// The tinymce link modal (pat-tinymce js/links.js) constructs the modal
// imperatively (`new Modal(...)`) and calls show() synchronously right after.
// The implementation must therefore be a constructable pattern that exposes
// its methods synchronously — not a config object grafted asynchronously by
// the thin modal.js registration module.
describe("modal implementation", function () {
    let $el;
    beforeEach(function () {
        $el = $("<div/>").appendTo("body");
    });
    afterEach(function () {
        $el.remove();
    });

    it("is constructable and exposes its methods synchronously", function () {
        const modal = new Modal($el, { html: "<div>content</div>" });
        expect(typeof modal.show).toBe("function");
        expect(typeof modal.hide).toBe("function");
    });
});

describe("modal form submit errors", function () {
    let $el;
    let ajaxSubmit;

    const html = `
        <div>
          <h1>Log in</h1>
          <div id="content">
            <form action="/login" method="post">
              <input type="text" name="login" />
              <div class="formControls">
                <button type="submit" name="submit" value="1">Log in</button>
              </div>
            </form>
          </div>
        </div>`;

    // Let ajaxSubmit fail the way jquery-form reports it.
    const failWith = (textStatus) => {
        ajaxSubmit.mockImplementation(function (options) {
            options.error(
                { status: textStatus === "timeout" ? 0 : 500 },
                textStatus,
                "",
            );
        });
    };

    const submit = async (modal) => {
        const calls = ajaxSubmit.mock.calls.length;
        $(".pattern-modal-buttons button", modal.$modal).trigger("click");
        // handleFormAction awaits the dynamic import of jquery-form, so
        // wait until it has called ajaxSubmit.
        for (let i = 0; i < 100 && ajaxSubmit.mock.calls.length === calls; i++) {
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
        expect(ajaxSubmit.mock.calls.length).toBe(calls + 1);
    };

    const message = (modal) => $(".modal-body .modal-submit-error", modal.$modal);

    beforeEach(async function () {
        $el = $("<div/>").appendTo("body");
        ajaxSubmit = $.fn.ajaxSubmit = jest.fn();
    });

    afterEach(function () {
        delete $.fn.ajaxSubmit;
        $(".modal-wrapper, .modal-backdrop").remove();
        $el.remove();
    });

    it("submits with a timeout of 5 seconds", async function () {
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(ajaxSubmit).toHaveBeenCalledTimes(1);
        expect(ajaxSubmit.mock.calls[0][0].timeout).toBe(5000);
    });

    it("shows a warning when the server does not respond in time", async function () {
        failWith("timeout");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(1);
        expect(message(modal).hasClass("alert-warning")).toBe(true);
        expect(message(modal).attr("role")).toBe("alert");
        expect(message(modal).text()).toBe(
            "Warning The server did not respond in time, please try again later.",
        );
        // The form stays, so the user can try again.
        expect($(".modal-body form", modal.$modal).length).toBe(1);
    });

    it("shows a warning when the server returns an error", async function () {
        failWith("error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).text()).toBe(
            "Warning The server could not process the request, please try again later.",
        );
    });

    it("shows only one warning after repeated submits", async function () {
        failWith("error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        await submit(modal);
        expect(message(modal).length).toBe(1);
    });

    it("removes the warning when the form is submitted again", async function () {
        failWith("error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(1);
        ajaxSubmit.mockImplementation(() => {});
        await submit(modal);
        expect(message(modal).length).toBe(0);
    });

    it("does not show a warning in a modal opened after the submit", async function () {
        let fail;
        ajaxSubmit.mockImplementation(function (options) {
            fail = () => options.error({ status: 0 }, "timeout", "");
        });
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        modal.hide();
        modal.show();
        fail();
        expect(message(modal).length).toBe(0);
        expect($(".modal-submit-error").length).toBe(0);
    });

    it("leaves failures to onError and onTimeout when they are given", async function () {
        const onError = jest.fn();
        const onTimeout = jest.fn();
        const modal = new Modal($el, {
            html: html,
            actionOptions: { onError: onError, onTimeout: onTimeout },
        });
        modal.show();

        failWith("timeout");
        await submit(modal);
        expect(onTimeout).toHaveBeenCalledWith(modal.$modal, { status: 0 }, "");

        failWith("error");
        await submit(modal);
        expect(onError).toHaveBeenCalledWith({ status: 500 }, "error", "");

        expect(message(modal).length).toBe(0);
    });
});
