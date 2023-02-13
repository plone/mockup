import PatternSelect2 from "./select2";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import "select2";

const SELECT2_TIMEOUT = 1;

describe("Select2", function () {
    let ajax_defaults_transport = null;

    beforeEach(function () {
        ajax_defaults_transport = $.fn.select2.ajaxDefaults.transport;
        $.fn.select2.ajaxDefaults.transport = jest.fn().mockImplementation((opts) => {
            const items = [
                { id: "red", text: "Red" },
                { id: "blue", text: "Blue" },
                { id: "yellow", text: "Yellow" },
            ];
            return opts.success({ total: items.length, results: items });
        });
    });

    afterEach(function () {
        document.body.innerHTML = "";
        $.fn.select2.ajaxDefaults.transport = ajax_defaults_transport;
    });

    it("tagging", async function () {
        var $el = $(`
          <div>
            <input class="pat-select2"
                   data-pat-select2="tags: Red,Yellow,Blue"
                   value="Yellow" />
          </div>
        `);
        expect($(".select2-choices", $el).length).toEqual(0);
        registry.scan($el);
        await utils.timeout(1);
        expect($(".select2-choices", $el).length).toEqual(1);
        expect($(".select2-choices li", $el).length).toEqual(2);
    });

    it("init value map/tags from JSON string", async function () {
        var $el = $('<input class="pat-select2" value="Red" />').appendTo("body");
        new PatternSelect2($el, {
            tags: '["Red", "Yellow"]',
            initialValues: '{"Red": "RedTEXT", "Yellow": "YellowTEXT"}',
        });
        await utils.timeout(1);
        var $choices = $(".select2-choices li");
        expect($choices.length).toEqual(2);
    });

    it("init value map from string", async function () {
        var $el = $('<input class="pat-select2" value="Red" />').appendTo("body");
        new PatternSelect2($el, {
            tags: '["Red", "Yellow"]',
            initialValues: "Yellow: YellowTEXT, Red: RedTEXT",
        });
        await utils.timeout(1);
        var $choices = $(".select2-choices li");
        expect($choices.length).toEqual(2);
        var $redChoice = $choices.eq(0);
        expect($redChoice.find("div").text()).toEqual("RedTEXT");
    });

    it("init value map", async function () {
        var $el = $(
            "<div>" +
                ' <input class="pat-select2"' +
                '        data-pat-select2="{' +
                "          &quot;tags&quot;: &quot;Red,Yellow,Blue&quot;," +
                "          &quot;initialValues&quot;: {" +
                "            &quot;Yellow&quot;: &quot;YellowTEXT&quot;," +
                "            &quot;Red&quot;: &quot;RedTEXT&quot;" +
                "          }" +
                '        }"' +
                '        value="Yellow,Red"/>' +
                "</div>"
        );

        registry.scan($el);
        await utils.timeout(1);
        expect($(".select2-choices li", $el).length).toEqual(3);
    });

    it("ajax vocabulary url configuration", async function () {
        document.body.innerHTML = `
            <input class="pat-select2"
                   data-pat-select2="vocabularyUrl: select2-users-vocabulary"
                   />
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        const el = document.querySelector("input.pat-select2");
        const select2 = el["pattern-select2"];
        expect(select2.options.ajax.url).toEqual("select2-users-vocabulary");
    });

    it("displays the vocabulary when clicking an empty checkbox", async function () {
        document.body.innerHTML = `
          <input type="hidden"
                 class="pat-select2"
                 data-pat-select2="placeholder:Search for a Value;
                                   vocabularyUrl: /select2-ajax.json;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(0);

        $(".select2-input").click();
        await utils.timeout(SELECT2_TIMEOUT);

        $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(3);
        expect($results.first().hasClass("select2-highlighted")).toEqual(true);
        expect($results.first().text()).toEqual("Red");
    });

    it("prepends the query term to the selection", async function () {
        document.body.innerHTML = `
          <input type="hidden"
                 class="pat-select2"
                 data-pat-select2="placeholder:Search for a Value;
                                   vocabularyUrl: /select2-ajax.json;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $input = $(".select2-input");
        $input.click().val("AAA");
        var keyup = $.Event("keyup-change");
        $input.trigger(keyup);
        await utils.timeout(SELECT2_TIMEOUT);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(4);
        expect($results.first().hasClass("select2-highlighted")).toEqual(true);
        expect($results.first().text()).toEqual("AAA");
    });

    it("remove html input", async function () {
        document.body.innerHTML = `
          <input type="hidden" class="pat-select2"
                 data-pat-select2="placeholder:Search for a Value;
                                   vocabularyUrl: /select2-ajax.json;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $input = $(".select2-input");
        $input.click().val('<img src="logo.png" />Evil logo');
        var keyup = $.Event("keyup-change");
        $input.trigger(keyup);
        await utils.timeout(SELECT2_TIMEOUT);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(4);
        expect($results.first().hasClass("select2-highlighted")).toEqual(true);
        expect($results.first().text()).toEqual("Evil logo");
    });

    it("do not html-escape input", async function () {
        document.body.innerHTML = `
          <input type="hidden"
                 class="pat-select2"
                 data-pat-select2="placeholder:Search for a Value;
                                   vocabularyUrl: /select2-ajax.json;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $input = $(".select2-input");
        $input.click().val("this < that & those");
        var keyup = $.Event("keyup-change");
        $input.trigger(keyup);
        await utils.timeout(SELECT2_TIMEOUT);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(4);
        expect($results.first().hasClass("select2-highlighted")).toEqual(true);
        expect($results.first().text()).toEqual("this < that & those");
    });

    it("sets up orderable tags", async function () {
        var $el = $(
            "<div>" +
                ' <input class="pat-select2"' +
                '        data-pat-select2="orderable: true; tags: Red,Yellow,Blue"' +
                '        value="Red"' +
                "        />" +
                "</div>"
        );

        registry.scan($el);
        await utils.timeout(1);
        expect($(".select2-container", $el).hasClass("select2-orderable")).toEqual(true);
    });

    it.skip("handles orderable tag drag events", function () {
        document.body.innerHTML = `
          <div>
            <input class="pat-select2"
                   data-pat-select2="orderable: true; tags: Red,Yellow,Blue"
                   value="Yellow,Red"/>
          </div>"
        `;
        registry.scan(document.body);

        var $results = $("li.select2-search-choice");
        expect($results.length).toEqual(2);
        expect($.trim($results.eq(0).text())).toEqual("Yellow");
        expect($.trim($results.eq(1).text())).toEqual("Red");

        var firstElem = $results.eq(0);
        // css class is set and proxy is created when starting to drag
        expect($("li.dragging").length).toEqual(0);
        expect(firstElem.hasClass("select2-choice-dragging")).toEqual(false);

        firstElem.trigger($.Event("dragstart"));

        expect(firstElem.hasClass("select2-choice-dragging")).toEqual(true);
        var $proxy = $("li.dragging");
        expect($proxy.length).toEqual(1);

        // css position is updated while dragging
        firstElem.trigger($.Event("drag"), {
            proxy: $proxy,
            drop: [],
            offsetX: 10,
            offsetY: 0,
        });
        expect($proxy.css("top")).toEqual("0px");
        expect($proxy.css("left")).toEqual("10px");

        // css class is removed and proxy is deleted when dragging stops
        firstElem.trigger($.Event("dragend"), { proxy: $proxy });
        expect(firstElem.hasClass("select2-choice-dragging")).toEqual(false);
        expect($("li.dragging").length).toEqual(0);
    });

    it("does not allow new items to be added", async function () {
        document.body.innerHTML = `
          <input type="hidden"
                 class="pat-select2"
                 data-pat-select2="tags: Red,Yellow,Blue;
                                   allowNewItems: false;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $input = $(".select2-input");
        $input.click().val("AAA");
        var keyup = $.Event("keyup-change");
        $input.trigger(keyup);
        await utils.timeout(SELECT2_TIMEOUT);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(0);

        var $noResults = $("li.select2-no-results");
        expect($noResults.length).toEqual(1);
    });

    it("does not allow new items to be added when using ajax", async function () {
        document.body.innerHTML = `
          <input type="hidden" class="pat-select2"
                 data-pat-select2="vocabularyUrl: /select2-ajax.json;
                                   allowNewItems: false;
                                   width:20em;
                                   ajaxTimeout: 1;
                                   " />
        `;
        registry.scan(document.body);
        await utils.timeout(1);

        var $input = $(".select2-input");
        $input.click().val("AAA");
        var keyup = $.Event("keyup-change");
        $input.trigger(keyup);
        await utils.timeout(SELECT2_TIMEOUT);

        var $results = $("li.select2-result-selectable");
        expect($results.length).toEqual(3);

        var $noResults = $("li.select2-no-results");
        expect($noResults.length).toEqual(0);
    });

    it("HTML multiple select widget converted to hidden inuput, before applying select2", async function () {
        document.body.innerHTML = `
          <div>
            <select multiple class="pat-select2" id="test-select2" name="test-name"
                    data-pat-select2="{&quot;orderable&quot;: true, &quot;multiple&quot;: true, &quot;separator&quot;: &quot;;&quot;}">
              <option value="1" selected>One</value>
              <option value="2">Two</value>
              <option value="3" selected>Three</value>
              <option value="4">Four</value>
            </select>
          </div>
        `;

        registry.scan(document.body);
        await utils.timeout(1);

        expect($("#test-select2").is("input")).toEqual(true);
        expect($("#test-select2").attr("type")).toEqual("hidden");
        expect($("#test-select2").hasClass("pat-select2")).toEqual(true);
        expect($("#test-select2").attr("name")).toEqual("test-name");
        expect($("#test-select2").val()).toEqual("1;3");
        var $results = $("li.select2-search-choice");
        expect($results.length).toEqual(2);
        expect($.trim($results.eq(0).text())).toEqual("One");
        expect($.trim($results.eq(1).text())).toEqual("Three");
    });
});
