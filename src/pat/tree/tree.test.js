import $ from "jquery";
import Pattern from "./tree";
import utils from "../../core/utils";

$.fx.off = true;

describe("Tree", function () {

    it("loads the tree with data", function () {
        document.body.innerHTML = `
            <div class="pat-tree"></div>
        `;
        //await utils.timeout(1);
        const el = document.querySelector(".pat-tree");
        var tree = new Pattern(el, {
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
        expect(document.querySelectorAll("ul").length).toEqual(3);
    });
    it("load string of json", function () {
        document.body.innerHTML = `
            <div class="pat-tree"/>
        `;
        const el = document.querySelector(".pat-tree");
        var tree = new Pattern(el, {
            autoOpen: true,
            data:
                "[" +
                '{"label": "node1",' +
                '"children": [{' +
                '"label": "child1"' +
                "},{" +
                '"label": "child2"' +
                "}]" +
                "}]",
        });
        expect(document.querySelectorAll("ul").length).toEqual(2);
    });
});
