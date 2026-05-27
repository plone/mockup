import { TextEncoder } from "util";
import { uploadFileTus, uploadFilePost, uploadFile } from "./upload.js";
import { request } from "./client.js";

// jsdom does not expose TextEncoder (browsers and Node do); polyfill it so the
// tus Upload-Metadata base64 encoding runs.
if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
}

jest.mock("./client.js", () => ({ request: jest.fn() }));

const mockedRequest = request;

/** Minimal Response stand-in with header lookup. */
function fakeResponse({ ok = true, status = 200, headers = {} } = {}) {
    return {
        ok,
        status,
        headers: { get: (key) => (key in headers ? headers[key] : null) },
    };
}

beforeEach(() => {
    mockedRequest.mockReset();
    mockedRequest.mockResolvedValue({ "@id": "http://nohost/plone/folder/a.txt" });
    global.fetch = jest.fn();
});

afterEach(() => {
    delete global.fetch;
});

describe("uploadFileTus", () => {
    it("opens an upload then PATCHes the bytes and returns the created url", async () => {
        const file = new File(["0123456789"], "a.txt", { type: "text/plain" });
        global.fetch
            .mockResolvedValueOnce(
                fakeResponse({
                    status: 201,
                    headers: { Location: "http://nohost/plone/folder/@tus-upload/abc" },
                })
            )
            .mockResolvedValueOnce(
                fakeResponse({
                    status: 204,
                    headers: {
                        "Upload-Offset": "10",
                        Location: "http://nohost/plone/folder/a.txt",
                    },
                })
            );

        const onProgress = jest.fn();
        const result = await uploadFileTus("http://nohost/plone/folder", file, {
            onProgress,
        });

        expect(result).toBe("http://nohost/plone/folder/a.txt");

        const [postUrl, postInit] = global.fetch.mock.calls[0];
        expect(postUrl).toBe("http://nohost/plone/folder/@tus-upload");
        expect(postInit.method).toBe("POST");
        expect(postInit.headers["Upload-Length"]).toBe("10");
        expect(postInit.headers["Tus-Resumable"]).toBe("1.0.0");
        expect(postInit.headers["Upload-Metadata"]).toContain("filename ");

        const [patchUrl, patchInit] = global.fetch.mock.calls[1];
        expect(patchUrl).toBe("http://nohost/plone/folder/@tus-upload/abc");
        expect(patchInit.method).toBe("PATCH");
        expect(patchInit.headers["Content-Type"]).toBe("application/offset+octet-stream");
        expect(patchInit.headers["Upload-Offset"]).toBe("0");

        expect(onProgress).toHaveBeenLastCalledWith(10, 10);
    });

    it("throws when the create POST fails", async () => {
        const file = new File(["x"], "a.txt", { type: "text/plain" });
        global.fetch.mockResolvedValueOnce(fakeResponse({ ok: false, status: 500 }));
        await expect(uploadFileTus("http://nohost/plone/folder", file)).rejects.toThrow(
            /Could not start upload/
        );
    });

    it("throws when no Location header comes back", async () => {
        const file = new File(["x"], "a.txt", { type: "text/plain" });
        global.fetch.mockResolvedValueOnce(fakeResponse({ status: 201 }));
        await expect(uploadFileTus("http://nohost/plone/folder", file)).rejects.toThrow(
            /no Location header/
        );
    });
});

describe("uploadFilePost", () => {
    it("POSTs a base64 File for a non-image", async () => {
        const file = new File(["abc"], "a.txt", { type: "text/plain" });
        await uploadFilePost("http://nohost/plone/folder", file);
        expect(mockedRequest).toHaveBeenCalledTimes(1);
        const [url, init] = mockedRequest.mock.calls[0];
        expect(url).toBe("http://nohost/plone/folder");
        expect(init.method).toBe("POST");
        expect(init.body["@type"]).toBe("File");
        expect(init.body.title).toBe("a.txt");
        expect(init.body.file.encoding).toBe("base64");
        expect(init.body.file.filename).toBe("a.txt");
        expect(typeof init.body.file.data).toBe("string");
    });

    it("POSTs an Image for an image mime type", async () => {
        const file = new File(["abc"], "pic.png", { type: "image/png" });
        await uploadFilePost("http://nohost/plone/folder", file);
        const init = mockedRequest.mock.calls[0][1];
        expect(init.body["@type"]).toBe("Image");
        expect(init.body.image).toBeDefined();
    });
});

describe("uploadFile", () => {
    it("falls back to a plain POST when tus fails", async () => {
        const file = new File(["abc"], "a.txt", { type: "text/plain" });
        global.fetch.mockResolvedValueOnce(fakeResponse({ ok: false, status: 404 }));
        await uploadFile("http://nohost/plone/folder", file);
        expect(mockedRequest).toHaveBeenCalledTimes(1);
        expect(mockedRequest.mock.calls[0][1].body["@type"]).toBe("File");
    });
});
