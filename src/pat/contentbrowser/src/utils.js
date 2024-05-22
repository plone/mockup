import utils from "../../../core/utils.js";

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
    pageSize = 100,
    page = 1,
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
        page: page,
        size: pageSize,
    })}`;

    let headers = new Headers();
    headers.set("Accept", "application/json");

    const response = await fetch(url, {
        method: method,
        headers: headers,
    });
    const json = await response.json();

    if (response.ok) {
        if (!searchPath && !levelInfoPath && selectableTypes.length) {
            // we iter through response and filter out non-selectable
            // types but keep folderish types to maintain browsing
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

export async function get_items_from_uids(uids, config) {
    if (!uids) {
        return [];
    }
    const selectedItemsFromUids = await request({
        vocabularyUrl: config.vocabularyUrl,
        attributes: config.attributes,
        uids: uids,
    });
    let results = (await selectedItemsFromUids?.results) || [];
    // resort the results based on the order of uids
    results.sort((a, b) => {
        return uids.indexOf(a.UID) - uids.indexOf(b.UID);
    })
    return results;
}


/** use Plone resolveIcon to load a SVG icon and replace node with icon code */
export async function resolveIcon(node, { iconName }) {

    async function getIcon(iconName) {
        const icon = await utils.resolveIcon(iconName)
        return icon;
    }
    const iconCode = await getIcon(iconName);
    node.outerHTML = iconCode;
    return {
        destroy() {},
    };
}

/** Dispatch event on click outside of node */
export function clickOutside(node) {
    const handleClick = (event) => {
        if (node && !node.contains(event.target)) {
            node.dispatchEvent(new CustomEvent("click_outside", node));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}
