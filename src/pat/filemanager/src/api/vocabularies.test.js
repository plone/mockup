import { fetchVocabulary } from "./vocabularies.js";
import { request } from "./client.js";

jest.mock("./client.js", () => ({ request: jest.fn() }));

const mockedRequest = request;

beforeEach(() => {
    mockedRequest.mockReset();
});

describe("fetchVocabulary", () => {
    it("GETs the vocabulary unbatched and maps terms to {token,title}", async () => {
        mockedRequest.mockResolvedValue({
            items: [
                { token: "en", title: "English" },
                { token: "de", title: "German" },
            ],
        });
        const terms = await fetchVocabulary(
            "http://nohost/plone/folder",
            "plone.app.vocabularies.AvailableContentLanguages"
        );
        expect(mockedRequest).toHaveBeenCalledWith(
            "http://nohost/plone/folder/@vocabularies/plone.app.vocabularies.AvailableContentLanguages",
            { params: { b_size: "-1" } }
        );
        expect(terms).toEqual([
            { token: "en", title: "English" },
            { token: "de", title: "German" },
        ]);
    });

    it("returns an empty list when the vocabulary has no items", async () => {
        mockedRequest.mockResolvedValue({});
        const terms = await fetchVocabulary("http://nohost/plone/folder", "x");
        expect(terms).toEqual([]);
    });
});
