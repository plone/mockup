
export async function request({
    method = "GET",
    vocabularyUrl = null,
    attributes = [],
    path = null,
    uids = null,
    searchTerm = null,
    searchPath = null,
    levelInfoPath = null,
    selectableTypes = [],
}) {
    let vocabQuery = {
        criteria: [],
    };
    if (path) {
        vocabQuery = {
            criteria: [
                {
                    i: "path",
                    o: "plone.app.querystring.operation.string.path",
                    v: `${path}::1`,
                },
            ],
            sort_on: "getObjPositionInParent",
            sort_order: "ascending",
        };
    }
    if (levelInfoPath) {
        vocabQuery = {
            criteria: [
                {
                    i: "path",
                    o: "plone.app.querystring.operation.string.path",
                    v: `${levelInfoPath}::0`,
                },
            ],
        };
    }
    if (searchPath) {
        // search from searchPath down
        vocabQuery = {
            criteria: [
                {
                    i: "path",
                    o: "plone.app.querystring.operation.string.path",
                    v: searchPath,
                },
            ],
        };
        if(selectableTypes) {
            vocabQuery.criteria.push({
                i: "portal_type",
                o: "plone.app.querystring.operation.list.contains",
                v: selectableTypes,
            })
        }
    }
    if (uids) {
        vocabQuery = {
            criteria: [
                {
                    i: "UID",
                    o: "plone.app.querystring.operation.list.contains",
                    v: uids,
                },
            ],
        };
    }
    if (searchTerm) {
        vocabQuery.criteria.push({
            i: "SearchableText",
            o: "plone.app.querystring.operation.string.contains",
            v: `${searchTerm}`,

        })
    }

    if(!vocabQuery.criteria.length) {
        return {
            results: [],
            total: 0,
        }
    };
    console.log(vocabQuery);
    let url = `${vocabularyUrl}&query=${JSON.stringify(
        vocabQuery
    )}&attributes=${JSON.stringify(attributes)}&batch=${JSON.stringify({
        page: 1,
        size: 100,
    })}`;

    let headers = new Headers();
    headers.set("Accept", "application/json");

    const response = await fetch(url, {
        method: method,
        headers: headers,
    });
    const json = await response.json();

    if (response.ok) {
        if (!searchPath && selectableTypes.length) {
            // we iter through response and filter out non-selectable
            // types but keeping folderish types to maintain browsing
            // the content structure.
            const filtered_response = {
                results: [],
                total: json.total,
            }
            for (const it of json.results) {
                if (selectableTypes.indexOf(it.portal_type) != -1 || it.is_folderish) {
                    filtered_response.results.push(it);
                }
            }
            return filtered_response;
        }
        return json;
    } else {
        return {
            results: [],
            total: 0,
            errors: json.errors,
        };
    }
}
