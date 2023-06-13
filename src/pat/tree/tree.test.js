import $ from "jquery";
import Pattern from "./tree";
import utils from "@patternslib/patternslib/src/core/utils";

$.fx.off = true;

describe("Tree", function () {
    it("loads the tree with data", async function () {
        document.body.innerHTML = `<div class="pat-tree"/>`;
        const el = document.querySelector(".pat-tree");
        new Pattern(el, {
            autoOpen: true,
            data: [
                {
                    label: "node1",
                    children: [
                        {
                            label: "child1",
                        },
                        {
                            label: "child2",
                        },
                    ],
                },
                {
                    label: "node2",
                    children: [{ label: "child3" }],
                },
            ],
        });
        await utils.timeout(1);
        expect(document.querySelectorAll("ul").length).toEqual(3);
    });
    it("load string of json", async function () {
        document.body.innerHTML = `<div class="pat-tree"/>`;
        const el = document.querySelector(".pat-tree");
        new Pattern(el, {
            autoOpen: true,
            data: `[
                {
                    "label": "node1",
                    "children": [
                        {
                            "label": "child1"
                        },{
                            "label": "child2"
                        }
                    ]
                }
            ]`,
        });
        await utils.timeout(1);
        expect(document.querySelectorAll("ul").length).toEqual(2);
    });
});
