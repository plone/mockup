/* Resource Registry pattern.
 *
 * Options:
 *    bundles(object): object with all bundles ({})
 *    resources(object): object with all resources ({})
 *    javascripts(object): object with all legacy type javascripts ({})
 *    css(object): object with all legacy type css ({}) 
 *    overrides(array): List of current overrides ([])
 *    managerUrl(string): url to handle manage actions(null)
 *    baseUrl(string): to render resources from(null)
 *    lesscUrl(string): url to lessc to load for compiling less(null)
 *    rjsUrl(string): url to lessc to load for compiling less(null)
 *    lessvariables(object): group of settings that can be configured({})
 *
 *
 * Documentation:
 *    # Defaults
 *
 *    {{ example-1 }}
 *
 *
 * Example: example-1
 *    <div class="pat-resourceregistry"
 *        data-pat-resourceregistry='{"bundles":{
 *                                     "plone": {
 *                                       "resources": ["plone"], "depends": "",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     },
 *                                     "plone-auth": {
 *                                       "resources": ["plone-auth"], "depends": "plone",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     },
 *                                     "barceloneta": {
 *                                       "resources": ["barceloneta"], "depends": "*",
 *                                       "expression": "", "enabled": true, "conditionalcomment": ""
 *                                     }
 *                                   },
 *                                   "resources": {
 *                                     "plone": {
 *                                       "url": "js/bundles", "js": "plone.js",
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "plone-auth": {
 *                                       "url": "js/bundles", "js": "plone-auth.js",
 *                                       "css": [], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "barceloneta": {
 *                                       "url": "js/bundles", "js": "barceloneta.js",
 *                                       "css": ["barceloneta.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "modal": {
 *                                       "url": "patterns/modal", "js": "pattern.js",
 *                                       "css": ["pattern.modal.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": false
 *                                     },
 *                                     "autotoc": {
 *                                       "url": "patterns/autotoc", "js": "pattern.js",
 *                                       "css": ["pattern.autotoc.less", "pattern.other.less"],
 *                                       "deps": "", "export": "", "conf": ""
 *                                     },
 *                                     "pickadate": {
 *                                       "url": "patterns/pickadate", "js": "pattern.js",
 *                                       "css": ["pattern.pickadate.less"], "deps": "", "export": "",
 *                                       "conf": "", "force": true
 *                                     }
 *                                   },
 *                                   "lessvariables": {
 *                                     "foo": "bar"
 *                                   },
 *                                   "overrides": ["patterns/pickadate/pattern.js"],
 *                                   "baseUrl": "/resources-registry",
 *                                   "manageUrl": "/registry-manager",
 *                                   "lessUrl": "node_modules/less/dist/less-1.7.4.min.js",
 *                                   "lessConfigUrl": "tests/files/lessconfig.js",
 *                                   "rjsUrl": "tests/files/r.js"}'>
 *    </div>
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
  'underscore',
  'mockup-ui-url/views/base',
  'mockup-utils',
  'mockup-patterns-resourceregistry-url/js/less',
  'mockup-patterns-resourceregistry-url/js/overrides',
  'mockup-patterns-resourceregistry-url/js/registry',
], function($, Base, _, BaseView, utils, LessVariablesView, OverridesView, RegistryView) {
  'use strict';


  var TabView = BaseView.extend({
    tagName: 'div',
    activeTab: 'registry',
    template: _.template('' +
      '<ul class="main-tabs nav nav-tabs" role="tablist">' +
        '<li class="registry-btn"><a href="#">Registry</a></li>' +
        '<li class="overrides-btn"><a href="#">Overrides</a></li>' +
        '<li class="lessvariables-btn"><a href="#">Less Variables</a></li>' +
      '</div>' +
      '<div class="tab-content" />'
    ),
    events: {
      'click .registry-btn a': 'hideShow',
      'click .overrides-btn a': 'hideShow',
      'click .lessvariables-btn a': 'hideShow'
    },
    hideShow: function(e){
      var self = this;
      if(e !== undefined){
        e.preventDefault();
        self.activeTab = $(e.target).parent()[0].className.replace('-btn', '');
      }
      self.$('.main-tabs > li').removeClass('active');
      self.$content.find('.tab-pane').removeClass('active');
      self.tabs[self.activeTab].btn.addClass('active');
      self.tabs[self.activeTab].content.addClass('active');
    },
    initialize: function(options) {
      var self = this;
      BaseView.prototype.initialize.apply(self, [options]);
      self.registryView = new RegistryView({
        data: options,
        tabView: self});
      self.overridesView = new OverridesView({
        data: options,
        tabView: self});
      self.lessvariablesView = new LessVariablesView({
        data: options,
        tabView: self});
      self.tabs = {};
    },

    render: function(){
      var self = this;
      self.$el.append(self.template());
      self.loading = new utils.Loading();
      self.$tabs = self.$('ul.main-tabs');
      self.$content = self.$('.tab-content');
      self.$content.append(self.registryView.render().el);
      self.$content.append(self.overridesView.render().el);
      self.$content.append(self.lessvariablesView.render().el);
      self.tabs = {
        registry: {
          btn: self.$('.registry-btn'),
          content: self.registryView.$el
        },
        overrides: {
          btn: self.$('.overrides-btn'),
          content: self.overridesView.$el
        },
        lessvariables: {
          btn: self.$('.lessvariables-btn'),
          content: self.lessvariablesView.$el
        }
      };
      self.hideShow();
      return self;
    }
  });


  var ResourceRegistry = Base.extend({
    name: 'resourceregistry',
    defaults: {
      bundles: {},
      resources: {},
      javascripts: {},
      css: {},
      overrides: [],
      manageUrl: null,
      baseUrl: null,
      rjsUrl: null,
      lessvariables: {}
    },
    init: function() {
      var self = this;
      self.tabs = new TabView(self.options);
      self.$el.append(self.tabs.render().el);
    }
  });

  return ResourceRegistry;

});
