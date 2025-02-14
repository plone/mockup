import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import CookieTriggerComponent from "./cookietrigger.js";

export default {
    title: "Patterns/Cookie Trigger",
};

const getCookieTrigger = () => `
    <div class="portalMessage error pat-cookietrigger">
        Cookies are not enabled. You must enable cookies before you can log in.
    </div>
`;

export const CookieTrigger = {
    render: () => RenderHTML({}, getCookieTrigger),
};
