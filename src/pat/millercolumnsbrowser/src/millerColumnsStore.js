import { writable, get } from "svelte/store";
import {config} from "./stores";

let cfg = get(config);

export const config_unsubscribe = config.subscribe(value => {
	const cfg = value;
});

export default function () {
  const store = writable(
  []);

  store.request = async (method, path, params = null) => {
    // let baseUrlParams = "?name=plone.app.vocabularies.Catalog&field=relatedItems&query=";
    console.log("store.request() path:", path)
    let baseUrlParams = "&query=";
    let vocabQuery = `{"criteria":[{"i":"path","o":"plone.app.querystring.operation.string.path","v":"${path}::1"}],"sort_on":"getObjPositionInParent","sort_order":"ascending"}`;
    //let attributes = cfg.attr_string.split(",").map((item) => item.trim());
    let attributesParam = "&attributes=" + JSON.stringify(cfg.attributes);
    let batchParam = "&batch=" + JSON.stringify({ page: 1, size: 100 });
    let url = cfg.vocabularyUrl + baseUrlParams + vocabQuery + attributesParam + batchParam;
    console.log("url: ", url);

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
    }
  };

  store.get = async (path) => {
    console.log("store.get() path: ", path);
    let parts = path.split("/") || [];
    const depth = parts.length >= cfg.maxDepth ? cfg.maxDepth : parts.length;
    let paths = [];

    let partsToShow = parts.slice(parts.length - depth, parts.length);
    let partsToHide = parts.slice(0, parts.length - depth);
    const pathPrefix = partsToHide.join("/");

    while (partsToShow.length > 0) {
      let sub_path = partsToShow.join("/");
      if (!sub_path.startsWith("/")) sub_path = "/" + sub_path;
      sub_path = pathPrefix + sub_path;
      const poped = partsToShow.pop();
      if ( poped === "") sub_path = "/";
      if(paths.indexOf(sub_path) === -1) paths.push(sub_path);
    }

    console.log("final paths: ", paths);

    let levels = [];
    for (var p of paths) {
      console.log("GET basePath/p: ", cfg.basePath + p);
      let level = await store.request("GET", cfg.basePath + p);
      level.path = p;
      levels = [level, ...levels];
    }
    store.set(levels);
  };

  return store;
}
