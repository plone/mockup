/* i18n integration.
 *
 * This is a singleton.
 * Configuration is done on the body tag data-i18ncatalogurl attribute
 *     <body data-i18ncatalogurl="/plonejsi18n">
 *
 *  Or, it'll default to "/plonejsi18n"
 */

import I18N from "./i18n";

// we're creating a singleton here so we can potentially
// delay the initialization of the translate catalog
// until after the dom is available
let _t = null;
const translate = function (msgid, keywords) {
    if (_t === null) {
        var i18n = new I18N();
        i18n.loadCatalog("widgets");
        _t = i18n.MessageFactory("widgets");
    }
    return _t(msgid, keywords);
};

export default translate;
