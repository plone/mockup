import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import LivesearchComponent from "./livesearch.js";

export default {
    title: "Patterns/Livesearch",
};

const getLivesearch = () => `
    <form
        action="search"
        class="pat-livesearch"
        data-pat-livesearch="ajaxUrl:livesearch.json"
    >
        <input type="text" />
    </form>
`;

export const Livesearch = {
    render: () => RenderHTML({}, getLivesearch),
};
