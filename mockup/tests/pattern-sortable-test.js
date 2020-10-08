define([
  "expect",
  "jquery",
  "pat-registry",
  "mockup-patterns-sortable",
], function (expect, $, registry, Pattern) {
  "use strict";

  window.mocha.setup("bdd");
  $.fx.off = true;

  /* ==========================
   TEST: Toggle
  ========================== */

  describe("Sortable", function () {
    beforeEach(function () {
      this.$el = $(
        "" +
          '<ul class="pat-sortable">' +
          "<li>One</li>" +
          "<li>Two</li>" +
          "<li>Three</li>" +
          "</ul>"
      ).appendTo("body");
    });

    afterEach(function () {
      this.$el.remove();
    });

    it.skip("adds class on drag start", function (done) {
      // TODO: don't get it to run.
      // See: https://github.com/SortableJS/sortablejs/issues/735#issuecomment-290439229

      var sortable = new Pattern(this.$el);
      var $todrag = this.$el.find("li").eq(0);
      var $todrop = this.$el.find("li").eq(2);

      var start = $todrag.offset();
      var end = $todrop.offset();

      var mousedown = new Event("mousedown", { cancelable: true });
      var dragstart = new Event("dragstart", { cancelable: true });

      mousedown.clientX = dragstart.clientX = start.left + 1;
      mousedown.clientY = dragstart.clientY = start.top + 1;
      mousedown.screnX = dragstart.screenX = start.left + 5;
      mousedown.screnY = dragstart.screenY = start.left + 95;

      var drag = new Event("drag", { cancelable: true });
      var dragover = new Event("dragover", { cancelable: true });
      var drop = new Event("drop", { cancelable: true });
      var mouseup = new Event("mouseup", { cancelable: true });

      drag.clientX = dragover.clientX = drop.clientX = mouseup.clientX = end.left + 1; // prettier-ignore
      drag.clientY = dragover.clientY = drop.clientY = mouseup.clientY = end.top + 1; // prettier-ignore
      drag.screenX = dragover.screenX = drop.screenX = mouseup.screenX = end.left + 5; // prettier-ignore
      drag.screenY = dragover.screenY = drop.screenY = mouseup.screenY = end.left + 95; // prettier-ignore

      var el = this.$el[0];
      var todrag = $todrag[0];
      var todrop = $todrop[0];

      el.dispatchEvent(mousedown);
      setTimeout(
        function () {
          todrag.dispatchEvent(dragstart);
          setTimeout(
            function () {
              todrag.dispatchEvent(drag);
              setTimeout(
                function () {
                  todrop.dispatchEvent(dragover);
                  setTimeout(
                    function () {
                      todrag.dispatchEvent(drop);
                      setTimeout(
                        function () {
                          todrag.dispatchEvent(mouseup);
                          setTimeout(function () {}, 50);
                          console.log(el.outerHTML);
                          expect(
                            $todrag.hasClass(sortable.options.dragClass)
                          ).to.equal(true);
                          done();
                        }.bind(this),
                        50
                      );
                    }.bind(this),
                    50
                  );
                }.bind(this),
                50
              );
            }.bind(this),
            50
          );
        }.bind(this),
        50
      );
    });
  });
});
