import Base from "@patternslib/patternslib/src/core/base";

export default Base.extend({
    name: "discussion",
    trigger: "form#DiscussionSettingsEditForm",

    async init() {
        // Async import implementation to reduce bundle size for controlpanels
        const implementation = (await import("./discussion--implementation")).default;
        const instance = new implementation(this.el);
        instance.init();
    },
});
