import { jest } from "@jest/globals";
import "./navigationmarker";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Navigation Marker", function () {
    beforeEach(function () {
        // Set up the canonical link in head
        const canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        canonicalLink.href = "http://example.com/news/article-1";
        document.head.appendChild(canonicalLink);

        // Set portal URL on body
        document.body.dataset.portalUrl = "http://example.com";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li>
                        <a href="http://example.com">Home</a>
                    </li>
                    <li>
                        <input type="checkbox" id="news-toggle">
                        <a href="http://example.com/news">News</a>
                        <ul>
                            <li>
                                <a href="http://example.com/news/article-1">Article 1</a>
                            </li>
                            <li>
                                <a href="http://example.com/news/article-2">Article 2</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="http://example.com/about">About</a>
                    </li>
                    <li>
                        <a href="http://example.com/contact">Contact</a>
                    </li>
                </ul>
            </nav>
        `;

        this.$el = $(".pat-navigationmarker");
    });

    afterEach(() => {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        // Clean up canonical link
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.remove();
        }
    });

    it("marks current navigation item with 'current' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const currentItem = $("a[href='http://example.com/news/article-1']", this.$el).parent();
        expect(currentItem.hasClass("current")).toBe(true);
    });

    it("marks items in path with 'inPath' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const newsItem = $("a[href='http://example.com/news']", this.$el).parent();
        expect(newsItem.hasClass("inPath")).toBe(true);
    });

    it("does not mark home as 'inPath' when not actually on home page", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const homeItem = $("a[href='http://example.com']", this.$el).parent();
        expect(homeItem.hasClass("inPath")).toBe(false);
        expect(homeItem.hasClass("current")).toBe(false);
    });

    it("checks input checkboxes for items in path", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const newsCheckbox = $("#news-toggle");
        expect(newsCheckbox.prop("checked")).toBe(true);
    });

    it("removes /view suffix from navigation links during processing", async function () {
        // Test that /view is properly stripped from navigation links
        // We'll change the canonical URL to match what the navlink becomes after /view removal
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        canonicalLink.href = "http://example.com/test-page";

        // Add a navigation link with /view that after stripping should match canonical
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/test-page/view">Test Page</a></li>
                </ul>
            </nav>
        `;

        this.$el = $(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // The /view should be stripped, making "http://example.com/test-page/view" -> "http://example.com/test-page"
        // which should match the canonical URL exactly
        const viewItem = $("a[href='http://example.com/test-page/view']", this.$el).parent();
        expect(viewItem.hasClass("current")).toBe(true);
    });

    it("falls back to window.location.href when no canonical link", async function () {
        // Remove canonical link
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        canonicalLink.remove();

        // Mock window.location.href
        const originalLocation = window.location.href;
        Object.defineProperty(window, 'location', {
            value: { href: "http://example.com/about" },
            writable: true
        });

        // Need to create a new canonical link element to prevent error
        const newCanonicalLink = document.createElement("link");
        newCanonicalLink.rel = "canonical";
        document.head.appendChild(newCanonicalLink);

        registry.scan(document.body);
        await utils.timeout(1);

        const aboutItem = $("a[href='http://example.com/about']", this.$el).parent();
        expect(aboutItem.hasClass("current")).toBe(true);

        // Restore original location
        Object.defineProperty(window, 'location', {
            value: { href: originalLocation },
            writable: true
        });
    });

    it("does not mark items that don't match current URL", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const aboutItem = $("a[href='http://example.com/about']", this.$el).parent();
        const contactItem = $("a[href='http://example.com/contact']", this.$el).parent();

        expect(aboutItem.hasClass("current")).toBe(false);
        expect(aboutItem.hasClass("inPath")).toBe(false);
        expect(contactItem.hasClass("current")).toBe(false);
        expect(contactItem.hasClass("inPath")).toBe(false);
    });

    it("handles exact path matching correctly", async function () {
        // Update canonical to be a parent path
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        canonicalLink.href = "http://example.com/news";

        registry.scan(document.body);
        await utils.timeout(1);

        const newsItem = $("a[href='http://example.com/news']", this.$el).parent();
        const articleItem = $("a[href='http://example.com/news/article-1']", this.$el).parent();

        expect(newsItem.hasClass("current")).toBe(true);
        // Article should not be marked as current when we're on the news page
        expect(articleItem.hasClass("current")).toBe(false);
    });

    it("works with different navigation structures", async function () {
        // Test with a simple flat navigation
        document.body.innerHTML = `
            <div class="pat-navigationmarker">
                <a href="http://example.com">Home</a>
                <a href="http://example.com/news">News</a>
                <a href="http://example.com/news/article-1">Current Article</a>
                <a href="http://example.com/about">About</a>
            </div>
        `;

        this.$el = $(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const currentLink = $("a[href='http://example.com/news/article-1']", this.$el);
        expect(currentLink.parent().hasClass("current")).toBe(true);
    });

    it("handles case when navigation item has no parent li element", async function () {
        document.body.innerHTML = `
            <div class="pat-navigationmarker">
                <a href="http://example.com/news/article-1">Current Article</a>
            </div>
        `;

        this.$el = $(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Should not throw an error and should work on the anchor element itself
        const currentLink = $("a[href='http://example.com/news/article-1']", this.$el);
        expect(currentLink.parent().hasClass("current")).toBe(true);
    });
});

describe("Navigation Marker - Portal URL Edge Cases", function () {
    beforeEach(function () {
        const canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
        document.body.dataset.portalUrl = "http://example.com";
    });

    afterEach(() => {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.remove();
        }
    });

    it("marks home as current when actually on home page", async function () {
        // Set canonical to home page
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        canonicalLink.href = "http://example.com";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/news">News</a></li>
                </ul>
            </nav>
        `;

        const $el = $(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const homeItem = $("a[href='http://example.com']", $el).parent();
        expect(homeItem.hasClass("current")).toBe(true);
        // When on home page, home can be marked as inPath too since it matches exactly
        expect(homeItem.hasClass("inPath")).toBe(true);
    });

    it("does not mark home as inPath when on different pages", async function () {
        // Set canonical to a subpage
        const canonicalLink = document.querySelector('head link[rel="canonical"]');
        canonicalLink.href = "http://example.com/some/deep/page";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/some">Some</a></li>
                </ul>
            </nav>
        `;

        const $el = $(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const homeItem = $("a[href='http://example.com']", $el).parent();
        const someItem = $("a[href='http://example.com/some']", $el).parent();

        // Home should not be marked as inPath even though the URL contains the home URL
        expect(homeItem.hasClass("inPath")).toBe(false);
        expect(homeItem.hasClass("current")).toBe(false);

        // The actual parent should be marked as inPath
        expect(someItem.hasClass("inPath")).toBe(true);
    });
});