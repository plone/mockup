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

    render: function() {
      var self = this;
      var tpl = $('#tpl_page').html();
      require(["js/patterns/"+self.model.get('id')], function (MainRouter) {
        self.$el.html(_.template(tpl, self.model.toJSON()));
        registry.scan(self.$el);
      });
    }
  });

  var pages = new Pages();
/*
  pages.add([
    ,
    {id: 'cookiedirective', title: 'Cookie Directive', description: 'A pattern that checks cookies enabled and asks permission for the user to allow cookies or not.'},
    {id: 'expose', title: 'Expose', description: 'Exposes the focused element by darkening everything else on the page. Useful to focus the user attention on a particular area.'},
    {id: 'livesearch', title: 'Live Search', description: 'AJAX based customizable search functionality.'},
    {id: 'modal', title: 'Modal', description: 'Creates a modal dialog (also called overlay).'}
  ]);
*/

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