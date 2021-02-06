/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Import base
import "./public_path"; // first import

// Import pattern styles in JavaScript
window.__patternslib_import_styles = true;

import registry from "patternslib/src/core/registry";
import jquery from "jquery";

// Patternslib patterns
import "patternslib/src/pat/datetime-picker/datetime-picker";

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
import "./pat/inlinevalidation/inlinevalidation";
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
//import "./pat/resourceregistry/resourceregistry";
import "./pat/select2/select2";
import "./pat/sortable/sortable";
import "./pat/structure/structure";
//import "./pat/textareamimetypeselector/textareamimetypeselector";
//import "./pat/texteditor/texteditor";
//import "./pat/thememapper/thememapper";
import "./pat/tinymce/tinymce";
import "./pat/toggle/toggle";
import "./pat/toolbar/toolbar";
import "./pat/tooltip/tooltip";
import "./pat/tree/tree";
import "./pat/upload/upload";
import "pat-code-editor/src/code-editor";

// REMOVE obsolete patterns
import "./pat/pickadate/pickadate";

window.jQuery = jquery;
registry.init();
