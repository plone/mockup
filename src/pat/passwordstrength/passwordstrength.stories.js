import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import PasswordStrengthComponent from "./passwordstrength.js";

export default {
    title: "Patterns/PasswordStrength",
    zxcvbn: {
        control: "text",
        description: "Custom URL for the zxcvbn library",
        table: {
            disable: true,
        },
    },
};

// Simple password
const getPasswordStrength = () => `
  <input type="password" class="pat-passwordstrength" />
`;

export const PasswordStrength = {
    render: () => RenderHTML({}, getPasswordStrength),
};

// Custom zxcvbn location
const getPasswordStrengthCustom = ({ zxcvbn }) => `
  <input
    type="password"
    class="pat-passwordstrength"
    data-pat-passwordstrength="zxcvbn: ${zxcvbn}"
  />
`;

export const PasswordStrengthCustom = {
    render: (args) => RenderHTML(args, getPasswordStrengthCustom),
    args: {
        zxcvbn: "//lowe.github.io/tryzxcvbn/zxcvbn.js",
    },
};
