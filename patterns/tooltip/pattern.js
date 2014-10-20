/* Tooltip pattern.
 *
 * Options:
 *    enterEvent(string): Event used to trigger tooltip. ('mouseenter')
 *    exitEvent(string): Event used to dismiss tooltip. ('mouseleave')
 *
 * Documentation:
 *    # Directions
 *
 *    You can use this inside Plone or on any static page. Please check below
 *    for additional directions for non-Plone sites as there are some lines
 *    of code you need to add to the header of your webpage.
 *
 *    # Adding tooltip using Plone
 *
 *    - Make sure your viewing the page you want to add the tool tip too.
 *    - Log in
 *    - Create some text that you want to be the link that will reveal the
 *      tooltip.
 *    - Select the view html button
 *    - Find your text. and wrap that text with an href tag, and add a class
 *      and the href tag.
 *    - It should look like < a class="pat-tooltip" href="#my-demo-tip"> My
 *      link text </a>
 *    - Choose Save
 *
 *    Now that we have added our link we now need to add our tooltip.
 *
 *    - Choose "edit"
 *    - Immediently following the link click to add some text and hit your
 *      "return" key
 *    - Add the text that you want to be the tip.
 *    - Choose the "edit html" button
 *    - Find the tip text and wrap that text with a div tag, an ID tag and a
 *      class.
 *    - It should look like <div id="my-demo-tip" class="tooltips"> My Tip
 *      Text here </div>
 *    - Choose Save and test your tooltip.
 *
 *    Note: it's important that the href AND the ID be named exactly the same
 *    thing. This is what links them together.
 *
 *    # Example
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 *    <p href=".example-class" class="pat-tooltip">
 *      Hover over this line to see a tooltip
 *    </p>
 *    <p class="tooltips example-class">
 *      Setting the .example-class in the href makes this show up
 *    </p>
 *
 */

define([
  'jquery',
  'mockup-patterns-base'
], function($, Base, undefined) {
  'use strict';

  var ToolTip = Base.extend({
    name: 'tooltip',
    defaults: {
      attribute: 'class',
      enterEvent: 'mouseenter',
      exitEvent: 'mouseleave'
    },
    init: function() {
      var self = this;

      self.on(self.options.enterEvent, function(e) {
        e.stopPropagation();
        self.show.apply(self, [e]);
      });
      self.on(self.options.exitEvent, function(e) {
        e.stopPropagation();
        self.hide.apply(self, [e]);
      });

    },
    closest: function($el, selector) {
      var $closest;
      $.each($el.parents(), function(i, el) {
        $closest = $(selector, el);
        if ($closest.size() !== 0) {
          return false;
        }
      });
      return $closest;
    },
    show : function(e) {
      var s = $(e.target).attr('href');
      this.closest(this.$el, s).addClass('active');
    },

    hide : function(e) {
      var s = $(e.target).attr('href');
      this.closest(this.$el, s).removeClass('active');
    }

  });

  return ToolTip;

});
