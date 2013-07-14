define([
  'jquery',
  'underscore',
  'backbone',
  './registry.js'
], function($, _, Backbone, registry) {

  var Page = Backbone.Model.extend({
    defaults: {
      title: '',
      description: ''
    },
    initialize: function() {
      this.set('content', this.getContent());
    },
    getContent: function() {
      return $('#page_'+this.get('id')).html();
    }
  });

  var Pages = Backbone.Collection.extend({
    model: Page,
    comparater: function(model) {
      return model.get('title');
    }
  });

  var PatternView = Backbone.View.extend({
    initialize: function() {
      this.exampleClass = 'example-' + this.model.get('id');
      this.$examples = $('script.'+this.exampleClass);
    },
    renderExamples: function() {
      var tpl = $('#tpl_example').html();
      var html = '';
      examples = this.buildExamples();
      _.each(examples, function(example) {
        html += _.template(tpl, example);
      }, this);
      return html;
    },
    buildExamples: function() {
      var self = this,
          built = [];
      self.$examples.each(function() {
        var obj = {
          title: ''
        };
        obj.html = $(this).html();
        obj.pre = _.escape(obj.html);
        if ($(this).data().title !== undefined) obj.title = $(this).data().title;
        built.push(obj);
      });
      return built;
    },
    render: function() {
      var self = this;
      var tpl = $('#tpl_pattern').html();
      require(["js/patterns/"+self.model.get('id')], function (MainRouter) {
        self.$el.html(_.template(tpl, _.extend({
          examples: self.renderExamples()
        }, self.model.toJSON())));
        registry.scan(self.$el);
      });
      return this;
    }
  });

  var PatternsItemView = Backbone.View.extend({
    className: 'media',
    tpl: $('#tpl_patterns_list_item').html(),
    render: function() {
      this.$el.html(_.template(this.tpl, this.model.toJSON()));
      return this;
    }
  });

  var PatternsListView = Backbone.View.extend({
    className: 'docs-patterns',
    tpl: $('#tpl_patterns_list').html(),
    children: [],
    render: function() {
      this.$el.html(_.template(this.tpl, {}));
      _.each(this.model.models, function(model) {
        var view = new PatternsItemView({model: model});
        this.children.push(view);
        this.$el.append(view.render().$el);
      }, this);
      return this;
    },
    remove: function() {
      _.each(this.children, function(view) {
        view.remove();
      });
      Backbone.View.prototype.remove.apply(this);
    }
  });

  var PageView = Backbone.View.extend({
    render: function() {
      var self = this;
      var tpl = $('#tpl_page').html();
      self.$el.html(_.template(tpl, self.model.toJSON()));
      registry.scan(self.$el);
      return this;
    }
  });

  App = {
    patterns: new Pages(),
    pages: new Pages(),
    initialize: function() {
      this.detectUrl();
      Backbone.history.start({pushState: false, root: App.urlRoot});
      return App;
    },
    show: function(view) {
      if (this.view !== undefined) {
        this.view.remove();
        delete this.view;
      }
      this.view = view;
      $('#content').html(this.view.render().$el);
    },
    detectUrl: function () {
      var path = window.location.pathname.split('/'),
        rootUrl = '';
      if (!this.urlRoot) {
        _.each(path, function (pathEntry, index) {
          if (index < path.length - 1) {
            rootUrl += pathEntry + '/';
          }
        });
        this.urlRoot = rootUrl + 'index.html';
      }
    }
  };

  var Router = Backbone.Router.extend({
    routes: {
      'patterns/(:id)': 'pattern',
      'patterns': 'patterns',
      '': 'patterns',
      ':id': 'page'
    },

    patterns: function() {
      var view = new PatternsListView({model: App.patterns});
      App.show(view);
    },

    page: function(id) {
      this.resolve('page', App.pages, id);
    },

    pattern: function(id) {
      this.resolve('pattern', App.patterns, id);
    },

    resolve: function(type, collection, id) {
      var page_id;
      if (id) {
        page_id = id;
      } else {
        page_id = ''; // Default page
      }
      var page = collection.get(page_id);
      if (page) {
        var view;
        view = type === 'page' ? new PageView({model: page}) : new PatternView({model: page});
        App.show(view);
      }
    }
  });

  _.extend(App, Backbone.Events);
  App.router = new Router();

  return App;

});
