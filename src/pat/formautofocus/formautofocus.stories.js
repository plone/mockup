import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import FormAutofocus from "./formautofocus.js";

export default {
    title: "Patterns/FormAutoFocus",
    argTypes: {
        error: {
            control: "boolean",
            description: "Toggle to add an error state",
            table: {
                category: "Behavior",
            },
        },
    },
};

const getFormAutoFocus = ({ error }) => `
  <h4>Form without Autofocus</h4>
  <form>
      <div class="error">
          <input
              type="text"
              placeholder="should not be focused"
              name="in_other_form_should_not_be_focused"
          />
      </div>
  </form>
  <br />
  <h4>Form with Autofocus</h4>
  <form class="pat-formautofocus">
      <div>
          <input
              type="text"
              placeholder="should not be focused"
              name="a_should_not_be_focused"
              class="formTabs"
          />
          <input
              type="text"
              placeholder="should not be focused"
              name="b_should_not_be_focused"
          />
      </div>
      <div class="error" ${error ? `` : `style="display: none;"`}>
            <input
                type="text"
                placeholder="should not be focused"
                name="c_should_not_be_focused"
                class="formTabs"
            />
            <input type="text" name="d_should_be_focused" />
        </div>
  </form>
`;

export const FormAutoFocus = {
    render: (args) => RenderHTML(args, getFormAutoFocus),
    args: {
        error: true,
    },
};
