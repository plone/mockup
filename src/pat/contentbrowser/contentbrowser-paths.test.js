import "./contentbrowser";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import Upload from "../upload/upload--implementation";
import { isPathBelow, pathBelowRoot, physicalPath } from "./src/utils";

jest.mock("../upload/upload--implementation", () => jest.fn());

// A site at /plone which is served as http://example.org, like behind a
// virtual host: the URL does not show the site's id.
const SITE_PATH = "/plone";
const SITE_URL = "http://example.org";
const vocabularyUrl = `${SITE_URL}/@@getVocabulary?name=catalog`;

// physical path: is_folderish
const CONTENT = {
    "/plone": true,
    "/plone/media": true,
    "/plone/media/logo": false,
    "/plone/media/press": true,
    "/plone/media/press/photo": false,
    // a folder with the id of the site
    "/plone/plone": true,
    "/plone/plone/inner": false,
};

let deliverPhysicalPath = true;
let queries = [];

// Answers like plone.app.content: `path` is relative to the navigation
// root, `getPath` is the physical path and `getURL` the visible URL.
function vocabularyItem(path, attributes) {
    const item = {
        UID: `uid${path.replaceAll("/", "-")}`,
        Title: path.split("/").pop(),
        portal_type: CONTENT[path] ? "Folder" : "Image",
        path: path.slice(SITE_PATH.length),
        getPath: path,
        getURL: `${SITE_URL}${path.slice(SITE_PATH.length)}`,
        getIcon: "",
        is_folderish: CONTENT[path],
    };
    const delivered = attributes.filter(
        (attribute) => deliverPhysicalPath || attribute !== "getPath",
    );
    return Object.fromEntries(
        delivered.map((attribute) => [attribute, item[attribute]]),
    );
}

function mockVocabulary() {
    global.fetch = jest.fn(async (url, { body } = {}) => {
        const params = new URLSearchParams(body || new URL(url).search);
        const criterion = JSON.parse(params.get("query")).criteria[0];
        const attributes = JSON.parse(params.get("attributes"));
        let paths = [];
        if (criterion.i === "path") {
            queries.push(criterion.v);
            const [path, depth] = criterion.v.split("::");
            paths = Object.keys(CONTENT).filter((it) =>
                depth === "0"
                    ? it === path
                    : it.startsWith(`${path}/`) &&
                      !it.slice(path.length + 1).includes("/"),
            );
        }
        const results = paths.map((path) => vocabularyItem(path, attributes));
        return {
            ok: true,
            json: async () => ({ results: results, total: results.length }),
        };
    });
}

async function waitFor(find) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const found = find();
        if (found) {
            return found;
        }
        await utils.timeout(10);
    }
    throw new Error(`${find} found nothing`);
}

function levels() {
    return [...document.querySelectorAll(".levelColumn")].map((column) =>
        [...column.querySelectorAll(".contentItem")].map((el) => el.dataset.uuid),
    );
}

async function openBrowser(options) {
    options = {
        vocabularyUrl: vocabularyUrl,
        rootPath: SITE_PATH,
        rootUrl: SITE_URL,
        upload: true,
        ...options,
    };
    document.body.innerHTML = `
        <input type="text" class="pat-contentbrowser"
               data-pat-contentbrowser='${JSON.stringify(options)}'>
    `;
    registry.scan(document.body);
    (
        await waitFor(() =>
            document.querySelector(".content-browser-selected-items-wrapper a.btn"),
        )
    ).click();
    await waitFor(() => document.querySelector(".contentItem"));
}

async function open(uid) {
    const shown = levels().length;
    document.querySelector(`.contentItem[data-uuid="${uid}"]`).click();
    await waitFor(() => levels().length > shown);
}

async function uploadUrl() {
    Upload.mockClear();
    document.querySelector("button.upload").click();
    return (await waitFor(() => Upload.mock.calls[0]?.[1])).url;
}

describe("Content Browser paths", () => {
    beforeEach(() => {
        deliverPhysicalPath = true;
        queries = [];
        mockVocabulary();
        // jsdom has neither, and the sheet's transition needs animate()
        Element.prototype.scrollTo = jest.fn();
        Element.prototype.animate = jest.fn(() => ({ cancel: () => {} }));
    });

    afterEach(() => {
        document.body.innerHTML = "";
        delete global.fetch;
        delete Element.prototype.scrollTo;
        delete Element.prototype.animate;
        Upload.mockReset();
    });

    it("browses from the root path down", async () => {
        await openBrowser();
        expect(levels()).toEqual([["uid-plone-media", "uid-plone-plone"]]);

        await open("uid-plone-media");
        await open("uid-plone-media-press");

        expect(levels()).toEqual([
            ["uid-plone-media", "uid-plone-plone"],
            ["uid-plone-media-logo", "uid-plone-media-press"],
            ["uid-plone-media-press-photo"],
        ]);
        expect(queries.filter((query) => query.endsWith("::1"))).toEqual([
            "/plone::1",
            "/plone/media::1",
            "/plone/media/press::1",
        ]);
    });

    it("starts in the base path", async () => {
        await openBrowser({ basePath: "/plone/media/press" });

        expect(levels()).toEqual([
            ["uid-plone-media", "uid-plone-plone"],
            ["uid-plone-media-logo", "uid-plone-media-press"],
            ["uid-plone-media-press-photo"],
        ]);
        expect(
            [...document.querySelectorAll(".contentItem.inPath")].map(
                (el) => el.dataset.uuid,
            ),
        ).toEqual(["uid-plone-media", "uid-plone-media-press"]);
    });

    it("starts at the root path for a base path outside of it", async () => {
        await openBrowser({ basePath: "/plone2/media" });

        expect(levels()).toEqual([["uid-plone-media", "uid-plone-plone"]]);
    });

    it("opens a folder which has the id of the site", async () => {
        await openBrowser();

        await open("uid-plone-plone");

        expect(levels()).toEqual([
            ["uid-plone-media", "uid-plone-plone"],
            ["uid-plone-plone-inner"],
        ]);
    });

    it("uploads to the folder which is shown", async () => {
        await openBrowser();
        expect(await uploadUrl()).toEqual("http://example.org/@@fileUpload");
        expect(document.querySelector("button.upload").textContent).toContain(
            "upload to /",
        );

        await open("uid-plone-media");
        expect(await uploadUrl()).toEqual("http://example.org/media/@@fileUpload");
        expect(document.querySelector("button.upload").textContent).toContain(
            "upload to /media",
        );

        await open("uid-plone-media-press");
        expect(await uploadUrl()).toEqual("http://example.org/media/press/@@fileUpload");
    });

    it("uploads to a root path below the site", async () => {
        // rootUrl stays the URL of the site
        await openBrowser({ rootPath: "/plone/media" });
        expect(levels()).toEqual([["uid-plone-media-logo", "uid-plone-media-press"]]);
        expect(await uploadUrl()).toEqual("http://example.org/media/@@fileUpload");

        await open("uid-plone-media-press");
        expect(await uploadUrl()).toEqual("http://example.org/media/press/@@fileUpload");
    });

    it("browses a vocabulary which does not deliver getPath", async () => {
        deliverPhysicalPath = false;
        await openBrowser();

        await open("uid-plone-media");
        await open("uid-plone-media-press");

        expect(levels().pop()).toEqual(["uid-plone-media-press-photo"]);
        expect(await uploadUrl()).toEqual("http://example.org/media/press/@@fileUpload");
    });
});

describe("Content Browser path helpers", () => {
    it("knows what is below a path", () => {
        expect(isPathBelow("/plone", "/plone")).toBe(true);
        expect(isPathBelow("/plone/media", "/plone")).toBe(true);
        expect(isPathBelow("/plone2/media", "/plone")).toBe(false);
        expect(isPathBelow("/plone/media", "/")).toBe(true);
        expect(isPathBelow("/plone/media", "")).toBe(true);
    });

    it("cuts the root path off", () => {
        expect(pathBelowRoot("/plone", "/plone")).toEqual("");
        expect(pathBelowRoot("/plone/media", "/plone")).toEqual("/media");
        expect(pathBelowRoot("/plone/plone", "/plone")).toEqual("/plone");
        expect(pathBelowRoot("/plone2/media", "/plone")).toEqual("/plone2/media");
        expect(pathBelowRoot("/plone/media", "/")).toEqual("/plone/media");
        expect(pathBelowRoot("/plone/media", "")).toEqual("/plone/media");
    });

    it("takes the physical path from the vocabulary", () => {
        const item = { path: "/plone", getPath: "/plone/plone" };
        expect(physicalPath(item, "/plone")).toEqual("/plone/plone");
    });

    it("joins path and root path without getPath", () => {
        expect(physicalPath({ path: "/media" }, "/plone")).toEqual("/plone/media");
        expect(physicalPath({ path: "/plone/media" }, "/plone")).toEqual("/plone/media");
        expect(physicalPath({ path: "" }, "/plone")).toEqual("/plone");
        expect(physicalPath({ path: "/media/press" }, "/plone/media")).toEqual(
            "/plone/media/press",
        );
        expect(physicalPath({ path: "/media" }, "")).toEqual("/media");
    });
});
