import utils from "../../../core/utils.js";
import I18n from "../../../core/i18n.js";

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
        // query sublevel of path
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
        // query exact path
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
        if (selectableTypes.length) {
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

    if (!vocabQuery.criteria.length) {
        return {
            results: [],
            total: 0,
        }
    };

    let url = `${vocabularyUrl}${vocabularyUrl.indexOf("?") !== -1 ? "&" : "?"}query=${JSON.stringify(
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

    if (!response.ok) {
        return {
            results: [],
            total: 0,
            errors: json.errors,
        };
    }

    const json = await response.json();

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
        destroy() { },
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

export function recentlyUsedItems(filterItems, config) {
    let ret = utils.storage.get(config.recentlyUsedKey) || [];
    // hard-limit to 1000 entries
    ret = ret.slice(ret.length - 1000, ret.length);
    if (filterItems && config?.selectableTypes.length) {
        ret = ret.filter((it) => {
            return config.selectableTypes.indexOf(it.portal_type) != -1;
        });
    }
    // max is applied AFTER filtering selectable items.
    const max = parseInt(config.recentlyUsedMaxItems, 20);
    if (max) {
        // return the slice from the end, as we want to display newest items first.
        ret = ret.slice(ret.length - max, ret.length);
    }
    return ret;
}

export function updateRecentlyUsed(item, config) {
    if (!config.recentlyUsed) {
        return;
    }
    // add to recently added items
    const recentlyUsed = recentlyUsedItems(false, config); // do not filter for selectable but get all. append to that list the new item.
    const alreadyPresent = recentlyUsed.filter((it) => {
        return it.UID === item.UID;
    });
    if (alreadyPresent.length > 0) {
        recentlyUsed.splice(recentlyUsed.indexOf(alreadyPresent[0]), 1);
    }
    recentlyUsed.push(item);
    utils.storage.set(config.recentlyUsedKey, recentlyUsed);
}


export function formatDate(dateval) {
    // fix underscore replacement by /mockup/src/core/i18n.js
    // the "wrong" fix in i18n.js exists for use by select2 and tinymce
    // this fix should be moved to the mockup modules of tinymce and select
    // see: https://github.com/plone/mockup/issues/1429
    const d = Date.parse(dateval);
    const i18n = new I18n();
    return new Date(d).toLocaleString(i18n.currentLanguage.replace("_", "-"));    
}
