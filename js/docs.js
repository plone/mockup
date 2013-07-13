define([
  'jquery',
  'jam/Patterns/src/registry',
  'underscore',
  'backbone'
], function($, registry, _, Backbone) {

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
    model: Page
  });

  var PageView = Backbone.View.extend({
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
      var tpl = $('#tpl_page').html();
      require(["js/patterns/"+self.model.get('id')], function (MainRouter) {
        self.$el.html(_.template(tpl, _.extend({
          examples: self.renderExamples()
        }, self.model.toJSON())));
        registry.scan(self.$el);
      });
    }
  });

  App = {
    pages: new Pages(),
    initialize: function() {
      Backbone.history.start({pushState: false});
      return App;
    },
    show: function(view) {
      if (this.view !== undefined) {
        this.view.remove();
        delete this.view;
      }
      this.view = view;
      this.view.render();
    },
    add: function(page) {
      this.pages.add(page);
    }
  };

  var Router = Backbone.Router.extend({
    routes: {
      '(:id)': 'page'
    },

    page: function(id) {
      var page_id;
      if (id) {
        page_id = id;
      } else {
        page_id = ''; // Default page
      }
      var page = App.pages.get(page_id);
      if (page) {
        var view = new PageView({model: page});
        view.setElement($('#content'));
        App.show(view);
      }
    }
  });

  _.extend(App, Backbone.Events);
  App.router = new Router();

  return App;

});