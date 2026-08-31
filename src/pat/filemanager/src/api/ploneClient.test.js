// Mock the package so jest doesn't load axios/query-string (ESM) — we only
// exercise our own toPath/unwrap/api/init wiring here. The fake instance
// carries one service method so the api() proxy can be tested.
jest.mock("@plone/client", () => {
    const instance = {
        id: "fake-client",
        getBreadcrumbs: jest.fn(function () {
            // `this` must be the instance — the real services read this.config.
            return Promise.resolve({ data: { from: this.id } });
        }),
    };
    return {
        __esModule: true,
        default: { initialize: jest.fn(() => instance) },
    };
});

import PloneClient from "@plone/client";
import { initPloneClient, client, api, toPath, unwrap } from "./ploneClient.js";
import { RestapiError } from "./client.js";

beforeAll(() => initPloneClient("http://nohost/plone"));

describe("initPloneClient / client", () => {
    it("initialises with the apiPath and apiSuffix '' (no /++api++)", () => {
        expect(PloneClient.initialize).toHaveBeenCalledWith({
            apiPath: "http://nohost/plone",
            apiSuffix: "",
        });
        expect(client().id).toBe("fake-client");
    });
});

describe("api proxy", () => {
    it("unwraps service results and binds `this` to the instance", async () => {
        await expect(api().getBreadcrumbs({ path: "/x" })).resolves.toEqual({
            from: "fake-client",
        });
        expect(client().getBreadcrumbs).toHaveBeenCalledWith({ path: "/x" });
    });

    it("rejects with a RestapiError on a client rejection", async () => {
        client().getBreadcrumbs.mockRejectedValueOnce({
            status: 403,
            data: { error: { message: "Forbidden" } },
        });
        await expect(api().getBreadcrumbs({ path: "/x" })).rejects.toMatchObject({
            name: "RestapiError",
            message: "Forbidden",
            status: 403,
        });
    });

    it("passes non-function properties through", () => {
        expect(api().id).toBe("fake-client");
    });
});

describe("toPath", () => {
    it("strips the apiPath prefix, query/hash and trailing slash", () => {
        expect(toPath("http://nohost/plone/folder/sub/")).toBe("/folder/sub");
        expect(toPath("http://nohost/plone")).toBe("/");
        expect(toPath("http://nohost/plone/a?x=1#h")).toBe("/a");
    });

    it("falls back to the pathname for a url outside the apiPath", () => {
        expect(toPath("http://other/site/x")).toBe("/site/x");
    });
});

describe("unwrap", () => {
    it("returns the axios response body on success", async () => {
        await expect(unwrap(Promise.resolve({ data: { ok: 1 } }))).resolves.toEqual({ ok: 1 });
    });

    it("maps a {status,data} rejection to a RestapiError", async () => {
        const rejection = { status: 404, data: { error: { message: "Not found" } } };
        await expect(unwrap(Promise.reject(rejection))).rejects.toMatchObject({
            name: "RestapiError",
            message: "Not found",
            status: 404,
        });
    });

    it("uses a generic message when the body has none", async () => {
        await expect(unwrap(Promise.reject({ status: 500, data: {} }))).rejects.toThrow(
            "Request failed (500)"
        );
    });

    it("passes an existing RestapiError through unchanged", async () => {
        const original = new RestapiError("boom", { status: 400 });
        await expect(unwrap(Promise.reject(original))).rejects.toBe(original);
    });
});
