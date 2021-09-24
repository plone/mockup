import Base from "@patternslib/patternslib/src/core/base";

function loadScript(src) {
    var s,
        i,
        scripts = document.getElementsByTagName("script");

    // Check script element doesn't already exist
    for (i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf(src) !== -1) {
            return;
        }
    }

    // If not, add it to page
    s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = src;
    scripts[0].parentNode.insertBefore(s, scripts[0]);
}
function htmlToElement(html) {
    var htmltmp = document.createElement('div');
    html = html.trim(); // Never return a text node of whitespace as the result
    htmltmp.innerHTML = html;
    return htmltmp.firstElementChild;
}

export default Base.extend({
    name: "passwordstrength",
    trigger: ".pat-passwordstrength",
    parser: "mockup",
    defaults: {
        zxcvbn: "//cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js",
    },
    init: function () {
        var self = this,
            pwfield = this.el,
            pwmeterContainer = htmlToElement('<div class="progress mt-3"><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div></div>'),
            pwmeter = pwmeterContainer.firstChild,
            indicators = {0: "bg-transparent", 1: "bg-danger", 2: "bg-warning", 3: "bg-warning", 4: "bg-success"};
        function setLevel() {
            var score = 0;

            if (typeof window.zxcvbn !== "function") {
                // No zxcvbn yet, try and load it
                loadScript(self.options.zxcvbn);
            } else if (pwfield.value.length > 0) {
                // Run zxcvbn, supplying the value of any other widgets in the form
                score = Math.max(
                    1,
                    window.zxcvbn(
                        pwfield.value,
                        [].map
                            .call(
                                (pwfield.form || { elements: [] }).elements,
                                function (inp) {
                                    if (inp === pwfield) {
                                        return null;
                                    }
                                    return inp.value || null;
                                }
                            )
                            .filter(function (x) {
                                return x;
                            })
                    ).score
                );
            }
            var wclass = "";
            if (score != 0 && typeof score !== 'undefined')
            {
                wclass = " w-" + (25 * score);
            }
            pwmeter.className = "progress-bar" + wclass + " " + indicators[score];
            pwmeter.setAttribute("aria-valuenow", 25 * score);
        }

        pwfield.parentNode.insertBefore(pwmeterContainer, pwfield.nextSibling);
        // set up key strokes to change the meter
        pwfield.onkeyup = function (e) {
            setLevel();
        };
        // initial setting
        setLevel();
    },
});
