import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import ContentBrowserComponent from "./contentbrowser.js";

export default {
    title: "Patterns/ContentBrowser",
    parameters: {
        mockData: [
            {
                url: "/contentbrowser-test.json", // Fake API URL
                method: "GET",
                status: 200,
                response: {
                    items: [
                        {
                            UID: "1234",
                            Title: "Example Document",
                            path: "/example-document",
                        },
                        { UID: "5678", Title: "Another Item", path: "/another-item" },
                    ],
                },
            },
        ],
    },
};

// Basic Contentbrowser
const getContentBrowser = (args) => `
    <input
        type="text"
        class="pat-contentbrowser"
        data-pat-contentbrowser='{"vocabularyUrl": "${args.vocabularyUrl}"}'
    />
`;

// TODO:
// Story for this component: error Invalid URL
// Check svelte components mocks ?
export const ContentBrowser = {
    render: (args) => RenderHTML(args, getContentBrowser),
    args: {
        vocabularyUrl: "/contentbrowser-test.json",
    },
};
