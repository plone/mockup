import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import Toggle from "../../src/pat/toggle/toggle.js";

export default {
    title: "Patterns/Toggle",
    argTypes: {
        value: {
            control: "text",
            table: {
                disable: true,
            },
        },
        target: {
            control: "text",
            table: {
                disable: true,
            },
        },
        scope: {
            control: "text",
            table: {
                disable: true,
            },
        },
    },
};

const RenderHTML = (args, getStoryHtml) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = getStoryHtml(args);

    // Ensure PatternsLib initializes after render
    setTimeout(() => {
        registry.scan(wrapper);
    }, 300);

    return wrapper;
};

// Toggle itself
const getToggleItself = ({ value }) => `
    <button type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:${value};">
    This button goes bigger/smaller!
    </button>
`;

export const ToggleItself = {
    render: (args) => RenderHTML(args, getToggleItself),
    args: {
        value: "btn-lg",
    },
};

// Toggle many target elements
const getToggleTarget = ({ value, target }) => `
    <button type="button"
        class="btn btn-primary pat-toggle mb-2"
        data-pat-toggle="value:${value};target:${target};">
        Toggle
    </button>
    <span class="targetElement badge bg-secondary">Hello World</span>
`;

export const ToggleTarget = {
    render: (args) => RenderHTML(args, getToggleTarget),
    args: {
        target: ".targetElement",
        value: "bg-success",
    },
};

// Toggle target elements with scope
const getToggleTargetScope = ({ value, target, scope }) => `
<div class="wrapper">
    <div class="myScope">
        <button
            type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:${value};target:${target};targetScope:${scope};"
        >
            toggle</button
        ><br />
        <span class="targetElement badge bg-secondary mb-4">Hello World</span>
    </div>
    <div class="myScope">
        <button
            type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:${value};target:${target};targetScope:${scope};"
        >
            toggle</button
        ><br />
        <span class="targetElement badge bg-secondary">Hello World</span>
    </div>
</div>
`;

export const ToggleTargetScope = {
    render: (args) => RenderHTML(args, getToggleTargetScope),
    args: {
        value: "bg-success",
        target: ".targetElement",
        scope: ".myScope",
    },
};

// Toggle more than one target inside a specific target scope
const getToggleManyTargetScope = ({ value, target, scope }) => `
<div class="wrapper">
    <div class="myScope">
        <button
            type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:${value};target:${target};targetScope:${scope};"
        >
            toggle</button
        ><br />
        <span class="targetElement badge bg-secondary">Hello World</span>
        <span class="targetElement badge bg-secondary mb-4">Hello again</span>
    </div>
    <div class="myScope">
        <button
            type="button"
            class="btn btn-primary pat-toggle mb-2"
            data-pat-toggle="value:${value};target:${target};targetScope:${scope};"
        >
            toggle</button
        ><br />
        <span class="targetElement badge bg-secondary">Hello World</span>
    </div>
</div>
`;

export const ToggleTargetManyScope = {
    render: (args) => RenderHTML(args, getToggleManyTargetScope),
    args: {
        value: "bg-success",
        target: ".targetElement",
        scope: ".myScope",
    },
};
