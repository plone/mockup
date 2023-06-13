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

    const okayFiles = ["xml", "js", "htm", "html"];
    const found = [];
    const checkFile = function (filepath) {
        const split = filepath.split(".");
        if (okayFiles.indexOf(split[split.length - 1]) === -1) {
            return;
        }
        console.log("reading file: " + filepath);
        const file = fs.readFileSync(filepath, { encoding: "utf-8" });
        const re = /_t\((("[^"]+")|('[^']+'))(,\W{.*})?\)?\)/g;
        let match = re.exec(file);
        while (match) {
            if (match) {
                re.lastIndex = Math.max(match.index + 1, re.lastIndex + 1);
                const val = match[1].replace(/['"]+/g, "");
                if (found.indexOf(val) === -1) {
                    output += `#: ${filepath}
msgid "${val}"
msgstr ""

`;
                    found.push(val);
                }
                match = re.exec(file);
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
