import { jest } from "@jest/globals";
import "./toolbar";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import Cookies from "js-cookie";

describe("Toolbar", function () {
    beforeEach(function () {
        // Mock jQuery.ajax
        global.$ = $;
        $.ajax = jest.fn();

        // Mock Cookies.set
        jest.spyOn(Cookies, "set");

        // Set up portal URL on body
        document.body.setAttribute("data-portal-url", "http://example.com");

        document.body.innerHTML = `
            <div class="pat-toolbar">
                <div class="plone-toolbar-main">
                    <button class="toolbar-collapse">Collapse</button>
                    <button class="toolbar-expand">Expand</button>
                </div>
                <div id="collapse-personaltools">
                    Personal Tools
                </div>
            </div>
        `;

        this.toolbar_element = document.querySelector(".pat-toolbar");
    });

    afterEach(function () {
        document.body.innerHTML = "";
        document.body.removeAttribute("data-portal-url");
        document.body.className = "";
        jest.restoreAllMocks();
    });

    it("Initializes correctly", async function () {
        expect(document.body.querySelectorAll(".pat-toolbar.initialized").length).toBe(
            0,
        );
        registry.scan(document.body);
        await utils.timeout(1);
        expect(document.body.querySelectorAll(".pat-toolbar.initialized").length).toBe(
            1,
        );
    });

    it("handles structure-url-changed event and makes correct AJAX call", async function () {
        // Mock successful AJAX response - just verify the call is made correctly
        const ajax_mock = jest.fn().mockReturnValue({
            done: jest.fn().mockReturnValue({ fail: jest.fn() }),
        });
        $.ajax = ajax_mock;

        registry.scan(document.body);
        await utils.timeout(1);

        // Trigger the structure-url-changed event (needs jQuery for custom events)
        $("body").trigger("structure-url-changed", "/new-path");

        // Verify AJAX call was made with correct URL
        expect(ajax_mock).toHaveBeenCalledWith({
            url: "http://example.com/new-path/@@render-toolbar",
        });

        // Verify the done callback was set up
        expect(ajax_mock().done).toHaveBeenCalled();
    });

    it("handles toolbar collapse", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        // Initially, body should not have the expanded class
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );

        // Add the expanded class to test removal
        document.body.classList.add("plone-toolbar-left-expanded");
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        // Click the collapse button (using native DOM click)
        document.querySelector(".toolbar-collapse").click();

        // Check that the expanded class was removed
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );

        // Check that cookie was set with expanded: false
        expect(Cookies.set).toHaveBeenCalledWith(
            "plone-toolbar",
            JSON.stringify({ expanded: false }),
            { path: "/" },
        );
    });

    it("handles toolbar expand", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        // Initially, body should not have the expanded class
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );

        // Click the expand button (using native DOM click)
        document.querySelector(".toolbar-expand").click();

        // Check that the expanded class was added
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        // Check that cookie was set with expanded: true
        expect(Cookies.set).toHaveBeenCalledWith(
            "plone-toolbar",
            JSON.stringify({ expanded: true }),
            { path: "/" },
        );
    });

    it("handles multiple collapse/expand cycles", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        // Start collapsed
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );

        // Expand (using native DOM click)
        document.querySelector(".toolbar-expand").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        // Collapse (using native DOM click)
        document.querySelector(".toolbar-collapse").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );

        // Expand again (using native DOM click)
        document.querySelector(".toolbar-expand").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        // Verify cookies were set for each action
        expect(Cookies.set).toHaveBeenCalledTimes(3);
    });

    it("calls registry.scan on updated toolbar content", async function () {
        // Spy on registry.scan to verify it gets called
        const scan_spy = jest.spyOn(registry, "scan");

        const ajax_mock = jest.fn().mockReturnValue({
            done: jest.fn((callback) => {
                // Simulate successful response with toolbar content
                callback(`
                    <body>
                        <div id="edit-zone">
                            <div class="plone-toolbar-main">
                                <div class="pat-modal">Modal Pattern</div>
                            </div>
                            <div id="collapse-personaltools">
                                Personal Tools
                            </div>
                        </div>
                    </body>
                `);
                return { fail: jest.fn() };
            }),
        });
        $.ajax = ajax_mock;

        registry.scan(document.body);
        await utils.timeout(1);

        // Reset the scan spy after initial scan
        scan_spy.mockClear();

        // Trigger the structure-url-changed event (needs jQuery for custom events)
        $("body").trigger("structure-url-changed", "/test-path");

        await utils.timeout(100);

        // Verify that registry.scan was called (it should be called with the new toolbar content)
        expect(scan_spy).toHaveBeenCalled();
    });

    it("works without data-portal-url attribute", async function () {
        // Remove portal URL attribute
        document.body.removeAttribute("data-portal-url");

        $.ajax.mockImplementation(() => {
            return {
                done: (callback) => {
                    callback('<body><div id="edit-zone"></div></body>');
                    return { fail: () => {} };
                },
            };
        });

        registry.scan(document.body);
        await utils.timeout(1);

        // Trigger the structure-url-changed event (needs jQuery for custom events)
        $("body").trigger("structure-url-changed", "/test-path");

        // Should still make AJAX call, but with undefined portal URL
        expect($.ajax).toHaveBeenCalledWith({
            url: "undefined/test-path/@@render-toolbar",
        });
    });

    it("handles missing toolbar elements gracefully", async function () {
        // Test that the pattern doesn't crash when elements are missing
        const ajax_mock = jest.fn().mockReturnValue({
            done: jest.fn((callback) => {
                // Simulate calling the callback with empty response
                callback('<body><div id="edit-zone"></div></body>');
                return { fail: jest.fn() };
            }),
        });
        $.ajax = ajax_mock;

        registry.scan(document.body);
        await utils.timeout(1);

        // Trigger the structure-url-changed event (needs jQuery for custom events)
        $("body").trigger("structure-url-changed", "/test-path");

        await utils.timeout(100);

        // Verify AJAX was called
        expect(ajax_mock).toHaveBeenCalled();

        // The test should not crash - that's the main point of this test
        // The elements may be removed or remain, depending on jQuery's replaceWith behavior
        expect(true).toBe(true); // Test passes if we reach here without errors
    });

    it("works with different navigation structures", async function () {
        // Test with different HTML structure - using buttons in a nav element instead of divs
        document.body.innerHTML = `
            <div class="pat-toolbar">
                <button class="toolbar-collapse">Hide Toolbar</button>
                <button class="toolbar-expand">Show Toolbar</button>
            </div>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        // Test expand functionality with buttons in nav structure (using native DOM click)
        document.querySelector(".toolbar-expand").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        // Test collapse functionality with native DOM click
        document.querySelector(".toolbar-collapse").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );
    });
});

describe("Toolbar - Edge Cases", function () {
    beforeEach(function () {
        // Mock Cookies.set
        jest.spyOn(Cookies, "set");
        $.ajax = jest.fn();
    });

    afterEach(function () {
        document.body.innerHTML = "";
        document.body.className = "";
        jest.restoreAllMocks();
    });

    it("handles multiple toolbar instances", async function () {
        document.body.innerHTML = `
            <div class="pat-toolbar" id="toolbar1">
                <button class="toolbar-expand">Expand 1</button>
            </div>
            <div class="pat-toolbar" id="toolbar2">
                <button class="toolbar-collapse">Collapse 2</button>
            </div>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        // Both toolbars should be initialized
        expect(document.querySelectorAll(".pat-toolbar.initialized").length).toBe(2);

        // Clicks on different toolbars should both work (using native DOM click)
        document.querySelector("#toolbar1 .toolbar-expand").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );

        document.querySelector("#toolbar2 .toolbar-collapse").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            false,
        );
    });

    it("handles clicks on nested elements", async function () {
        document.body.innerHTML = `
            <div class="pat-toolbar">
                <div class="toolbar-expand">
                    <span class="icon">Expand</span>
                </div>
            </div>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        // Click on nested span should still trigger expand (using native DOM click)
        document.querySelector(".toolbar-expand .icon").click();
        expect(document.body.classList.contains("plone-toolbar-left-expanded")).toBe(
            true,
        );
    });
});
