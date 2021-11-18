import CodeEditor from "@patternslib/pat-code-editor/src/code-editor.js";
import Registry from "@patternslib/patternslib/src/core/registry";

const Pattern = CodeEditor.extend({
    name: "texteditor",
    trigger: ".pat-texteditor",
});
Registry.register(Pattern);
export default Pattern;
