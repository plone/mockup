import logger from "@patternslib/patternslib/src/core/logging";
import utils from "../../../core/utils.js";
import I18n from "../../../core/i18n.js";

const log = logger.getLogger("pat-contentbrowser");

export async function request({
    method = "GET",
    vocabularyUrl = null,
    attributes = [],
    path = null,
    uids = null,
    searchTerm = null,
    searchIndex = "SearchableText",
    searchPath = null,
    levelInfoPath = null,
    selectableTypes = [],
    browseableTypes = [],
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
        if (selectableTypes.length) {
            // we need to append browseableTypes here in order to
            // preserve browsing subitems
            vocabQuery.criteria.push({
                i: "portal_type",
                o: "plone.app.querystring.operation.list.contains",
                v: selectableTypes.concat(browseableTypes),
            })
        }
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
            i: searchIndex,
            o: "plone.app.querystring.operation.string.contains",
            v: searchTerm,

        })
    }

    if (!vocabQuery.criteria.length) {
        return {
            results: [],
            total: 0,
        }
    };
    const url_query = JSON.stringify(vocabQuery);
    const url_parameters = JSON.stringify(attributes);
    const url_batch = pageSize ? JSON.stringify({
        page: page,
        size: pageSize,
    }) : "";

    let url = encodeURI(`${vocabularyUrl}${vocabularyUrl.indexOf("?") !== -1 ? "&" : "?"}query=${url_query}&attributes=${url_parameters}` + (url_batch ? `&batch=${url_batch}` : ""));

    const headers = new Headers();
    headers.set("Accept", "application/json");

    let request_params =  {
        method: method,
        headers: headers,
    };

    if (method == "POST" && url.indexOf("?") !== -1) {
        const url_parts = url.split("?");
        url = url_parts[0];
        const post_data = url_parts[1];
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        log.debug(url, post_data);

        request_params['body'] = post_data;
    }

    const response = await fetch(url, request_params);

    if (!response.ok) {
        return {
            results: [],
            total: 0,
            errors: response.errors,
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
        // use POST request (when many selected items are present the URL might get too long)
        method: "POST",
        vocabularyUrl: config.vocabularyUrl,
        attributes: config.attributes,
        uids: uids,
        // do not batch here, otherwise we do not get all items
        pageSize: null,
    });
    let results = (await selectedItemsFromUids?.results) || [];
    // resort the results based on the order of uids
    results.sort((a, b) => {
        return uids.indexOf(a.UID) - uids.indexOf(b.UID);
    })
    return results;
}


/** use Plone resolveIcon to load a SVG icon and replace node with icon code */

export async function iconTag(iconName) {
    const icon = await utils.resolveIcon(iconName);
    return icon;
}

export async function resolveIcon(node, { iconName }) {
    const iconCode = await iconTag(iconName);
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
