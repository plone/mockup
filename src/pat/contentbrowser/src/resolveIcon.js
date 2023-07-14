/** use Plone resolveIcon to load a SVG icon and replace node with icon code */
import utils from "../../../core/utils.js";

export async function resolveIcon(node, { iconName }) {

    async function getIcon(iconName) {
        const icon = await utils.resolveIcon(iconName)
        console.log(icon)
        return icon;
    }
    const iconCode = await getIcon(iconName);
    node.outerHTML = iconCode;
    return {
        destroy() {},
    };
}
