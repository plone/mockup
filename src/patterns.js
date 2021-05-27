/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Import base
import "@patternslib/patternslib/src/public_path";

// Core
import registry from "@patternslib/patternslib/src/core/registry";
import jquery from "jquery";

// Patternslib patterns
import "@patternslib/patternslib/src/pat/datetime-picker/datetime-picker";
import "@patternslib/patternslib/src/pat/validation/validation";
import { parser as tooltip_parser } from "@patternslib/patternslib/src/pat/tooltip/tooltip";
import "@patternslib/pat-code-editor/src/code-editor";
import "@patternslib/pat-content-browser/src/content-browser";
//import "@patternslib/pat-tinymce/src/tinymce";

// Import all used patterns for the bundle to be generated
import "./pat/autotoc/autotoc";
import "./pat/backdrop/backdrop";
import "./pat/contentloader/contentloader";
import "./pat/cookietrigger/cookietrigger";
import "./pat/datatables/datatables";
import "./pat/eventedit/eventedit";
//import "./pat/filemanager/filemanager";
import "./pat/formautofocus/formautofocus";
import "./pat/formunloadalert/formunloadalert";
import "./pat/livesearch/livesearch";
import "./pat/markspeciallinks/markspeciallinks";
import "./pat/modal/modal";
import "./pat/moment/moment";
import "./pat/navigationmarker/navigationmarker";
import "./pat/passwordstrength/passwordstrength";
import "./pat/preventdoublesubmit/preventdoublesubmit";
import "./pat/querystring/querystring";
import "./pat/recurrence/recurrence";
import "./pat/relateditems/relateditems";
import "./pat/resourceregistry/resourceregistry";
import "./pat/select2/select2";
import "./pat/sortable/sortable";
import "./pat/structure/structure";
import "./pat/textareamimetypeselector/textareamimetypeselector";
//import "./pat/thememapper/thememapper";
import "./pat/toggle/toggle";
import "./pat/toolbar/toolbar";
import "./pat/tree/tree";
import "./pat/upload/upload";

// Volto
import "./pat/contentbrowser/contentbrowser";

// REMOVE obsolete patterns
//import "./pat/pickadate/pickadate";
import "./pat/tinymce/tinymce";
//import "./pat/texteditor/texteditor";

// Import pattern styles in JavaScript
window.__patternslib_import_styles = true;

// Register jQuery globally
window.jQuery = jquery;

// Change default value for pat-tooltip trigger
tooltip_parser.parameters.trigger.value = "hover";

registry.init();
