import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import PreventDoubleSubmitComponent from "./preventdoublesubmit.js";

export default {
    title: "Patterns/Prevent Double Submit",
};

const getPreventDoubleSubmit = () => `
    <form class="pat-preventdoublesubmit" onsubmit="javascript:return false;">
        <input type="text" value="submit this value please!" />
        <input class="btn btn-large btn-primary" type="submit" value="Single submit" />
        <input class="btn btn-large btn-primary allowMultiSubmit" type="submit" value="Multi submit" />
    </form>
`;

export const PreventDoubleSubmit = {
    render: () => RenderHTML({}, getPreventDoubleSubmit),
};
