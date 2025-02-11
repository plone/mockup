import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fn } from "@storybook/test";

const preview = {
    parameters: {
        actions: {
            handles: {
                onClick: fn(),
                onSubmit: fn(),
                onChange: fn(),
            },
        },
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: "centered",
    },
};

export default preview;
