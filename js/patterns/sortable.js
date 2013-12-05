/* Sortable pattern.
 *
 * Options:
 *    selector(string): Selector to use to draggable items in pattern ('li')
 *    dragClass(string): Class to apply to original item that is being dragged. ('item-dragging')
 *    cloneClass(string): Class to apply to cloned item that is dragged. ('dragging')
 *    drop(function): callback function for when item is dropped (null)
 *
 * Documentation:
 *    # Default
 *
 *    {{ example-1 }}
 *
 *    # Table
 *
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <ul class="pat-sortable">
 *      <li>One</li>
 *      <li>Two</li>
 *      <li>Three</li>
 *    </ul>
 *
 * Example: example-2
 *    <table class="table table-stripped pat-sortable"
 *           data-pat-sortable="selector:tr;">
 *      <tbody>
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
 * License:
 *    Copyright (C) 2010 Plone Foundation
 *
 *    This program is free software; you can redistribute it and/or modify it
 *    under the terms of the GNU General Public License as published by the
 *    Free Software Foundation; either version 2 of the License.
 *
 *    This program is distributed in the hope that it will be useful, but
 *    WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
 *    Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


define([
  'jquery',
  'mockup-patterns-base',
  'jquery.event.drag',
  'jquery.event.drop'
], function($, Base) {
  "use strict";

  var SortablePattern = Base.extend({
    name: "sortable",
    defaults: {
      selector: 'li',
      dragClass: 'item-dragging',
      cloneClass: 'dragging',
      drop: null // function to handle drop event
    },
    init: function() {
      var self = this;
      var start = 0;

      self.$el.find(self.options.selector).drag('start', function(e, dd) {
        var dragged = this;
        $(dragged).addClass(self.options.dragClass);
        $.drop({
          tolerance: function(event, proxy, target) {
            if($(target.elem).closest(self.$el).length === 0){
              /* prevent dragging conflict over another drag area */
              return;
            }
            var test = event.pageY > (target.top + target.height / 2);
            $.data(target.elem, "drop+reorder",
                   test ? "insertAfter" : "insertBefore" );
            return this.contains(target, [event.pageX, event.pageY]);
          }
        });
        start = $(this).index();
        return $( this ).clone().
          addClass(self.options.cloneClass).
          css({opacity: 0.75, position: 'absolute'}).
          appendTo(document.body);
      })
      .drag(function(e, dd) {
        /*jshint eqeqeq:false */
        $( dd.proxy ).css({
          top: dd.offsetY,
          left: dd.offsetX
        });
        var drop = dd.drop[0],
            method = $.data(drop || {}, "drop+reorder");
        /* XXX Cannot use triple equals here */
        if (method && drop && (drop != dd.current || method != dd.method)){
          $(this)[method](drop);
          dd.current = drop;
          dd.method = method;
          dd.update();
        }
      })
      .drag('end', function(e, dd) {
        var $el = $(this);
        $el.removeClass(self.options.dragClass);
        $(dd.proxy).remove();
        if(self.options.drop){
          self.options.drop($el, $el.index() - start);
        }
      })
      .drop('init', function(e, dd ) {
        /*jshint eqeqeq:false */
        /* XXX Cannot use triple equals here */
        return (this == dd.drag) ? false: true;
      });

    }
  });

  return SortablePattern;

});


