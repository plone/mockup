import dom from "@patternslib/patternslib/src/core/dom";
import Pattern from "./cookietrigger";
import { jest } from "@jest/globals";

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
        jest.spyOn(pattern, "isCookiesEnabled").mockImplementation(() => 0);
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
        jest.spyOn(pattern, "isCookiesEnabled").mockImplementation(() => 1);
        pattern.init(el); // need to spy on already initialized pattern. re-init

        expect(el.style.display).toEqual("none");

        done();
    });
});
