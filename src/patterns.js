/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Core
import registry from "@patternslib/patternslib/src/core/registry";

// Patternslib patterns
import "@patternslib/patternslib/src/pat/checklist/checklist";
import "@patternslib/patternslib/src/pat/date-picker/date-picker";
import "@patternslib/patternslib/src/pat/datetime-picker/datetime-picker";
import "@patternslib/patternslib/src/pat/display-time/display-time";
import { Pattern as ValidationPattern } from "@patternslib/patternslib/src/pat/validation/validation"; // Also loads the Pattern itself.
import { parser as tooltip_parser } from "@patternslib/patternslib/src/pat/tooltip/tooltip";
import "@patternslib/pat-code-editor/src/code-editor";
import "@patternslib/patternslib/src/pat/inject/inject";
import "@patternslib/patternslib/src/pat/depends/depends";

//import "@patternslib/pat-content-browser/src/content-browser";
//import "@patternslib/pat-tinymce/src/tinymce";

// Import all used patterns for the bundle to be generated
import "./pat/autotoc/autotoc";
import "./pat/backdrop/backdrop";
import "./pat/contentloader/contentloader";
import "./pat/cookietrigger/cookietrigger";
import "./pat/datatables/datatables";
import "./pat/formautofocus/formautofocus";
import "./pat/formunloadalert/formunloadalert";
import "./pat/livesearch/livesearch";
import "./pat/markspeciallinks/markspeciallinks";
import "./pat/modal/modal";
import "./pat/navigationmarker/navigationmarker";
import "./pat/passwordstrength/passwordstrength";
import "./pat/preventdoublesubmit/preventdoublesubmit";
import "./pat/manageportlets/manageportlets.js";
import "./pat/querystring/querystring";
import "./pat/recurrence/recurrence";
import "./pat/relateditems/relateditems";
import "./pat/search/search";
import "./pat/select2/select2";
import "./pat/sortable/sortable";
import "./pat/structure/structure";
import "./pat/textareamimetypeselector/textareamimetypeselector";
import "./pat/tinymce/tinymce";
import "./pat/toggle/toggle";
import "./pat/toolbar/toolbar";
import "./pat/tree/tree";
import "./pat/upload/upload";

// REMOVE obsolete patterns
//import "./pat/texteditor/texteditor";

// Controlpanels
import "./pat/controlpanels/dexterity-types-listing";
import "./pat/controlpanels/registry";
import "./pat/controlpanels/schemaeditor";
import "./pat/controlpanels/contentrules";
import "./pat/controlpanels/contentrule-elements";
import "./pat/controlpanels/discussion";
import "./pat/controlpanels/discussion-comments";
import "./pat/controlpanels/discussion-moderation";

// Change default value for pat-tooltip trigger
tooltip_parser.parameters.trigger.value = "hover";

// Change validation error template to be BS compatible
ValidationPattern.prototype.error_template = (message) =>
    `<em class="invalid-feedback">${message}</em>`;

// Import pattern styles in JavaScript
window.__patternslib_import_styles = true;

registry.init();
