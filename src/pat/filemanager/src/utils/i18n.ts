// i18n bridge: route every user-facing string through the patternslib i18n
// singleton (the "widgets" domain, same catalog pat-structure uses). Keep the
// `${name}` placeholder syntax of core/i18n — keywords are substituted there.

// @ts-expect-error — core/i18n-wrapper is plain JS without type declarations.
import translate from "../../../../core/i18n-wrapper";

export function _t(msgid: string, keywords?: Record<string, unknown>): string {
    return translate(msgid, keywords);
}
