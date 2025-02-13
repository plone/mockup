import registry from "@patternslib/patternslib/src/core/registry";

/**
 * Storybook runs inside an iframe, which means we need to ensure that
 * Patternslib is fully initialized before rendering the HTML.
 *
 * To achieve this, the `RenderHTML` function delays rendering
 * so Patternslib is ready.
 */
export const RenderHTML = (args, getStoryHtml) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = getStoryHtml(args);

    // Ensure PatternsLib initializes after render
    setTimeout(() => {
        registry.scan(wrapper);
    }, 300);

    return wrapper;
};
