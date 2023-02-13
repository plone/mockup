import "./search";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Search", function () {
    beforeEach(function () {
        document.body.innerHTML = `
            <form id="searchform" class="pat-search">
                <input type="hidden" name="sort_on" value="">
                <input type="hidden" name="sort_order" value="">
                <input type="hidden" id="search-batch-start" name="b_start:int" value="0">
                <input type="hidden" id="advanced-search-input" name="advanced_search" value="False">

                <input name="SearchableText" type="text" size="25" title="Website durchsuchen" value="">
                <input type="submit" value="Suche">

                <input type="hidden" name="created.range:record" value="min">

                <div class="mt-3">
                  <h1 id="search-term">
                    <span>Search Results</span>
                  </h1>
                </div>


                <span id="results-count"><span id="search-results-number">0</span> Inhalte gefunden</span>

                <div class="nav-item dropdown" id="search-filter">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" id="search-filter-toggle">Ergebnisse filtern</a>
                    <div class="dropdown-menu dropdown-menu-md-end">
                        <div class="d-flex text-nowrap">
                            <div class="mx-3">
                                <span class="fw-bold">Inhaltstyp</span>
                                <ul class="list-unstyled search-type-options">
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="pt_toggle" value="#" id="pt_toggle" class="form-check-input" checked="checked">
                                        <label for="pt_toggle" class="form-check-label">Alle/Keine auswählen</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="Image" id="portal_type_1">
                                        <label for="portal_type_1" class="form-check-label">Bild</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="coursetool.course" id="portal_type_2">
                                        <label for="portal_type_2" class="form-check-label">Kurs</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="coursetool.member" id="portal_type_3">
                                        <label for="portal_type_3" class="form-check-label">Teilnehmer:in</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="Folder" id="portal_type_4">
                                        <label for="portal_type_4" class="form-check-label">Ordner</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="File" id="portal_type_5">
                                        <label for="portal_type_5" class="form-check-label">Datei</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="checkbox" name="portal_type:list" class="form-check-input" checked="checked" value="Document" id="portal_type_6">
                                        <label for="portal_type_6" class="form-check-label">Seite</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="mx-3">
                                <span class="fw-bold">Neue Inhalte seit</span>
                                <ul class="list-unstyled">
                                    <li>
                                        <div class="form-check">
                                        <input type="radio" id="query-date-yesterday" name="created.query:record:date" class="form-check-input" value="2022-08-02T00:00:00+02:00" checked="checked">
                                        <label for="query-date-yesterday" class="form-check-label">Gestern</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="radio" id="query-date-lastweek" name="created.query:record:date" class="form-check-input" value="2022-07-27T00:00:00+02:00" checked="checked">
                                        <label for="query-date-lastweek" class="form-check-label">Letzte Woche</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="radio" id="query-date-lastmonth" name="created.query:record:date" class="form-check-input" value="2022-07-03T00:00:00+02:00" checked="checked">
                                        <label for="query-date-lastmonth" class="form-check-label">Letzter Monat</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="form-check">
                                        <input type="radio" id="query-date-ever" name="created.query:record:date" class="form-check-input" value="1970-01-02T00:00:00" checked="checked">
                                        <label for="query-date-ever" class="form-check-label">Immer</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <ul id="sorting-options">
                    <li>
                        <a href="./search?sort_on=relevance" data-sort="relevance" data-order="">Relevanz</a>
                    </li>
                    <li>
                        <a href="./search?sort_on=Date&amp;sort_order=reverse" data-sort="Date" data-order="reverse">Datum (neueste zuerst)</a>
                    </li>
                    <li>
                        <a href="./search?sort_on=sortable_title" data-sort="sortable_title" data-order="">alphabetisch</a>
                    </li>
                </ul>

                </div>

                <div id="search-results-wrapper">
                    <div id="search-results" data-default-sort="relevance">
                        <div class="alert alert-info">Nothing found.</div>
                    </div>
                </div>
            </form>
        `;
    });

    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("elements exists", async function () {
        registry.scan(document.body);
        await utils.timeout(1);

        expect(document.querySelectorAll(".pat-search").length).toEqual(1);
        expect(
            document.querySelectorAll(".pat-search input[name='SearchableText']").length
        ).toEqual(1);
        expect(document.querySelector("#search-results .alert").textContent).toEqual(
            "Nothing found."
        );
    });
});
