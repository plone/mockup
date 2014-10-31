/* Sticky kit pattern.
 *
 * Options:
 *    parent(string): The element will be the parent of the sticky item. The dimensions of the parent control when the sticky element bottoms out. Defaults to the closest parent of the sticky element. Can be a selector. (null)
 *    inner_scrolling(bool): Boolean to enable or disable the ability of the sticky element to scroll independently of the scrollbar when it’s taller than the viewport. Defaults to true for enabled. (true)
 *    sticky_class(string): The name of the CSS class to apply to elements when they have become stuck. Defaults to "is_stuck". ('is_stuck')
 *    offset_top(int): offsets the initial sticking position by of number of pixels, can be either negative or positive (null)
 *
 *
 * Documentation:
 *    Sticky-kit provides an easy way to attach elements to the page when the user scrolls such that the element is always visible.
 *
 *    # Default
 *
 *    {{ example-1 }}
 *
 * Example: example-1
 * <style>
 * .content {
 *     overflow: hidden; }
 * .content .sidebar {
 *     width: 200px;
 *     height: 66px;
 *     margin: 10px;
 *     margin-right: 0;
 *     border: 1px solid red;
 *     float: left;
 *     overflow: hidden;
 *     font-family: sans-serif; }
 * .content .main {
 *     margin: 10px;
 *     margin-left: 222px;
 *     border: 1px solid blue;
 *     height: 400px;
 *     overflow: hidden; }
 * .footer {
 *     margin: 10px;
 *     text-align: center;
 *     font-size: 13px;
 *     border-top: 1px dashed #dadada;
 *     color: #666;
 *     padding-top: 10px;
 *     min-height: 133px; }
 * </style>
 * <div class="content">
 *     <div class="sidebar pat-sticky-kit"
 *          data-pat-sticky-kit="offset_top:80">
 *         This is a sticky column
 *     </div>
 *     <div class="main">
 *         This is the main column
 *         <p class="sub">
 *         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempus id
 *         leo et aliquam. Proin consectetur ligula vel neque cursus laoreet. Nullam
 *         dignissim, augue at consectetur pellentesque, metus ipsum interdum
 *         sapien, quis ornare quam enim vel ipsum.
 *         </p>
 *         <p class="sub">
 *         In congue nunc vitae magna
 *         tempor ultrices. Cras ultricies posuere elit. Nullam ultrices purus ante,
 *         at mattis leo placerat ac. Nunc faucibus ligula nec lorem sodales
 *         venenatis. Curabitur nec est condimentum, blandit tellus nec, semper
 *         arcu. Nullam in porta ipsum, non consectetur mi. Sed pharetra sapien
 *         nisl. Aliquam ac lectus sed elit vehicula scelerisque ut vel sem. Ut ut
 *         semper nisl.
 *         </p>
 *         <p class="sub">
 *         Curabitur rhoncus, arcu at placerat volutpat, felis elit sollicitudin ante, sed
 *         tempus justo nibh sed massa. Integer vestibulum non ante ornare eleifend. In
 *         vel mollis dolor.
 *         </p>
 *     </div>
 * </div>
 * <div class="footer">
 *     My very tall footer!
 * </div>
 *
 */

define([
  'jquery',
  'mockup-patterns-base',
  'jquery.sticky-kit',
], function ($, Base) {
  'use strict';

  var StickyKitPattern = Base.extend({
    name: 'sticky-kit',
    defaults: {
      parent: null,
      inner_scrolling: true,
      sticky_class: 'is_stuck',
      offset_top: null,
    },
    init: function () {
      var self = this;
      var $label = self.$el;

      // Set all options 
      var options = {};
      if (self.options.parent !== null) {
          options.parent = self.options.parent;
      }
      if (self.options.offset_top !== null) {
          options.offset_top = parseInt(self.options.offset_top);
      }
      options.inner_scrolling = self.options.inner_scrolling;
      options.sticky_class = self.options.sticky_class;

      $label.stick_in_parent(options);
    }
  });

  return StickyKitPattern;
});
