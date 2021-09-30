import "./modal";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";


describe("Modal", function () {

    beforeEach(function () {
        $.ajax = jest.fn().mockImplementation(() => {
            console.log("AJAX call");
            const fakeResponse = "<html>" +
                "<head></head>" +
                "<body>" +
                '<div id="content">' +
                "<h1>Modal with Form</h1>" +
                "<p>This modal contains a form.</p>" +
                '<form method="POST" action="/modal-submit.html">' +
                '  <label for="name">Name:</label><input type="text" name="name" />' +
                '  <div class="formControls"> ' +
                '    <input type="submit" class="btn btn-primary" value="Submit" name="save" />' +
                "  </div>" +
                "</form>" +
                "</body>" +
                "</html>";
            return Promise.resolve(fakeResponse);
        });
    });

    afterEach(function () {
        $("body").empty();
        $.ajax.mockClear();
    });

    it("default behaviour", async function () {
        var $el = $(
            '<div id="body">' +
            ' <a class="pat-plone-modal" href="#target"' +
            '    data-pat-plone-modal="backdrop: #body">Open</a>' +
            ' <div id="target" style="display:none;">Target</div>' +
            '</div>'
        ).appendTo("body");

        registry.scan($el);
        await utils.timeout(1);

        expect($(".plone-modal-wrapper", $el).length).toEqual(0);
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        expect($(".plone-modal-backdrop", $el).length).toEqual(0);
        expect($(".plone-modal", $el).length).toEqual(0);

        $("a.pat-plone-modal", $el).trigger("click");
        await utils.timeout(1);

        expect($(".plone-modal-backdrop", $el).is(":visible")).toEqual(true);
        expect($el.hasClass("plone-backdrop-active")).toEqual(true);
        expect($(".plone-modal-wrapper", $el).is(":visible")).toEqual(true);
        expect($(".plone-modal", $el).length).toEqual(1);
        expect($(".plone-modal", $el).hasClass("in")).toEqual(true);
        expect($(".plone-modal .plone-modal-header", $el).length).toEqual(1);
        expect($(".plone-modal .plone-modal-body", $el).length).toEqual(1);
        expect($(".plone-modal .plone-modal-footer", $el).length).toEqual(1);

        var keydown = $.Event("keydown");
        keydown.keyCode = 27;
        $(document).trigger(keydown);
        expect($el.hasClass("plone-backdrop-active")).toEqual(false);
        expect($(".plone-modal", $el).length).toEqual(0);

        $el.remove();
    });

    it("customize modal on show event", function () {
        var $el = $(
            "" +
                '<div id="body">' +
                ' <a class="pat-plone-modal" href="#target"' +
                '    data-pat-plone-modal="backdrop: #body">Open</a>' +
                ' <div id="target">Target</div>' +
                "</div>"
        ).appendTo("body");

        $("a", $el)
            .patPloneModal()
            .on("show.plone-modal.patterns", function (e) {
                var modal = $(this).data("pattern-plone-modal");
                $(".plone-modal-header", modal.$modal).prepend(
                    $("<h3>New Title</h3>")
                );
            })
            .click();
        expect($(".plone-modal .plone-modal-header h3", $el).text()).toEqual(
            "New Title"
        );

        $el.remove();
    });

    it("load modal content via ajax", function (done) {
        $('<a class="pat-plone-modal" />')
            .patPloneModal()
            .on("show.plone-modal.patterns", function (e) {
                expect(true).toEqual(true);
                done();
            })
            .click();
    });

    it("redirects to base urls", function (done) {
        $('<a class="pat-plone-modal" />')
            .patPloneModal()
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
                done();
            })
            .click();
    });

    it("handles forms and form submits", function (done) {
        var server = this.server;
        $('<a href="modal-form.html" class="pat-plone-modal" >Foo</a>')
            .appendTo("body")
            .patPloneModal()
            .on("show.plone-modal.patterns", function (e) {
                var $input = $(".pattern-modal-buttons").find("input");
                expect($input.length).toEqual(1);
                $input.click();
                server.respond(); // XXX could not get autorespond to work
            })
            .on("formActionSuccess.plone-modal.patterns", function () {
                expect($(".plone-modal").hasClass("in")).toEqual(true);
                var title = $(".plone-modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
                done();
            })
            .click();
        server.respond(); // XXX could not get autorespond to work
    });

    it("handles form submits with enter key", function (done) {
        var server = this.server;
        $('<a href="modal-form.html" class="pat-plone-modal" >Foo</a>')
            .appendTo("body")
            .patPloneModal()
            .on("show.plone-modal.patterns", function (e) {
                var event = $.Event("keydown");
                event.which = event.keyCode = 13;
                $(".plone-modal form").trigger(event);
                server.respond();
            })
            .on("formActionSuccess.plone-modal.patterns", function () {
                var title = $(".plone-modal-header").find("h2").text();
                expect(title).toEqual("Form submitted");
                done();
            })
            .click();
        server.respond();
    });

    describe("modal positioning (findPosition) ", function () {
        //
        // -- CHANGE POSITION ONLY ----------------------------------------------
        //
        it("position: center middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .click();
        });
        it("position: left middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: right middle, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 0 = 150 - 140 = 10
                    expect(pos.top).toEqual("10px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: center top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "top",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .click();
        });
        it("position: center bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 0 = 200 - 170 = 30
                    expect(pos.left).toEqual("30px");
                    done();
                })
                .click();
        });
        it("position: left top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "top",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: left bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: right top, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "top",
                        0,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: right bottom, margin: 0, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });

        //
        // -- NON-ZERO MARGIN ---------------------------------------------------
        //
        it("position: center middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("position: left middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("position: right middle, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    // half wrapper height - half modal height - margin
                    // 300/2 - 280/2 - 5 = 150 - 140 - 5 = 5
                    expect(pos.top).toEqual("5px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: center top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "top",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("position: center bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    // half wrapper width - half modal width - margin
                    // 400/2 - 340/2 - 5 = 200 - 170 - 5 = 25
                    expect(pos.left).toEqual("25px");
                    done();
                })
                .click();
        });
        it("position: left top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "top",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("position: left bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("5px");
                    done();
                })
                .click();
        });
        it("position: right top, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "top",
                        5,
                        340,
                        280,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("5px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: right bottom, margin: 5, modal: 340x280, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("5px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("5px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });

        //
        // -- WRAPPER SMALLER THAN MODAL ----------------------------------------
        //
        it("position: center middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: left middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: right middle, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: center top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "center",
                        "top",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: center bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: left top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "left",
                        "top",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: left bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).not.to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.left).toEqual("0px");
                    done();
                })
                .click();
        });
        it("position: right top, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
                .on("show.plone-modal.patterns", function (e) {
                    var modal = $(this).data("pattern-plone-modal");
                    var pos = modal.findPosition(
                        "right",
                        "top",
                        0,
                        450,
                        350,
                        400,
                        300
                    );
                    expect(pos).not.to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.top).toEqual("0px");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
        it("position: right bottom, margin: 0, modal: 450x350, wrapper: 400x300", function (done) {
            $('<a href="#"/>')
                .patPloneModal()
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
                    expect(pos).to.have.property("bottom");
                    expect(pos).to.have.property("top");
                    expect(pos.bottom).toEqual("0px");
                    expect(pos.top).toEqual("auto");

                    expect(pos).to.have.property("right");
                    expect(pos).to.have.property("left");
                    expect(pos.right).toEqual("0px");
                    expect(pos.left).toEqual("auto");
                    done();
                })
                .click();
        });
    });

});
