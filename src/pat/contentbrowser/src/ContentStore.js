import { writable, get } from "svelte/store";
import { request } from "./api.js";

export default function (config, pathCache) {
    const store = writable([]);

    store.get = async ({
        path = "",
        searchTerm = "",
        updateCache = false,
    }) => {
        const base_url = new URL(config.base_url);
        const portalPath = base_url.pathname;
        path = path.replace(new RegExp(`^${portalPath}`), "");

        let parts = path.split("/") || [];
        const depth = parts.length >= config.maxDepth ? config.maxDepth : parts.length;
        let paths = [];

        let partsToShow = parts.slice(parts.length - depth, parts.length);
        let partsToHide = parts.slice(0, parts.length - depth);
        const pathPrefix = portalPath + partsToHide.join("/");

        while (partsToShow.length > 0) {
            let sub_path = partsToShow.join("/").replace(/^\//, "");
            const poped = partsToShow.pop();
            sub_path = pathPrefix + ((poped != "") ? `/${sub_path}` : "");
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
                    method: "GET",
                    vocabularyUrl: config.vocabularyUrl,
                    attributes: config.attributes,
                    path: p,
                };

                if (isFirstPath && searchTerm) {
                    query["searchTerm"] = "*" + searchTerm + "*";
                }
                if (config.selectableTypes.length) {
                    query["selectableTypes"] = config.selectableTypes;
                }
                level = await request(query);

                // do not update cache when searching
                if(!searchTerm) {
                    const levelInfo = await request({
                        levelInfoPath: p,
                        vocabularyUrl: config.vocabularyUrl,
                        attributes: config.attributes,

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
