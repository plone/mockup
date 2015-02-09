/* Content loader pattern.
 *
 * Options:
 *    url(string): To load content from remote resource.
 *    content(string): CSS selector for content already on page. Can be used in conjunction with url to load remote content on page.
 *    trigger(string): Event to trigger content loading. Defaults to "click"
 *    target(string): CSS selector of target for content loading. If this is empty, it's assume content will replace pattern element.
 *
 * Documentation:
 *    # With selector
 *    {{ example-1 }}
 *
 *    # With remote content
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <a href="#" class="pat-contentloader" data-pat-contentloader="content:#clexample1;target:#clexample1target;">Load content</a>
 *    <div id="clexample1target">Original Content</div>
 *    <div id="clexample1" style="display:none">Replaced Content</div>
 *
 * Example: example-2
 *    <a href="#" class="pat-contentloader" data-pat-contentloader="url:something.html;">Load content</a>
 *
 *
 */


define([
  'jquery',
  'mockup-patterns-base',
  'pat-logger',
  'pat-registry',
  'mockup-utils'
], function($, Base, logger, Registry, utils) {
  'use strict';
  var log = logger.getLogger('pat-contentloader');

  var ContentLoader = Base.extend({
    name: 'contentloader',
    trigger: '.pat-contentloader',
    defaults: {
      url: null,
      content: null,
      trigger: 'click',
      target: null
    },
    init: function() {
      var that = this;
      that.$el.on(that.options.trigger, function(e){
        e.preventDefault();
        that.$el.addClass('loading-content');
        if(that.options.url){
          that.loadRemote();
        }else{
          that.loadLocal();
        }
      });
    },
    loadRemote: function(){
      var that = this;
      $.ajax({
        url: that.options.url
      }).done(function(data){
        if(data.indexOf('<html') !== -1){
          data = utils.parseBodyTag(data);
        }
        var $el = $(data);
        if(that.options.content !== null){
          $el = $el.find(that.options.content);
        }
        that.loadLocal($el);
      });
    },
    loadLocal: function($content){
      var that = this;
      if(!$content && that.options.content === null){
        log.warn('No selector configured');
        return;
      }
      var $target = that.$el;
      if(that.options.target !== null){
        $target = $(that.options.target);
        if($target.size() === 0){
          log.warn('No target nodes found');
          return;
        }
      }

      if(!$content){
        $content = $(that.options.content).clone();
      }
      $content.show();
      $target.replaceWith($content);
      Registry.scan($content);
      that.$el.removeClass('loading-content');
    }
  });

  return ContentLoader;

});
