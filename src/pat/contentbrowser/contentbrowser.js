import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "contentbrowser",
    trigger: ".pat-contentbrowser",
    parser: "mockup",

    async init() {
        window.__CLIENT__ = true; // Define as volto client
        window.__DEVELOPMENT__ = true;
        window.__SERVER__ = false;

        // await import("@plone/volto/config");
        //
        //
        //
        //
        //
        //

        const config = (await import("@plone/volto/registry")).default;

        const contentIcons = (await import("@plone/volto/config/ContentIcons"))
            .contentIcons;

        config.set("settings", {
            apiPath: "http://localhost:8080/Plone",
            storeExtenders: [],
            nonContentRoutes: [],
            contentIcons: contentIcons,
        });

        const React = (await import("react")).default;
        const ReactDOM = (await import("react-dom")).default;
        const IntlProvider = (await import("react-intl")).IntlProvider;
        const Provider = (await import("react-redux")).Provider;
        const Contents = (await import("@plone/volto/components/manage/Contents/Contents.jsx")).default; // prettier-ignore
        const configureStore = (await import("@plone/volto/store")).default;

        const StaticRouter = (await import("react-router-dom")).StaticRouter;

        const createBrowserHistory = (await import("history")).createBrowserHistory;
        const Api = (await import("@plone/volto/helpers")).Api;

        const history = createBrowserHistory();
        const api = new Api();
        const store = configureStore(window.__data, history, api);

        //const persistAuthToken = (await import("@plone/volto/helpers")).persistAuthToken;
        //persistAuthToken(store);

        //const ConnectedRouter = (await import("connected-react-router")).ConnectedRouter;
        //const routes = {
        //    path: "/**",
        //    component: Contents,
        //};

        ReactDOM.render(
            React.createElement(
                Provider,
                { store: store },
                React.createElement(
                    IntlProvider,
                    { locale: "en" },
                    React.createElement(
                        StaticRouter,
                        { location: "/" },
                        React.createElement(
                            Contents,
                            { location: { pathname: "/" } },
                            null
                        )
                    )
                )
            ),
            this.el
        );
    },
});
