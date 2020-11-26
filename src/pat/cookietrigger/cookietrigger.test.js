import $ from "jquery";
import dom from "patternslib/src/core/dom";
import Pattern from "./cookietrigger";

describe("Cookie Trigger", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("The .pat-cookietrigger DOM element is shown if cookies are disabled", (done) => {
        document.body.innerHTML = `
          <div class="portalMessage error pat-cookietrigger">
          Cookies are not enabled. You must enable cookies before you can log in.
          </div>
        `;

        const el = document.querySelector(".pat-cookietrigger");
        dom.hide(el);

        const pattern = new Pattern(el);
        spyOn(pattern, "isCookiesEnabled").and.callFake(() => 0);
        pattern.init(el); // need to spy on already initialized pattern. re-init

        expect(el.style.display).not.toEqual("none");

        done();
    });

    it("The .pat-cookietrigger DOM element is hidden if cookies are enabled", (done) => {
        document.body.innerHTML = `
          <div class="portalMessage error pat-cookietrigger">
          Cookies are not enabled. You must enable cookies before you can log in.
          </div>
        `;

        const el = document.querySelector(".pat-cookietrigger");
        dom.hide(el);

        const pattern = new Pattern(el);
        spyOn(pattern, "isCookiesEnabled").and.callFake(() => 1);
        pattern.init(el); // need to spy on already initialized pattern. re-init

        expect(el.style.display).toEqual("none");

        done();
    });
});