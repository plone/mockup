import $ from "jquery";
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

export default Base.extend({
    name: "passwordstrength",
    trigger: ".pat-passwordstrength",
    parser: "mockup",
    defaults: {
        zxcvbn: "//cdnjs.cloudflare.com/ajax/libs/zxcvbn/1.0/zxcvbn.js",
    },
    init: function () {
        var self = this,
            // last jquery part: how to access the element? .el? .element? this?
            pwfield = this.$el[0],
            pwmeterContainer = document.createElement("div", {class: "progress mt-3"}),
            pwmeter = document.createElement("div", {class: "progress-bar", role: "progressbar"}),
            indicators = {1: "bg-danger", 2: "bg-warning", 3: "bg-info", 4: "bg-success"};

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
            pwmeter.className = "progress-bar " + indicators[score];
            pwmeter.setAttribute("style", "width: " + (25 * score) + "%");
        }

        pwmeter.setAttribute("aria-valuemin", "0");
        pwmeter.setAttribute("aria-valuemax", "100");
        pwmeterContainer.appendChild(pwmeter);
        pwmeterContainer.className = "progress mt-3";
        pwfield.parentNode.insertBefore(pwmeterContainer, pwfield.nextSibling);
        // todo: test without (i really do not want the check to delay just because i'm typing fast)
        //var timeoutId = 0;
        $(pwfield).on("keyup", function (e) {
            //clearTimeout(timeoutId);
            //timeoutId = setTimeout(setLevel, 500);
            setLevel();
        });
        setLevel();
    },
});
