// i18n bridge: route every user-facing string through the patternslib i18n
// singleton (the "widgets" domain, same catalog pat-structure uses). Keep the
// `${name}` placeholder syntax of core/i18n — keywords are substituted there.

// @ts-expect-error — core/i18n-wrapper is plain JS without type declarations.
import translate, { translate_plone } from "../../../../core/i18n-wrapper";

export function _t(msgid: string, keywords?: Record<string, unknown>): string {
    return translate(msgid, keywords);
}

// Translate via the "plone" domain instead of "widgets". Use for values whose
// catalog lives in Plone core, not the widgets bundle — review-state titles
// (e.g. "published" -> "Veröffentlicht"). Mirrors pat-structure's
// translate_plone for its translatableColumns (review_state).
export function _tp(msgid: string, keywords?: Record<string, unknown>): string {
    return translate_plone(msgid, keywords);
}
