import "./querystring";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";


const mockFetch =
    (json = {}) =>
    () =>
        Promise.resolve({
            json: () => Promise.resolve(json),
        });


const mockAjax = function() {
    const fakeResponse = {
        id: 1,
        name: "All",
        value: "Dummy Data"
    };
    return Promise.resolve(fakeResponse);

}

describe("Querystring", function () {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="formfield-query"><input class="pat-querystring text-widget list-field"
                   type="text" name="form.widgets.ICollection.query"
                   style="display: none;"
                   value=\'[
                        {
                            "i": "portal_type",
                            "o": "plone.app.querystring.operation.selection.any",
                            "v": [
                                "Event"
                            ]
                        },
                        {
                            "i": "review_state",
                            "o": "plone.app.querystring.operation.selection.any",
                            "v": [
                                "published"
                            ]
                        }
                    ]\'
                   data-pat-querystring=\'{
                        "indexOptionsUrl": "http://localhost:8080/Plone/@@qsOptions",
                        "previewURL": "http://localhost:8080/Plone/news/aggregator/@@querybuilder_html_results",
                        "previewCountURL": "http://localhost:8080/Plone/news/aggregator/@@querybuildernumberofresults",
                        "patternDateOptions": {
                            "time": false,
                            "date": {
                                "firstDay": 1,
                                "weekdaysFull": [
                                    "Sonntag",
                                    "Montag",
                                    "Dienstag",
                                    "Mittwoch",
                                    "Donnerstag",
                                    "Freitag",
                                    "Samstag"
                                ],
                                "weekdaysShort": [
                                    "So",
                                    "Mo",
                                    "Di",
                                    "Mi",
                                    "Do",
                                    "Fr",
                                    "Sa"
                                ],
                                "monthsFull": [
                                    "Januar",
                                    "Februar",
                                    "M\u00e4rz",
                                    "April",
                                    "Mai",
                                    "Juni",
                                    "Juli",
                                    "August",
                                    "September",
                                    "Oktober",
                                    "November",
                                    "Dezember"
                                ],
                                "monthsShort": [
                                    "Jan",
                                    "Feb",
                                    "Mrz",
                                    "Apr",
                                    "Mai",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Okt",
                                    "Nov",
                                    "Dez"
                                ],
                                "selectYears": 200,
                                "min": [
                                    1921,
                                    1,
                                    1
                                ],
                                "max": [
                                    2041,
                                    1,
                                    1
                                ],
                                "format": "d mmmm, yyyy",
                                "placeholder": "Datum eingeben\u2026"
                            },
                            "today": "Heute",
                            "clear": "Auswahl aufheben"
                        },
                        "patternAjaxSelectOptions": {
                            "separator": ";"
                        },
                        "patternRelateditemsOptions": {
                            "separator": ";",
                            "vocabularyUrl": "http://localhost:8080/Plone/@@getVocabulary?name=plone.app.vocabularies.Catalog&amp;field=relatedItems",
                            "basePath": "/Plone/news",
                            "rootPath": "/Plone",
                            "rootUrl": "http://localhost:8080/Plone",
                            "contextPath": "/Plone/news/aggregator",
                            "favorites": [
                                {
                                    "title": "Current Content",
                                    "path": "/Plone/news"
                                },
                                {
                                    "title": "Start Page",
                                    "path": "/Plone"
                                }
                            ]
                        }
                    }\'></div>
                    <div id="formfield-sort_on">
                        <input id="form-widgets-sort_on" value="start" type="text">
                    </div>
                    <div id="formfield-sort_reversed">
                        <input id="form-widgets-sort_reversed-0" type="checkbox" checked="checked">
                    </div>
        `;
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("create querystring pattern", async function () {
        expect(document.querySelectorAll(".querystring-wrapper").length).toEqual(0);

        const criterias = await import("./test-querystringcriteria.json");

        global.fetch = jest.fn().mockImplementation(mockFetch(criterias));

        registry.scan(document.body);
        await utils.timeout(1);

        // querystring pattern initialized
        expect(document.querySelectorAll(".querystring-wrapper").length).toEqual(1);
        expect(document.querySelectorAll(".querystring-sort-wrapper").length).toEqual(1);
        expect(document.querySelectorAll(".querystring-preview-wrapper").length).toEqual(1);

        // there should be 3 criteria rows now
        expect(document.querySelectorAll(".querystring-criteria-wrapper").length).toEqual(3);

        // check for correct initialized values
        expect($(".querystring-sort-wrapper select").val()).toEqual("start");
        expect($(".querystring-sort-wrapper .querystring-sortreverse input[type='checkbox']")[0].checked).toBeTruthy();

        global.fetch.mockClear();
        delete global.fetch;
    });
});
