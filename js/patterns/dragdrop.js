// drag and drop support.
//
// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//


define([
  'jquery',
  'mockup-patterns-base',
  'jquery.event.drag',
  'jquery.event.drop'
], function($, Base) {
  "use strict";

  var DragDropPattern = Base.extend({
    name: "dragdrop",
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
        if (drop && (drop != dd.current || method != dd.method)){
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

  return DragDropPattern;

});


