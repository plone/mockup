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
//import "./pat/filemanager/pattern";
//import "./pat/formautofocus/pattern";
//import "./pat/formunloadalert/pattern";
//import "./pat/inlinevalidation/pattern";
//import "./pat/livesearch/pattern";
//import "./pat/markspeciallinks/pattern";
//import "./pat/modal/pattern";
//import "./pat/moment/pattern";
//import "./pat/navigationmarker/pattern";
//import "./pat/passwordstrength/pattern";
//import "./pat/preventdoublesubmit/pattern";
//import "./pat/querystring/pattern";
//import "./pat/recurrence/pattern";
//import "./pat/relateditems/pattern";
//import "./pat/resourceregistry/pattern";
import "./pat/select2/select2";
//import "./pat/sortable/pattern";
//import "./pat/structure/pattern";
//import "./pat/textareamimetypeselector/pattern";
//import "./pat/texteditor/pattern";
//import "./pat/thememapper/pattern";
//import "./pat/tinymce/pattern";
//import "./pat/toggle/pattern";
//import "./pat/toolbar/pattern";
//import "./pat/tooltip/pattern";
import "./pat/tree/tree";
//import "./pat/upload/pattern";

// REMOVE obsolete patterns
//import "./pat/pickadate/pickadate";

window.jQuery = jquery;
registry.init();
