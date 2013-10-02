// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
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
  'underscore',
  'backbone',
  'js/patterns/structure/views/tablerow',
  'text!js/patterns/structure/templates/table.tmpl',
  'js/patterns/structure/views/contextmenu',
  'jquery.event.drag',
  'jquery.event.drop'
], function($, _, Backbone, TableRowView, TableTemplate, ContextMenu) {
  "use strict";

  var TableView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(TableTemplate),
    initialize: function(){
      this.app = this.options.app;
      this.collection = this.app.collection;
      this.selectedCollection = this.app.selectedCollection;
      this.listenTo(this.collection, 'sync', this.render);
      this.listenTo(this.selectedCollection, 'remove', this.render);
      this.listenTo(this.selectedCollection, 'reset', this.render);
      this.collection.pager();
      this.subset_ids = [];
    },
    events: {
      'click .breadcrumbs a': 'breadcrumbClicked',
      'change .select-all': 'selectAll',
      // 'change tbody input[type="checkbox"]': 'toggleSelectAll'
    },
    render: function() {
      var self = this;
      self.$el.html(self.template({
        path: self.app.queryHelper.getCurrentPath(),
        status: self.app.status,
        statusType: self.app.statusType
      }));

      self.contextMenu = (new ContextMenu({
        container: self,
        app: self.app
      })).render();
      self.$el.append(self.contextMenu.$el);

      if(self.collection.length){
        var container = self.$('tbody');
        self.collection.each(function(result){
          var view = (new TableRowView({
            model: result,
            app: self.app
          })).render();
          self.contextMenu.bind(view.$el);
          container.append(view.el);
        });
      }
      self.addReordering();
      self.storeOrder();
      return this;
    },
    breadcrumbClicked: function(e){
      e.preventDefault();
      var $el = $(e.target);
      this.app.queryHelper.currentPath = $el.attr('data-path');
      this.collection.pager();
    },
    selectAll: function(e) {
      if ($(e.target).is(':checked')) {
        $('input[type="checkbox"]', $('tbody')).attr('checked', 'checked').change();
      } else {
        this.selectedCollection.remove(this.collection.models);
      }
    },
    toggleSelectAll: function(e) {
      var $el = $(e.target);
      if (!$el.is(':checked')) {
        this.$('.select-all').removeAttr('checked');
      }
    },
    addReordering: function(){
      var self = this;
      // if we have a custom query going on, we do not allow sorting.
      if(self.app.inQueryMode()){
        self.app.setStatus('Can not order items while querying');
        self.$el.removeClass('order-support');
        return;
      }
      self.$el.addClass('order-support');
      var start = null;
      /* drag and drop reording support */
      self.$('tbody tr').drag('start', function(e, dd) {
        var dragged = this;
        $(dragged).addClass('structure-dragging');
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
          addClass('dragging').
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
        $el.removeClass('structure-dragging');
        $(dd.proxy).remove();
        self.app.moveItem($el.attr('data-id'), $el.index() - start, self.subset_ids);
        self.storeOrder();
      })
      .drop('init', function(e, dd ) {
        /*jshint eqeqeq:false */
        /* XXX Cannot use triple equals here */
        return (this == dd.drag) ? false: true;
      });
    },
    storeOrder: function(){
      var self = this;
      var subset_ids = [];
      self.$('tbody tr.itemRow').each(function(idx){
        subset_ids.push($(this).attr('data-id'));
      });
      self.subset_ids = subset_ids;
    }
  });

  return TableView;
});
