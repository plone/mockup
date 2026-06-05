const fs = require("fs");

const extract = () => {
    let output = `# Gettext Message File for Plone mockup
msgid ""
msgstr ""
"Project-Id-Version: mockup\\n"
"Last-Translator: Plone i18n <plone-i18n@lists.sourceforge.net>\\n"
"Language-Team: Plone i18n <plone-i18n@lists.sourceforge.net>\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=1; plural=0;\\n"
"Language-Code: en\\n"
"Language-Name: English\\n"
"Preferred-Encodings: utf-8\\n"
"Domain: widgets\\n"

`;

    // ".svelte.ts" / ".ts" share the "ts" extension; covering it picks up
    // store modules like ListInteractions.svelte.ts.
    const okayFiles = ["xml", "js", "ts", "htm", "html", "svelte"];
    const found = [];
    const checkFile = function (filepath) {
        const split = filepath.split(".");
        if (okayFiles.indexOf(split[split.length - 1]) === -1) {
            return;
        }
        console.log("reading file: " + filepath);
        const file = fs.readFileSync(filepath, { encoding: "utf-8" });
        // Match the translation call with optional whitespace/newlines before
        // the first string argument (multiline calls), and allow escaped quotes
        // inside the string so embedded quotes in a msgid survive extraction.
        const re = /_t\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
        let match;
        while ((match = re.exec(file))) {
            const raw = match[1];
            const quote = raw[0];
            // Strip only the surrounding quotes, then unescape any escaped
            // surrounding-quote chars to recover the literal runtime msgid.
            const val = raw
                .slice(1, -1)
                .replace(new RegExp("\\\\" + quote, "g"), quote);
            if (found.indexOf(val) === -1) {
                // gettext .po msgids must escape backslashes and double quotes.
                const escaped = val
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"');
                output += `#: ${filepath}
msgid "${escaped}"
msgstr ""

`;
                found.push(val);
            }
        }
    };
    const checkDir = function (path) {
        console.log("Read folder: " + path);
        const files = fs.readdirSync(path);
        for (const filename of files) {
            if (
                filename === "__pycache__" ||
                filename === "build" ||
                filename === "coverage" ||
                filename === "less" ||
                filename === "node_modules" ||
                filename === "tests"
            ) {
                return;
            }
            const stats = fs.statSync(path + filename);
            if (stats.isDirectory()) {
                checkDir(path + filename + "/");
            } else {
                checkFile(path + filename);
            }
        }
    };
    checkDir("./src/");
    fs.writeFileSync("./widgets.pot", output);
};

extract();
