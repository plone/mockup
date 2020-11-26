/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Import base
import "./public_path"; // first import
import registry from "patternslib/src/core/registry";
import jquery from "jquery";

// Import all used patterns for the bundle to be generated
import "./pat/autotoc/autotoc";
import "./pat/backdrop/backdrop";
import "./pat/contentloader/contentloader";
import "./pat/cookietrigger/cookietrigger";
import "./pat/datatables/pattern";
//import "./pat/eventedit/pattern";
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
//import "./pat/pickadate/pattern";
//import "./pat/preventdoublesubmit/pattern";
//import "./pat/querystring/pattern";
//import "./pat/recurrence/pattern";
//import "./pat/relateditems/pattern";
//import "./pat/resourceregistry/pattern";
//import "./pat/select2/pattern";
//import "./pat/sortable/pattern";
//import "./pat/structure/pattern";
//import "./pat/textareamimetypeselector/pattern";
//import "./pat/texteditor/pattern";
//import "./pat/thememapper/pattern";
//import "./pat/tinymce/pattern";
//import "./pat/toggle/pattern";
//import "./pat/toolbar/pattern";
//import "./pat/tooltip/pattern";
//import "./pat/tree/pattern";
//import "./pat/upload/pattern";

window.jQuery = jquery;
registry.init();
