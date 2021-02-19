define([
  'jquery',
  'underscore',
  'mockup-patterns-structure-url/js/views/tablerow',
  'text!mockup-patterns-structure-url/templates/table.xml',
  'mockup-ui-url/views/base',
  'mockup-patterns-datatables',
  'mockup-patterns-sortable',
  'mockup-patterns-moment',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-patterns-structure-url/js/views/actionmenu',
  'translate',
  'pat-registry',
  'bootstrap-alert'
], function($, _, TableRowView, TableTemplate, BaseView, patDataTables,
            Sortable, patMoment, Result, ActionMenuView, _t, registry) {
  'use strict';

  var TableView = BaseView.extend({
    tagName: 'div',
    template: _.template(TableTemplate),

    context_info_loaded_handler: function(event, data) {
      this.contextInfo = data;
      /* set default page info */
      this.setContextInfo();
    },

    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.collection = self.app.collection;
      self.selectedCollection = self.app.selectedCollection;
      self.listenTo(self.collection, 'sync', self.render);
      self.listenTo(self.selectedCollection, 'remove', self.render);
      self.listenTo(self.selectedCollection, 'reset', self.render);
      self.collection.pager();
      self.subsetIds = [];
      self.contextInfo = null;

      $('body')
        .off('context-info-loaded', this.context_info_loaded_handler.bind(this))
        .on('context-info-loaded', this.context_info_loaded_handler.bind(this));

      self.dateColumns = [
        'ModificationDate',
        'EffectiveDate',
        'CreationDate',
        'ExpirationDate',
        'start',
        'end',
        'last_comment_date'
      ];
    },
    events: {
      'click .fc-breadcrumbs a': 'breadcrumbClicked',
      'change .select-all': 'selectAll',
    },
    setContextInfo: function() {
      var self = this;
      var data = self.contextInfo;
      var $defaultPage = self.$('[data-id="' + data.defaultPage + '"]');
      if ($defaultPage.length > 0) {
        $defaultPage.addClass('default-page');
      }
      /* set breadcrumb title info */
      var crumbs = data.breadcrumbs;
      if (crumbs && crumbs.length) {
        var $crumbs = self.$('.fc-breadcrumbs a.crumb');
        _.each(crumbs, function(crumb, idx) {
          $crumbs.eq(idx).html(crumb.title);
        });
      }
    },
    render: function() {
      var self = this;

      // By default do not start sorted by any column
      // Ignore first column and the last one (activeColumns.length + 1)
      // Do not show paginator, search or information, we only want column sorting
      var datatables_options = {
        "aaSorting": [],
        "aoColumnDefs": [
          { "bSortable": false, "aTargets": [ 0, self.app.activeColumns.length + 2 ] }
        ],
        "paging": false,
        "searching": false,
        "info": false
      };

      // If options were passed from the pattern, override these ones
      $.extend(
        datatables_options, self.app.options.datatables_options
      );

      self.$el.html(self.template({
        _t: _t,
        pathParts: _.filter(
          self.app.getCurrentPath().split('/').slice(1),
          function(val) {
            return val.length > 0;
          }
        ),
        activeColumns: self.app.activeColumns,
        availableColumns: self.app.availableColumns,
        datatables_options: JSON.stringify(datatables_options)
      }));

      if (self.collection.length) {
        var container = self.$('tbody');
        self.collection.each(function(result) {
          self.dateColumns.map(function (col) {
            // empty column instead of displaying "None".
            if (result.attributes.hasOwnProperty(col) && (result.attributes[col] === 'None' || !result.attributes[col] )) {
              result.attributes[col] = '';
            }
          });

          var view = (new TableRowView({
            model: result,
            app: self.app,
            table: self
          })).render();
          container.append(view.el);
        });
      }
      self.moment = new patMoment(self.$el, {
        selector: '.' + self.dateColumns.join(',.'),
        format: self.options.app.momentFormat
      });

      if (self.app.options.moveUrl) {
        self.addReordering();
      }

      self.storeOrder();

      registry.scan(self.$el);

      self.$el.find("table").on( 'order.dt', function (e, settings, details) {
        var btn = $('<button type="button" class="btn btn-danger btn-xs"></button>')
                  .text(_t('Reset column sorting'))
                  .on('click', function(e) {
                    // Use column 0 to restore ordering and then empty list so it doesn't
                    // show the icon in the column header
                    self.$el.find("table.pat-datatables").data('patternDatatables').table
                        .order([ 0, "asc" ]).draw()
                        .order([]).draw();
                    // Restore reordering by drag and drop
                    self.addReordering();
                    // Clear the status message
                    self.app.clearStatus();
                  });
        self.app.setStatus({
          text: _t('Notice: Drag and drop reordering is disabled when viewing the contents sorted by a column.'),
          type: 'warning'
        }, btn, false, 'sorting_dndreordering_disabled');
        $(".pat-datatables tbody").find('tr').off("drag");
        self.$el.removeClass('order-support');
      });

      return this;
    },
    breadcrumbClicked: function(e) {
      e.preventDefault();
      var $el = $(e.target);
      if ($el[0].tagName !== 'A') {
        $el = $el.parent('a');
      }
      var path = '';
      $($el.prevAll('a').get().reverse()).each(function() {
        var part = $(this).attr('data-path');
        path += part;
        if (part !== '/') {
          path += '/';
        }
      });
      path += $el.attr('data-path');
      this.app.setCurrentPath(path);
      this.collection.currentPage = 1;
      this.collection.pager();
    },
    selectAll: function(e) {
      if ($(e.target).is(':checked')) {
        $('input[type="checkbox"]', this.$('tbody')).prop('checked', true).change();
      } else {
        /* delaying the re-rendering is much faster in this case */
        this.selectedCollection.remove(this.collection.models, { silent: true });
        this.selectedCollection.trigger('remove');
      }
      this.setContextInfo();
    },
    toggleSelectAll: function(e) {
      var $el = $(e.target);
      if (!$el.is(':checked')) {
        this.$('.select-all').prop('checked', false);
      }
    },
    addReordering: function() {
      var self = this;
      // if we have a custom query going on, we do not allow sorting.
      if (self.app.inQueryMode()) {
        self.$el.removeClass('order-support');
        return;
      }
      self.$el.addClass('order-support');
      var dd = new Sortable(self.$('tbody'), {
        selector: 'tr',
        createDragItem: function(pattern, $el) {
          var $tr = $el.clone();
          var $table = $('<table><tbody></tbody></table>');
          $('tbody', $table).append($tr);
          $table.addClass('structure-dragging')
            .css({opacity: 0.85, position: 'absolute'});
          $table.width($el.width());
          $table.height($el.height());
          $table.appendTo(document.body);
          return $table;
        },
        drop: function($el, delta) {
          if (delta !== 0){
            self.app.moveItem($el.attr('data-id'), delta, self.subsetIds);
            self.storeOrder();
          }
        }
      });
    },
    storeOrder: function() {
      var self = this;
      var subsetIds = [];
      self.$('tbody tr.itemRow').each(function() {
        subsetIds.push($(this).attr('data-id'));
      });
      self.subsetIds = subsetIds;
    }
  });

  return TableView;
});
