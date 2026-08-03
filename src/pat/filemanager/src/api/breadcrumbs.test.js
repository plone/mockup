import { fetchBreadcrumbs, buildBreadcrumbTrail } from "./breadcrumbs.js";
import { api } from "./ploneClient.js";

jest.mock("./ploneClient.js", () => {
    const stub = { getBreadcrumbs: jest.fn() };
    return {
        api: () => stub,
        toPath: (url) => new URL(url).pathname.replace(/\/+$/, ""),
    };
});

const c = api();

beforeEach(() => {
    c.getBreadcrumbs.mockReset();
});

describe("fetchBreadcrumbs", () => {
    it("calls getBreadcrumbs with the portal-relative path and returns items + root", async () => {
        c.getBreadcrumbs.mockResolvedValue({
            "@id": "http://nohost/plone/folder/@breadcrumbs",
            root: "http://nohost/plone",
            items: [{ "@id": "http://nohost/plone/folder", title: "Folder" }],
        });
        const data = await fetchBreadcrumbs("http://nohost/plone/folder");
        expect(c.getBreadcrumbs).toHaveBeenCalledWith({ path: "/plone/folder" });
        expect(data).toEqual({
            items: [{ "@id": "http://nohost/plone/folder", title: "Folder" }],
            root: "http://nohost/plone",
        });
    });

    it("defaults items to [] and root to null when missing", async () => {
        c.getBreadcrumbs.mockResolvedValue({});
        const data = await fetchBreadcrumbs("http://nohost/plone");
        expect(data).toEqual({ items: [], root: null });
    });
});

describe("buildBreadcrumbTrail", () => {
    it("leaves the trail unchanged when the navigation root is the portal root", () => {
        const trail = buildBreadcrumbTrail({
            items: [{ "@id": "http://nohost/plone/folder", title: "Folder" }],
            root: "http://nohost/plone",
            portalUrl: "http://nohost/plone",
        });
        expect(trail).toEqual({
            items: [{ "@id": "http://nohost/plone/folder", title: "Folder" }],
            home: "http://nohost/plone",
        });
    });

    it("prepends the language root folder and rebases Home on the portal root (multilingual)", () => {
        // Browsing /en/foo in a PAM site: @breadcrumbs stops at /en (the nav
        // root) and lists only [foo]; /en itself is omitted.
        const trail = buildBreadcrumbTrail({
            items: [{ "@id": "http://nohost/plone/en/foo", title: "Foo" }],
            root: "http://nohost/plone/en",
            portalUrl: "http://nohost/plone",
        });
        expect(trail).toEqual({
            items: [
                { "@id": "http://nohost/plone/en", title: "en" },
                { "@id": "http://nohost/plone/en/foo", title: "Foo" },
            ],
            home: "http://nohost/plone",
        });
    });

    it("shows the language root itself as the active (last) crumb when browsing it", () => {
        // Browsing /en directly: @breadcrumbs returns no items.
        const trail = buildBreadcrumbTrail({
            items: [],
            root: "http://nohost/plone/de",
            portalUrl: "http://nohost/plone",
        });
        expect(trail).toEqual({
            items: [{ "@id": "http://nohost/plone/de", title: "de" }],
            home: "http://nohost/plone",
        });
    });

    it("fills in every segment for a navigation root nested several levels deep", () => {
        const trail = buildBreadcrumbTrail({
            items: [{ "@id": "http://nohost/plone/a/b/en/foo", title: "Foo" }],
            root: "http://nohost/plone/a/b/en",
            portalUrl: "http://nohost/plone",
        });
        expect(trail.items).toEqual([
            { "@id": "http://nohost/plone/a", title: "a" },
            { "@id": "http://nohost/plone/a/b", title: "b" },
            { "@id": "http://nohost/plone/a/b/en", title: "en" },
            { "@id": "http://nohost/plone/a/b/en/foo", title: "Foo" },
        ]);
        expect(trail.home).toBe("http://nohost/plone");
    });

    it("tolerates trailing slashes on portalUrl and root", () => {
        const trail = buildBreadcrumbTrail({
            items: [],
            root: "http://nohost/plone/en/",
            portalUrl: "http://nohost/plone/",
        });
        expect(trail).toEqual({
            items: [{ "@id": "http://nohost/plone/en", title: "en" }],
            home: "http://nohost/plone",
        });
    });

    it("does not treat a shared name prefix as an ancestor", () => {
        // /plone-two is not below /plone even though the strings share a prefix.
        const trail = buildBreadcrumbTrail({
            items: [{ "@id": "http://nohost/plone-two/x", title: "X" }],
            root: "http://nohost/plone-two",
            portalUrl: "http://nohost/plone",
        });
        expect(trail.items).toEqual([
            { "@id": "http://nohost/plone-two/x", title: "X" },
        ]);
        expect(trail.home).toBe("http://nohost/plone");
    });

    it("falls back to the portal root for Home when root is null", () => {
        const trail = buildBreadcrumbTrail({
            items: [],
            root: null,
            portalUrl: "http://nohost/plone",
        });
        expect(trail).toEqual({ items: [], home: "http://nohost/plone" });
    });
});
