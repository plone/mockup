import { writable, get } from "svelte/store";

export default function (config, pathCache) {
    const store = writable([]);

    store.request = async ({
        method = "GET",
        path = null,
        uids = null,
        params = null,
        searchTerm = null,
        levelInfoPath = null,
    }) => {
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
        if(searchTerm) {
            vocabQuery.criteria.push({
                i: "SearchableText",
                o: "plone.app.querystring.operation.string.contains",
                v: `${searchTerm}`,

            })
        }

        let url = `${config.vocabularyUrl}&query=${JSON.stringify(
            vocabQuery
        )}&attributes=${JSON.stringify(config.attributes)}&batch=${JSON.stringify({
            page: 1,
            size: 100,
        })}`;

        let headers = new Headers();
        headers.set("Accept", "application/json");
        const body = params ? JSON.stringify(params) : undefined;

        const response = await fetch(url, { method, body, headers });
        const json = await response.json();

        if (response.ok) {
            if(config.selectableTypes.length) {
                // we iter through response and filter out non-selectable
                // types but keeping folderish types to maintain browsing
                // the content structure.
                const filtered_response = {
                    results: [],
                    total: json.total,
                }
                for(const it of json.results) {
                    if(config.selectableTypes.indexOf(it.portal_type) != -1 || it.is_folderish) {
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
    };

    store.get = async (path, searchTerm, updateCache) => {
        let parts = path.split("/") || [];
        const depth = parts.length >= config.maxDepth ? config.maxDepth : parts.length;
        let paths = [];

        let partsToShow = parts.slice(parts.length - depth, parts.length);
        let partsToHide = parts.slice(0, parts.length - depth);
        const pathPrefix = partsToHide.join("/");
        while (partsToShow.length > 0) {
            let sub_path = partsToShow.join("/");
            if (!sub_path.startsWith("/")) sub_path = "/" + sub_path;
            sub_path = pathPrefix + sub_path;
            const poped = partsToShow.pop();
            if (poped === "") sub_path = "/";
            if (paths.indexOf(sub_path) === -1) paths.push(sub_path);
        }

        let levels = [];
        let pathCounter = 0;

        for (var p of paths) {
            pathCounter++;
            const isFirstPath = pathCounter == 1;
            let skipCache = isFirstPath && (searchTerm || updateCache);
            let level = {};
            const c = get(pathCache);
            if (Object.keys(c).indexOf(p) === -1 || skipCache) {
                let query = {
                    method: "GET"
                };
                let queryPath = config.basePath;
                if (queryPath === "/") {
                    queryPath = "";
                }
                queryPath = queryPath + p;
                query["path"] = queryPath;
                if(isFirstPath && searchTerm){
                    query["searchTerm"] = "*" + searchTerm + "*";
                }
                if(config.selectableTypes.length) {
                    query["selectableTypes"] = config.selectableTypes;
                }
                level = await store.request(query);

                // do not update cache when searching
                if(!searchTerm) {
                    const levelInfo = await store.request({
                        "levelInfoPath": queryPath,
                    });
                    if (levelInfo.total) {
                        level.UID = levelInfo.results[0].UID;
                        level.Title = levelInfo.results[0].Title;
                        // check if level is selectable (config.selectableTypes)
                        level.selectable = (!config.selectableTypes.length || config.selectableTypes.indexOf(levelInfo.results[0].portal_type) != -1);
                    }
                    level.gridView = false;
                    level.path = p;
                    pathCache.update((n) => {
                        n[p] = level;
                        return n;
                    });
                }
            } else {
                level = c[p];
            }
            levels = [level, ...levels];
        }
        store.set(levels);
    };

    return store;
}
