// Plone extended search.
import Base from "@patternslib/patternslib/src/core/base";
import utils from "../../core/utils";

export default Base.extend({
    name: "search",
    trigger: ".pat-search",
    init: function () {
        const loading = new utils.Loading();

        // Cache DOM references
        const searchform = document.getElementById("searchform");
        const filter = document.getElementById("search-filter");
        const filterBtn = filter?.querySelector("#search-filter-toggle") ?? null;
        const advSearchInput = document.getElementById("advanced-search-input");
        const ctSelectAll = document.getElementById("pt_toggle");
        const selectAllContainer = document.querySelector(".search-type-options");
        const sortingContainer = document.getElementById("sorting-options");
        const sortingLinks = sortingContainer?.querySelectorAll("a") ?? [];
        const sortOnEl = document.querySelector('[name="sort_on"]');
        const sortOrderEl = document.querySelector('[name="sort_order"]');
        const batchStartEl = document.getElementById("search-batch-start");

        const serializeForm = () =>
            new URLSearchParams(new FormData(searchform)).toString();

        /* handle history */
        if (window.history?.pushState) {
            window.addEventListener("popstate", () => {
                /* we're just going to cheat and reload the page so
                   we aren't keep moving around state here..
                   Here, I'm lazy, we're not using react here... */
                window.location = window.location.href;
            });
        }

        const pushHistory = (params) => {
            if (window.history?.pushState) {
                const url =
                    window.location.origin + window.location.pathname + "?" + params;
                window.history.pushState(null, null, url);
            }
        };

        // Helper: replace element by id from parsed document
        const replaceById = (id, doc) => {
            const current = document.getElementById(id);
            const next = doc.getElementById(id);
            if (current && next) {
                current.replaceWith(next);
            }
        };

        let timeout = 0;
        const search = () => {
            loading.show();
            const params = serializeForm();
            pushHistory(params);
            const url =
                window.location.origin +
                window.location.pathname +
                "?ajax_load=1&" +
                params;
            fetch(url)
                .then((response) => response.text())
                .then((html) => {
                    const doc = new DOMParser().parseFromString(html, "text/html");
                    replaceById("search-results", doc);
                    replaceById("search-term", doc);
                    replaceById("results-count", doc);
                    loading.hide();
                })
                .catch((error) => {
                    console.error("Search request failed:", error);
                    loading.hide();
                });
        };

        const searchDelayed = () => {
            clearTimeout(timeout);
            timeout = setTimeout(search, 200);
        };

        const setBatchStart = (b_start) => {
            if (batchStartEl) {
                batchStartEl.value = b_start;
            }
        };

        // for some reason the backend always flags with active class the sorting options
        const updateSortingState = (activeEl) => {
            sortingLinks.forEach((a) => a.classList.remove("active"));
            activeEl?.classList.add("active");
        };
        const defaultSort = document
            .getElementById("search-results")
            ?.getAttribute("data-default-sort");
        updateSortingState(
            defaultSort
                ? sortingContainer.querySelector(`a[data-sort=${defaultSort}]`)
                : null
        );

        /* sorting */
        sortingLinks.forEach((a) => {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                updateSortingState(e.currentTarget);
                const sort = e.currentTarget.getAttribute("data-sort");
                const order = e.currentTarget.getAttribute("data-order");
                if (sortOnEl) sortOnEl.value = sort ?? "";
                if (sortOrderEl) sortOrderEl.value = sort && order === "reverse" ? "reverse" : "";
                search();
            });
        });

        /* form submission */
        document.querySelectorAll(".searchPage").forEach((form) => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                setBatchStart("0");
                search();
            });
        });

        /* filters */
        filterBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            filter.classList.toggle("activated");
            if (advSearchInput) {
                advSearchInput.value = filter.classList.contains("activated")
                    ? "True"
                    : "False";
            }
        });

        ctSelectAll?.addEventListener("change", () => {
            selectAllContainer?.querySelectorAll("input").forEach((input) => {
                input.checked = ctSelectAll.checked;
            });
        });

        filter?.querySelectorAll("input").forEach((input) => {
            input.addEventListener("change", () => {
                setBatchStart("0");
                searchDelayed();
            });
        });

        /* pagination */
        searchform?.addEventListener("click", (e) => {
            const link = e.target.closest(".pagination a");
            if (!link) return;
            const b_start = new URLSearchParams(link.getAttribute("href")).get(
                "b_start:int"
            );
            if (!b_start) {
                // not plone pagination
                return;
            }
            e.preventDefault();
            setBatchStart(b_start);
            search();
        });
    },
});
