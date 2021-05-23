import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    parser: "mockup",

    async init() {
        window.__CLIENT__ = true; // Define as volto client

        const React = (await import("react")).default;
        const ReactDOM = (await import("react-dom")).default;
        const IntlProvider = (await import("react-intl")).IntlProvider;
        const Provider = (await import("react-redux")).Provider;
        const ContentBrowser = (await import("@plone/volto/components/manage/Contents/Contents.jsx")).default; // prettier-ignore
        const MemoryRouter = (await import("react-router-dom")).MemoryRouter;
        const configureStore = (await import("redux-mock-store")).default;
        const mockStore = configureStore();

        const store = mockStore({
            actions: {
                actions: {
                    document_actions: [],
                    object: [
                        {
                            icon: "",
                            id: "folderContents",
                            title: "Contents",
                        },
                    ],
                },
            },
            userSession: {
                token: "14134234123qwdaf",
            },
            search: {
                items: [
                    {
                        "@id": "/blog",
                        "@type": "Folder",
                        "title": "Blog",
                        "descripton": "My Blog",
                        "ModificationDate": "2017-04-19T22:48:56+02:00",
                        "EffectiveDate": "2017-04-19T22:48:56+02:00",
                        "review_state": "private",
                    },
                ],
                total: 1,
            },
            breadcrumbs: {
                items: [
                    {
                        url: "/blog",
                        title: "Blog",
                    },
                ],
            },
            clipboard: {
                action: "copy",
                source: ["/blog"],
                request: {
                    loading: false,
                    loaded: false,
                },
            },
            content: {
                delete: {
                    loading: false,
                    loaded: false,
                },
                update: {
                    loading: false,
                    loaded: false,
                },
                updatecolumns: {
                    loading: false,
                    loaded: false,
                },
            },
            intl: {
                locale: "en",
                messages: {},
            },
        });

        ReactDOM.render(
            React.createElement(
                Provider,
                { store: store },
                React.createElement(
                    MemoryRouter,
                    {},
                    React.createElement(
                        IntlProvider,
                        { locale: "en" },
                        React.createElement(
                            ContentBrowser,
                            {
                                location: { pathname: "/blog" },
                            },
                            null
                        )
                    )
                )
            ),
            this.el
        );
    },
});
