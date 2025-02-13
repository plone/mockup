console.log("Using App:", import.meta.url);

// TODO:
// How to prevent App.svelte from running ?
// both mock and real App.svelte are running rn
if (typeof window !== "undefined") {
    console.log({ aqui: window.ContentBrowserApp });
    window.ContentBrowserApp = "alala";
    console.log({ aqui: window.ContentBrowserApp });
}

export default function MockContentBrowserApp({ target, props }) {
    console.log("MockSelectedItem initialized with", props);
    target.innerHTML = `<div style="border: 2px solid blue; padding: 10px;">
          Mocked Content Browser App
      </div>`;
}
