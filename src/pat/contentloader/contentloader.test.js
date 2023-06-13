import $ from "jquery";
import Pattern from "./contentloader";

describe("Livesearch", function () {
    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("load local content", function () {
        document.body.innerHTML = `
            <a href="#" class="pat-contentloader">Loader</a>
            <div class="content">foobar</div>
        `;
        const el = document.querySelector(".pat-contentloader");
        new Pattern(el, { content: ".content" });
        el.dispatchEvent(new Event("click"));
        expect(document.querySelectorAll(".content").length).toEqual(2);
    });

    it("load local content to target", function () {
        document.body.innerHTML = `
            <a href="#" class="pat-contentloader">Loader</a>
            <div class="content">foobar</div>
            <div class="target">blah</div>
        `;
        const el = document.querySelector(".pat-contentloader");
        new Pattern(el, {
            content: ".content",
            target: ".target",
        });
        el.dispatchEvent(new Event("click"));
        expect(document.querySelectorAll(".content").length).toEqual(2);
        expect(document.querySelectorAll(".target").length).toEqual(0);
    });

    it("load remote content", function () {
        $.ajax = jest.fn().mockImplementation((opts) => {
            const fakeResponse = `
              <html>
                <head></head>
                <body>
                  <div id="content">
                  <h1>content from ajax</h1>
                  <p>ah, it is a rock, though. should beat everything.</p>
                </body>
              </html>
            `;
            return opts.success(fakeResponse);
        });

        document.body.innerHTML = `
            <a href="#" class="pat-contentloader">Loader</a>
        `;
        const el = document.querySelector(".pat-contentloader");
        new Pattern(el, { url: "something.html" });
        el.dispatchEvent(new Event("click"));
        expect(document.querySelectorAll("#content").length).toEqual(1);

        $.ajax.mockClear();
    });
});
