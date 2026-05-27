import sveltePreprocess from "svelte-preprocess";

/** @type {import('svelte/compiler').CompileOptions} */
const config = {
    preprocess: sveltePreprocess(),
    compilerOptions: {
        runes: true,
    },
};

export default config;
