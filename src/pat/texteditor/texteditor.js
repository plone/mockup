import CodeEditor from "@patternslib/pat-code-editor/src/code-editor.js";
import Registry from "@patternslib/patternslib/src/core/registry";

throw Error;
const Pattern = CodeEditor.extend({
    name: "texteditor",
    trigger: ".pat-texteditor",
});
Registry.register(Pattern);
export default Pattern;

// import $ from "jquery";
// import Base from "@patternslib/patternslib/src/core/base";
// import utils from "../../core/utils";
// import "ace-builds/src/ace";
//
// export default Base.extend({
//     name: "texteditor",
//     trigger: ".pat-texteditor",
//     parser: "mockup",
//     defaults: {
//         theme: null,
//         mode: "text",
//         width: 500,
//         height: 200,
//         tabSize: 4,
//         softTabs: true,
//         wrapMode: false,
//         showGutter: true,
//         showPrintMargin: false,
//         readOnly: false,
//     },
//     init: function () {
//         var self = this;
//         if (!window.ace) {
//             // XXX hack...
//             // wait, try loading later
//             setTimeout(function () {
//                 self.init();
//             }, 200);
//             return;
//         }
//         var ace = window.ace;
//
//         ace.config.set("packaged", true);
//         ace.config.set("basePath", "++plone++static/components/ace-builds/src/");
//
//         // set id on current element
//         var id = utils.setId(self.$el);
//         self.$wrapper = $('<div class="editorWrapper" />').css({
//             height: parseInt(self.options.height) + 25, // weird sizing issue here...
//             width: self.options.width,
//             position: "relative",
//         });
//         if (!self.$el.parent().hasClass("editorWrapper")) {
//             self.$el.wrap(self.$wrapper);
//         }
//         self.$el.css({
//             width: self.options.width,
//             height: self.options.height,
//             position: "absolute",
//         });
//
//         self.editor = ace.edit(id);
//         if (self.options.theme) {
//             self.setTheme(self.options.theme);
//         }
//         self.editor.getSession().setMode("ace/mode/" + self.options.mode);
//         self.editor.getSession().setTabSize(parseInt(self.options.tabSize, 10));
//         self.editor.getSession().setUseSoftTabs(utils.bool(self.options.softTabs));
//         self.editor.getSession().setUseWrapMode(utils.bool(self.options.wrapMode));
//         self.editor.renderer.setShowGutter(utils.bool(self.options.showGutter));
//         self.editor.setShowPrintMargin(utils.bool(self.options.showPrintMargin));
//         self.editor.setReadOnly(utils.bool(self.options.readOnly));
//     },
//     setSyntax: function (name) {
//         var self = this;
//         var modes = {
//             js: "javascript",
//             txt: "text",
//             css: "css",
//             html: "html",
//             xml: "xml",
//             less: "less",
//             py: "python",
//             pt: "xml",
//             cfg: "ini",
//         };
//
//         var extension = name.substr(name.lastIndexOf(".") + 1);
//         var mode = modes[extension];
//
//         if (mode !== undefined) {
//             self.editor.getSession().setMode("ace/mode/" + mode);
//             return true;
//         }
//     },
//     setTheme: function (theme) {
//         var self = this;
//         self.editor.setTheme("ace/theme/" + theme);
//     },
//     setText: function (data) {
//         var self = this;
//         if (self.editor) {
//             self.editor.setValue(data);
//         }
//     },
// });
