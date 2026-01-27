import submitForm from "./form-submit";

const response = (text = "", status = 200, statusText = "OK") => ({
    ok: status >= 200 && status < 300,
    status: status,
    statusText: statusText,
    headers: new Map([["content-type", "text/html"]]),
    text: () => Promise.resolve(text),
});

describe("core/form-submit", () => {
    let form;
    let fetch_orig;

    beforeEach(() => {
        fetch_orig = global.fetch;
        document.body.innerHTML = `
            <form action="/login" method="post">
              <input type="text" name="login" value="jane" />
              <button type="submit" name="form.buttons.save" value="Save">Save</button>
            </form>`;
        form = document.querySelector("form");
    });

    afterEach(() => {
        global.fetch = fetch_orig;
        document.body.innerHTML = "";
        jest.useRealTimers();
    });

    it("posts the fields of the form and the extra data", async () => {
        global.fetch = jest.fn(() => Promise.resolve(response("<p>ok</p>")));
        const success = jest.fn();
        const error = jest.fn();

        await submitForm(form, {
            data: { "form.buttons.save": "Save", "undefined": undefined },
            success: success,
            error: error,
        });

        const [url, request] = global.fetch.mock.calls[0];
        expect(url).toBe("/login");
        expect(request.method).toBe("POST");
        expect(request.headers["X-Requested-With"]).toBe("XMLHttpRequest");
        expect([...request.body.entries()]).toEqual([
            ["login", "jane"],
            ["form.buttons.save", "Save"],
        ]);

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalledTimes(1);
        const [text, state, xhr, form_arg] = success.mock.calls[0];
        expect(text).toBe("<p>ok</p>");
        expect(state).toBe("success");
        expect(xhr.status).toBe(200);
        expect(xhr.responseText).toBe("<p>ok</p>");
        expect(xhr.getResponseHeader("content-type")).toBe("text/html");
        expect(xhr.getAllResponseHeaders()).toBe("content-type: text/html\r\n");
        expect(form_arg).toBe(form);
    });

    it("submits the button which was clicked", async () => {
        global.fetch = jest.fn(() => Promise.resolve(response()));
        await submitForm(form, { submitter: form.querySelector("button") });
        expect([...global.fetch.mock.calls[0][1].body.entries()]).toEqual([
            ["login", "jane"],
            ["form.buttons.save", "Save"],
        ]);
    });

    it("uses the url of the settings", async () => {
        global.fetch = jest.fn(() => Promise.resolve(response()));
        await submitForm(form, { url: "/other" });
        expect(global.fetch.mock.calls[0][0]).toBe("/other");
    });

    it("puts the fields of a GET form in the query string", async () => {
        global.fetch = jest.fn(() => Promise.resolve(response()));
        form.setAttribute("method", "get");
        form.setAttribute("action", "/search?a=1");

        await submitForm(form, { data: { b: "2" } });

        const [url, request] = global.fetch.mock.calls[0];
        expect(url).toBe("/search?a=1&login=jane&b=2");
        expect(request.method).toBe("GET");
        expect(request.body).toBeUndefined();
    });

    it("reports an error response with its status", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve(response("<p>broken</p>", 500, "Internal Server Error")),
        );
        const success = jest.fn();
        const error = jest.fn();

        await submitForm(form, { success: success, error: error });

        expect(success).not.toHaveBeenCalled();
        const [xhr, text_status, error_status] = error.mock.calls[0];
        expect(xhr.status).toBe(500);
        expect(xhr.responseText).toBe("<p>broken</p>");
        expect(text_status).toBe("error");
        expect(error_status).toBe("Internal Server Error");
    });

    it("reports a server which can not be reached with status 0", async () => {
        global.fetch = jest.fn(() => Promise.reject(new TypeError("Failed to fetch")));
        const error = jest.fn();

        await submitForm(form, { error: error });

        const [xhr, text_status] = error.mock.calls[0];
        expect(xhr.status).toBe(0);
        expect(text_status).toBe("error");
    });

    it("gives up after the timeout", async () => {
        jest.useFakeTimers();
        // Like fetch: reject when the request is aborted.
        global.fetch = jest.fn(
            (url, request) =>
                new Promise((resolve, reject) => {
                    request.signal.addEventListener("abort", () =>
                        reject(new DOMException("Aborted", "AbortError")),
                    );
                }),
        );
        const success = jest.fn();
        const error = jest.fn();

        const submitted = submitForm(form, {
            timeout: 5000,
            success: success,
            error: error,
        });
        jest.advanceTimersByTime(5000);
        await submitted;

        expect(success).not.toHaveBeenCalled();
        const [xhr, text_status] = error.mock.calls[0];
        expect(xhr.status).toBe(0);
        expect(text_status).toBe("timeout");
    });

    it("does not report an error in the success callback as a failed request", async () => {
        global.fetch = jest.fn(() => Promise.resolve(response()));
        const error = jest.fn();

        await expect(
            submitForm(form, {
                success: () => {
                    throw new Error("broken callback");
                },
                error: error,
            }),
        ).rejects.toThrow("broken callback");
        expect(error).not.toHaveBeenCalled();
    });

    it("calls beforeSubmit before the request", async () => {
        const order = [];
        global.fetch = jest.fn(() => {
            order.push("fetch");
            return Promise.resolve(response());
        });
        await submitForm(form, { beforeSubmit: () => order.push("before") });
        expect(order).toEqual(["before", "fetch"]);
    });
});
