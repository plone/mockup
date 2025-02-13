import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import ModalComponent from "./modal.js";

export default {
    title: "Patterns/Modal",
    argTypes: {
        id: {
            control: "text",
            description: "Modal ID",
            table: {
                category: "Attributes",
                disable: true,
            },
        },
        dataPat: {
            control: "text",
            description: "Data-pat-plone-modal value",
            table: {
                category: "Attributes",
                disable: true,
            },
        },
        title: {
            control: "text",
            description: "Modal title",
            table: {
                category: "Content",
                disable: true,
            },
        },
        content: {
            control: "text",
            description: "Modal content",
            table: {
                category: "Content",
                disable: true,
            },
        },
    },
};

const getModal = ({ id, dataPat, title, content }) => `
    <a href="#${id}" 
       class="plone-btn plone-btn-large plone-btn-primary pat-plone-modal"
       data-pat-plone-modal="${dataPat}">${title}</a>

    <div id="${id}" style="display: none">
        ${content}
    </div>
`;

export const Modal = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modal1",
        dataPat: "width: 400",
        title: "Modal basic",
        content: `
            <h1>Basic modal!</h1>
            <p>Indeed. Whoa whoa whoa whoa. Wait.</p>`,
    },
};

export const ModalWithButtons = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modal2",
        dataPat: "{'width': '400', 'buttons': ['.plone-btn']}",
        title: "Modal with buttons",
        content: `
            <h1>Modal With Buttons!</h1>
            <p>Indeed. Whoa whoa whoa whoa. Wait.</p>
            <input type="submit" class="btn btn-secondary plone-btn me-1" name="cancel" value="Cancel" />
            <input type="submit" class="btn btn-primary plone-btn" name="insert" value="Submit" />`,
    },
};

export const ModalScrolling = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modal3",
        dataPat: "width: 500",
        title: "Modal long scrolling",
        content: `
            <h1>Modal with scrolling</h1>
            ${`<p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua
            </p>
            <br /><br /><br /><br /><br />
            <br /><br /><br /><br /><br />`.repeat(5)}
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua
            </p>`,
    },
};

// TODO: Fix Tinymce implementation
export const ModalTinymce = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modaltinymce",
        dataPat: "height: 600px; width: 80%",
        title: "Modal with TinyMCE",
        content: `<textarea class="pat-tinymce"></textarea>`,
    },
};

export const ModalFullscreen = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modal4",
        dataPat: "{'modalSizeClass': 'modal-fullscreen', 'margin': '0'}",
        title: "Modal fullscreen!",
        content: `
            <h1>Full screen modal!</h1>
            <p>Indeed. Whoa whoa whoa whoa. Wait.</p>`,
    },
};

export const ModalLarge = {
    render: (args) => RenderHTML(args, getModal),
    args: {
        id: "modal5",
        dataPat: "{'modalSizeClass': 'modal-lg;'}",
        title: "Modal large!",
        content: `
            <h1>Modal Large</h1>
            <p>Indeed. Whoa whoa whoa whoa. Wait.</p>`,
    },
};
