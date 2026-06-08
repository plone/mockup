import { fetchWorkflow, transitionItem, fetchTransitions } from "./workflow.js";
import { request } from "./client.js";

jest.mock("./client.js", () => ({ request: jest.fn() }));

const mockedRequest = request;

beforeEach(() => {
    mockedRequest.mockReset();
    mockedRequest.mockResolvedValue(null);
});

describe("fetchWorkflow", () => {
    it("GETs the @workflow endpoint for an item", async () => {
        await fetchWorkflow("http://nohost/plone/doc");
        expect(mockedRequest).toHaveBeenCalledWith("http://nohost/plone/doc/@workflow");
    });
});

describe("transitionItem", () => {
    it("POSTs the transition with default body", async () => {
        await transitionItem({ itemUrl: "http://nohost/plone/doc", transition: "publish" });
        expect(mockedRequest).toHaveBeenCalledWith(
            "http://nohost/plone/doc/@workflow/publish",
            { method: "POST", body: { comment: "", include_children: false } }
        );
    });

    it("passes comment, include_children and dates when given", async () => {
        await transitionItem({
            itemUrl: "http://nohost/plone/doc",
            transition: "publish",
            comment: "go live",
            includeChildren: true,
            effective: "2026-01-01T00:00",
            expires: "2026-12-31T00:00",
        });
        const body = mockedRequest.mock.calls[0][1].body;
        expect(body).toEqual({
            comment: "go live",
            include_children: true,
            effective: "2026-01-01T00:00",
            expires: "2026-12-31T00:00",
        });
    });
});

describe("fetchTransitions", () => {
    it("unions transitions across items, deduped by id", async () => {
        mockedRequest
            .mockResolvedValueOnce({
                transitions: [
                    { "@id": "http://nohost/plone/a/@workflow/publish", title: "Publish" },
                    { "@id": "http://nohost/plone/a/@workflow/reject", title: "Reject" },
                ],
            })
            .mockResolvedValueOnce({
                transitions: [
                    { "@id": "http://nohost/plone/b/@workflow/publish", title: "Publish" },
                    { "@id": "http://nohost/plone/b/@workflow/retract", title: "Retract" },
                ],
            });
        const transitions = await fetchTransitions([
            "http://nohost/plone/a",
            "http://nohost/plone/b",
        ]);
        expect(transitions).toEqual([
            { id: "publish", title: "Publish" },
            { id: "reject", title: "Reject" },
            { id: "retract", title: "Retract" },
        ]);
    });

    it("tolerates items without transitions", async () => {
        mockedRequest.mockResolvedValue({});
        const transitions = await fetchTransitions(["http://nohost/plone/a"]);
        expect(transitions).toEqual([]);
    });
});
