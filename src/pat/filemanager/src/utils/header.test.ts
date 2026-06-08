import { swapContextHeader } from "./header";

// A page header shaped like CMFPlone's #content > header (title, below-title
// byline, description).
function headerHtml({
    title,
    author,
    modified,
    description,
}: {
    title: string;
    author: string;
    modified: string;
    description: string;
}): string {
    return `<!DOCTYPE html><html><head><title>${title} — Plone</title></head>
    <body><article id="content"><header>
        <h1 class="documentFirstHeading">${title}</h1>
        <section id="section-byline">
            <span class="label-by-author">by <a href="/author">${author}</a> —</span>
            <span class="documentModified">
                <span>last modified</span> <span>${modified}</span>
            </span>
        </section>
        <p class="documentDescription">${description}</p>
    </header><div id="content-core">…</div></article></body></html>`;
}

function seedLiveHeader(doc: Document): void {
    doc.body.innerHTML = `<article id="content"><header>
        <h1 class="documentFirstHeading">Old title</h1>
        <section id="section-byline">
            <span class="label-by-author">by <a href="/old">Old Author</a> —</span>
            <span class="documentModified"><span>last modified</span> <span>2020-01-01</span></span>
        </section>
        <p class="documentDescription">Old description</p>
    </header><div id="content-core">app</div></article>`;
    doc.title = "Old title — Plone";
}

describe("swapContextHeader", () => {
    beforeEach(() => seedLiveHeader(document));

    it("transplants the fetched header and updates document.title", () => {
        const html = headerHtml({
            title: "Reports",
            author: "Jane Doe",
            modified: "2026-06-08",
            description: "Quarterly reports",
        });
        const swapped = swapContextHeader(html, "#content > header");

        expect(swapped).toBe(true);
        expect(document.querySelector(".documentFirstHeading")?.textContent).toBe("Reports");
        expect(document.querySelector(".documentDescription")?.textContent).toBe(
            "Quarterly reports"
        );
        expect(document.title).toBe("Reports — Plone");
    });

    it("carries the byline subtree (author + modified date) across intact", () => {
        const html = headerHtml({
            title: "Reports",
            author: "Jane Doe",
            modified: "2026-06-08",
            description: "x",
        });
        swapContextHeader(html, "#content > header");

        const byline = document.querySelector("#section-byline");
        expect(byline?.querySelector(".label-by-author")?.textContent).toContain("Jane Doe");
        expect(byline?.querySelector(".documentModified")?.textContent).toContain("2026-06-08");
    });

    it("leaves the content-core (app) untouched", () => {
        const html = headerHtml({ title: "R", author: "a", modified: "m", description: "d" });
        swapContextHeader(html, "#content > header");
        expect(document.querySelector("#content-core")?.textContent).toBe("app");
    });

    it("is a no-op when the fetched HTML lacks the header", () => {
        const swapped = swapContextHeader("<html><body>nothing</body></html>", "#content > header");
        expect(swapped).toBe(false);
        expect(document.querySelector(".documentFirstHeading")?.textContent).toBe("Old title");
        expect(document.title).toBe("Old title — Plone");
    });

    it("is a no-op (false) when the live header is absent", () => {
        document.body.innerHTML = "<div>no header here</div>";
        const html = headerHtml({ title: "R", author: "a", modified: "m", description: "d" });
        expect(swapContextHeader(html, "#content > header")).toBe(false);
    });
});
