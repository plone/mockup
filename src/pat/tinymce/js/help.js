/**
 * TinyMCE version 6.8.3 (2024-02-08)
 * Extracted from tinymce/plugins/help/plugin.js
 */

import tinymce from "tinymce/tinymce";
import shortcuts from "./help/shortcuts";
import { Cell, Optional } from "./help/utils";

(function () {
    "use strict";

    let unique = 0;
    const generate = (prefix) => {
        const date = new Date();
        const time = date.getTime();
        const random = Math.floor(Math.random() * 1000000000);
        unique++;
        return prefix + "_" + random + unique + String(time);
    };

    const get$1 = (customTabs) => {
        const addTab = (spec) => {
            var _a;
            const name =
                (_a = spec.name) !== null && _a !== void 0 ? _a : generate("tab-name");
            const currentCustomTabs = customTabs.get();
            currentCustomTabs[name] = spec;
            customTabs.set(currentCustomTabs);
        };
        return { addTab };
    };

    const registerCommand = (editor, dialogOpener) => {
        editor.addCommand("mceHelp", dialogOpener);
    };

    const option = (name) => (editor) => editor.options.get(name);
    const registerOption = (editor) => {
        editor.options.register("help_tabs", { processor: "array" });
    };
    const getHelpTabs = option("help_tabs");

    // Menu Item and Button
    const register = (editor, dialogOpener) => {
        editor.ui.registry.addButton("help", {
            icon: "help",
            tooltip: "Help",
            shortcut: "Alt+0",
            onAction: dialogOpener,
        });
        editor.ui.registry.addMenuItem("help", {
            text: "Help",
            icon: "help",
            shortcut: "Alt+0",
            onAction: dialogOpener,
        });
    };

    const hasProto = (v, constructor, predicate) => {
        var _a;
        if (predicate(v, constructor.prototype)) {
            return true;
        } else {
            return (
                ((_a = v.constructor) === null || _a === void 0 ? void 0 : _a.name) ===
                constructor.name
            );
        }
    };
    const typeOf = (x) => {
        const t = typeof x;
        if (x === null) {
            return "null";
        } else if (t === "object" && Array.isArray(x)) {
            return "array";
        } else if (
            t === "object" &&
            hasProto(x, String, (o, proto) => proto.isPrototypeOf(o))
        ) {
            return "string";
        } else {
            return t;
        }
    };

    const isType = (type) => (value) => typeOf(value) === type;
    const isString = isType("string");

    Optional.singletonNone = new Optional(false);

    const map = (xs, f) => {
        const len = xs.length;
        const r = new Array(len);
        for (let i = 0; i < len; i++) {
            const x = xs[i];
            r[i] = f(x, i);
        }
        return r;
    };

    const keys = Object.keys;
    const hasOwnProperty = Object.hasOwnProperty;
    const get = (obj, key) => {
        return has(obj, key) ? Optional.from(obj[key]) : Optional.none();
    };
    const has = (obj, key) => hasOwnProperty.call(obj, key);

    const cat = (arr) => {
        const r = [];
        const push = (x) => {
            r.push(x);
        };
        for (let i = 0; i < arr.length; i++) {
            arr[i].each(push);
        }
        return r;
    };

    // Keynav tab
    var tinymce_resource = tinymce.util.Tools.resolve('tinymce.Resource');
    var tinymce_i18n = tinymce.util.Tools.resolve('tinymce.util.I18n');
    const pLoadHtmlByLangCode = (baseUrl, langCode) => {
        Promise.resolve(import(`./help/i18n/keynav/${ langCode }.js`));
        return tinymce_resource.load(`tinymce.html-i18n.help-keynav.${ langCode }`, `./help/i18n/keynav/${ langCode }.js`);
    }
    const pLoadI18nHtml = baseUrl => pLoadHtmlByLangCode(baseUrl, tinymce_i18n.getCode()).catch(() => pLoadHtmlByLangCode(baseUrl, 'en'));
    const initI18nLoad = (editor, baseUrl) => {
      editor.on('init', () => {
        var lastIndex = baseUrl.lastIndexOf('/');
        var resourcesUrl = baseUrl.substring(0, lastIndex);
        pLoadI18nHtml(resourcesUrl);
      });
    };
    const pTab = async pluginUrl => {

        const body = {
            type: "htmlpanel",
            presets: "document",
            html: await pLoadI18nHtml(pluginUrl)
        };
        return {
            name: "keyboardnav",
            title: "Keyboard Navigation",
            items: [body],
        };
    };

    const convertText = (source) => {
        const isMac = tinymce.Env.os.isMacOS() || tinymce.Env.os.isiOS();
        const mac = {
            alt: "&#x2325;",
            ctrl: "&#x2303;",
            shift: "&#x21E7;",
            meta: "&#x2318;",
            access: "&#x2303;&#x2325;",
        };
        const other = {
            meta: "Ctrl ",
            access: "Shift + Alt ",
        };
        const replace = isMac ? mac : other;
        const shortcut = source.split("+");
        const updated = map(shortcut, (segment) => {
            const search = segment.toLowerCase().trim();
            return has(replace, search) ? replace[search] : segment;
        });
        return isMac ? updated.join("").replace(/\s/, "") : updated.join("+");
    };

    // Shortcuts Tab
    const getShortcuts = () => {
        const shortcutList = map(shortcuts, (shortcut) => {
            const shortcutText = map(shortcut.shortcuts, convertText).join(
                " " + tinymce.util.I18n.translate("or").toLocaleLowerCase() + " "
            );
            return [shortcut.action, shortcutText];
        });
        const tablePanel = {
            type: "table",
            header: ["Action", "Shortcut"],
            cells: shortcutList,
        };
        return {
            name: "shortcuts",
            title: "Handy Shortcuts",
            items: [tablePanel],
        };
    };

    const parseHelpTabsSetting = (tabsFromSettings, tabs) => {
        const newTabs = {};
        const names = map(tabsFromSettings, (t) => {
            var _a;
            if (isString(t)) {
                if (has(tabs, t)) {
                    newTabs[t] = tabs[t];
                }
                return t;
            } else {
                const name =
                    (_a = t.name) !== null && _a !== void 0 ? _a : generate("tab-name");
                newTabs[name] = t;
                return name;
            }
        });
        return {
            tabs: newTabs,
            names,
        };
    };
    const getNamesFromTabs = (tabs) => {
        const names = keys(tabs);
        const idx = names.indexOf("versions");
        if (idx !== -1) {
            names.splice(idx, 1);
            names.push("versions");
        }
        return {
            tabs,
            names,
        };
    };
    const pParseCustomTabs = async (editor, customTabs, pluginUrl) => {
        const shortcuts = getShortcuts();
        const nav = await pTab(pluginUrl);
        const tabs = {
            [shortcuts.name]: shortcuts,
            [nav.name]: nav,
            ...customTabs.get(),
        };
        return Optional.from(getHelpTabs(editor)).fold(
            () => getNamesFromTabs(tabs),
            (tabsFromSettings) => parseHelpTabsSetting(tabsFromSettings, tabs)
        );
    };
    const init = (editor, customTabs, pluginUrl) => () => {
        pParseCustomTabs(editor, customTabs, pluginUrl).then(({ tabs, names }) => {
            const foundTabs = map(names, (name) => get(tabs, name));
            const dialogTabs = cat(foundTabs);
            const body = {
                type: "tabpanel",
                tabs: dialogTabs,
            };
            editor.windowManager.open({
                title: "Help",
                size: "medium",
                body,
                buttons: [
                    {
                        type: "cancel",
                        name: "close",
                        text: "Close",
                        primary: true,
                    },
                ],
                initialData: {},
            });
        });
    };

    var Plugin = () => {
        tinymce.PluginManager.add("help", (editor, pluginUrl) => {
            const customTabs = new Cell({});
            const api = get$1(customTabs);
            registerOption(editor);
            const dialogOpener = init(editor, customTabs, pluginUrl);
            register(editor, dialogOpener);
            registerCommand(editor, dialogOpener);
            editor.shortcuts.add("Alt+0", "Open help dialog", "mceHelp");
            initI18nLoad(editor, pluginUrl);
            
            return api;
        });
    };
    tinymce.addI18n("es", {
        "Press {0} for help": "Pulse {0} para obtener la ayuda"
    })
    Plugin();
})();
