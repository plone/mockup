import pattern from "./preventdoublesubmit";
import { jest } from "@jest/globals";

describe("PreventDoubleSubmit", function () {
    it("prevent form to be submitted twice", function () {
        document.body.innerHTML = `
            <form id="helped" class="pat-preventdoublesubmit">
                <input type="text" value="Yellow" />
                <select name="aselect">
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <input id="b1" type="submit" value="Submit 1" />
                <input id="b2" type="submit" class="allowMultiSubmit" value="Submit 2" />
            </form>
        `;
        const el = document.querySelector(".pat-preventdoublesubmit");
        el.addEventListener("submit", (e) => e.preventDefault());

        const pat = new pattern(el);

        let confirmed = false;
        jest.spyOn(pat, "_confirm").mockImplementation(() => {
            confirmed = true;
        });

        const b1 = document.querySelector("#b1");
        const b2 = document.querySelector("#b2");

        expect(confirmed).toBe(false);
        b1.click();

        expect(confirmed).toBe(false);

        const guard_class = "submitting";

        expect(b1.classList.contains(guard_class)).toBe(true);

        b1.click();
        expect(confirmed).toBe(true);

        // reset
        confirmed = false;

        b2.click();
        expect(b2.classList.contains(guard_class)).toBe(true);
        expect(confirmed).toBe(false);
    });
});
