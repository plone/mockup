
export async function request({
    method = "GET",
    path = null,
    uids = [],
    searchTerm = null,
    levelInfoPath = null,
    base_url = null,
    selectableTypes = [],
}) {
    let query = new URLSearchParams();
    if (path) {
        query.set("path.query", path);
        query.set("path.depth", 1);
        query.set("sort_on", "getObjPositionInParent");
        query.set("sort_order", "ascending");
    }
    else if (levelInfoPath) {
        query.set("path.query", levelInfoPath);
        query.set("path.depth", 0);
    }
    if (uids.length) {
        for(const uid of uids) {
            query.append("UID", uid);
        }
    }
    if (searchTerm) {
        query.set("SearchableText", searchTerm);
    }

    query.set("metadata_fields", "_all");

    const url = `${base_url}/@search?${query.toString()}`;
    console.log(url);

    let headers = new Headers();
    headers.set("Accept", "application/json");

    const response = await fetch(url, {
        method: method,
        headers: headers,
    });
    const json = await response.json();

    if (response.ok) {
        if (selectableTypes.length) {
            // we iter through response and filter out non-selectable
            // types but keeping folderish types to maintain browsing
            // the content structure.
            const filtered_response = {
                items: [],
                items_total: json.items_total,
            }
            for (const it of json.items) {
                if (selectableTypes.indexOf(it.portal_type) != -1 || it.is_folderish) {
                    filtered_response.items.push(it);
                }
            }
            return filtered_response;
        }
        return json;
    } else {
        return {
            items: [],
            items_total: 0,
            errors: json.errors,
        };
    }
}
