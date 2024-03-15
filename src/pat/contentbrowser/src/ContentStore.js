import { writable, get } from "svelte/store";
import { pathCache } from "./stores";


export default function (config) {
    const store = writable([]);

    store.request = async ({
        method = "GET",
        path = null,
        uids = null,
        params = null,
        searchTerm = null,
        levelInfoPath = null,
        selectableTypes = [],
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
        if(selectableTypes) {
        //     if(selectableTypes.indexOf("Folder") == -1) {
        //         // add Folder always to preserve browsing through structure
        //         selectableTypes.push("Folder");
        //     }
        //     // query only selectable types
        //     vocabQuery.criteria.push({
        //         i: "portal_type",
        //         o: "plone.app.querystring.operation.selection.any",
        //         v: selectableTypes,
        //     });
        }
        let url = `${config.vocabularyUrl}&query=${JSON.stringify(
            vocabQuery
        )}&attributes=${JSON.stringify(config.attributes)}&batch=${JSON.stringify({
            page: 1,
            size: 100,
        })}`;

        store.update((data) => {
            delete data.errors;
            data.loading = true;
            return data;
        });

        let headers = new Headers();
        headers.set("Accept", "application/json");
        const body = params ? JSON.stringify(params) : undefined;

        const response = await fetch(url, { method, body, headers });
        const json = await response.json();

        if (response.ok) {
            return json;
        } else {
            store.update((data) => {
                data.loading = false;
                data.errors = json.errors;
                return data;
            });
            return [];
        }
    };

    store.get = async (path, searchTerm, skipCache) => {
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
            if(typeof skipCache === "undefined") {
                skipCache = isFirstPath && searchTerm;
            }
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
                if(!skipCache) {
                    const levelInfo = await store.request({
                        "levelInfoPath": queryPath,
                    });
                    if (levelInfo.total) {
                        level.UID = levelInfo.results[0].UID;
                        level.Title = levelInfo.results[0].Title;
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
