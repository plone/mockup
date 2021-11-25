import CodeEditor from "@patternslib/pat-code-editor/src/code-editor.js";
import Registry from "@patternslib/patternslib/src/core/registry";

class TextEditor extends CodeEditor {}
TextEditor.extend({
    name: "texteditor",
    trigger: ".pat-texteditor",
});
export default TextEditor;
