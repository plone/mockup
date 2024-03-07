/** Dispatch event on click outside of node */
export function clickOutside(node) {
    const handleClick = (event) => {
        debugger
        //if (node && !node.contains(event.target) && !event.defaultPrevented) {
        if (node && !node.contains(event.target)) {
            node.dispatchEvent(new CustomEvent("click_outside", node));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}
