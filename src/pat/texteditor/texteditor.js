import CodeEditor from "@patternslib/pat-code-editor/src/code-editor.js";
import Registry from "@patternslib/patternslib/src/core/registry";

class Pattern extends CodeEditor {
    static name = "texteditor";
    static trigger = ".pat-texteditor";
}

Registry.register(Pattern);
export default Pattern;
export { Pattern };
