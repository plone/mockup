import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import SortableComponent from "./sortable.js";

export default {
    title: "Patterns/Sortable",
};

// Sortable
const getSortable = () => `
  <style type="text/css" media="screen">
    .item-dragging {
        background-color: red;
    }
    .dragging {
        background: green;
    }
  </style>
  <ul class="pat-sortable">
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
  </ul>
`;

export const Sortable = {
    render: () => RenderHTML({}, getSortable),
};

// Sortable Table
const getSortableTable = () => `
  <table class="table table-stripped">
      <tbody class="pat-sortable" data-pat-sortable="selector:tr;">
          <tr>
              <td>One One</td>
              <td>One Two</td>
          </tr>
          <tr>
              <td>Two One</td>
              <td>Two Two</td>
          </tr>
          <tr>
              <td>Three One</td>
              <td>Three Two</td>
          </tr>
      </tbody>
  </table>
`;

export const SortableTable = {
    render: () => RenderHTML({}, getSortableTable),
};
