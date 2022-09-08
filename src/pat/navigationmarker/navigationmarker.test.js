import Pattern from "./navigationmarker";

describe("pat-navigationmarker", () => {
    let _window_location;

    beforeEach(() => {
        _window_location = global.window.location;
        delete global.window.location;
        document.body.innerHTML = "";
    });

    afterEach(() => {
        global.window.location = _window_location;
    });

    const set_url = (url, portal_url) => {
        global.window.location = {
            href: url,
        };

        portal_url = portal_url || url;

        document.body.dataset.portalUrl = portal_url;
    };

    it("navigationmarker roundtrip", () => {
        document.body.innerHTML = `
          <nav class="pat-navigationmarker">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/path1">p1</a>
              </li>
              <li>
                <a href="/path2">p2</a>
                <ul>
                  <li>
                    <a href="/path2/path2.1">p2.1</a>
                  </li>
                  <li>
                    <a href="/path2/path2.2">p2.2</a>
                    <ul>
                      <li>
                        <a href="/path2/path2.2/path2.2.1">p2.2.1</a>
                      </li>
                      <li>
                        <a href="/path2/path2.2/path2.2.2">p2.2.2</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="../../path3">p1</a>
                  </li>
                  <li>
                    <a href="https://patternslib.com/path4">p1</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        `;

        set_url("https://patternslib.com/");

        const instance = new Pattern(document.querySelector(".pat-navigationmarker"));

        const it0 = document.querySelector("a[href='/']");
        const it1 = document.querySelector("a[href='/path1']");
        const it2 = document.querySelector("a[href='/path2']");
        const it21 = document.querySelector("a[href='/path2/path2.1']");
        const it22 = document.querySelector("a[href='/path2/path2.2']");
        const it221 = document.querySelector("a[href='/path2/path2.2/path2.2.1']");
        const it222 = document.querySelector("a[href='/path2/path2.2/path2.2.2']");
        const it3 = document.querySelector("a[href='../../path3']");
        const it4 = document.querySelector("a[href='https://patternslib.com/path4']");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(0);
        expect(document.querySelector(".current a")).toBe(it0);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path1");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(0);
        expect(document.querySelector(".current a")).toBe(it1);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path2");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(0);
        expect(document.querySelector(".current a")).toBe(it2);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path2/path2.1");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(1);
        expect(document.querySelector(".current a")).toBe(it21);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path2/path2.2");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(1);
        expect(document.querySelector(".current a")).toBe(it22);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path2/path2.2/path2.2.1");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(2);
        expect(document.querySelector(".current a")).toBe(it221);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path2/path2.2/path2.2.2");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(2);
        expect(document.querySelector(".current a")).toBe(it222);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path3");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(0);
        expect(document.querySelector(".current a")).toBe(it3);

        instance.clear_items();
        instance.mark_items("https://patternslib.com/path4");

        expect(document.querySelectorAll(".current").length).toBe(1);
        expect(document.querySelectorAll(".inPath").length).toBe(0);
        expect(document.querySelector(".current a")).toBe(it4);
    });
});
