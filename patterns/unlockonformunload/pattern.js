/* UnlockOnFormUnload pattern.
 *
 * Documentation:
 *
 * # Plone unlock handler; attaches an unlock handler to $('form.enableUnlockProtection')
 *
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <form class="pat-unlockonformunload">
 *      <input type="text" value="" />
 *      <input
 *        class="btn btn-large btn-primary"
 *        type="submit" value="Submit" />
 *      <br />
 *      <a href="/">Click here to go somewhere else</a>
 *    </form>
 *
 */

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base) {
  'use strict';

  var UnlockOnFormUnload = Base.extend({
    name: 'unlockonformunload',
    defaults: {},

    cleanup: function() {
        var self = this;
        $(window).unbind('unload', self.execute());
        clearInterval(self._refresher);
    },
    
    execute: function() {
        // this.submitting is set from the form unload handler
        // (formUnload.js) and signifies that we are in the
        // form submit process. This means: no unlock needed,
        // and it also would be harmful (ConflictError)
        var self = this;
        if (self.$el.submitting) {return;}
        $.ajax({url: self._baseUrl() + '/@@plone_lock_operations/safe_unlock', async: false});
    },
    
    refresh: function() {
        var self = this;
        if (self.$el.submitting) {return;}
        $.get(self._baseUrl() + '/@@plone_lock_operations/refresh_lock');
    },
    
    _baseUrl: function() {
        var baseUrl, pieces;

        baseUrl = $('base').attr('href');
        if (!baseUrl) {
            pieces = window.location.href.replace(location.hash,"").split('/');
            pieces.pop();
            baseUrl = pieces.join('/');
        }
        return baseUrl;
    },
    init: function() {
        var self = this;
        // set up the handler, if there are any forms
        $(window).unload(self.execute());
        // $(window).on('beforeunload', self.execute());
        self._refresher = setInterval(self.refresh(), 300000);
    }
  });

  return UnlockOnFormUnload;

});
