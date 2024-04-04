import { writable, get } from "svelte/store";
import { request } from "./api.js";

export default function (config, pathCache) {
    const store = writable([]);

    store.loading = false;

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
                console.log(`uncached lookup of ${p} (${isFirstPath}, ${searchTerm}, ${updateCache})`);
                let query = {
                    base_url: config.base_url,
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
                if (!searchTerm) {
                    const levelInfo = await request({
                        base_url: config.base_url,
                        levelInfoPath: p,
                    });
                    if (levelInfo.items_total) {
                        level.UID = levelInfo.items[0].UID;
                        level.Title = levelInfo.items[0].Title;
                        // check if level is selectable (config.selectableTypes)
                        level.selectable = (!config.selectableTypes.length || config.selectableTypes.indexOf(levelInfo.items[0].portal_type) != -1);
                    }
                    level.gridView = false;
                    level.path = p;
                    pathCache.update((n) => {
                        n[p] = level;
                        return n;
                    });
                }
            } else {
                console.log(`get path ${p} from cache`);
                level = c[p];
            }
            levels = [level, ...levels];
        }
        store.set(levels);
    };

    store.loadMore = async (path, current_path) => {
        store.loading = true;

        const c = get(pathCache);
        if (Object.keys(c).indexOf(path) === -1) {
            console.log(`path not found in cache ${path}`);
            return;
        };
        const level = c[path];

        if (!level.batching) {
            console.log("nothing to load");
        }

        const url = level.batching.next;

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(`could not load url ${url}`);
            return;
        }

        console.log(`loading ${url} for ${path}`);

        const batch_url = new URL(url);
        const b_start = parseInt(batch_url.searchParams.get("b_start"));

        for (const [idx, item] of Object.entries(json.items)) {
            level.items[parseInt(idx) + b_start] = item;
        }
        level.batching = json.batching;

        pathCache.update((n) => {
            n[path] = level;
            return n;
        });

        // use store.get to update levels
        store.get({path: current_path});
    };

    return store;
}
