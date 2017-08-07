define([
  'jquery',
  'mockup-patterns-modal',
  'underscore',
  'mockup-utils',
  'translate',
  'text!mockup-patterns-thememapper-url/templates/rapidostore.xml',
], function($, Modal, _, utils,  _t, RapidoStoreTemplate){
  'use strict';

  var RapidoStore = function(thememapper, options){
    var self = this;
    self.thememapper = thememapper;
    self.options = (options != undefined )? options : {};
    self.$btnClose = null;
    self.apiUrl = base_url + '/@@rapido-store-api';
    self.currentTheme = self.thememapper.options.themeUrl.replace(/\\/g,'/').replace(/.*\//, '');
    
    self.modal = new Modal($('<div/>').appendTo(self.thememapper.$el), {
      html: _.template(RapidoStoreTemplate)($.extend({ _t: _t }, self.options)),
      content: null,
      width: 700,
      name: 'rapido-modal',
      buttons: '.plone-btn',
      position: 'center top'
    });
    
    self.modal.on('shown', function() {
      var $el = self.modal.$modal;
      var $info = $el.find('.start-info');
      self.$btnClose = $el.find('button.close-store');
      self.modal.$modal.find("#local-app-listing").html("");

      self.$btnClose.off('click').on('click', function(){
        self.modal.hide();
      });
      self.getLocalApps();
    });
    
    self.getLocalApps = function(){
        $.ajax({
            url: self.apiUrl + "?action=list",
            dataType: 'json',
            success: function(themes) {
                var $container = self.modal.$modal.find("#local-app-listing");
                var theme_id, app_id, i, apps, $el;
                
                for(theme_id in themes) {
                    apps = themes[theme_id];
                    if( apps.length == 0){
                        continue
                    }
                    $el = $("<div class='rapido-theme'><h5>Available Apps from " + theme_id.toUpperCase() + " theme</h5><hr><div class='rapido-apps'></div></div>");
                    for(i in apps) {
                        app_id = apps[i];
                        $("<a href='#' theme-id='" + theme_id +"' app-id='" + app_id + "' class='rapido-app'>" + app_id.toUpperCase() + "</a>").appendTo($el.find(".rapido-apps"));
                    }
                    $el.appendTo($container);
                }
                $("a.rapido-app", $container).on("click", function(e) {
                    var $this = $(this);
                    var theme_id = $this.attr("theme-id");
                    var app_id = $this.attr("app-id");
                    var do_action = confirm("Are you sure you want to install " + app_id + " from " + theme_id + " theme?");
                    if(do_action) {
                        $.ajax({
                            url: self.apiUrl + "?action=import&source_id="+theme_id+"&app_id="+app_id+"&destination_id="+self.currentTheme,
                            dataType: 'json',
                            success: function(resp){
                                if(resp.error == false) {
                                    console.log(resp);
                                    alert(resp.message);
                                    self.thememapper.fileManager.refreshTree();
                                    self.close();
                                } else {
                                    alert(resp.error);
                                }
                            }
                        })
                    }
                });
            }
            
        })
    }
    
    self.open = function(){
        self.modal.show();
    };
    
    self.close = function(){
        self.modal.hide();
    };
    
  };
  
  return RapidoStore;
});
