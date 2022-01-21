import "./upload";
import $ from "jquery";
import registry from "@patternslib/patternslib/src/core/registry";
import utils from "@patternslib/patternslib/src/core/utils";

describe("Upload", function () {
    describe("Div", function () {
        beforeEach(function () {
            this.$el = $(`
                    <div>
                      <div class="pat-upload"
                        data-pat-upload="url: /upload">
                      </div>
                    </div>
            `).appendTo("body");
        });
        afterEach(function () {
            this.$el.remove();
        });

        it("default attributes", async function () {
            expect($(".pat-upload", this.$el).hasClass("upload")).toEqual(false);
            expect($(".upload-area", this.$el).length).toEqual(0);
            expect($(".dz-message", this.$el).length).toEqual(0);
            // initialize pattern
            registry.scan(this.$el);
            await utils.timeout(1);
            expect($(".pat-upload", this.$el).hasClass("upload")).toEqual(true);
            expect($(".upload-area", this.$el).length).toEqual(1);
            expect($(".upload-area", this.$el).hasClass("dz-clickable")).toEqual(
                true
            );
            expect($(".dz-message", this.$el).length).toEqual(1);
            expect($(".dz-message", this.$el).hasClass("dz-default")).toEqual(
                false
            );
            expect($(".dz-message p", this.$el).html()).toEqual(
                "Drop files here..."
            );
        });
        it("change className data option", async function () {
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; className: drop-zone"
            );
            registry.scan(this.$el);
            await utils.timeout(1);
            expect($(".pat-upload", this.$el).hasClass("drop-zone")).toEqual(
                true
            );
        });
        it("update clickable data option to false", async function () {
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; clickable: false"
            );
            registry.scan(this.$el);
            await utils.timeout(1);
            expect($(".pat-upload", this.$el).hasClass("dz-clickable")).toEqual(
                false
            );
        });
        it("update wrap data option to true", async function () {
            expect(
                $(".pat-upload", this.$el).parent().hasClass("upload-wrapper")
            ).toEqual(false);
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; wrap: true"
            );
            registry.scan(this.$el);
            await utils.timeout(1);
            expect(
                $(".pat-upload", this.$el).parent().hasClass("upload-wrapper")
            ).toEqual(true);
        });
        it("update autoCleanResults data option to true", function () {
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; autoCleanResults: true"
            );
            registry.scan(this.$el);
            //TODO
        });
    });
});
