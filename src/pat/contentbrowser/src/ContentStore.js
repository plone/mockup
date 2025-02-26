import { writable, get } from "svelte/store";
import { request } from "./utils.js";

export default function (config, pathCache) {
    const store = writable([]);

    const load = async (query) => {
        let defaults = {
            vocabularyUrl: config.vocabularyUrl,
            attributes: config.attributes,
            pageSize: config.pageSize,
            browseableTypes: config.browseableTypes,
        };
        query = {
            ...defaults,
            ...query,
        }
        if (config.selectableTypes.length) {
            query["selectableTypes"] = config.selectableTypes;
        }
        try {
            return await request(query);
        }
        catch {
            return {
                "error": "Could load data from backend."
            };
        }
    }

    const browse = async (path, searchTerm, updateCache) => {

        let rootPath = config.rootPath;
        let physicalPath = path;

        if (!physicalPath.startsWith(rootPath)) {
            // The path from the returned items from "vocabularyUrl" are starting
            // relative from the rootPath. This is either the Plone site or the VirtualHosted navigation root path.
            physicalPath = rootPath + physicalPath;
        }

        let paths = [];
        let parts = physicalPath.split("/") || [];
        const maxDepth = Math.min(parts.length, config.maxDepth || 999);

        let partsToShow = parts.slice(parts.length - maxDepth, parts.length);
        let partsToHide = parts.slice(0, parts.length - maxDepth);
        const pathPrefix = partsToHide.join("/");

        while (partsToShow.length > 0) {
            let sub_path = partsToShow.join("/").replace(/^\//, "");
            const poped = partsToShow.pop();
            sub_path = pathPrefix + ((poped != "") ? `/${sub_path}` : "");
            if (sub_path && paths.indexOf(sub_path) === -1) paths.push(sub_path);
            if (sub_path == rootPath) {
                // respect rootPath
                break;
            }
        }

        const pC = get(pathCache);
        let levels = [];
        let pathCounter = 0;

        for (var p of paths) {
            pathCounter++;
            const isFirstPath = pathCounter == 1;
            let level = {};
            if (
                !(p in pC) ||  // new path not found in cache
                (isFirstPath && searchTerm) ||  // filtering the level
                updateCache  // manual cache update request
            ) {
                let query = {
                    path: p,
                };

                if (isFirstPath && searchTerm) {
                    query["searchTerm"] = "*" + searchTerm + "*";
                }

                level = await load(query);

                // check if there is more than the current batch
                level.more = config.pageSize < level.total;
                // save possible search filter for later batch loading
                level.searchTerm = searchTerm;
                level.page = 1;
                level.path = p;
                level.displayPath = p.replace(rootPath, "") || "/"

                // do not update cache when searching
                if (!searchTerm) {
                    const levelInfo = await load({
                        levelInfoPath: p,
                    });
                    if (levelInfo.total) {
                        level.UID = levelInfo.results[0].UID;
                        level.Title = levelInfo.results[0].Title;
                        level.portal_type = levelInfo.results[0].portal_type;
                        level.getIcon = levelInfo.results[0].getIcon;
                        // check if level is selectable (config.selectableTypes)
                        level.selectable = (!config.selectableTypes.length || config.selectableTypes.indexOf(levelInfo.results[0].portal_type) != -1);
                    }
                    level.showFilter = false;
                    pathCache.update((n) => {
                        n[p] = level;
                        return n;
                    });
                }
            } else {
                level = pC[p];
            }
            levels = [level, ...levels];
        }
        store.set(levels);
    }

    const search = async (searchTerm, page) => {
        let query = {
            searchPath: config.rootPath,
            page: page,
        };
        if (searchTerm) {
            if (searchTerm.length < 2) {
                // minimum length of search term
                return;
            }
            query["searchTerm"] = "*" + searchTerm + "*";
        }
        let level = await load(query);
        level.page = page;
        level.searchTerm = searchTerm;

        store.update((levels) => {
            const has_more = (page * config.pageSize) < level.total;

            // first time or new search
            if (levels.length == 0 || levels[0].searchTerm != searchTerm) {
                level.more = has_more;
                level.selectable = false;
                return [level,];
            }

            // has more ?
            levels[0].more = has_more;
            levels[0].page = level.page;

            // append new batch
            levels[0].results = [
                ...levels[0].results,
                ...level.results,
            ];
            return levels;
        });
    }

    const nextBatch = async (p, page, searchTerm) => {
        let query = {
            path: p,
            page: page,
        };

        if (searchTerm) {
            query["searchTerm"] = "*" + searchTerm + "*";
        }

        let level = await load(query);
        level.more = (page * config.pageSize) < level.total;
        level.page = page;

        store.update((levels) => {
            levels.forEach((l) => {
                if (l.path != p) {
                    return l;
                }
                l.page = level.page;
                l.more = level.more;
                l.results = [
                    ...l.results,
                    ...level.results,
                ]
            });
            return levels;
        });
    }

    store.get = async ({
        path = "",
        searchTerm = "",
        updateCache = false,
        loadMorePath = "",
        page = 1,
        mode = null,
    }) => {
        if(mode == null) {
            mode = config.mode;
        }
        if (mode === "search") {
            await search(searchTerm, page);
        } else if (loadMorePath) {
            const pC = get(pathCache);
            if (!(loadMorePath in pC)) {
                return;
            }
            let level = pC[loadMorePath];
            if (page > level.page) {
                await nextBatch(loadMorePath, page, level.searchTerm);
            }
        } else if (path) {
            await browse(path, searchTerm, updateCache);
        }

    };

    return store;
}
