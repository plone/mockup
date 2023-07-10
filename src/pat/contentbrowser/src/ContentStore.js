import { writable, get } from "svelte/store";
import { config, cache } from "./stores";

let cfg = get(config);

// update cfg when config store changes
export const config_unsubscribe = config.subscribe((value) => {
    cfg = value;
});

export default function () {
    const store = writable([]);

    store.request = async ({method='GET', path=null, uids=null, params=null}) => {
        let vocabQuery;
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

        let url = `${cfg.vocabularyUrl}&query=${JSON.stringify(
            vocabQuery
        )}&attributes=${JSON.stringify(cfg.attributes)}&batch=${JSON.stringify({
            page: 1,
            size: 100,
        })}`;

        store.update((data) => {
            delete data.errors;
            data.loading = true;
            return data;
        });

        let headers = new Headers();
        headers.set("Content-type", "application/json");
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
            return {};
        }
    };

    store.get = async (path) => {
        let parts = path.split("/") || [];
        const depth =
            parts.length >= cfg.maxDepth ? cfg.maxDepth : parts.length;
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
        for (var p of paths) {
            let level = {};
            const c = get(cache);
            if (Object.keys(c).indexOf(p) === -1) {
                console.log("not in cache: ", p);
                level = await store.request({method:"GET", path:cfg.basePath + p});
                cache.update((n) => {
                    n[p] = level;
                    return n;
                });
            } else {
                console.log("in cache: ", p);
                level = c[p];
            }
            console.log(get(cache));
            level.path = p;
            levels = [level, ...levels];
        }
        store.set(levels);
    };

    return store;
}
