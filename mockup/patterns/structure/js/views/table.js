define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-patterns-structure-url/js/views/tablerow',
  'text!mockup-patterns-structure-url/templates/table.xml',
  'mockup-ui-url/views/base',
  'mockup-patterns-sortable',
  'mockup-patterns-moment',
  'mockup-patterns-structure-url/js/models/result',
  'mockup-patterns-structure-url/js/views/actionmenu',
  'translate'
], function($, _, Backbone, TableRowView, TableTemplate, BaseView, Sortable,
            Moment, Result, ActionMenu, _t) {
  'use strict';

  var TableView = BaseView.extend({
    tagName: 'div',
    template: _.template(TableTemplate),
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
      self.contextInfo = self.folderModel = self.folderMenu = null;

      self.app.on('context-info-loaded', function(data) {
        self.contextInfo = data;
        /* set default page info */
        self.setContextInfo();
      });
    },
    events: {
      'click .breadcrumbs a': 'breadcrumbClicked',
      'change .select-all': 'selectAll',
      'change .breadcrumbs-container input[type="checkbox"]': 'selectFolder'
    },
    setContextInfo: function() {
      var self = this;
      var data = self.contextInfo;
      var $defaultPage = self.$('[data-id="' + data.defaultPage + '"]');
      if ($defaultPage.length > 0) {
        $defaultPage.find('td.title').prepend('<span>*</span> ');
        $defaultPage.addClass('default-page');
      }
      /* set breadcrumb title info */
      var crumbs = data.breadcrumbs;
      if (crumbs && crumbs.length) {
        var $crumbs = self.$('.breadcrumbs a.crumb');
        _.each(crumbs, function(crumb, idx) {
          $crumbs.eq(idx).html(crumb.title);
        });
      }
      if (data.object){
        self.folderModel = new Result(data.object);
        $('.context-buttons', self.$el).show();
        if (self.selectedCollection.findWhere({UID: data.object.UID})){
          $('input[type="checkbox"]', self.$breadcrumbs)[0].checked = true;
        }
        self.folderMenu = new ActionMenu({
          app: self.app,
          model: self.folderModel,
          header: _t('Actions on current folder'),
          canMove: false
        });
        $('.input-group-btn', self.$breadcrumbs).empty().append(self.folderMenu.render().el);
      }else {
        self.folderModel = null;
      }
    },
    render: function() {
      var self = this;
      self.$el.html(self.template({
        _t: _t,
        pathParts: _.filter(
          self.app.queryHelper.getCurrentPath().split('/').slice(1),
          function(val) {
            return val.length > 0;
          }
        ),
        status: self.app.status,
        statusType: self.app.statusType,
        activeColumns: self.app.activeColumns,
        availableColumns: self.app.availableColumns
      }));
      self.$breadcrumbs = $('.breadcrumbs-container', self.$el);

      if (self.collection.length) {
        var container = self.$('tbody');
        self.collection.each(function(result) {
          var view = (new TableRowView({
            model: result,
            app: self.app,
            table: self
          })).render();
          container.append(view.el);
        });
      }

      self.moment = new Moment(self.$el, {
        selector: '.ModificationDate,.EffectiveDate,.CreationDate,.ExpirationDate',
        format: 'relative'
      });
      self.addReordering();
      self.storeOrder();
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
      this.app.queryHelper.currentPath = path;
      this.collection.pager();
    },
    selectFolder: function(e) {
      var self = this;
      if (self.folderModel){
        if ($(e.target).is(':checked')) {
          self.selectedCollection.add(self.folderModel);
        } else {
          this.selectedCollection.removeByUID(self.folderModel.attributes.UID);
        }
        self.setContextInfo();
      }
    },
    selectAll: function(e) {
      if ($(e.target).is(':checked')) {
        $('input[type="checkbox"]', this.$('tbody')).prop('checked', true).change();
      } else {
        this.selectedCollection.remove(this.collection.models);
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
        self.app.setStatus(_t('Can not order items while querying'));
        self.$el.removeClass('order-support');
        return;
      }
      self.$el.addClass('order-support');
      var dd = new Sortable(self.$('tbody'), {
        selector: 'tr',
        dragClass: 'structure-dragging',
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
      self.$('tbody tr.itemRow').each(function(idx) {
        subsetIds.push($(this).attr('data-id'));
      });
      self.subsetIds = subsetIds;
    }
  });

  return TableView;
});
