require([
  'jquery',
  'jam/Patterns/src/registry',
  'underscore',
  'backbone',
  'js/patterns/livesearch'
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

    render: function() {
      var tpl = $('#tpl_page').html();
      this.$el.html(_.template(tpl, this.model.toJSON()));
      registry.scan(this.$el);
    }
  });

  var pages = new Pages();

  pages.add([
    {id: 'livesearch', title: 'Live Search', description: 'AJAX based customizable search functionality.'}
  ]);

  App = {};

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
      var page = pages.get(page_id);
      if (page) {
        var view = new PageView({model: page});
        view.setElement($('#content'));
        this.show(view);
      }
    },

    show: function(view) {
      if (App.view !== undefined) {
        App.view.remove();
        delete App.view;
      }
      App.view = view;
      App.view.render();
    }
  });

  _.extend(App, Backbone.Events);
  App.router = new Router();
  App.initialize = function() {
    Backbone.history.start({pushState: false});
    return App;
  };

  $(document).ready(function() {
    App.initialize();
  });

});