import $ from "jquery";
import Modal from "./modal--implementation";
import "../formunloadalert/formunloadalert";

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
    let ajax_submit;

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

    // Let $.fn.ajaxSubmit fail the way jquery-form reports it.
    const fail_with = (
        text_status,
        status = text_status === "timeout" ? 0 : 500,
        status_text = "",
    ) => {
        ajax_submit.mockImplementation(function (options) {
            options.error({ status: status }, text_status, status_text);
        });
    };

    const submit = async (modal) => {
        const calls = ajax_submit.mock.calls.length;
        $(".pattern-modal-buttons button", modal.$modal).trigger("click");
        // handleFormAction awaits the dynamic import of jquery-form, so
        // wait until it has called $.fn.ajaxSubmit.
        for (let i = 0; i < 100 && ajax_submit.mock.calls.length === calls; i++) {
            await new Promise((resolve) => setTimeout(resolve, 0));
        }
        expect(ajax_submit.mock.calls.length).toBe(calls + 1);
    };

    const message = (modal) => $(".modal-body .modal-submit-error", modal.$modal);

    beforeEach(async function () {
        $el = $("<div/>").appendTo("body");
        ajax_submit = $.fn.ajaxSubmit = jest.fn();
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
        expect(ajax_submit).toHaveBeenCalledTimes(1);
        expect(ajax_submit.mock.calls[0][0].timeout).toBe(5000);
    });

    it("shows a warning when the server does not respond in time", async function () {
        fail_with("timeout");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(1);
        expect(message(modal).hasClass("statusmessage-warning")).toBe(true);
        expect(message(modal).hasClass("alert-warning")).toBe(true);
        expect(message(modal).attr("role")).toBe("alert");
        expect(message(modal).text()).toBe(
            "Warning The server did not respond in time. The request may still have been processed. Please check this before you submit the form again.",
        );
        // In the prepend area, with the other portal messages.
        expect(message(modal).parent().is(".modal-body > div:first-child")).toBe(true);
        // The form stays, so the user can try again.
        expect($(".modal-body form", modal.$modal).length).toBe(1);
    });

    it("shows an error with the HTTP status when the server returns an error", async function () {
        fail_with("error", 500, "Internal Server Error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(1);
        expect(message(modal).hasClass("statusmessage-error")).toBe(true);
        expect(message(modal).hasClass("alert-danger")).toBe(true);
        expect(message(modal).hasClass("alert-warning")).toBe(false);
        expect(message(modal).attr("role")).toBe("alert");
        expect(message(modal).text()).toBe(
            "Error The server could not process the request, please try again later. (500 Internal Server Error)",
        );
        expect(message(modal).parent().is(".modal-body > div:first-child")).toBe(true);
    });

    it("shows only the status code when there is no status text", async function () {
        // HTTP/2 has no status text.
        fail_with("error", 403, "");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).text()).toBe(
            "Error The server could not process the request, please try again later. (403)",
        );
    });

    it("shows an error when the server cannot be reached", async function () {
        fail_with("error", 0, "");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).hasClass("alert-danger")).toBe(true);
        expect(message(modal).text()).toBe(
            "Error The server could not be reached. Please check your connection and try again.",
        );
    });

    it("asks before closing with unsaved changes after a failed submit", async function () {
        fail_with("error", 0, "");
        const modal = new Modal($el, {
            html: html.replace("<form ", '<form class="pat-formunloadalert" '),
        });
        modal.show();
        // pat-formunloadalert is initialized by the registry scan in _show.
        await new Promise((resolve) => setTimeout(resolve, 0));
        modal.$modal[0]
            .querySelector("input[name=login]")
            .dispatchEvent(new Event("change", { bubbles: true }));
        await submit(modal);
        expect(message(modal).length).toBe(1);

        const confirm_spy = jest.spyOn(window, "confirm").mockReturnValue(false);
        modal.hide();
        expect(confirm_spy).toHaveBeenCalledTimes(1);
        expect(document.body.contains(modal.$modal[0])).toBe(true);
        confirm_spy.mockRestore();
    });

    it("shows an error when the response cannot be read", async function () {
        fail_with("parsererror", 200, "OK");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).hasClass("alert-danger")).toBe(true);
        expect(message(modal).text()).toBe(
            "Error The response of the server could not be read. Please try again later.",
        );
    });

    it("does not show a message when the request is aborted", async function () {
        fail_with("abort");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(0);
    });

    it("shows only one message after repeated submits", async function () {
        fail_with("error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        await submit(modal);
        expect(message(modal).length).toBe(1);
    });

    it("removes the message when the form is submitted again", async function () {
        fail_with("error");
        const modal = new Modal($el, { html: html });
        modal.show();
        await submit(modal);
        expect(message(modal).length).toBe(1);
        ajax_submit.mockImplementation(() => {});
        await submit(modal);
        expect(message(modal).length).toBe(0);
    });

    it("does not show a message in a modal opened after the submit", async function () {
        let fail;
        ajax_submit.mockImplementation(function (options) {
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
        const on_error = jest.fn();
        const on_timeout = jest.fn();
        const modal = new Modal($el, {
            html: html,
            actionOptions: { onError: on_error, onTimeout: on_timeout },
        });
        modal.show();

        fail_with("timeout");
        await submit(modal);
        expect(on_timeout).toHaveBeenCalledWith(modal.$modal, { status: 0 }, "");

        fail_with("error");
        await submit(modal);
        expect(on_error).toHaveBeenCalledWith({ status: 500 }, "error", "");

        expect(message(modal).length).toBe(0);
    });

    it("calls onError and onTimeout given as names of window functions", async function () {
        window.modal_test_on_error = jest.fn();
        window.modal_test_on_timeout = jest.fn();
        const modal = new Modal($el, {
            html: html,
            actionOptions: {
                onError: "modal_test_on_error",
                onTimeout: "modal_test_on_timeout",
            },
        });
        modal.show();

        fail_with("timeout");
        await submit(modal);
        expect(window.modal_test_on_timeout).toHaveBeenCalledWith(
            modal.$modal,
            { status: 0 },
            "",
        );

        fail_with("error");
        await submit(modal);
        expect(window.modal_test_on_error).toHaveBeenCalledWith(
            { status: 500 },
            "error",
            "",
        );

        delete window.modal_test_on_error;
        delete window.modal_test_on_timeout;
    });
});
