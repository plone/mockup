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
            "a[href='http://example.com/news/article-1']",
        );
        expect(current_link.classList.contains("current")).toBe(true);
    });

    it("marks current navigation wrapper item with 'current' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_item = current_link.parentElement;
        expect(current_item.classList.contains("current")).toBe(true);
    });

    it("marks in-path link parents but not the link itself with the 'inPath' class", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const news_item = news_link.parentElement;
        expect(news_link.classList.contains("inPath")).toBe(false);
        expect(news_item.classList.contains("inPath")).toBe(true);
    });

    it("does not mark home as 'inPath' when not actually on home page", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.classList.contains("inPath")).toBe(false);
        expect(home_link.classList.contains("current")).toBe(false);
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
            "a[href='http://example.com/test-page/view']",
        );
        expect(view_link.classList.contains("current")).toBe(true);
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

        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        expect(about_link.classList.contains("current")).toBe(true);

        // Restore original location
        Object.defineProperty(window, "location", {
            value: { href: original_location },
            writable: true,
        });
    });

    it("does not mark items that don't match current URL", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        const about_item = about_link.parentElement;
        const contact_link = this.nav_element.querySelector(
            "a[href='http://example.com/contact']",
        );
        const contact_item = contact_link.parentElement;

        expect(about_item.classList.contains("current")).toBe(false);
        expect(about_link.classList.contains("inPath")).toBe(false);
        expect(contact_item.classList.contains("current")).toBe(false);
        expect(contact_link.classList.contains("inPath")).toBe(false);
    });

    it("handles exact path matching correctly", async function () {
        // Update canonical to be a parent path
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/news";

        registry.scan(document.body);
        await utils.timeout(1);

        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const article_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );

        expect(news_link.classList.contains("current")).toBe(true);
        // Article should not be marked as current when we're on the news page
        expect(article_link.classList.contains("current")).toBe(false);
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

        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        expect(current_link.classList.contains("current")).toBe(true);
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
        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        expect(current_link.classList.contains("current")).toBe(true);
    });

    it("uses custom in-path-class and current-class when specified via pattern arguments", async function () {
        // Set up custom class names via data attributes
        document.body.innerHTML = `
            <nav class="pat-navigationmarker" data-pat-navigationmarker="in-path-class: in-path; current-class: active">
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
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Test custom current-class "active"
        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_item = current_link.parentElement;
        expect(current_link.classList.contains("active")).toBe(true);
        expect(current_item.classList.contains("active")).toBe(true);
        // Should NOT contain the default "current" class
        expect(current_link.classList.contains("current")).toBe(false);
        expect(current_item.classList.contains("current")).toBe(false);

        // Test custom in-path-class "in-path"
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const news_item = news_link.parentElement;
        expect(news_item.classList.contains("in-path")).toBe(true);
        // Should NOT contain the default "inPath" class
        expect(news_item.classList.contains("inPath")).toBe(false);

        // Verify other items don't have the custom classes
        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        expect(home_link.classList.contains("in-path")).toBe(false);
        expect(home_link.classList.contains("active")).toBe(false);
        expect(about_link.classList.contains("in-path")).toBe(false);
        expect(about_link.classList.contains("active")).toBe(false);
    });

    it("uses custom item-wrapper to determine which element gets navigation classes", async function () {
        // Set up navigation with custom item-wrapper selector
        document.body.innerHTML = `
            <nav class="pat-navigationmarker" data-pat-navigationmarker="item-wrapper: .nav-wrapper; in-path-class: in-path; current-class: active">
                <div class="nav-wrapper">
                    <span class="nav-icon"></span>
                    <a href="http://example.com">Home</a>
                </div>
                <div class="nav-wrapper">
                    <span class="nav-icon"></span>
                    <a href="http://example.com/news">News</a>
                    <div class="nav-wrapper">
                        <span class="nav-icon"></span>
                        <a href="http://example.com/news/article-1">Article 1</a>
                    </div>
                </div>
                <div class="nav-wrapper">
                    <span class="nav-icon"></span>
                    <a href="http://example.com/about">About</a>
                </div>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Test that the custom item-wrapper (.nav-wrapper) gets the classes, not the direct parent
        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_wrapper = current_link.closest(".nav-wrapper");
        expect(current_wrapper.classList.contains("active")).toBe(true);
        expect(current_link.classList.contains("active")).toBe(true);

        // Test in-path class is applied to the wrapper
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const news_wrapper = news_link.closest(".nav-wrapper");
        expect(news_wrapper.classList.contains("in-path")).toBe(true);

        // Test that other wrappers don't have the classes
        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        const home_wrapper = home_link.closest(".nav-wrapper");
        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        const about_wrapper = about_link.closest(".nav-wrapper");

        expect(home_wrapper.classList.contains("in-path")).toBe(false);
        expect(home_wrapper.classList.contains("active")).toBe(false);
        expect(about_wrapper.classList.contains("in-path")).toBe(false);
        expect(about_wrapper.classList.contains("active")).toBe(false);
    });

    it("handles URL cleanup for Plone view patterns", async function () {
        // Test cleanup of /view, @@, and ++ patterns
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/news/article-1";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/news/article-1/view">Article 1 (with /view)</a></li>
                    <li><a href="http://example.com/news/@@search">Search (with @@)</a></li>
                    <li><a href="http://example.com/news/++add++document">Add Document (with ++)</a></li>
                    <li><a href="http://example.com/news/">News (with trailing slash)</a></li>
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // The /view should be stripped, making it match the canonical URL
        const view_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1/view']",
        );
        expect(view_link.classList.contains("current")).toBe(true);

        // The @@ and ++ patterns should be stripped and not match
        const search_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/@@search']",
        );
        const add_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/++add++document']",
        );

        // These should be treated as /news after cleanup and marked as in-path
        expect(search_link.parentElement.classList.contains("inPath")).toBe(true);
        expect(add_link.parentElement.classList.contains("inPath")).toBe(true);

        // Trailing slash should be handled correctly
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/']",
        );
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);
    });

    it("uses improved in-path detection with slash-based logic", async function () {
        // Test the new slash-based in-path detection
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/news/events/conference";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/news">News</a></li>
                    <li><a href="http://example.com/news/events">Events</a></li>
                    <li><a href="http://example.com/news/events/conference">Conference</a></li>
                    <li><a href="http://example.com/news/articles">Articles</a></li>
                    <li><a href="http://example.com/about">About</a></li>
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Current item should have both in-path and current classes
        const conference_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/events/conference']",
        );
        expect(conference_link.classList.contains("current")).toBe(true);
        expect(conference_link.parentElement.classList.contains("inPath")).toBe(true);

        // Parent paths should be in-path
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const events_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/events']",
        );
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);
        expect(events_link.parentElement.classList.contains("inPath")).toBe(true);

        // Sibling path should not be in-path
        const articles_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/articles']",
        );
        expect(articles_link.parentElement.classList.contains("inPath")).toBe(false);

        // Home should not be marked as in-path (special case)
        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.parentElement.classList.contains("inPath")).toBe(false);

        // Unrelated paths should not be in-path
        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        expect(about_link.parentElement.classList.contains("inPath")).toBe(false);
    });

    it("marks home as in-path when directly on home page", async function () {
        // Test special case where home is marked as in-path when actually on home
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

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.classList.contains("current")).toBe(true);
        expect(home_link.parentElement.classList.contains("inPath")).toBe(true);

        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        expect(news_link.parentElement.classList.contains("inPath")).toBe(false);
    });

    it("handles URL rebasing correctly", async function () {
        // Test absolute URLs that should work directly
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        canonical_link.href = "http://example.com/site/news/article-1";

        // Set a portal URL
        document.body.dataset.portalUrl = "http://example.com/site";

        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/site">Home</a></li>
                    <li><a href="http://example.com/site/news">News</a></li>
                    <li><a href="http://example.com/site/news/article-1">Article 1</a></li>
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");
        registry.scan(document.body);
        await utils.timeout(1);

        // Test with absolute URLs that match the canonical structure
        const article_link = this.nav_element.querySelector(
            "a[href='http://example.com/site/news/article-1']",
        );
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/site/news']",
        );
        const home_link = this.nav_element.querySelector(
            "a[href='http://example.com/site']",
        );

        expect(article_link.classList.contains("current")).toBe(true);
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);
        // Home should not be in-path since we're on a sub-page
        expect(home_link.parentElement.classList.contains("inPath")).toBe(false);
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
        expect(home_link.classList.contains("current")).toBe(true);
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
        expect(home_link.classList.contains("current")).toBe(false);

        // The actual parent should be marked as inPath
        expect(some_item.classList.contains("inPath")).toBe(true);
    });
});
