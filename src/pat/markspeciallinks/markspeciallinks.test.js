import "./markspeciallinks";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("MarkSpecialLinks", function () {
    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("external links have target=_blank", async function () {
        document.body.innerHTML = `
            <p id="id1" class="pat-markspeciallinks">
              <a id="id11" href="./internal-link">internal link</a>
              <a id="id12" href="#anchor">anchor</a>
              <a id="id13" href="ftp://ftp.url">ftp url</a>
              <a id="id14" class="link-plain" href="http://external.url">external url</a>
              <a id="id15" class="link-plain" href="https://secure.url">secure url</a>
              <a id="id16" href="http://external.url">external url</a>
              <a id="id17" href="https://secure.url">secure url</a>
            </p>
            <p id="id2" class="pat-markspeciallinks" data-pat-markspeciallinks="external_links_open_new_window: true">
              <a id="id21" href="./internal-link">internal link</a>
              <a id="id22" href="#anchor">anchor</a>
              <a id="id23" href="ftp://ftp.url">ftp url</a>
              <a id="id24" class="link-plain" href="http://external.url">external url</a>
              <a id="id25" class="link-plain" href="https://secure.url">secure url</a>
              <a id="id26" href="http://external.url">external url</a>
              <a id="id27" href="https://secure.url">secure url</a>
            </p>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelector("#id11").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id12").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id13").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id14").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id15").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id16").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id17").getAttribute("target")).toBe(null);

        expect(document.querySelector("#id21").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id22").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id23").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id24").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id25").getAttribute("target")).toBe(null);
        expect(document.querySelector("#id26").getAttribute("target")).toBe("_blank");
        expect(document.querySelector("#id26").getAttribute("rel")).toBe("noopener");
        expect(document.querySelector("#id27").getAttribute("target")).toBe("_blank");
        expect(document.querySelector("#id27").getAttribute("rel")).toBe("noopener");
    });

    it("check for correct icon classes per protocol", async function () {
        document.body.innerHTML = `
            <ul class="pat-markspeciallinks">
              <li id="id1" ><a href="http://www.plone.org">http</a></li>
              <li id="id2" ><a href="https://www.plone.org">https</a></li>
              <li id="id3" ><a href="mailto:info@plone.org">mailto</a></li>
              <li id="id4" ><a href="ftp://www.plone.org">ftp</a></li>
              <li id="id5" ><a href="news://www.plone.org">news</a></li>
              <li id="id6" ><a href="irc://www.plone.org">irc</a></li>
              <li id="id7" ><a href="sip://www.plone.org">sip</a></li>
              <li id="id8" ><a href="callto://www.plone.org">callto</a></li>
              <li id="id9"><a href="webcal://www.plone.org">webcal</a></li>
            </ul>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelector("#id1 svg").classList.contains("bi-link-45deg")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id2 svg").classList.contains("bi-link-45deg")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id3 svg").classList.contains("bi-envelope")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id4 svg").classList.contains("bi-cloud-download")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id5 svg").classList.contains("bi-newspaper")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id6 svg").classList.contains("bi-chat")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id7 svg").classList.contains("bi-telephone")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id8 svg").classList.contains("bi-telephone")).toBe(true); // prettier-ignore
        expect(document.querySelector("#id9 svg").classList.contains("bi-calendar")).toBe(true); // prettier-ignore
    });
});
