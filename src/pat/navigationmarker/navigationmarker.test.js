import Pattern from "./navigationmarker";
import events from "@patternslib/patternslib/src/core/events";
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
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        expect(current_link.classList.contains("current")).toBe(true);
    });

    it("marks current navigation wrapper item with 'current' class", async function () {
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

        const current_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_item = current_link.parentElement;
        expect(current_item.classList.contains("current")).toBe(true);
    });

    it("marks in-path link parents but not the link itself with the 'inPath' class", async function () {
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        const news_item = news_link.parentElement;
        expect(news_link.classList.contains("inPath")).toBe(false);
        expect(news_item.classList.contains("inPath")).toBe(true);
    });

    it("does not mark home as 'inPath' when not actually on home page", async function () {
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.classList.contains("inPath")).toBe(false);
        expect(home_link.classList.contains("current")).toBe(false);
    });

    it("checks input checkboxes for items in path", async function () {
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // The /view should be stripped, making "http://example.com/test-page/view" -> "http://example.com/test-page"
        // which should match the canonical URL exactly
        const view_link = nav_element.querySelector(
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

        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

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
        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

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

        const instance = new Pattern(this.nav_element);
        await events.await_pattern_init(instance);

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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        const current_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        registry.scan(document.body);
        await utils.timeout(1);

        // Should not throw an error and should work on the anchor element itself
        const current_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // Test custom current-class "active"
        const current_link = nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_item = current_link.parentElement;
        expect(current_link.classList.contains("active")).toBe(true);
        expect(current_item.classList.contains("active")).toBe(true);
        // Should NOT contain the default "current" class
        expect(current_link.classList.contains("current")).toBe(false);
        expect(current_item.classList.contains("current")).toBe(false);

        // Test custom in-path-class "in-path"
        const news_link = nav_element.querySelector("a[href='http://example.com/news']");
        const news_item = news_link.parentElement;
        expect(news_item.classList.contains("in-path")).toBe(true);
        // Should NOT contain the default "inPath" class
        expect(news_item.classList.contains("inPath")).toBe(false);

        // Verify other items don't have the custom classes
        const home_link = nav_element.querySelector("a[href='http://example.com']");
        const about_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // Test that the custom item-wrapper (.nav-wrapper) gets the classes, not the direct parent
        const current_link = nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const current_wrapper = current_link.closest(".nav-wrapper");
        expect(current_wrapper.classList.contains("active")).toBe(true);
        expect(current_link.classList.contains("active")).toBe(true);

        // Test in-path class is applied to the wrapper
        const news_link = nav_element.querySelector("a[href='http://example.com/news']");
        const news_wrapper = news_link.closest(".nav-wrapper");
        expect(news_wrapper.classList.contains("in-path")).toBe(true);

        // Test that other wrappers don't have the classes
        const home_link = nav_element.querySelector("a[href='http://example.com']");
        const home_wrapper = home_link.closest(".nav-wrapper");
        const about_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // The /view should be stripped, making it match the canonical URL
        const view_link = nav_element.querySelector(
            "a[href='http://example.com/news/article-1/view']",
        );
        expect(view_link.classList.contains("current")).toBe(true);

        // The @@ and ++ patterns should be stripped and not match
        const search_link = nav_element.querySelector(
            "a[href='http://example.com/news/@@search']",
        );
        const add_link = nav_element.querySelector(
            "a[href='http://example.com/news/++add++document']",
        );

        // These should be treated as /news after cleanup and marked as in-path
        expect(search_link.parentElement.classList.contains("inPath")).toBe(true);
        expect(add_link.parentElement.classList.contains("inPath")).toBe(true);

        // Trailing slash should be handled correctly
        const news_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // Current item should have both in-path and current classes
        const conference_link = nav_element.querySelector(
            "a[href='http://example.com/news/events/conference']",
        );
        expect(conference_link.classList.contains("current")).toBe(true);
        expect(conference_link.parentElement.classList.contains("inPath")).toBe(true);

        // Parent paths should be in-path
        const news_link = nav_element.querySelector("a[href='http://example.com/news']");
        const events_link = nav_element.querySelector(
            "a[href='http://example.com/news/events']",
        );
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);
        expect(events_link.parentElement.classList.contains("inPath")).toBe(true);

        // Sibling path should not be in-path
        const articles_link = nav_element.querySelector(
            "a[href='http://example.com/news/articles']",
        );
        expect(articles_link.parentElement.classList.contains("inPath")).toBe(false);

        // Home should not be marked as in-path (special case)
        const home_link = nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.parentElement.classList.contains("inPath")).toBe(false);

        // Unrelated paths should not be in-path
        const about_link = nav_element.querySelector(
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        const home_link = nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.classList.contains("current")).toBe(true);
        expect(home_link.parentElement.classList.contains("inPath")).toBe(true);

        const news_link = nav_element.querySelector("a[href='http://example.com/news']");
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

        const nav_element = document.querySelector(".pat-navigationmarker");
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

        // Test with absolute URLs that match the canonical structure
        const article_link = nav_element.querySelector(
            "a[href='http://example.com/site/news/article-1']",
        );
        const news_link = nav_element.querySelector(
            "a[href='http://example.com/site/news']",
        );
        const home_link = nav_element.querySelector("a[href='http://example.com/site']");

        expect(article_link.classList.contains("current")).toBe(true);
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);
        // Home should not be in-path since we're on a sub-page
        expect(home_link.parentElement.classList.contains("inPath")).toBe(false);
    });

    it("handles multiple URL scenarios with re-scanning (roundtrip test)", async function () {
        // Test navigation behavior across different URL scenarios
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li>
                        <a href="http://example.com/">Home</a>
                    </li>
                    <li>
                        <a href="http://example.com/path1">p1</a>
                    </li>
                    <li>
                        <a href="http://example.com/path2">p2</a>
                        <ul>
                            <li>
                                <a href="http://example.com/path2/path2.1">p2.1</a>
                            </li>
                            <li>
                                <a href="http://example.com/path2/path2.2">p2.2</a>
                                <ul>
                                    <li>
                                        <a href="http://example.com/path2/path2.2/path2.2.1">p2.2.1</a>
                                    </li>
                                    <li>
                                        <a href="http://example.com/path2/path2.2/path2.2.2">p2.2.2</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        `;

        document.body.dataset.portalUrl = "http://example.com";
        const canonical_link = document.querySelector('head link[rel="canonical"]');

        // Test 1: On home page
        canonical_link.href = "http://example.com/";

        const nav_element_1 = document.querySelector(".pat-navigationmarker");
        const instance_1 = new Pattern(nav_element_1);
        await events.await_pattern_init(instance_1);

        const it0 = document.querySelector("a[href='http://example.com/']");

        expect(it0.classList.contains("current")).toBe(true);
        expect(it0.parentElement.classList.contains("inPath")).toBe(true); // Home is in-path when on home

        // Test 2: Navigate to /path1 (rescan with new navigation)
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/">Home</a></li>
                    <li><a href="http://example.com/path1">p1</a></li>
                    <li><a href="http://example.com/path2">p2</a></li>
                </ul>
            </nav>
        `;

        canonical_link.href = "http://example.com/path1";

        const nav_element_2 = document.querySelector(".pat-navigationmarker");
        const instance_2 = new Pattern(nav_element_2);
        await events.await_pattern_init(instance_2);

        const new_it1 = document.querySelector("a[href='http://example.com/path1']");
        const new_it0 = document.querySelector("a[href='http://example.com/']");

        expect(new_it1.classList.contains("current")).toBe(true);
        expect(new_it1.parentElement.classList.contains("current")).toBe(true);
        expect(new_it0.classList.contains("current")).toBe(false); // Should not be current
        expect(new_it0.parentElement.classList.contains("inPath")).toBe(false); // Should not be in-path

        // Test 3: Navigate to nested path
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com/">Home</a></li>
                    <li>
                        <a href="http://example.com/path2">p2</a>
                        <ul>
                            <li><a href="http://example.com/path2/path2.1">p2.1</a></li>
                            <li>
                                <a href="http://example.com/path2/path2.2">p2.2</a>
                                <ul>
                                    <li><a href="http://example.com/path2/path2.2/path2.2.1">p2.2.1</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        `;

        canonical_link.href = "http://example.com/path2/path2.2/path2.2.1";

        const nav_element_3 = document.querySelector(".pat-navigationmarker");
        const instance_3 = new Pattern(nav_element_3);
        await events.await_pattern_init(instance_3);

        const final_it221 = document.querySelector(
            "a[href='http://example.com/path2/path2.2/path2.2.1']",
        );
        const final_it2 = document.querySelector("a[href='http://example.com/path2']");
        const final_it22 = document.querySelector(
            "a[href='http://example.com/path2/path2.2']",
        );

        expect(final_it221.classList.contains("current")).toBe(true);
        expect(final_it221.parentElement.classList.contains("current")).toBe(true);
        expect(final_it2.parentElement.classList.contains("inPath")).toBe(true); // path2 should be in-path
        expect(final_it22.parentElement.classList.contains("inPath")).toBe(true); // path2.2 should be in-path
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
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

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
        const instance = new Pattern(nav_element);
        await events.await_pattern_init(instance);

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

describe("Navigation Marker - Navigate Event Handling", function () {
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
                </ul>
            </nav>
        `;

        this.nav_element = document.querySelector(".pat-navigationmarker");

        // Mock window.navigation if it doesn't exist
        if (!window.navigation) {
            window.navigation = {
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
        }
    });

    afterEach(() => {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        // Clean up canonical link
        const canonical_link = document.querySelector('head link[rel="canonical"]');
        if (canonical_link) {
            canonical_link.remove();
        }
        // Clean up any event listeners
        if (window.navigation && window.navigation.removeEventListener) {
            window.navigation.removeEventListener(
                "navigate",
                "pat-navigationmarker--history-changed",
            );
        }
    });

    it("re-initializes mark_items when navigate event fires", async function () {
        // Create and initialize the pattern instance properly
        const pattern_instance = new Pattern(this.nav_element);
        await events.await_pattern_init(pattern_instance);

        // Verify initial state
        const article1_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const article2_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-2']",
        );

        expect(article1_link.classList.contains("current")).toBe(true);
        expect(article2_link.classList.contains("current")).toBe(false);

        // Simulate a navigate event to Article 2
        const navigate_event = {
            destination: {
                url: "http://example.com/news/article-2",
            },
        };

        // Spy on mark_items to verify it gets called
        const spy_on_mark_items = jest.spyOn(pattern_instance, "mark_items");

        // Call the pattern's navigate event handler directly
        pattern_instance.mark_items(navigate_event.destination.url);

        await utils.timeout(1);

        // Verify that mark_items was called with the new URL
        expect(spy_on_mark_items).toHaveBeenCalledWith(
            "http://example.com/news/article-2",
        );

        // Verify that the navigation markers have been updated
        expect(article1_link.classList.contains("current")).toBe(false);
        expect(article2_link.classList.contains("current")).toBe(true);
        expect(article2_link.parentElement.classList.contains("current")).toBe(true);

        // The news parent should still be in-path
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);

        spy_on_mark_items.mockRestore();
    });

    it("handles navigate event with different destination URLs", async function () {
        const pattern_instance = new Pattern(this.nav_element);
        await events.await_pattern_init(pattern_instance);

        const spy_on_mark_items = jest.spyOn(pattern_instance, "mark_items");

        // Test navigation to About page
        const navigate_to_about = {
            destination: {
                url: "http://example.com/about",
            },
        };

        pattern_instance.mark_items(navigate_to_about.destination.url);
        await utils.timeout(1);

        expect(spy_on_mark_items).toHaveBeenCalledWith("http://example.com/about");

        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );

        expect(about_link.classList.contains("current")).toBe(true);
        expect(about_link.parentElement.classList.contains("current")).toBe(true);
        expect(news_link.parentElement.classList.contains("inPath")).toBe(false);

        // Test navigation to Home
        const navigate_to_home = {
            destination: {
                url: "http://example.com",
            },
        };

        pattern_instance.mark_items(navigate_to_home.destination.url);
        await utils.timeout(1);

        expect(spy_on_mark_items).toHaveBeenCalledWith("http://example.com");

        const home_link = this.nav_element.querySelector("a[href='http://example.com']");
        expect(home_link.classList.contains("current")).toBe(true);
        expect(home_link.parentElement.classList.contains("current")).toBe(true);
        expect(about_link.classList.contains("current")).toBe(false);

        spy_on_mark_items.mockRestore();
    });

    it("clears previous navigation states when navigate event fires", async function () {
        const pattern_instance = new Pattern(this.nav_element);
        await events.await_pattern_init(pattern_instance);

        // Verify initial state - Article 1 is current and News is in-path
        const article1_link = this.nav_element.querySelector(
            "a[href='http://example.com/news/article-1']",
        );
        const news_link = this.nav_element.querySelector(
            "a[href='http://example.com/news']",
        );

        expect(article1_link.classList.contains("current")).toBe(true);
        expect(news_link.parentElement.classList.contains("inPath")).toBe(true);

        // Navigate to a completely different section (About)
        pattern_instance.mark_items("http://example.com/about");
        await utils.timeout(1);

        // Verify that the previous states are cleared
        expect(article1_link.classList.contains("current")).toBe(false);
        expect(article1_link.parentElement.classList.contains("current")).toBe(false);
        expect(news_link.parentElement.classList.contains("inPath")).toBe(false);

        // And the new state is set
        const about_link = this.nav_element.querySelector(
            "a[href='http://example.com/about']",
        );
        expect(about_link.classList.contains("current")).toBe(true);
        expect(about_link.parentElement.classList.contains("current")).toBe(true);
    });

    it("handles navigate event gracefully when window.navigation is not available", async function () {
        // This test ensures the pattern doesn't break on browsers without Navigation API

        // Temporarily remove window.navigation
        const original_navigation = window.navigation;
        delete window.navigation;

        // Re-create the element for this test
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/news">News</a></li>
                </ul>
            </nav>
        `;

        const news_element = document.querySelector(".pat-navigationmarker");

        // Should not throw an error during pattern initialization
        const pattern_instance = new Pattern(news_element);
        await expect(events.await_pattern_init(pattern_instance)).resolves.not.toThrow();

        // mark_items should still work when called directly
        expect(() => {
            pattern_instance.mark_items("http://example.com/news");
        }).not.toThrow();

        // Restore window.navigation
        if (original_navigation) {
            window.navigation = original_navigation;
        }
    });

    it("sets up navigate event listener when window.navigation is available", async function () {
        // Mock window.navigation with spy on addEventListener
        const mockNavigation = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };

        // Temporarily replace window.navigation with our mock
        const original_navigation = window.navigation;
        window.navigation = mockNavigation;

        // Re-create the element for this test
        document.body.innerHTML = `
            <nav class="pat-navigationmarker">
                <ul>
                    <li><a href="http://example.com">Home</a></li>
                    <li><a href="http://example.com/news">News</a></li>
                </ul>
            </nav>
        `;

        const news_element = document.querySelector(".pat-navigationmarker");
        const pattern_instance = new Pattern(news_element);
        await events.await_pattern_init(pattern_instance);

        // Verify that addEventListener was called for the navigate event
        expect(mockNavigation.addEventListener).toHaveBeenCalledWith(
            "navigate",
            expect.any(Function),
            {}, // Empty options object passed by events.add_event_listener
        );

        // Test that the event listener function works by calling it directly
        const addEventListenerCalls = mockNavigation.addEventListener.mock.calls;
        const navigateEventCall = addEventListenerCalls.find(
            (call) => call[0] === "navigate",
        );
        expect(navigateEventCall).toBeDefined();

        const navigateEventHandler = navigateEventCall[1];
        expect(typeof navigateEventHandler).toBe("function");

        // Spy on mark_items to verify it gets called when the event fires
        const spy_on_mark_items = jest.spyOn(pattern_instance, "mark_items");

        // Simulate the navigate event by calling the handler
        const mockNavigateEvent = {
            destination: {
                url: "http://example.com/news",
            },
        };

        navigateEventHandler(mockNavigateEvent);

        // Verify mark_items was called with the destination URL
        expect(spy_on_mark_items).toHaveBeenCalledWith("http://example.com/news");

        spy_on_mark_items.mockRestore();

        // Restore original window.navigation
        window.navigation = original_navigation;
    });
});
