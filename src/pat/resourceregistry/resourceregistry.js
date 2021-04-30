import $ from "jquery";
import _ from "underscore";
import _t from "../../core/i18n-wrapper";
import Base from "@patternslib/patternslib/src/core/base";
import utils from "../../core/utils";
import BaseView from "../../core/ui/views/base";
import LessVariablesView from "./js/less";
import OverridesView from "./js/overrides";
import RegistryView from "./js/registry";
import PatternOptionsView from "./js/patternoptions";

const TabView = BaseView.extend({
    tagName: "div",
    activeTab: "registry",
    template: _.template(
        "" +
            '<div class="autotabs">' +
            '<ul class="main-tabs autotoc-nav" role="tablist">' +
            '<li class="registry-btn"><a href="#"><%- _t("Registry") %></a></li>' +
            '<li class="overrides-btn"><a href="#"><%- _t("Overrides") %></a></li>' +
            '<li class="lessvariables-btn"><a href="#"><%- _t("Less Variables") %></a></li>' +
            '<li class="patternoptions-btn"><a href="#"><%- _t("Pattern Options") %></a></li>' +
            "</ul>" +
            "</div>" +
            '<div class="tab-content" />'
    ),
    events: {
        "click .registry-btn a": "hideShow",
        "click .overrides-btn a": "hideShow",
        "click .lessvariables-btn a": "hideShow",
        "click .patternoptions-btn a": "hideShow",
    },
    hideShow: function (e) {
        var self = this;
        if (e !== undefined) {
            e.preventDefault();
            self.activeTab = $(e.target).parent()[0].className.replace("-btn", "");
        }
        self.$(".main-tabs > li a").removeClass("active");
        self.$content.find(".tab-pane").removeClass("active");
        self.tabs[self.activeTab].btn.find("a").addClass("active");
        self.tabs[self.activeTab].content.addClass("active");
    },
    initialize: function (options) {
        var self = this;

        BaseView.prototype.initialize.apply(self, [options]);
        self.registryView = new RegistryView({
            data: options,
            tabView: self,
        });
        self.overridesView = new OverridesView({
            data: options,
            tabView: self,
        });
        self.lessvariablesView = new LessVariablesView({
            data: options,
            tabView: self,
        });
        self.patternoptionsView = new PatternOptionsView({
            data: options,
            tabView: self,
        });
        self.tabs = {};
    },

    render: function () {
        var self = this;
        self.$el.append(self.template({ _t: _t }));
        self.loading = new utils.Loading();
        self.$tabs = self.$("ul.main-tabs");
        self.$content = self.$(".tab-content");
        self.$content.append(self.registryView.render().el);
        self.$content.append(self.overridesView.render().el);
        self.$content.append(self.lessvariablesView.render().el);
        self.$content.append(self.patternoptionsView.render().el);
        self.tabs = {
            registry: {
                btn: self.$(".registry-btn"),
                content: self.registryView.$el,
            },
            overrides: {
                btn: self.$(".overrides-btn"),
                content: self.overridesView.$el,
            },
            lessvariables: {
                btn: self.$(".lessvariables-btn"),
                content: self.lessvariablesView.$el,
            },
            patternoptions: {
                btn: self.$(".patternoptions-btn"),
                content: self.patternoptionsView.$el,
            },
        };
        self.hideShow();
        return self;
    },

    saveData: function (action, data, onSave, onError) {
        var self = this;
        self.loading.show();
        if (!data) {
            data = {};
        }
        data = $.extend({}, data, {
            action: action,
            _authenticator: utils.getAuthenticator(),
        });
        $.ajax({
            url: self.options.manageUrl,
            type: "POST",
            dataType: "json",
            data: data,
        })
            .done(function (resp) {
                if (onSave) {
                    onSave(resp);
                }
                if (resp.success !== undefined && !resp.success && resp.msg) {
                    window.alert(resp.msg);
                }
            })
            .always(function () {
                self.loading.hide();
            })
            .fail(function (resp) {
                if (onError) {
                    onError(resp);
                } else {
                    window.alert(
                        _t("Error processing ajax request for action: ") + action
                    );
                }
            });
    },
});

export default Base.extend({
    name: "resourceregistry",
    trigger: ".pat-resourceregistry",
    parser: "mockup",
    defaults: {
        bundles: {},
        resources: {},
        javascripts: {},
        css: {},
        overrides: [],
        manageUrl: null,
        baseUrl: null,
        rjsUrl: null,
        lessvariables: {},
        patternoptions: {},
    },
    init: function () {
        var self = this;
        self.$el.empty();
        self.tabs = new TabView(self.options);
        self.$el.append(self.tabs.render().el);
    },
});
