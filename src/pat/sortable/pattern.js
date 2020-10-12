/* Sortable pattern.
 *
 * Options:
 *    selector(string): Selector to use to draggable items in pattern ('li')
 *    dragClass(string): Class to apply to original item that is being dragged. ('item-dragging')
 *    cloneClass(string): Class to apply to cloned item that is dragged. ('dragging')
 *    drop(function, string): Callback function or name of callback function in global namespace to be called when item is dropped ('')
 *
 * Documentation:
 *    # Default
 *
 *    {{ example-1 }}
 *
 *    # Table
 *
 *    The patttern needs to be defined on the direct parent element of the elements to be sorted.
 *    Heads up: A <tbody> would be added to the table by browser automatically.
 *    The pattern needs to be defined on the <tbody> then.
 *
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <style type="text/css" media="screen">
 *      .item-dragging { background-color: red; }
 *      .dragging { background: green; }
 *    </style>
 *    <ul class="pat-sortable">
 *      <li>One</li>
 *      <li>Two</li>
 *      <li>Three</li>
 *    </ul>
 *
 * Example: example-2
 *    <table class="table table-stripped">
 *      <tbody class="pat-sortable" data-pat-sortable="selector:tr;">
 *        <tr>
 *          <td>One One</td>
 *          <td>One Two</td>
 *        </tr>
 *        <tr>
 *          <td>Two One</td>
 *          <td>Two Two</td>
 *        </tr>
 *        <tr>
 *          <td>Three One</td>
 *          <td>Three Two</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *
 */

define(["jquery", "pat-base", "sortable"], function ($, Base, Sortable) {
    "use strict";

    var SortablePattern = Base.extend({
        name: "sortable",
        trigger: ".pat-sortable",
        parser: "mockup",
        defaults: {
            selector: "li",
            dragClass: "item-dragging",
            cloneClass: "dragging",
            drop: undefined, // callback function or name of global function
        },
        init: function () {
            var sortable = new Sortable(this.$el[0], {
                draggable: this.options.selector,
                chosenClass: this.options.dragClass,
                dragClass: this.options.cloneClass,
                onEnd: function (e) {
                    var cb = this.options.drop;
                    if (!cb) {
                        return;
                    }
                    if (typeof cb === "string") {
                        cb = window[this.options.drop];
                    }
                    cb($(e.item), e.newIndex - e.oldIndex);
                }.bind(this),
            });
        },
    });

    return SortablePattern;
});
