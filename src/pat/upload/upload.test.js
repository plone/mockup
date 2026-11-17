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
            expect($(".upload-area", this.$el).hasClass("dz-clickable")).toEqual(true);
            expect($(".dz-message", this.$el).length).toEqual(1);
            expect($(".dz-message", this.$el).hasClass("dz-default")).toEqual(false);
            expect($(".dz-message p", this.$el).html()).toEqual("Drop files here...");
        });
        it("change className data option", async function () {
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; className: drop-zone"
            );
            registry.scan(this.$el);
            await utils.timeout(1);
            expect($(".pat-upload", this.$el).hasClass("drop-zone")).toEqual(true);
        });
        it("update clickable data option to false", async function () {
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr(
                "data-pat-upload",
                attr + "; clickable: false"
            );
            registry.scan(this.$el);
            await utils.timeout(1);
            expect($(".pat-upload", this.$el).hasClass("dz-clickable")).toEqual(false);
        });
        it("update wrap data option to true", async function () {
            expect(
                $(".pat-upload", this.$el).parent().hasClass("upload-wrapper")
            ).toEqual(false);
            var attr = $(".pat-upload", this.$el).attr("data-pat-upload");
            $(".pat-upload", this.$el).attr("data-pat-upload", attr + "; wrap: true");
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

    describe("Queue", function () {
        const queueFile = (pattern) => {
            const file = new File(["content"], "report.txt", { type: "text/plain" });
            pattern.dropzone.addFile(file);
            return file;
        };

        beforeEach(function () {
            // show and hide at once
            $.fx.off = true;
        });
        afterEach(function () {
            $.fx.off = false;
            document.body.innerHTML = "";
        });

        it("shows the controls only while files are queued", async function () {
            document.body.innerHTML = `
                <div class="pat-upload" data-pat-upload="url: /upload"></div>
            `;
            const el = document.querySelector(".pat-upload");
            registry.scan(document.body);
            await utils.timeout(1);
            const pattern = el["pattern-upload"];
            const controls = el.querySelector(".controls");

            // hidden by the template itself, not by the stylesheet
            expect(controls.style.display).toEqual("none");

            const file = queueFile(pattern);
            await utils.timeout(100);
            expect(controls.style.display).not.toEqual("none");
            expect(controls.querySelector("button.upload-all")).toBeTruthy();

            pattern.dropzone.removeFile(file);
            await utils.timeout(100);
            expect(controls.style.display).toEqual("none");
        });

        it("offers the path selection before a file is queued", async function () {
            document.body.innerHTML = `
                <div class="pat-upload"
                     data-pat-upload='{"baseUrl": "/", "relativePath": "upload"}'></div>
            `;
            const el = document.querySelector(".pat-upload");
            registry.scan(document.body);
            await utils.timeout(1);

            const path = el.querySelector(".path");
            expect(path.querySelector("input[name=location]")).toBeTruthy();
            expect(path.closest(".controls")).toBe(null);
        });

        it("has no path selection without path based URLs", async function () {
            document.body.innerHTML = `
                <div class="pat-upload" data-pat-upload="url: /upload"></div>
            `;
            const el = document.querySelector(".pat-upload");
            registry.scan(document.body);
            await utils.timeout(1);

            expect(el.querySelector(".path")).toBe(null);
            expect(el.querySelector("input[name=location]")).toBe(null);
        });
    });
});
