define([
  'jquery',
  'underscore',
  'backbone',
  'mockup-registry'
], function($, _, Backbone, registry) {

  var Page = Backbone.Model.extend({
    defaults: {
      title: '',
      description: ''
    },
    initialize: function() {
      this.set('content', this.getContent());
      if (this.get('attributes')) {
        var collection = new Attributes();
        collection.add(this.get('attributes'));
        this.set('attributes', collection);
      }
    },
    getContent: function() {
      return $('#page_'+this.get('id')).html();
    }
  });

  var Attribute = Backbone.Model.extend({
    defaults: {
      attribute: '',
      type: '',
      description: '',
      defaultValue: ''
    },
    initialize: function() {
      if (this.get('attributes')) {
        var collection = new Attributes();
        collection.add(this.get('attributes'));
        this.set('attributes', collection);
      }
    }
  });

  var Attributes = Backbone.Collection.extend({
    model: Attribute
  });

  var Pages = Backbone.Collection.extend({
    model: Page,
    comparater: function(model) {
      return model.get('title');
    }
  });

  var AttributeView = Backbone.View.extend({
    tagName: 'tr',
    tpl: $('#tpl_attribute').html(),
    render: function() {
      var self = this,
          attrs = '',
          tpl_options = {};
      if (self.model.get('attributes')) {
        attrs = $('<div />').append(new AttributesView({model: self.model.get('attributes')}).render().$el).html();
      }

      tpl_options.attrs = attrs;

      self.$el.html(_.template(self.tpl, _.extend(tpl_options,self.model.toJSON())));
      return self;
    }
  });

  var AttributesView = Backbone.View.extend({
    tagName: 'table',
    className: 'table',
    tpl: $('#tpl_attributes').html(),
    render: function() {
      this.$el.html(_.template(this.tpl, {}));
      _.each(this.model.models, function(model) {
        var view = new AttributeView({model: model});
        this.$el.find('> tbody').append(view.render().$el);
      }, this);
      return this;
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
      var examples = this.buildExamples();
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
        if ($(this).data().title !== undefined) {
          obj.title = $(this).data().title;
        }
        built.push(obj);
      });
      return built;
    },
    render: function() {
      var self = this;
      var tpl = $('#tpl_pattern').html();
      require(["mockup-patterns-"+self.model.get('id')], function (MainRouter) {
        self.$el.html(_.template(tpl, _.extend({
          examples: self.renderExamples()
        }, self.model.toJSON())));

        if (self.model.get('attributes')) {
          $('.docs-attributes', self.$el).append(new AttributesView({model: self.model.get('attributes')}).render().$el);
        }
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
      var modelJSON = self.model.toJSON();
      var builtreq = [];
      if($.isArray(modelJSON.requiredPatterns) && modelJSON.requiredPatterns.length > 0) {
        $.each(modelJSON.requiredPatterns, function(i, v) {
          builtreq.push('mockup-patterns-'+v);
        });
      }
      require(builtreq, function(MainRouter) {
        self.$el.html(_.template(tpl, modelJSON));
        registry.scan(self.$el);
      });
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
