import "./modal";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";
import sinon from "sinon";

describe("Modal", function () {
    const registry_scan = async () => {
        registry.scan(document.body);
        await utils.timeout(2);
    };

    const mockJQueryAjax = () => {
        $.ajax.fail = jest.fn().mockImplementation(() => {
            return Promise.resolve("404");
        });
        $.ajax.always = jest.fn().mockImplementation(() => {
            return Promise.resolve("done");
        });
        $.ajax = jest.fn().mockImplementation((params) => {
            let fakeResponse = "404";
            if(params.url === "modal-form.html") {
                fakeResponse = `
                    <html>
                    <head></head>
                    <body>
                    <div id="content">
                    <h1>Modal with Form</h1>
                    <p>This modal contains a form.</p>
                    <form method="POST" action="/modal-submit.html">
                      <label for="name">Name:</label><input type="text" name="name" />
                      <div class="formControls">
                        <input type="submit" class="btn btn-primary" value="Submit" name="save" />
                      </div>
                    </form>
                    </body>
                    </html>`;
            }
            return {
                done: () => {
                    return {
                        fail: () => {
                            return {
                                always: () => {
                                    return fakeResponse;
                                }
                            }
                        }
                    }
                }
            }
        });
    };

    beforeEach(function() {
        mockJQueryAjax();

        document.body.innerHTML = `
          <div id="body1">
            <a class="pat-plone-modal" href="#target"
               data-pat-plone-modal="backdrop: #body1">
                Open
            </a>
            <div id="target" style="display:none;">Target</div>
          </div>
          <div id="body2">
            <a class="pat-plone-modal" />
          </div>
          <div id="body3">
            <a href="modal-form.html" class="pat-plone-modal" >Foo</a>
          </div>`;

        registry_scan();
    });

    afterEach(function () {
        document.body.innerHTML = "";
        $.ajax.mockClear();
    });

    it("1 - default behaviour", async function () {
        const $el = $("#body1");
        expect($(".modal-wrapper", $el).length).toEqual(0);
        expect($el.hasClass("backdrop-active")).toEqual(false);
        expect($(".modal-backdrop", $el).length).toEqual(0);
        expect($(".modal", $el).length).toEqual(0);

        $("a.pat-plone-modal", $el).trigger("click");
        await utils.timeout(1);

        expect($(".modal-backdrop", $el).length).toEqual(1);
        expect($el.hasClass("backdrop-active")).toEqual(true);
        expect($(".modal-wrapper", $el).is(":visible")).toEqual(true);
        expect($(".modal", $el).length).toEqual(1);
        expect($(".modal .modal-header", $el).length).toEqual(1);
        expect($(".modal .modal-body", $el).length).toEqual(1);
        expect($(".modal .modal-footer", $el).length).toEqual(1);

        var keydown = $.Event("keydown");
        keydown.keyCode = 27;
        $(document).trigger(keydown);
        expect($el.hasClass("backdrop-active")).toEqual(false);
        expect($(".modal", $el).length).toEqual(0);
    });

    it("2 - customize modal on show event", () => {
        const $el = $("#body1");

        $("a.pat-plone-modal", $el)
            .on("show.plone-modal.patterns", function (e) {
                var modal = $(this).data("pattern-plone-modal");
                $(".modal-header", modal.$modal).prepend($("<h3>New Title</h3>"));
            })
            .trigger("click");

        expect($(".modal .modal-header h3", $el).text()).toEqual("New Title");
    });

    it("3 - load modal content via ajax", () => {
        $('#body2 a.pat-plone-modal')
            .on("show.plone-modal.patterns", function (e) {
                expect(document.querySelectorAll(".modal-body").length).toEqual(1);
            })
            .trigger("click");
    });

    it("4 - redirects to base urls", function () {
        $('#body2 a.pat-plone-modal')
            .on("show.plone-modal.patterns", function (e) {
                var modal = $(this).data("pattern-plone-modal");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><head><base href="testurl1"></base></head></html>'
                    )
                ).toEqual("testurl1");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><head><base href="testurl2" /></head></html>'
                    )
                ).toEqual("testurl2");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><body data-base-url="testurl3" rubbish="discarded"></body></html>'
                    )
                ).toEqual("testurl3");
                expect(
                    modal.defaults.actionOptions.redirectToUrl(
                        "ignore",
                        '<html><body data-view-url="testurl4" rubbish="discarded"></body></html>'
                    )
                ).toEqual("testurl4");
            })
            .trigger("click");
    });

    it("5 - handles forms and form submits", function () {
        $('#body3 a.pat-plone-modal')
            .on("show.plone-modal.patterns", async function (e) {
                await utils.timeout(1);
                var $input = $(".pattern-modal-buttons").find("input");
                expect($input.length).toEqual(1);
                $input.trigger("click");
            })
            .on("formActionSuccess.plone-modal.patterns", async function () {
                await utils.timeout(1);
                expect($(".modal").length).toEqual(1);
                var title = $(".modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
            })
            .trigger("click");
    });

    it("6 - handles form submits with enter key", function () {
        $('<a href="modal-form.html" class="pat-plone-modal" >Foo</a>')
            .on("show.plone-modal.patterns", async function (e) {
                await utils.timeout(1);
                var event = $.Event("keydown");
                event.which = event.keyCode = 13;
                $(".modal form").trigger(event);
            })
            .on("formActionSuccess.plone-modal.patterns", async function () {
                var title = $(".modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
            })
            .trigger("click");
    });

    describe("7 - modal positioning (findPosition) ", function () {
        //
        // -- CHANGE POSITION ONLY ----------------------------------------------
        //
        it("7.1 - position: center middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .trigger("click");
        });
        it("7.2 - position: left middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.3 - position: right middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.4 - position: center top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .click();
        });
        it("7.5 - position: center bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .click();
        });
        it("7.6 - position: left top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.7 - position: left bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.8 - position: right top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 0, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.9 - position: right bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });

        //
        // -- NON-ZERO MARGIN ---------------------------------------------------
        //
        it("7.10 - position: center middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("7.11 - position: left middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("7.12 - position: right middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.13 - position: center top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("7.14 - position: center bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("7.15 - position: left top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("7.16 - position: left bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("7.17 - position: right top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 5, 340, 280, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.18 - position: right bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });

        //
        // -- WRAPPER SMALLER THAN MODAL ----------------------------------------
        //
        it("7.19 - position: center middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.20 - position: left middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.21 - position: right middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "middle",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.22 - position: center top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("center", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.23 - position: center bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.24 - position: left top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("left", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.25 - position: left bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("7.26 - position: right top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition("right", "top", 0, 450, 350, 400, 300);
                    expect(pos).not.toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("7.27 - position: right bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('#body2 a.pat-plone-modal')
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "bottom",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).toHaveProperty("bottom");
                    expect(pos).toHaveProperty("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).toHaveProperty("right");
                    expect(pos).toHaveProperty("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
    });
});
