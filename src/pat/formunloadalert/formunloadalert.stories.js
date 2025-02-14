import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import FormUnloadAlertComponent from "./formunloadalert.js";

export default {
    title: "Patterns/Form Unload Alert",
};

const getFormUnloadAlert = () => `
    <form class="pat-formunloadalert" onsubmit="javascript:return false;">
        <input type="text" value="" />
        <select>
            <option value="1">value 1</option>
            <option value="2">value 2</option>
        </select>
        <input class="btn btn-large btn-primary" type="submit" value="Submit" />
        <br />
        <a href="/">Click here to go somewhere else</a>
    </form>
`;

export const FormUnloadAlert = {
    render: () => RenderHTML({}, getFormUnloadAlert),
};
