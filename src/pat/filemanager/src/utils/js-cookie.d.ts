// Minimal ambient declaration for js-cookie v3. The installed package ships no
// types and there is no @types/js-cookie in this repo, so this covers just the
// subset the filemanager uses (get/set/remove).
declare module "js-cookie" {
    export interface CookieAttributes {
        expires?: number | Date;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: "strict" | "lax" | "none" | "Strict" | "Lax" | "None";
        [property: string]: unknown;
    }

    interface CookiesStatic {
        get(): { [key: string]: string };
        get(name: string): string | undefined;
        set(name: string, value: string, options?: CookieAttributes): string | undefined;
        remove(name: string, options?: CookieAttributes): void;
    }

    const Cookies: CookiesStatic;
    export default Cookies;
}
