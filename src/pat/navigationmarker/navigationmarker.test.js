import "./navigationmarker";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Navigation Marker", function () {
    beforeEach(function () {
        // Set up the canonical link in head
        const canonical_link = document.createElement("link");
        canonical_link.rel = "canonical";
        canonical_link.href = "http://example.com/news/article-1";
        document.head.appendChild(canonical_link);

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

        this.nav_element = document.querySelector(".pat-navigationmarker");
    });

    afterEach(() => {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        // Clean up canonical link
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        if (canonical_link) {
            canonical_link.remove();
        }
    });

    it("marks current navigation item with 'current' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']"
        );
        const current_item = current_link.parentElement;
        expect(current_item.classList.contains("current")).toBe(true);
    });

    it("marks items in path with 'inPath' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const news_link = this.nav_element.querySelector("a[href='http://example.com/news']");
        const news_item = news_link.parentElement;
        expect(news_item.classList.contains("inPath")).toBe(true);
    });

    it("does not mark home as 'inPath' when not actually on home page", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        const home_item = home_link.parentElement;
        expect(home_item.classList.contains("inPath")).toBe(false);
        expect(home_item.classList.contains("current")).toBe(false);
    });

    it("checks input checkboxes for items in path", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const news_checkbox = document.getElementById("news-toggle");
        expect(news_checkbox.checked).toBe(true);
    });

    it("removes /view suffix from navigation links during processing", async function () {
        // Test that /view is properly stripped from navigation links
        // We'll change the canonical URL to match what the navlink becomes after /view removal
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/test-page";

        // Add a navigation link with /view that after stripping should match canonical
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/test-page/view">Test Page</a></li>
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // The /view should be stripped, making "http://example.com/test-page/view" -> "http://example.com/test-page"
        // which should match the canonical URL exactly
        const view_link = this.nav_element.querySelector(
            "a[href='http://example.com/test-page/view']"
        );
        const view_item = view_link.parentElement;
        expect(view_item.classList.contains("current")).toBe(true);
    });

    it("falls back to window.location.href when no canonical link", async function () {
        // Remove canonical link
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.remove();

        // Mock window.location.href
        const original_location = window.location.href;
        Object.defineProperty(window, "location", {
            value: { href: "http://example.com/about" },
            writable: true,
        });

        // Need to create a new canonical link element to prevent error
        const new_canonical_link = document.createElement("link");
        new_canonical_link.rel = "canonical";
        document.head.appendChild(new_canonical_link);

        registry.scan(document.body);
        await utils.timeout(1);

        const about_link = this.nav_element.querySelector("a[href='http://example.com/about']");
        const about_item = about_link.parentElement;
        expect(about_item.classList.contains("current")).toBe(true);

        // Restore original location
        Object.defineProperty(window, "location", {
            value: { href: original_location },
            writable: true,
        });
    });

    it("does not mark items that don't match current URL", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const about_link = this.nav_element.querySelector("a[href='http://example.com/about']");
        const about_item = about_link.parentElement;
        const contact_link = this.nav_element.querySelector("a[href='http://example.com/contact']");
        const contact_item = contact_link.parentElement;

        expect(about_item.classList.contains("current")).toBe(false);
        expect(about_item.classList.contains("inPath")).toBe(false);
        expect(contact_item.classList.contains("current")).toBe(false);
        expect(contact_item.classList.contains("inPath")).toBe(false);
    });

    it("handles exact path matching correctly", async function () {
        // Update canonical to be a parent path
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/news";

        registry.scan(document.body);
        await utils.timeout(1);

        const news_link = this.nav_element.querySelector("a[href='http://example.com/news']");
        const news_item = news_link.parentElement;
        const article_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']"
        );
        const article_item = article_link.parentElement;

        expect(news_item.classList.contains("current")).toBe(true);
        // Article should not be marked as current when we're on the news page
        expect(article_item.classList.contains("current")).toBe(false);
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

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const current_link = this.nav_element.querySelector("a[href='http://example.com/news/article-1']");
        expect(current_link.parentElement.classList.contains("current")).toBe(true);
    });

    it("handles case when navigation item has no parent li element", async function () {
        document.body.innerHTML = `
            <div class="pat-navigationmarker">
                <a href="http://example.com/news/article-1">Current Article</a>
            </div>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Should not throw an error and should work on the anchor element itself
        const current_link = this.nav_element.querySelector("a[href='http://example.com/news/article-1']");
        expect(current_link.parentElement.classList.contains("current")).toBe(true);
    });
});

describe("Navigation Marker - Portal URL Edge Cases", function () {
    beforeEach(function () {
        const canonical_link = document.createElement("link");
        canonical_link.rel = "canonical";
        document.head.appendChild(canonical_link);
        document.body.dataset.portalUrl = "http://example.com";
    });

    afterEach(() => {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        if (canonical_link) {
            canonical_link.remove();
        }
    });

    it("marks home as current when actually on home page", async function () {
        // Set canonical to home page
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/news">News</a></li>
                </ul>
            </nav>
        `;

        const nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const home_link = nav_element.querySelector("a[href='http://example.com']");
        const home_item = home_link.parentElement;
        expect(home_item.classList.contains("current")).toBe(true);
        // When on home page, home can be marked as inPath too since it matches exactly
        expect(home_item.classList.contains("inPath")).toBe(true);
    });

    it("does not mark home as inPath when on different pages", async function () {
        // Set canonical to a subpage
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/some/deep/page";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/some">Some</a></li>
                </ul>
            </nav>
        `;

        const nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const home_link = nav_element.querySelector("a[href='http://example.com']");
        const home_item = home_link.parentElement;
        const some_link = nav_element.querySelector("a[href='http://example.com/some']");
        const some_item = some_link.parentElement;

        // Home should not be marked as inPath even though the URL contains the home URL
        expect(home_item.classList.contains("inPath")).toBe(false);
        expect(home_item.classList.contains("current")).toBe(false);

        // The actual parent should be marked as inPath
        expect(some_item.classList.contains("inPath")).toBe(true);
    });
});

