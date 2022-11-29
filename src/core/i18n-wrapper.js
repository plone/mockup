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
let _translation_domains = {
    "plone": null,
    "widgets": null,
};

const translate = function(domain, msgid, keywords) {
    if(_translation_domains[domain] === null) {
        var i18n = new I18N();
        i18n.loadCatalog(domain);
        _translation_domains[domain] = i18n.MessageFactory(domain);
    }
    return _translation_domains[domain](msgid, keywords);
};

const translate_widgets = function(msgid, keywords) {
    return translate("widgets", msgid, keywords);
};

const translate_plone = function(msgid, keywords) {
    return translate("plone", msgid, keywords);
};

// backwards compatibilty: "widgets" domain is default factory
export default translate_widgets;

// explicit export of translation domain factories
export {
    translate_widgets,
    translate_plone,
}
