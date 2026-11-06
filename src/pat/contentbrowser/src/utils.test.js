import {
    portalTypeClass,
    reviewStateClass,
    reviewStateColor,
    sanitizeCssClass,
} from "./utils.js";

describe("review state helpers", () => {
    it("sanitizes CSS class names", () => {
        expect(sanitizeCssClass("Published")).toBe("published");
        expect(sanitizeCssClass("Internally Published")).toBe(
            "internally-published",
        );
        expect(sanitizeCssClass("My.Type")).toBe("my-type");
        expect(sanitizeCssClass("  foo--bar  ")).toBe("foo-bar");
        expect(sanitizeCssClass(null)).toBe("");
        expect(sanitizeCssClass("")).toBe("");
    });

    it("builds the review state class", () => {
        expect(reviewStateClass("published")).toBe("state-published");
        expect(reviewStateClass("Internally Published")).toBe(
            "state-internally-published",
        );
        expect(reviewStateClass("")).toBe("");
        expect(reviewStateClass(null)).toBe("");
    });

    it("builds the portal type class", () => {
        expect(portalTypeClass("Document")).toBe("contenttype-document");
        expect(portalTypeClass("News Item")).toBe("contenttype-news-item");
        expect(portalTypeClass("")).toBe("");
        expect(portalTypeClass(null)).toBe("");
    });

    it("builds the review state color with fallback", () => {
        expect(reviewStateColor("pending")).toBe(
            "var(--plone-state-pending, #fd7e14)",
        );
        expect(reviewStateColor("private")).toBe(
            "var(--plone-state-private, #dc3545)",
        );
        expect(reviewStateColor("unknown-state")).toBe(
            "var(--plone-state-unknown-state, inherit)",
        );
        expect(reviewStateColor("published")).toBeNull();
        expect(reviewStateColor(null)).toBeNull();
        expect(reviewStateColor("")).toBeNull();
    });
});
